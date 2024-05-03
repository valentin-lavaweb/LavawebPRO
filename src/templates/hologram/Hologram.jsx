import * as THREE from 'three'
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"

import hologramVertexShader from './shaders/vertex.glsl'
import hologramFragmentShader from './shaders/fragment.glsl'

export default function Hologram(props) {
    const materialRef = useRef()
    const hologramRef = useRef()
    const hologramModel = useGLTF('/models/rocket.glb')

    useEffect(() => {
        // console.log(materialRef)
        // hologramRef.current.rotation.x = Math.PI
    }, [])

    useFrame((renderer, delta) => {
        materialRef.current.uniforms.uTime.value += delta * 0.05;
        // hologramRef.current.rotation.x += delta * 0.05;
        // hologramRef.current.rotation.y += delta * 0.05;
    })

    return <>
        <mesh ref={hologramRef} {...hologramModel.scene.children[0]} scale={1} rotation={[0, 0, 0]} position={[0, -8, 0]}>
            <shaderMaterial ref={materialRef}
            vertexShader={hologramVertexShader}
            fragmentShader={hologramFragmentShader}
            transparent={true}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={
                {
                    uTime: new THREE.Uniform(0),
                    uColor: new THREE.Uniform(new THREE.Vector3(1.0, 1.0, 5.0))
                }
            }/>
        </mesh>
    </>
}