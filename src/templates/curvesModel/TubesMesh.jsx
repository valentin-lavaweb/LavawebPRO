import * as THREE from 'three'
import { extend, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { useRef } from 'react';

export default function TubesMesh(props) {
    
    function Tube({curve}) {
        const tubeShaderMaterialRef = useRef()

        const {viewport} = useThree()

        const TubeShaderMaterial = shaderMaterial(
            {
                time: 0,
                color: new THREE.Color(0.02, 0.03, 0.1),
                mouse: new THREE.Vector3(0.0, 0.0, 0.0)
            },
            // VERTEX SHADER
            /*glsl*/`
            uniform float time;
            uniform vec3 color;
            uniform vec3 mouse;
            varying vec2 vUv;
            varying float vProgress;
            void main() {
                vUv = uv;
                vProgress = smoothstep(-1.0, 1.0, sin(vUv.x * 8.0 + time));

                vec3 p = position;

                // CURSOR REACTING
                // float maxDist = 0.1;
                // float dist = length(mouse * 0.5 - p);
                // if(dist < maxDist) {
                //     vec3 dir = normalize(mouse - p);
                //     dir*= (1.0 - dist/maxDist);
                //     p -=dir * 0.02;
                // }

                gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }
            `,
            // FRAGMENT SHADER
            /*glsl*/`
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            varying float vProgress;
            void main() {
                vec3 color2 = vec3(0.0, 0.0, 0.5);
                vec3 finalColor = mix(color, color * 0.25, vProgress);

                float hideCorners1 = smoothstep(1.0, 0.85, vUv.x);
                float hideCorners2 = smoothstep(0.0, 0.15, vUv.x);
                
                gl_FragColor.rgba = vec4(finalColor, hideCorners1 * hideCorners2);
            }
            `
        )

        extend({ TubeShaderMaterial })

        useFrame((renderer, delta) => {
            tubeShaderMaterialRef.current.uniforms.time.value += delta * 4.0
        })
        return <>
        <mesh scale={props.scale}>
            <tubeGeometry args={[curve, 64, 0.0001, 8, false]}/>
            <tubeShaderMaterial ref={tubeShaderMaterialRef}
            transparent={true}
            depthTest={false}
            depthWirite={false}
            blending={THREE.AdditiveBlending}
            wireframe={true}
            />
        </mesh>
        </>
    }

    function Tubes({finalCurves}) {
        return <>
        {finalCurves.map((curve, index) => {
            return <Tube curve={curve} key={index} />
        })}
        </>
    }

    return <>
        <Tubes finalCurves={props.finalCurves}/>
    </>
}