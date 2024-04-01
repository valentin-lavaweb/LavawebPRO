import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import BackgroundLavaComponent from "./background/BackgroundLavaComponent"
import { Icosahedron, MeshDistortMaterial, shaderMaterial, useCubeTexture, useTexture } from "@react-three/drei"
import { easing } from 'maath'
import { useControls } from 'leva'
import { motion } from 'framer-motion-3d'
import Particles from '../../templates/particles/Particles.jsx'
import MorphParticles from '../../templates/morphParticles/MorphParticles.jsx'
import GlassModel from '../../templates/glassModel/GlassModel.jsx'

export default forwardRef( function Scene1(props, ref) {
    const three = useThree()
    const bumpMap = useTexture("/bump.jpg");
    const envMap = useCubeTexture(
      ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
      { path: "/cube/" }
    );
    const [material, setMaterial] = useState();
    const groupRef = useRef()

    useEffect(() => {
      ref.scene.current.visible = false
    }, [])

    useFrame(({pointer}) => {
      easing.damp(ref.camera.current.position, 'x', -pointer.x * 0.25, 0.2);
      easing.damp(ref.camera.current.position, 'y', -pointer.y * 0.25, 0.2);
      ref.camera.current.lookAt(0, 0, 0)
      if (props.currentScene.current === 0) {
        easing.damp(groupRef.current.position, 'y', (props.progress.current - 0) * 1.75, 0.05);
      } else if (props.currentScene.current === props.scenes.current.length - 1) {
        easing.damp(groupRef.current.position, 'y', (props.progress.current - 1) * 1.75, 0.05);
      }
    })
    const bg = new THREE.TextureLoader().load('/backgrounds/bg1.png')
    const bgTexture = new THREE.WebGLRenderTarget(three.viewport.width, three.viewport.height);
    const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture.texture });

    return <>
    {/* <scene ref={ref.scene} background={bg}> */}
    <scene ref={ref.scene}>
      <color attach="background" args={["#030d15"]} />
      <perspectiveCamera {...three.camera} ref={ref.camera}/>
      {/* <BackgroundLavaComponent progress={props.progress} currentScene={props.currentScene} scenes={props.scenes}/> */}
      {/* <MeshDistortMaterial
          ref={setMaterial}
          envMap={envMap}
          bumpMap={bumpMap}
          color={"#010101"}
          roughness={0}
          metalness={1}
          bumpScale={0.005}
          clearcoat={1}
          clearcoatRoughness={1}
          radius={1}
          distort={0.35}
      /> */}
      <group ref={groupRef}>
        {/* <Sphere />
        <LittleSpheres />
        <Rings />
        <PlatformScene /> */}
        {/* <Particles /> */}
        {/* <MorphParticles /> */}
        <GlassModel />
      </group>
    </scene>
    </>
})