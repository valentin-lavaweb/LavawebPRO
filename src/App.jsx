import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Html,
  OrbitControls,
  PerformanceMonitor
} from "@react-three/drei";
import { KernelSize } from "postprocessing";
import MainScene from "./components/MainScene.jsx";
import Hud from "./components/hud/Hud.jsx";
import { useStore } from "./store.jsx";

export default function App() {
  const activeMenu = useRef()
  const activeSceneMenu = useRef()
  const displacementCanvasRef = useRef()
  const language = useRef()
  const defaultCameraPosition = useRef(5)
  const [dpr, setDpr] = useState(1)

  useEffect(() => {
    activeMenu.current = false
    activeSceneMenu.current = false
    language.current = 'EN'

        
    displacementCanvasRef.current.style.position = 'fixed'
    displacementCanvasRef.current.style.right = '0px'
    displacementCanvasRef.current.style.top = '0px'
    displacementCanvasRef.current.style.width = `${64}px`
    displacementCanvasRef.current.style.height = `${64}px`
    displacementCanvasRef.current.style.display = 'none'
    displacementCanvasRef.current.style.pointerEvents = 'none'
    displacementCanvasRef.current.style.opacity = '1'
  }, [])

  return <>
    <Canvas
      camera={{
        position: [0, 0, defaultCameraPosition.current],
        fov: 75
      }}
      dpr={dpr}
      // linear={true}
      // flat={false}
      // orthographic
      // className={`canvas ${store.activeHeader === false && `dark`}`}
      // scene={null}
      // antialias={window.devicePixelRatio}
    >
      <color attach="background" args={["#000000"]} />
      {/* <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(window.devicePixelRatio)} /> */}
      {/* <fog color="#131e25" attach="fog" near={8} far={30} /> */}
      <Suspense fallback={<Html center>Loading.</Html>}>
        <MainScene activeMenu={activeMenu} activeSceneMenu={activeSceneMenu} defaultCameraPosition={defaultCameraPosition} displacementCanvasRef={displacementCanvasRef}/>
      </Suspense>
      {/* <OrbitControls /> */}
    
    </Canvas>
    <canvas ref={displacementCanvasRef}></canvas>
    <Hud activeMenu={activeMenu} activeSceneMenu={activeSceneMenu} language={language}/>

  </>
}
