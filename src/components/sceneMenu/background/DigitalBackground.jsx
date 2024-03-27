import * as THREE from 'three'
import { shaderMaterial, useTexture } from "@react-three/drei"
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useRef } from "react"
// import { useControls } from 'leva'
import { RGBELoader } from 'three-stdlib'
import { easing } from 'maath'
import CustomShaderMaterial from 'three-custom-shader-material'
import lavaFragment from '../../../shaders/lavaFragment.glsl'
import lavaVertex from '../../../shaders/lavaVertex.glsl'

export default function Digital(props) {
    const three = useThree()
    const lavaMesh = useRef()
    const materialRef = useRef()
    const noiseTexture = useTexture('/backgrounds/perlinNoise.png')
    const backgroundTexture = useLoader(RGBELoader, '/backgrounds/backLavaweb.hdr')
    const materialParams = {
        distortionPower: 0.3,
        distortionScale: 0.3
    }
    const DigitalBackgroundMaterial = shaderMaterial(
        {
            // wireframe: true,
          backgroundTexture: backgroundTexture,
          noiseTexture: noiseTexture,
          distortionPower: materialParams.distortionPower,
          distortionScale: materialParams.distortionScale,
          distortionColor: new THREE.Color("#1b476f"),
        //   distortionColor: new THREE.Color("#ffffff"),
          uResolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
          uLiquidScale: 1,
          uTime: 0.0,
          uCursor: new THREE.Vector2(0, 0),
          uZ: 0.0
        },
        
        /* glsl */
        `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform vec2 uResolution;
        uniform vec2 uCursor;
        uniform float uLiquidScale;    
        uniform float uTime;

        void main() {
            // Изменение позиции вершины в зависимости от её исходной позиции
            vUv = uv;
            vPosition = position;
            vec3 pos = position;
            // gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_Position = vec4( pos, 1.0 );  
        }`
        ,
        
        /* glsl */
        `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform vec2 uResolution;
        uniform float uTime;
        uniform float uZ;
        uniform vec2 uCursor;
        const int ITERATIONS = 20;   //use less value if you need more performance
        const float SPEED = 1.0;
        
        const float STRIP_CHARS_MIN =  7.;
        const float STRIP_CHARS_MAX = 40.;
        const float STRIP_CHAR_HEIGHT = 0.15;
        const float STRIP_CHAR_WIDTH = 0.10;
        const float ZCELL_SIZE = 1. * (STRIP_CHAR_HEIGHT * STRIP_CHARS_MAX);  //the multiplier can't be less than 1.
        const float XYCELL_SIZE = 12. * STRIP_CHAR_WIDTH;  //the multiplier can't be less than 1.
        
        const int BLOCK_SIZE = 5;  //in cells
        const int BLOCK_GAP = 2;    //in cells
        
        const float WALK_SPEED = 1. * XYCELL_SIZE;
        const float BLOCKS_BEFORE_TURN = 3.;
        
        
        const float PI = 3.14159265359;

        //        ----  random  ----
        float hash(float v) {
            return fract(sin(v)*43758.5453123);
        }

        float hash(vec2 v) {
            return hash(dot(v, vec2(5.3983, 5.4427)));
        }

        vec2 hash2(vec2 v)
        {
            v = vec2(v * mat2(127.1, 311.7,  269.5, 183.3));
            return fract(sin(v)*43758.5453123);
        }

        vec4 hash4(vec2 v)
        {
            vec4 p = vec4(v * mat4x2( 127.1, 311.7,
                                    269.5, 183.3,
                                    113.5, 271.9,
                                    246.1, 124.6 ));
            return fract(sin(p)*43758.5453123);
        }

        vec4 hash4(vec3 v)
        {
            vec4 p = vec4(v * mat4x3( 127.1, 311.7, 74.7,
                                    269.5, 183.3, 246.1,
                                    113.5, 271.9, 124.6,
                                    271.9, 269.5, 311.7 ) );
            return fract(sin(p)*43758.5453123);
        }

        
        // ----  symbols  ----
        float rune_line(vec2 p, vec2 a, vec2 b) {
            p -= a, b -= a;
            float h = clamp(dot(p, b) / dot(b, b), 0., 1.);   // proj coord on line
            return length(p - b * h);                         // dist to segment
        }

        float rune(vec2 U, vec2 seed, float highlight)
        {
            float d = 1e5;
            for (int i = 0; i < 4; i++)	// number of strokes
            {
                vec4 pos = hash4(seed);
                seed += 1.;

                // each rune touches the edge of its box on all 4 sides
                if (i == 0) pos.y = .0;
                if (i == 1) pos.x = .999;
                if (i == 2) pos.x = .0;
                if (i == 3) pos.y = .999;
                // snap the random line endpoints to a grid 2x3
                vec4 snaps = vec4(2, 3, 2, 3);
                pos = ( floor(pos * snaps) + .5) / snaps;

                if (pos.xy != pos.zw)  //filter out single points (when start and end are the same)
                    d = min(d, rune_line(U, pos.xy, pos.zw + .001) ); // closest line
            }
            return smoothstep(0.1, 0., d) + highlight*smoothstep(0.4, 0., d);
        }

        float random_char(vec2 outer, vec2 inner, float highlight) {
            vec2 seed = vec2(dot(outer, vec2(269.5, 183.3)), dot(outer, vec2(113.5, 271.9)));
            return rune(inner, seed, highlight);
        }

        //        ----  digital rain  ----
        // xy - horizontal, z - vertical
        vec3 rain(vec3 ro3, vec3 rd3, float time) {
            vec4 result = vec4(0.);

            // normalized 2d projection
            vec2 ro2 = vec2(ro3);
            vec2 rd2 = normalize(vec2(rd3));
            
            
            // Проверяем, что луч движется влево
            if (rd2.x >= 0.0) {
                return result.xyz;
            }

            bool prefer_dx = abs(rd2.x) > abs(rd2.y);
            float t3_to_t2 = prefer_dx ? rd3.x / rd2.x : rd3.y / rd2.y;

            // at first, horizontal space (xy) is divided into cells (which are columns in 3D)
            // then each xy-cell is divided into vertical cells (along z) - each of these cells contains one raindrop

            ivec3 cell_side = ivec3(step(0., rd3));      //for positive rd.x use cell side with higher x (1) as the next side, for negative - with lower x (0), the same for y and z
            ivec3 cell_shift = ivec3(sign(rd3));         //shift to move to the next cell

            //  move through xy-cells in the ray direction
            float t2 = 0.;  // the ray formula is: ro2 + rd2 * t2, where t2 is positive as the ray has a direction.
            ivec2 next_cell = ivec2(floor(ro2/XYCELL_SIZE));  //first cell index where ray origin is located
            for (int i=0; i<ITERATIONS; i++) {
                ivec2 cell = next_cell;  //save cell value before changing
                float t2s = t2;          //and t

                //  find the intersection with the nearest side of the current xy-cell (since we know the direction, we only need to check one vertical side and one horizontal side)
                vec2 side = vec2(next_cell + cell_side.xy) * XYCELL_SIZE;  //side.x is x coord of the y-axis side, side.y - y of the x-axis side
                vec2 t2_side = (side - ro2) / rd2;  // t2_side.x and t2_side.y are two candidates for the next value of t2, we need the nearest
                if (t2_side.x < t2_side.y) {
                    t2 = t2_side.x;
                    next_cell.x += cell_shift.x;  //cross through the y-axis side
                } else {
                    t2 = t2_side.y;
                    next_cell.y += cell_shift.y;  //cross through the x-axis side
                }
                //now t2 is the value of the end point in the current cell (and the same point is the start value in the next cell)

                //  gap cells
                vec2 cell_in_block = fract(vec2(cell) / float(BLOCK_SIZE));
                float gap = float(BLOCK_GAP) / float(BLOCK_SIZE);
                if (cell_in_block.x < gap || cell_in_block.y < gap || (cell_in_block.x < (gap+0.1) && cell_in_block.y < (gap+0.1))) {
                    continue;
                }

                //  return to 3d - we have start and end points of the ray segment inside the column (t3s and t3e)
                float t3s = t2s / t3_to_t2;

                //  move through z-cells of the current column in the ray direction (don't need much to check, two nearest cells are enough)
                float pos_z = ro3.z + rd3.z * t3s;
                float xycell_hash = hash(vec2(cell));
                float z_shift = xycell_hash*11. - time * (0.5 + xycell_hash * 1.0 + xycell_hash * xycell_hash * 1.0 + pow(xycell_hash, 16.) * 3.0);  //a different z shift for each xy column
                float char_z_shift = floor(z_shift / STRIP_CHAR_HEIGHT);
                z_shift = char_z_shift * STRIP_CHAR_HEIGHT;
                int zcell = int(floor((pos_z - z_shift)/ZCELL_SIZE));  //z-cell index
                for (int j=0; j<2; j++) {  //2 iterations is enough if camera doesn't look much up or down
                    //  calcaulate coordinates of the target (raindrop)
                    vec4 cell_hash = hash4(vec3(ivec3(cell, zcell)));
                    vec4 cell_hash2 = fract(cell_hash * vec4(127.1, 311.7, 271.9, 124.6));

                    float chars_count = cell_hash.w * (STRIP_CHARS_MAX - STRIP_CHARS_MIN) + STRIP_CHARS_MIN;
                    float target_length = chars_count * STRIP_CHAR_HEIGHT;
                    float target_rad = STRIP_CHAR_WIDTH / 2.;
                    float target_z = (float(zcell)*ZCELL_SIZE + z_shift) + cell_hash.z * (ZCELL_SIZE - target_length);
                    vec2 target = vec2(cell) * XYCELL_SIZE + target_rad + cell_hash.xy * (XYCELL_SIZE - target_rad*2.);

                    //  We have a line segment (t0,t). Now calculate the distance between line segment and cell target (it's easier in 2d)
                    vec2 s = target - ro2;
                    float tmin = dot(s, rd2);  //tmin - point with minimal distance to target
                    if (tmin >= t2s && tmin <= t2) {
                        float u = s.x * rd2.y - s.y * rd2.x;  //horizontal coord in the matrix strip
                        if (abs(u) < target_rad) {
                            u = (u/target_rad + 1.) / 2.;
                            float z = ro3.z + rd3.z * tmin/t3_to_t2;
                            float v = (z - target_z) / target_length;  //vertical coord in the matrix strip
                            if (v >= 0.0 && v < 1.0) {
                                float c = floor(v * chars_count);  //symbol index relative to the start of the strip, with addition of char_z_shift it becomes an index relative to the whole cell
                                float q = fract(v * chars_count);
                                vec2 char_hash = hash2(vec2(c+char_z_shift, cell_hash2.x));
                                if (char_hash.x >= 0.1 || c == 0.) {  //10% of missed symbols
                                    float time_factor = floor(c == 0. ? time*5.0 :  //first symbol is changed fast
                                            time*(1.0*cell_hash2.z +   //strips are changed sometime with different speed
                                                    cell_hash2.w*cell_hash2.w*4.*pow(char_hash.y, 4.)));  //some symbols in some strips are changed relatively often
                                    float a = random_char(vec2(char_hash.x, time_factor), vec2(u,q), max(1., 3. - c/2.)*0.2);  //alpha
                                    a *= clamp((chars_count - 0.5 - c) / 2., 0., 1.);  //tail fade
                                    if (a > 0.) {
                                        float attenuation = 1. + pow(0.06*tmin/t3_to_t2, 2.);
                                        vec3 col = (c == 0. ? vec3(0., 4.8, 8.0) : vec3(0.0, 0.5, 3.0)) / attenuation;
                                        // vec3 col = (c == 0. ? vec3(0.0, 1.2, 2.0) : vec3(0.0, 0.6, 1.0)) / 1.0;
                                        float a1 = result.a;
                                        result.a = a1 + (1. - a1) * a;
                                        result.xyz = (result.xyz * a1 + col * (1. - a1) * a) / result.a;
                                        if (result.a > 0.98)  return result.xyz;
                                        // if (result.a > 0.98)  return col;
                                    }
                                }
                            }
                        }
                    }
                    // not found in this cell - go to next vertical cell
                    zcell += cell_shift.z;
                }
                // go to next horizontal cell
            }

            return result.xyz * result.a;
        }


        //        ----  main, camera  ----
        vec2 rotate(vec2 v, float a) {
            float s = sin(a);
            float c = cos(a);
            mat2 m = mat2(c, -s, s, c);
            return m * v;
        }

        vec3 rotateX(vec3 v, float a) {
            float s = sin(a);
            float c = cos(a);
            return mat3(1.,0.,0.,0.,c,-s,0.,s,c) * v;
        }

        vec3 rotateY(vec3 v, float a) {
            float s = sin(a);
            float c = cos(a);
            return mat3(c,0.,-s,0.,1.,0.,s,0.,c) * v;
        }

        vec3 rotateZ(vec3 v, float a) {
            float s = sin(a);
            float c = cos(a);
            return mat3(c,-s,0.,s,c,0.,0.,0.,1.) * v;
        }

        float smoothstep1(float x) {
            return smoothstep(0., 1., x);
        }
    
        void main() {
            if (STRIP_CHAR_WIDTH > XYCELL_SIZE || STRIP_CHAR_HEIGHT * STRIP_CHARS_MAX > ZCELL_SIZE) {
                // error
                gl_FragColor = vec4(1., 0., 0., 1.);
                return;
            }
        
            vec2 uv = (gl_FragCoord.xy * 2. - uResolution.xy) / uResolution.y;
        
            float time = uTime * SPEED * 15.0;        
            vec3 ro = vec3(0., 0., 0.);
            vec3 rd = vec3(uv.x, 2.0, uv.y);
            float up_down = 0.;   
            ro.y += time;
            ro.x -= 100.0;
            rd.y -= 1.0;
            rd.x += uCursor.x * 0.5 - .5;
            rd.y += uZ;
        
            vec3 col = rain(ro, rd, time);        
            gl_FragColor = vec4(col, 1.);
    
            // #include <encodings_fragment>
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
        }`
    )
    extend({DigitalBackgroundMaterial})
    useFrame((renderer, delta) => {
        materialRef.current.uniforms.uTime.value += delta * 0.05
        if(props.activeMenu.current === true) {
            easing.damp(materialRef.current.uniforms.uCursor.value,'x', renderer.pointer.x, 0.3)
            easing.damp(materialRef.current.uniforms.uCursor.value,'y', renderer.pointer.y, 0.3)
            easing.damp(materialRef.current.uniforms.uZ,'value', 0.0, 0.3)
        } else {
            easing.damp(materialRef.current.uniforms.uZ,'value', -1.0, 0.6)
        }
    })

    useEffect(() => {
        materialRef.current.precision = "lowp"
    }, [])


    return <>
    <mesh ref={lavaMesh} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1}>
        {/* <planeGeometry args={[three.viewport.width, three.viewport.height, 20, 20]}/> */}
        {/* <planeGeometry args={[three.viewport.width, three.viewport.height]}/> */}
        <planeGeometry args={[2, 2]}/>
        <digitalBackgroundMaterial ref={materialRef}/>
    </mesh>
    </>
}

// extend({LavaMaterial, LavaMaterial2})