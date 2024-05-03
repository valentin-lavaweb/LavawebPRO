import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { easing } from 'maath'
import Hologram from '../../templates/hologram/Hologram.jsx'
import CurvesModel from '../../templates/curvesModel/CurvesModel.jsx'
import { OrbitControls } from '@react-three/drei'

export default forwardRef( function Scene1(props, ref) {
    const three = useThree()
    const groupRef = useRef()
    const orbitRef = useRef()

    useEffect(() => {
      ref.scene.current.visible = false
      orbitRef.current.object = ref.camera.current
    }, [])


    useFrame(({pointer}, delta) => {
      // easing.damp(ref.camera.current.position, 'y', props.scrollScene1.current, 0.2);

      if (props.currentScene.current === 0) {
        easing.damp(groupRef.current.position, 'y', (props.progress.current - 0) * 1.75, 0.05);
      } else if (props.currentScene.current === props.scenes.current.length - 1) {
        easing.damp(groupRef.current.position, 'y', (props.progress.current - 1) * 1.75, 0.05);
      }
    })
    const bg = new THREE.TextureLoader().load('/backgrounds/bg1.png')
    const bgTexture = new THREE.WebGLRenderTarget(three.viewport.width, three.viewport.height);
    const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture.texture });
    const CubeOfSchemesRef = useRef()

    return <>
    {/* <scene ref={ref.scene} background={bg}> */}
    <scene ref={ref.scene}>
      <color attach="background" args={["#181c20"]} />
      <perspectiveCamera {...three.camera} ref={ref.camera}/>
      {/* <BackgroundLavaComponent progress={props.progress} currentScene={props.currentScene} scenes={props.scenes}/> */}
      <group ref={groupRef}>
        <Hologram />
        <CurvesModel />
      </group>
      <OrbitControls ref={orbitRef}/>
    </scene>
    </>
})