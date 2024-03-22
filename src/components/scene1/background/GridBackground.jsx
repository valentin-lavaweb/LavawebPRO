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

export default function GridBackground(props) {
    const three = useThree()
    const lavaMesh = useRef()
    const materialRef = useRef()
    const noiseTexture = useTexture('/backgrounds/perlinNoise.png')
    const backgroundTexture = useLoader(RGBELoader, '/backgrounds/backLavaweb.hdr')
    const materialParams = {
        distortionPower: 0.3,
        distortionScale: 0.3
    }
    const LavaMaterial = shaderMaterial(
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
        },
        
        /* glsl */
        `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform vec2 uResolution;
        uniform float uLiquidScale;    
        uniform float uTime;    
        void main() {
            // Изменение позиции вершины в зависимости от её исходной позиции
            vUv = uv;
            vPosition = position;
            vec3 pos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            // gl_Position = vec4( pos, 1.0 );  
        }`
        ,
        
        /* glsl */
        `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform vec2 uResolution;
        uniform float uTime;
        uniform vec2 uCursor;
        #define PI                3.141592654
        #define TAU               (2.0*PI)
        #define ROT(a)            mat2(cos(a), sin(a), -sin(a), cos(a))
        #define PCOS(x)           (0.5 + 0.5*cos(x))
        #define TTIME             (TAU*TIME)

        vec2 mod2(inout vec2 p, vec2 size) {
            vec2 c = floor((p + size*0.5)/size);
            p = mod(p + size*0.5,size) - size*0.5;
            return c;
        }

        vec3 toSpherical(vec3 p) {
            float r   = length(p);
            float t   = acos(p.z/r);
            float ph  = atan(p.y, p.x);
            return vec3(r, t, ph);
        }

        vec3 postProcess(vec3 col, vec2 q)  {
            col=pow(clamp(col,0.0,1.0),vec3(1.0/2.2)); 
            col=col*0.6+0.4*col*col*(3.0-2.0*col);  // contrast
            col=mix(col, vec3(dot(col, vec3(0.33))), -0.4);  // satuation
            col*=0.5+0.5*pow(19.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.7);  // vigneting
            return col;
        }

        vec3 grid(vec3 ro, vec3 rd) {
            vec3 srd = toSpherical(rd.xzy);
            
            const float m = 1.0;

            const vec2 dim = vec2(1.0/12.0*PI);
            vec2 pp = srd.yz;
            vec2 np = mod2(pp, dim);

            vec3 col = vec3(0.0);

            float y = sin(srd.y);
            float d = min(abs(pp.x), abs(pp.y*y));
            
            float aa = 2.0/uResolution.y;
            
            col += 2.0*vec3(0.5, 0.5, 6.0)*exp(-5000.0*max(d-0.00025, 0.0));
            
            return 0.25*tanh(col);
        }
    
        void main() {  
            vec2 q = gl_FragCoord.xy/uResolution.xy; 
            vec2 p = -1.0 + 2.0*q;
            p.x *= uResolution.x/uResolution.y;
          
            vec3 ro = vec3(2.0, 0, 0.);
            // ro.xy *= uCursor.x * 100.0;
            // ro.xz *= uCursor.x * 100.0;
            ro.xz *= ROT(uCursor.x/3.0);
            ro.xy *= ROT(uCursor.y/3.0);
            // ro.xz *= ROT(uCursor.y/1.0);
            // ro.xy *= ROT(-0.33*sin((2.0 * PI) * uTime/12.0));
            // ro.xz *= ROT(1.5+0.33*sin((2.0 * PI) * uTime/12.0));
            vec3 la = vec3(0.0, 0.0, 0.0);
          
            vec3 ww = normalize(la - ro);
            vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww));
            vec3 vv = normalize(cross(ww,uu));
          
            const float rdd = 2.0;
            vec3 rd = normalize(p.x*uu + p.y*vv + rdd*ww);
          
            vec3 col = vec3(0.0);
            col += grid(ro, rd);
            
            col = clamp(col, 0.0, 1.0);
            // fragColor = vec4(postProcess(col, q),1.0);
            
            gl_FragColor = vec4(postProcess(col, q),1.0);
    
            // #include <encodings_fragment>
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
        }`
    )
    extend({LavaMaterial})
    useFrame((renderer, delta) => {
        materialRef.current.uniforms.uTime.value += delta * 0.05
        easing.damp(materialRef.current.uniforms.uCursor.value,'x', renderer.pointer.x, 0.3)
        easing.damp(materialRef.current.uniforms.uCursor.value,'y', renderer.pointer.y, 0.3)
    })

    useEffect(() => {
        materialRef.current.precision = "lowp"
    }, [])


    return <>
    <mesh ref={lavaMesh} position={[0, 0, -1]} rotation={[0, 0, 0]} scale={4.2}>
        {/* <planeGeometry args={[three.viewport.width, three.viewport.height, 20, 20]}/> */}
        <planeGeometry args={[three.viewport.width, three.viewport.height]}/>
        <lavaMaterial ref={materialRef}/>
    </mesh>
    </>
}

// extend({LavaMaterial, LavaMaterial2})