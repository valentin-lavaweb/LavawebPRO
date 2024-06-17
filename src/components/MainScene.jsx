import * as THREE from "three";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VirtualScroll from 'virtual-scroll';
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { OrbitControls, useFBO } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import RenderScene from "./renderScene/RenderScene.jsx";
import BlurEffectComponent from "../templates/blurEffect/BlurEffectComponent.jsx";

import * as Comlink from 'comlink';
import workerImport from '../worker.worker.js?worker';
import Scene1Test from "./scene1/Scene1Test.jsx";
const worker = Comlink.wrap(new workerImport());

// const Scene1WithWorkers = React.lazy(() => import("./scene1/Scene1WithWorkers.jsx"));
const Scene1 = React.lazy(() => import("./scene1/Scene1.jsx"));
const Scene2 = React.lazy(() => import("./scene2/Scene2.jsx"));
const Scene3 = React.lazy(() => import("./scene3/Scene3.jsx"));
const SceneMenu = React.lazy(() => import("./sceneMenu/SceneMenu.jsx"));

export default function MainScene(props) {
  const three = useThree();
  const progressTo = useRef(0.0);
  const progress = useRef(0.0);
  const currentScene = useRef(0);
  const nextScene = useRef(1);
  const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);
  const [windowInnerHeight, setWindowInnerHeight] = useState(window.innerHeight);
  const renderTarget = useFBO();
  const renderTarget2 = useFBO();
  
  const renderSceneRef = useRef({
    scene: useRef(),
    material: useRef(),
  });

  const scenes = useRef([
    {
      scene: useRef(),
      camera: useRef(),
      scroll: useRef(0),
    },
    {
      scene: useRef(),
      camera: useRef(),
      scroll: useRef(0),
    },
    {
      scene: useRef(),
      camera: useRef(),
      scroll: useRef(1),
    },
  ]);

  const sceneMenuRef = useRef({
    scene: useRef(),
    camera: useRef(),
  });
  const scrollCoefficent = useRef(10000)
  const bloomRef = useRef()
  const composerRef = useRef()
  console.log(composerRef)

  const scrollFunction = useCallback((progressTo) => async(e) => {
    // const workerResult = await worker.scroll(progress)
    if (progress.current === 0) {
      scenes.current[currentScene.current].scroll.current -= e.deltaY / scrollCoefficent.current;
      scenes.current[currentScene.current].scroll.current = Math.min(Math.max(scenes.current[currentScene.current].scroll.current, 0), 1);
    }

    if (scenes.current[currentScene.current].scroll.current === 1) {
      progressTo.current -= e.deltaY / 1000;
    } else if (scenes.current[currentScene.current].scroll.current === 0 && progress.current === 0) {
      progressTo.current -= e.deltaY / 1000;
    }
  }, [progressTo]);

  function switchScenes() {
    // console.log(`
    // currentScene: ${currentScene.current}
    // progress: ${progress.current}
    // progressTo: ${progressTo.current}
    // scene1Scroll: ${scenes.current[0].scroll.current}
    // scene2Scroll: ${scenes.current[1].scroll.current}
    // scene3Scroll: ${scenes.current[2].scroll.current}
    // `);
    easing.damp(progress, 'current', progressTo.current, 0.6);
  
    if (progress.current > 1) {
      progressTo.current = 0;
      progress.current = 0;
      currentScene.current = (currentScene.current + 1) % scenes.current.length;
      nextScene.current = (currentScene.current + 1) % scenes.current.length;
      if (currentScene.current === scenes.current.length - 1) {
        nextScene.current = 0;
      }
      scenes.current[currentScene.current].scroll.current = 0;
      scenes.current[nextScene.current].scroll.current = 0;
    } else if (progress.current < 0) {
      if (scenes.current[currentScene.current].scroll.current === 0) {
        progressTo.current = 1;
        progress.current = 1;
        currentScene.current = (currentScene.current - 1 + scenes.current.length) % scenes.current.length;
        nextScene.current = (currentScene.current + 1) % scenes.current.length;
        if (currentScene.current === 0) {
          nextScene.current = 1;
        }
        scenes.current[currentScene.current].scroll.current = 1;
        scenes.current[nextScene.current].scroll.current = 0;
      } else {
        progress.current = 0;
      }
    }

    // Удаляем этот код чтобы увеличить чувствительность скролла, но появится баг, который я ещё не решил.
    if (progressTo.current < 0) {
      progressTo.current = 0;
    }
    if (progressTo.current > 1) {
      progressTo.current = 1;
    }
  }

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setWindowInnerWidth(newWidth);
      setWindowInnerHeight(newHeight);
      
      renderTarget.setSize(newWidth, newHeight);
      renderTarget2.setSize(newWidth, newHeight);
      scenes.current.forEach(scene => {
        scene.camera.current.aspect = newWidth / newHeight;
        scene.camera.current.updateProjectionMatrix();
      });
      three.camera.aspect = newWidth / newHeight;
      three.camera.updateProjectionMatrix();
      three.gl.setSize(newWidth, newHeight);
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderTarget, renderTarget2, scenes]);

  useEffect(() => {
    three.invalidate();
    const scrollEventHandler = scrollFunction(progressTo);
    const vs = new VirtualScroll();
    vs.on(scrollEventHandler);
    return () => {
      vs.off(scrollEventHandler);
    };
  }, [scenes.current[0].scene.current, scenes.current[1].scene.current, scenes.current[2].scene.current, windowInnerWidth]);

  useFrame(({gl, scene, camera}, delta) => {
    if(props.activeSceneMenu.current === false) {
      switchScenes();
      renderSceneRef.current.scene.current.visible = false;
      sceneMenuRef.current.scene.current.visible = false;

      gl.setRenderTarget(renderTarget);
      scenes.current[currentScene.current].scene.current.visible = true;
      scenes.current[nextScene.current].scene.current.visible = false;
      gl.render(scenes.current[currentScene.current].scene.current, scenes.current[currentScene.current].camera.current);
      
      gl.setRenderTarget(renderTarget2);
      scenes.current[currentScene.current].scene.current.visible = false;
      scenes.current[nextScene.current].scene.current.visible = true;
      gl.render(scenes.current[nextScene.current].scene.current, scenes.current[nextScene.current].camera.current);
      
      scenes.current[currentScene.current].scene.current.visible = false;
      scenes.current[nextScene.current].scene.current.visible = false;

      renderSceneRef.current.scene.current.visible = true;

      gl.setRenderTarget(null);
    } else {
      renderSceneRef.current.scene.current.visible = false;
      scenes.current[currentScene.current].scene.current.visible = false;
      scenes.current[nextScene.current].scene.current.visible = false;
      
      gl.setRenderTarget(renderTarget);
      sceneMenuRef.current.scene.current.visible = true;
      gl.render(sceneMenuRef.current.scene.current, sceneMenuRef.current.camera.current);
      
      gl.setRenderTarget(renderTarget2);
      gl.render(sceneMenuRef.current.scene.current, sceneMenuRef.current.camera.current);

      sceneMenuRef.current.scene.current.visible = false;
      renderSceneRef.current.scene.current.visible = true;

      gl.setRenderTarget(null);
    }
    if (renderSceneRef.current != null) {
      renderSceneRef.current.material.current.map = renderTarget.texture;
      renderSceneRef.current.material.current.progress = progress.current;
    }
  });

  // useFrame(() => {
  //   renderSceneRef.current.scene.current.visible = false
  //   scenes.current[0].scene.current.visible = true
  // }, 1)
  return <>
    <RenderScene ref={renderSceneRef}
      renderTarget={renderTarget}
      renderTarget2={renderTarget2}
      progress={progress}
      activeSceneMenu={props.activeSceneMenu}
    />
    <Scene1 ref={scenes.current[0]}
      currentScene={currentScene} nextScene={nextScene} progress={progress} scenes={scenes} activeMenu={props.activeMenu}
      scroll={scenes.current[0].scroll}
    />
    {/* <Scene1Test ref={scenes.current[0]}/> */}
    <Scene2 ref={scenes.current[1]} currentScene={currentScene} nextScene={nextScene} progress={progress} scenes={scenes}
      scroll={scenes.current[1].scroll}
    />
    <Scene3 ref={scenes.current[2]} currentScene={currentScene} nextScene={nextScene} progress={progress} scenes={scenes}
      scroll={scenes.current[2].scroll}
    />
    <SceneMenu ref={sceneMenuRef} activeMenu={props.activeMenu} hoveredElement={props.hoveredElement}/>
    <EffectComposer 
      ref={composerRef}
      multisampling={0} 
      disableNormalPass={true}
      depthBuffer={true}
      stencilBuffer={true}
      resolutionScale={0.5}
    >
      <Bloom
        ref={bloomRef}
        mipmapBlur
        kernelSize={KernelSize.VERY_LARGE}
        luminanceThreshold={1}
        luminanceSmoothing={2}
        intensity={1}
      />
      <Noise opacity={0.025} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
    {/* <OrbitControls /> */}
  </>
}
