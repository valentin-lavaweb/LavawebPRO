import * as THREE from 'three';
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

import wiresVectors from '../../scene1/schemeVectors/wiresVectors.json';
import screenVectors from '../../scene1/schemeVectors/screenVectors';

const SchemesModelWithWorker = React.lazy(() => import("../../../templates/schemes/schemesModelWorker/SchemesModelWithWorker.jsx"));
const RainParticlesWithWorker = React.lazy(() => import("../../../templates/rainParticles/rainParticlesWorker/RainParticlesWithWorker.jsx"));
const StarsWithWorker = React.lazy(() => import("../../../templates/stars/starsWithWorker/StarsWithWorker.jsx"));

const SchemesModel = React.lazy(() => import("../../../templates/schemes/SchemesModel.jsx"));
const RainParticles = React.lazy(() => import("../../../templates/rainParticles/RainParticles.jsx"));
const Stars = React.lazy(() => import("../../../templates/stars/Stars.jsx"));

// Шейдерный материал для голографического эффекта
const HologramMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null
  },
  /*glsl*/`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /*glsl*/`
    uniform float uTime;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      vec3 color = texture2D(uTexture, uv).rgb;
      
      float glitch = sin(uv.y * 10.0 + uTime * 50.0) * 0.05;
      color.b += glitch;

      gl_FragColor = vec4(color * 2.0, 0.75);
    }
  `
);
extend({ HologramMaterial });

export default function Scene1Model(props) {
  const sceneModel = useGLTF('/models/screen1/BuildingScene.glb');
  const frameCount = useRef(0);
  const hologramMaterialRef = useRef();

  const video = useMemo(() => {
    const video = document.createElement('video');
    video.src = '/videos/showreel2023.mp4';
    video.loop = true;
    video.muted = true;
    video.play()
    return video;
  }, []);

  const videoTexture = useMemo(() => {
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [video]);

  useEffect(() => {
    sceneModel.scene.traverse((node) => {
      if (node.isMesh && node.name === 'ScreenPlane') {
        node.material = hologramMaterialRef.current;
      }
    });
  }, [sceneModel, videoTexture]);

  useFrame((state, delta) => {
    frameCount.current++;
    if (frameCount.current % 2 === 0) {
      hologramMaterialRef.current.uTime += delta;
    }
  });

  return <>
    <primitive object={sceneModel.scene} />
    <hologramMaterial ref={hologramMaterialRef} uTexture={videoTexture} />
    <directionalLight intensity={0.1} color={new THREE.Color(5, 5, 50)} position={[-10, 10, 5]} />
    <directionalLight intensity={0.2} color={new THREE.Color(5, 5, 50)} position={[0, 10, 5]} />

    <Stars />
    <RainParticles xScale={40} zScale={40} zPosition={0} lengthScale={1} count={10000} opacity={0.1} speedScale={1}/>
    <RainParticles xScale={25} zScale={8} zPosition={7} lengthScale={0.5} count={10000} opacity={0.1} speedScale={0.25}/>
    <SchemesModel vectors={wiresVectors} speed={0.00007} particlesCount={1500} delay={10}/>
    <SchemesModel vectors={screenVectors} speed={0.00005} particlesCount={500} delay={0.1}/>
    
    {/* <StarsWithWorker />
    <RainParticlesWithWorker xScale={40} zScale={40} zPosition={0} lengthScale={1} count={10000} opacity={0.1} speedScale={1}/>
    <RainParticlesWithWorker xScale={25} zScale={8} zPosition={7} lengthScale={0.5} count={10000} opacity={0.1} speedScale={0.25}/>
    <SchemesModelWithWorker vectors={wiresVectors} speed={0.00007} particlesCount={1500} delay={10}/>
    <SchemesModelWithWorker vectors={screenVectors} speed={0.00005} particlesCount={500} delay={0.1}/> */}
  </>;
}
