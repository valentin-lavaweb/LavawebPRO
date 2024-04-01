import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function AnimatedParticles(props) {

    const nipigasLogoModel = useGLTF('/models/NipigasLogo.glb')
    // console.log(nipigasLogoModel)
    const material = new THREE.MeshBasicMaterial({color: 'red'})
    for (let i = 0; i < nipigasLogoModel.scene.children[0].children.length; i++) {
        const element = nipigasLogoModel.scene.children[0].children[i];
        // element.material = material
    }
    const particlesRef = useRef({
        geometry: new THREE.SphereGeometry(3),
        material: new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uTime: {value: 0.0},
                uSize: {value: 0.1},
                uResolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)} ,
                uCursor: {value: new THREE.Vector2(0.0, 0.0)},
                uProgress: {value: 0.0}
            },
            // transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }),
        maxCount: 0,
        models: [
            nipigasLogoModel,
            
        ]
    })
    const particles = particlesRef.current

    useEffect(() => {
        particles.geometry.setIndex(null)
    }, [])

    return <>
    <points geometry={particles.geometry} material={particles.material}></points>
    <primitive object={nipigasLogoModel.scene} />
    <ambientLight />
    {/* <directionalLight /> */}
    {/* <mesh scale={1.0}>
        <planeGeometry />
        <meshBasicMaterial color="red"/>
    </mesh> */}
    </>
}