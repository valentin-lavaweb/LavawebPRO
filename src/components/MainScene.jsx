import * as THREE from "three";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VirtualScroll from 'virtual-scroll'
import {
    EffectComposer,
    DepthOfField,
    Bloom,
    Noise,
    Vignette,
    BrightnessContrast
  } from "@react-three/postprocessing";
  import { KernelSize } from "postprocessing";
  import {
    OrbitControls, useFBO
  } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import RenderScene from "./renderScene/RenderScene.jsx";

const Scene1 = React.lazy(() => import("./scene1/Scene1.jsx"));
const Scene2 = React.lazy(() => import("./scene2/Scene2.jsx"));
const Scene3 = React.lazy(() => import("./scene3/Scene3.jsx"));
const SceneMenu = React.lazy(() => import("./sceneMenu/SceneMenu.jsx"));

export default function MainScene(props) {
    const three = useThree()
    const progressTo = useRef(0.1);
    const progress = useRef(0.1);
    const currentScene = useRef(0)
    const nextScene = useRef(1)
    const bg = new THREE.TextureLoader().load('/backgrounds/bg1.png')
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth)
    const [windowInnerHeight, setWindowInnerHeight] = useState(window.innerHeight)
    const renderTarget = useFBO()
    const renderTarget2 = useFBO()
    const renderSceneTarget = useFBO()
    const renderTargetMenu = useFBO()
    const renderSceneRef = useRef({
        scene: useRef(),
        material: useRef()
    });
    const scenes = useRef([
        {
            scene: useRef(),
            camera: useRef()
        },
        {
            scene: useRef(),
            camera: useRef()
        },
        {
            scene: useRef(),
            camera: useRef()
        },
    ])
    const sceneMenuRef = useRef()
    const activeMenu = props.activeMenu
    const darkness = useRef(false)

    const scrollFunction = useCallback((progressTo) => (e) => {
        progressTo.current -= (e.deltaY / 1000)
    }, [progressTo]);

    const switchScenes = () => {
        easing.damp(progress, 'current', progressTo.current, 0.6);
        // if (progressTo.current > 1) {
        //     progressTo.current = 1.05
        // }
        // if (progressTo.current < 0) {
        //     progressTo.current = -0.05
        // }
    
        if (progress.current > 1) {
            progressTo.current = (progressTo.current % 1) * 0.25;
            progress.current = 0;
            currentScene.current = (currentScene.current + 1) % scenes.current.length;
            nextScene.current = (currentScene.current + 1) % scenes.current.length;
            if (currentScene.current === scenes.current.length - 1) {
                nextScene.current = 0;
            }
        } else if (progress.current < 0) {
            progressTo.current = 1 - ((progressTo.current % 1) * 0.25);
            progress.current = 1;
            currentScene.current = (currentScene.current - 1 + scenes.current.length) % scenes.current.length;
            nextScene.current = (currentScene.current + 1) % scenes.current.length;
            if (currentScene.current === 0) {
                nextScene.current = 1;
            }
        }
    }

    useEffect(() => {
        three.invalidate()
        const scrollEventHandler = scrollFunction(progressTo);
        const vs = new VirtualScroll()
        vs.on(scrollEventHandler);
        return () => {
            vs.off(scrollEventHandler);
        }
    }, [scenes.current[0].scene.current, scenes.current[1].scene.current, scenes.current[2].scene.current, windowInnerWidth])

    useFrame(({gl, scene, camera}, delta) => {
        switchScenes()
        
        activeMenu.current === true ? sceneMenuRef.current.visible = true : sceneMenuRef.current.visible = false
        gl.setRenderTarget(renderTarget)
        renderSceneRef.current.scene.current.visible = false
        // scene.visible = false
        scenes.current[currentScene.current].scene.current.visible = true
        scenes.current[nextScene.current].scene.current.visible = false
        // scene.background = bg
        gl.render(scene, scenes.current[currentScene.current].camera.current)
        // gl.render(scenes.current[currentScene.current].scene.current, scenes.current[currentScene.current].camera.current)

        gl.setRenderTarget(renderTarget2)
        renderSceneRef.current.scene.current.visible = false
        scenes.current[currentScene.current].scene.current.visible = false
        scenes.current[nextScene.current].scene.current.visible = true
        gl.render(scene, scenes.current[nextScene.current].camera.current)
        // gl.render(scenes.current[nextScene.current].scene.current, scenes.current[currentScene.current].camera.current)
        
        scenes.current[currentScene.current].scene.current.visible = false
        scenes.current[nextScene.current].scene.current.visible = false
        renderSceneRef.current.material.current.uniforms.tex.value = renderTarget.texture
        renderSceneRef.current.material.current.uniforms.tex2.value = renderTarget2.texture
        renderSceneRef.current.scene.current.visible = true

        // МОЖНО ЗАКОМЕНТИРОВАТЬ
        // gl.setRenderTarget(null)
        // gl.render(scene, camera)
        if (renderSceneRef.current != null) {
            if (activeMenu.current === true) {
                easing.damp(scenes.current[currentScene.current].camera.current.position, 'z', 10, 2);
                easing.damp(scenes.current[nextScene.current].camera.current.position, 'z', 10, 2);
            } else {
                easing.damp(scenes.current[currentScene.current].camera.current.position, 'z', 5, 0.5);
                easing.damp(scenes.current[nextScene.current].camera.current.position, 'z', 5, 0.5);
            }
            // renderSceneRef.current.material.current.map = renderTarget.texture
            renderSceneRef.current.material.current.progression = progress.current
        }
    })

    // useFrame(({scene}) =>{
    //     // scene.background = bg
    //     scenes.current[0].scene.current.visible = true
    // })
    return <>
        <RenderScene ref={renderSceneRef} activeMenu={activeMenu}
        renderTarget={renderTarget}
        renderTarget2={renderTarget2}
        progress={progress}
        />
        <Scene1 ref={scenes.current[0]} currentScene={currentScene} nextScene={nextScene} progress={progress} scenes={scenes}/>
        <Scene2 ref={scenes.current[1]} currentScene={currentScene} nextScene={nextScene} progress={progress} scenes={scenes}/>
        <Scene3 ref={scenes.current[2]} currentScene={currentScene} nextScene={nextScene} progress={progress} scenes={scenes}/>
        <SceneMenu ref={sceneMenuRef}/>
        <EffectComposer 
        multisampling={0} 
        disableNormalPass={false}
        depthBuffer={true}
        stencilBuffer={true}
        // scene={renderSceneRef.current.scene.current}
        scene={null}
        // resolutionScale={2}
        >
            {/* <DepthOfField
            focusDistance={0}
            focalLength={0.05}
            bokehScale={2}
            // height={300}
            // width={300}
            /> */}
            {/* <BrightnessContrast
                brightness={0} // brightness. min: -1, max: 1
            /> */}
            <Bloom
            mipmapBlur
            mipMap={false}
            kernelSize={KernelSize.LARGE}
            luminanceThreshold={0}
            luminanceSmoothing={0.2}
            opacity={3}
            intensity={2}
            />
            <Noise opacity={0.025} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
    </>
}