import * as THREE from "three";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VirtualScroll from 'virtual-scroll'
import {
    EffectComposer,
    DepthOfField,
    Bloom,
    Noise,
    Vignette,
    BrightnessContrast,
  } from "@react-three/postprocessing";
  import { KernelSize } from "postprocessing";
  import {
    OrbitControls, useFBO
  } from "@react-three/drei";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { easing } from "maath";
import RenderScene from "./renderScene/RenderScene.jsx";
import BlurEffectComponent from "../templates/blurEffect/BlurEffectComponent.jsx";
import { RGBELoader } from "three-stdlib";
// import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';

const Scene1 = React.lazy(() => import("./scene1/Scene1.jsx"));
const Scene2 = React.lazy(() => import("./scene2/Scene2.jsx"));
const Scene3 = React.lazy(() => import("./scene3/Scene3.jsx"));
const SceneMenu = React.lazy(() => import("./sceneMenu/SceneMenu.jsx"));

export default function MainScene(props) {
    const three = useThree()

    const letScrollScene = useRef(true);
    const progressTo = useRef(0.0);
    const progress = useRef(0.0);
    const currentScene = useRef(0)
    const nextScene = useRef(1)
    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth)
    const [windowInnerHeight, setWindowInnerHeight] = useState(window.innerHeight)
    const renderTarget = useFBO()
    const renderTarget2 = useFBO()
    
    const renderSceneRef = useRef({
        scene: useRef(),
        material: useRef()
    });

    // Сцены
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
    const sceneMenuRef = useRef({
        scene: useRef(),
        camera: useRef()
    })

    // Функция скролла
    const scrollFunction = useCallback((progressTo) => (e) => {
        if (letScrollScene.current === false) {
            progressTo.current -= (e.deltaY / 1000)
        }
    }, [progressTo]);

    // Функция переключения сцен
    function switchScenes() {
        easing.damp(progress, 'current', progressTo.current, 0.6);
    
        if (progress.current > 1) {
            // progressTo.current = (progressTo.current % 1) * 0.25;
            progressTo.current = 0
            progress.current = 0;
            currentScene.current = (currentScene.current + 1) % scenes.current.length;
            nextScene.current = (currentScene.current + 1) % scenes.current.length;
            if (currentScene.current === scenes.current.length - 1) {
                nextScene.current = 0;
            }
        } else if (progress.current < 0) {
            // progressTo.current = 1 - ((progressTo.current % 1) * 0.25);
            progressTo.current = 1
            progress.current = 1;
            currentScene.current = (currentScene.current - 1 + scenes.current.length) % scenes.current.length;
            nextScene.current = (currentScene.current + 1) % scenes.current.length;
            if (currentScene.current === 0) {
                nextScene.current = 1;
            }
        }
    }

    // Функция отдаления и приближения камеры
    function checkCamerasZ() {
        if (props.activeMenu.current === true) {
            easing.damp(scenes.current[currentScene.current].camera.current.position, 'z', props.defaultCameraPosition.current * 2, 2);
            easing.damp(scenes.current[nextScene.current].camera.current.position, 'z', props.defaultCameraPosition.current * 2, 2);
        } else {
            easing.damp(scenes.current[currentScene.current].camera.current.position, 'z', props.defaultCameraPosition.current, 0.5);
            easing.damp(scenes.current[nextScene.current].camera.current.position, 'z', props.defaultCameraPosition.current, 0.5);
        }
    }

    // RESIZE
    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            setWindowInnerWidth(newWidth);
            setWindowInnerHeight(newHeight);
            
            renderTarget.setSize(newWidth, newHeight);
            renderTarget2.setSize(newWidth, newHeight);
            // Обновляем размеры камер в сценах
            scenes.current.forEach(scene => {
                scene.camera.current.aspect = newWidth / newHeight;
                scene.camera.current.updateProjectionMatrix();
            });
            // Обновляем основную камеру
            three.camera.aspect = newWidth / newHeight;
            three.camera.updateProjectionMatrix();

            // Выставляем новый размер рендера
            three.gl.setSize(newWidth, newHeight);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [renderTarget, renderTarget2, scenes]);

    // Включаем скролл, подготавливаем сцены
    useEffect(() => {
        three.invalidate() // подготовили все сцены
        const scrollEventHandler = scrollFunction(progressTo);
        const vs = new VirtualScroll()
        vs.on(scrollEventHandler);
        return () => {
            vs.off(scrollEventHandler);
        }
    }, [scenes.current[0].scene.current, scenes.current[1].scene.current, scenes.current[2].scene.current, windowInnerWidth])



    // РЕНДЕРЕР
    useFrame(({gl, scene, camera}, delta) => {       
        // Рендер сцен, если меню закрыто
        if(props.activeSceneMenu.current === false) {
            switchScenes()
            renderSceneRef.current.scene.current.visible = false
            sceneMenuRef.current.scene.current.visible = false

            gl.setRenderTarget(renderTarget)
            scenes.current[currentScene.current].scene.current.visible = true
            scenes.current[nextScene.current].scene.current.visible = false
            gl.render(scenes.current[currentScene.current].scene.current, scenes.current[currentScene.current].camera.current)
            
            gl.setRenderTarget(renderTarget2)
            scenes.current[currentScene.current].scene.current.visible = false
            scenes.current[nextScene.current].scene.current.visible = true
            gl.render(scenes.current[nextScene.current].scene.current, scenes.current[nextScene.current].camera.current)
            
            scenes.current[currentScene.current].scene.current.visible = false
            scenes.current[nextScene.current].scene.current.visible = false

            // renderSceneRef.current.material.current.uniforms.tex.value = renderTarget.texture
            // renderSceneRef.current.material.current.uniforms.tex2.value = renderTarget2.texture

            renderSceneRef.current.scene.current.visible = true

            // gl.setRenderTarget(renderSceneTarget)
            // gl.render(scene, camera)
            // blurEffectComponentRef.current.tex = renderSceneTarget.texture

            // gl.setRenderTarget(renderSceneTarget)
            // gl.render(scene, camera)
            // blurEffectComponentRef.current.depthTex = renderSceneTarget.depthTexture
            // console.log(renderSceneTarget, renderTarget)
            
    
            // МОЖНО ЗАКОМЕНТИРОВАТЬ ЕСЛИ EFFECT COMPOSER ВКЛЮЧЕН.
            gl.setRenderTarget(null)

        } 
        else {
            renderSceneRef.current.scene.current.visible = false
            scenes.current[currentScene.current].scene.current.visible = false
            scenes.current[nextScene.current].scene.current.visible = false
            
            gl.setRenderTarget(renderTarget)
            sceneMenuRef.current.scene.current.visible = true
            gl.render(sceneMenuRef.current.scene.current, sceneMenuRef.current.camera.current)
            
            gl.setRenderTarget(renderTarget2)
            gl.render(sceneMenuRef.current.scene.current, sceneMenuRef.current.camera.current)

            // renderSceneRef.current.material.current.uniforms.tex.value = renderTarget.texture
            // renderSceneRef.current.material.current.uniforms.tex2.value = renderTarget2.texture

            sceneMenuRef.current.scene.current.visible = false
            renderSceneRef.current.scene.current.visible = true
    
            // МОЖНО ЗАКОМЕНТИРОВАТЬ ЕСЛИ EFFECT COMPOSER ВКЛЮЧЕН.
            gl.setRenderTarget(null)
        }
        if (renderSceneRef.current != null) {
            renderSceneRef.current.material.current.map = renderTarget.texture
            renderSceneRef.current.material.current.progress = progress.current
        }

        // Двигаем камеру всех сцен, если открыли меню
        // checkCamerasZ()
    })
    
    // // const environmentMap = useLoader(RGBELoader, '/backgrounds/backLavaweb.hdr')
    // useFrame(({scene}) =>{
    //     // scene.background = environmentMap
    //     scenes.current[0].scene.current.visible = true
    // })

    return <>
        <RenderScene ref={renderSceneRef}
        renderTarget={renderTarget}
        renderTarget2={renderTarget2}
        progress={progress}
        activeSceneMenu={props.activeSceneMenu}
        />
        <Scene1 ref={scenes.current[0]}
        currentScene={currentScene} nextScene={nextScene} progress={progress} scenes={scenes} activeMenu={props.activeMenu}
        letScrollScene={letScrollScene}
        />
        <Scene2 ref={scenes.current[1]} currentScene={currentScene} nextScene={nextScene} progress={progress} scenes={scenes}
        letScrollScene={letScrollScene}
        />
        <Scene3 ref={scenes.current[2]} currentScene={currentScene} nextScene={nextScene} progress={progress} scenes={scenes}
        letScrollScene={letScrollScene}
        />
        <SceneMenu ref={sceneMenuRef} activeMenu={props.activeMenu} hoveredElement={props.hoveredElement}/>
        {/* <OrbitControls /> */}
        <EffectComposer 
        multisampling={0} 
        disableNormalPass={true}
        depthBuffer={true}
        stencilBuffer={true}
        // scene={scenes.current[0]}
        scene={null}
        resolutionScale={0.5}
        >
            <Bloom
            mipmapBlur
            mipMap={false}
            kernelSize={KernelSize.VERY_LARGE}
            luminanceThreshold={1}
            luminanceSmoothing={2}
            // opacity={3}
            intensity={1}
            />
            <Noise opacity={0.025} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
    </>
}