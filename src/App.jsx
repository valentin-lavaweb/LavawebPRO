import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Html,
  OrbitControls
} from "@react-three/drei";
import { KernelSize } from "postprocessing";
import MainScene from "./components/MainScene.jsx";
import Hud from "./components/hud/Hud.jsx";
import { useStore } from "./store.jsx";

export default function App() {
  const activeMenu = useRef()
  const activeSceneMenu = useRef()
  const language = useRef()

  useEffect(() => {
    activeMenu.current = true
    activeSceneMenu.current = true
    language.current = 'RU'
  }, [])

  return <>
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 75
      }}
      dpr={1}
      // className={`canvas ${store.activeHeader === false && `dark`}`}
      // scene={null}
    >
      <color attach="background" args={["#131e25"]} />
      {/* <fog color="#131e25" attach="fog" near={8} far={30} /> */}
      <Suspense fallback={<Html center>Loading.</Html>}>
        <MainScene activeMenu={activeMenu} activeSceneMenu={activeSceneMenu}/>
      </Suspense>
      {/* <OrbitControls /> */}
    
    </Canvas>
    <Hud activeMenu={activeMenu} activeSceneMenu={activeSceneMenu} language={language}/>

  </>
}
