import * as THREE from 'three'
import { extend, useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import { shaderMaterial } from '@react-three/drei';

// ПАРТИКЛИ
export default function CurvesParticles({finalCurves, scale}) {
    const myPoints = useRef([])

    // Функция рандома
    const randomRange = (min, max) => Math.random() * (max - min) + min;

    let density = 10
    let numberOfPoints = density * finalCurves.length

    // ATTRIBUTES
    let positions = useMemo(() => {
        let positions = []
        for (let i = 0; i < numberOfPoints; i++) {
            positions.push(
                randomRange(-1, 1),
                randomRange(-1, 1),
                randomRange(-1, 1),
            )
        }
        return new Float32Array(positions)
    }, [])

    let randomSize = useMemo(() => {
        let randomSize = []
        for (let i = 0; i < numberOfPoints; i++) {
            randomSize.push(
                randomRange(1 * scale, 5 * scale),
            )
        }
        return new Float32Array(randomSize)
    }, [])

    const ParticlesShaderMaterial = shaderMaterial(
        {
            time: 0,
            color: new THREE.Color(1.0, 1.0, 10.0),
        },
        // VERTEX SHADER
        /*glsl*/`
        uniform float time;
        varying vec2 vUv;
        attribute float randomSize;
        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = randomSize * 0.15 * (1.0 / -mvPosition.z);
        }
        `,
        // FRAGMENT SHADER
        /*glsl*/`
        uniform float time;
        uniform vec3 color;
        void main() {         
            float disc = length(gl_PointCoord.xy - vec2(0.5));
            float opacity = smoothstep(0.5, 0.4, disc);
            gl_FragColor = vec4(vec3(opacity * color), 1.0);
        }
        `
    )
    extend({ ParticlesShaderMaterial })

    const pointsRef = useRef()

    useEffect(() => {
        for (let i = 0; i < finalCurves.length; i++) {
            for (let j = 0; j < density; j++) {
                myPoints.current.push({
                    currentOffset: Math.random(),
                    speed: Math.random()*0.004,
                    curve: finalCurves[i],
                    curPosition: Math.random()
                })
            }
        }
    })

    useFrame(() => {
        let curpositions = pointsRef.current.geometry.attributes.position.array;

        for (let i = 0; i < myPoints.current.length; i++) {
            myPoints.current[i].curPosition += myPoints.current[i].speed
            myPoints.current[i].curPosition = myPoints.current[i].curPosition%1

            let curPoint = myPoints.current[i].curve.getPointAt(myPoints.current[i].curPosition)
            curpositions[i*3] = curPoint.x
            curpositions[i*3 + 1] = curPoint.y
            curpositions[i*3 + 2] = curPoint.z
            
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true
    })

    return <>
    <points ref={pointsRef} scale={scale}>
        <bufferGeometry attach="geometry">
            <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
            />
            <bufferAttribute
            attach="attributes-randomSize"
            count={randomSize.length / 3}
            array={randomSize}
            itemSize={1}
            />
        </bufferGeometry>
        <particlesShaderMaterial
        attach="material" 
        depthTest={false}
        depthWrite={false}
        transparent={true}
        blending={THREE.AdditiveBlending}
        />
    </points>
    </>
}