import * as THREE from 'three'
import {data} from '../../data'
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { useRef } from 'react';

export default function BrainModel(props) {

    
    const PATHS = data.economics[0].paths
    const randomRange = (min, max) => Math.random() * (max - min) + min;
    let curves = []
    for (let i = 0; i < 100; i++) {
        let points = []
        let length = randomRange(0.2, 0.8)
        for (let j = 0; j < 100; j++) {
            points.push(
                new THREE.Vector3().setFromSphericalCoords(
                    0.2, 
                    Math.PI * 1 - (j / 100) * Math.PI * length,
                    (i / 100) * Math.PI * 2
                )
            )
        }
        
        let tempcurve = new THREE.CatmullRomCurve3(points)
        curves.push(tempcurve)
    }

    let brainCurves = []
    PATHS.forEach((path) => {
        let points = []
        for (let i = 0; i < path.length; i+=3) {
            points.push(new THREE.Vector3(path[i], path[i+1], path[i+2]))
            
        }
        let tempcurve = new THREE.CatmullRomCurve3(points)
        brainCurves.push(tempcurve)
    });
    
    function Tube({curve}) {
        const tubeShaderMaterialRef = useRef()

        const TubeShaderMaterial = shaderMaterial(
            {
                time: 0,
                color: new THREE.Color(0.02, 0.03, 0.1),
            },
            // VERTEX SHADER
            /*glsl*/`
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            varying float vProgress;
            void main() {
                vUv = uv;
                vProgress = smoothstep(-1.0, 1.0, sin(vUv.x * 4.0 + time));
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
                gl_FragColor.rgba = vec4(finalColor, 1.0);
            }
            `
        )

        extend({ TubeShaderMaterial })

        useFrame((renderer, delta) => {
            tubeShaderMaterialRef.current.uniforms.time.value += delta * 2.0
        })
        return <>
        <mesh>
            <tubeGeometry args={[curve, 64, 0.001, 8, false]}/>
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

    function Tubes({finalCurve}) {
        return <>
        {finalCurve.map((curve, index) => {
            return <Tube curve={curve} key={index} />
        })}
        </>
    }

    return <>
        <ambientLight />
        <directionalLight />
        <Tubes finalCurve={brainCurves}/>
    </>
}