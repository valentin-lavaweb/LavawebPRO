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

export default function App() {
  const activeMenu = useRef()
  const activeSceneMenu = useRef()
  const displacementCanvasRef = useRef()
  const language = useRef()
  const hoveredElement = useRef('')

  const defaultCameraPosition = useRef(5)
  const [dpr, setDpr] = useState(1)

  useEffect(() => {
    activeMenu.current = false
    activeSceneMenu.current = false
    language.current = 'EN'
  }, [])

  return <>
    <Canvas
      camera={{
        position: [0, 0, defaultCameraPosition.current],
        fov: 50,
        far: 10000,
        near: 0.1
      }}
      dpr={1}
      // linear={true}
      // flat={false}
      // orthographic
      // scene={null}
    >
      <color attach="background" args={["#000000"]} />
      {/* <fog color="#131e25" attach="fog" near={8} far={30} /> */}
      <Suspense fallback={<Html center>Loading.</Html>}>
        <MainScene displacementCanvasRef={displacementCanvasRef}
          defaultCameraPosition={defaultCameraPosition}
          activeMenu={activeMenu}
          activeSceneMenu={activeSceneMenu}
          hoveredElement={hoveredElement}
        />
      </Suspense>
    
    </Canvas>
    <Hud 
      activeMenu={activeMenu}
      activeSceneMenu={activeSceneMenu} 
      language={language}
      hoveredElement={hoveredElement}
    />
  </>
}
