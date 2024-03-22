import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette
} from "@react-three/postprocessing";
import {
  Html,
  Icosahedron,
  useTexture,
  useCubeTexture,
  MeshDistortMaterial,
  OrbitControls
} from "@react-three/drei";
import { KernelSize } from "postprocessing";
import MainScene from "./components/MainScene.jsx";

export default function App() {
  useEffect(() => {
    activeMenu.current = false
  }, [])
  const activeMenu = useRef()

  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 75
      }}
      dpr={1}
      className={`canvas ${activeMenu.current === false && `dark`}`}
      // scene={null}
    >
      <color attach="background" args={["#131e25"]} />
      {/* <fog color="#131e25" attach="fog" near={8} far={30} /> */}
      <Suspense fallback={<Html center>Loading.</Html>}>
        <MainScene activeMenu={activeMenu}/>
      </Suspense>
      {/* <OrbitControls /> */}
    
    </Canvas>
  );
}
