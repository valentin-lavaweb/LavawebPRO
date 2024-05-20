import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import { forwardRef, useCallback, useEffect, useRef } from "react"
import VirtualScroll from 'virtual-scroll'

export default forwardRef( function Scene2(props, ref) {
    const three = useThree()
    const groupRef = useRef()
    const sceneProgress = useRef(0.0)
    const targetProgress = useRef(0.0)
    useEffect(() => {
        ref.scene.current.visible = false
    }, [])


    // Скролл
    const scrollFunction = useCallback((targetProgress) => (e) => {
        // ПРИ СКРОЛЛЕ ВНИЗ
        if (e.deltaY < 0) {
            // ЕСЛИ НАХОДИМСЯ НА ТЕКУЩЕЙ СЦЕНЕ И ОНА ОТКРЫТА ЦЕЛИКОМ
            if (props.currentScene.current === 1 && props.progress.current <= 0.001) {
                // ЕСЛИ РАЗРЕШЕН СКРОЛЛ СЦЕНЫ
                if (props.letScrollScene.current === true){
                    targetProgress.current -= (e.deltaY / 10000)
                    targetProgress.current = Math.min(targetProgress.current, 1)
                    targetProgress.current = Math.max(0.001, targetProgress.current)
                }
                // ЕСЛИ СКРОЛЛ СЦЕНЫ ВНИЗ ЗАКОНЧИЛСЯ - ЗАПРЕЩАЕМ СКРОЛЛ СЦЕНЫ
                if (sceneProgress.current >= 0.99 && props.letScrollScene.current === true) {
                    props.letScrollScene.current = false
                }
                // ЕСЛИ СКРОЛЛ СЦЕНЫ В НАЧАЛЕ - ВКЛЮЧАЕМ СКРОЛЛ СЦЕНЫ
                if (props.letScrollScene.current === false && sceneProgress.current <= 0.01) {
                    props.letScrollScene.current = true
                }
            }
            // ЕСЛИ ПЕРЕШЛО НА ПРЕДЫДУЩУЮ СЦЕНУ
            if (props.currentScene.current === 0 && props.progress.current >= 0.999) {
                // ЕСЛИ РАЗРЕШЕН СКРОЛЛ СЦЕНЫ
                if (props.letScrollScene.current === true){
                    targetProgress.current -= (e.deltaY / 10000)
                    targetProgress.current = Math.min(targetProgress.current, 1)
                    targetProgress.current = Math.max(0.001, targetProgress.current)
                }
                // ЕСЛИ СКРОЛЛ СЦЕНЫ ВНИЗ ЗАКОНЧИЛСЯ - ЗАПРЕЩАЕМ СКРОЛЛ СЦЕНЫ
                if (sceneProgress.current >= 0.99 && props.letScrollScene.current === true) {
                    props.letScrollScene.current = false
                }
                // ЕСЛИ СКРОЛЛ СЦЕНЫ В НАЧЛЕ - ВКЛЮЧАЕМ СКРОЛЛ СЦЕНЫ
                if (sceneProgress.current <= 0.01 && props.letScrollScene.current === false) {
                    props.letScrollScene.current = true
                }
            }
        }

        // ПРИ СКРОЛЛЕ ВВЕРХ
        if (e.deltaY > 0) {
            // ЕСЛИ НАХОДИМСЯ НА ТЕКУЩЕЙ СЦЕНЕ И ОНА ОТКРЫТА ЦЕЛИКОМ
            if (props.currentScene.current === 1 && props.progress.current <= 0.001) {
                // ЕСЛИ РАЗРЕШЕН СКРОЛЛ СЦЕНЫ
                if (props.letScrollScene.current === true){
                    targetProgress.current -= (e.deltaY / 10000)
                    targetProgress.current = Math.min(targetProgress.current, 1)
                    targetProgress.current = Math.max(0.001, targetProgress.current)
                }
                // ЕСЛИ СКРОЛЛ СЦЕНЫ ВВЕРХ ЗАКОНЧИЛСЯ - ЗАПРЕЩАЕМ СКРОЛЛ СЦЕНЫ
                if (sceneProgress.current <= 0.01 && props.letScrollScene.current === true) {
                    props.letScrollScene.current = false
                }
                // ЕСЛИ СКРОЛЛ СЦЕНЫ В КОНЦЕ - ВКЛЮЧАЕМ СКРОЛЛ СЦЕНЫ
                if (sceneProgress.current >= 0.99 && props.letScrollScene.current === false) {
                    props.letScrollScene.current = true
                }
            }
            // ЕСЛИ ПЕРЕШЛО НА ПРЕДЫДУЩУЮ СЦЕНУ
            if (props.currentScene.current === 0 && props.progress.current >= 0.999) {
                // ЕСЛИ РАЗРЕШЕН СКРОЛЛ СЦЕНЫ
                if (props.letScrollScene.current === true){
                    targetProgress.current -= (e.deltaY / 10000)
                    targetProgress.current = Math.min(targetProgress.current, 1)
                    targetProgress.current = Math.max(0.001, targetProgress.current)
                }
                // ЕСЛИ СКРОЛЛ СЦЕНЫ ВВЕРХ ЗАКОНЧИЛСЯ - ЗАПРЕЩАЕМ СКРОЛЛ СЦЕНЫ
                if (sceneProgress.current <= 0.01 && props.letScrollScene.current === true) {
                    props.letScrollScene.current = false
                }
                // ЕСЛИ СКРОЛЛ СЦЕНЫ В КОНЦЕ - ВКЛЮЧАЕМ СКРОЛЛ СЦЕНЫ
                if (sceneProgress.current >= 0.99 && props.letScrollScene.current === false) {
                    props.letScrollScene.current = true
                }
            }
        }
    }, [targetProgress])

    // Включаем скролл
    useEffect(() => {
        const scrollEventHandler = scrollFunction(targetProgress);
        const vs2 = new VirtualScroll()
        vs2.on(scrollEventHandler);
        return () => {
            vs2.off(scrollEventHandler);
        }
    }, [])

    useFrame((renderer, delta) => {
        // ЕСЛИ МЫ НАХОДИМСЯ В НАЧАЛЕ ПРЕДЫДУЩЕЙ СЦЕНЫ
        if (props.currentScene.current === 0 && props.progress.current <= 0.01) {
            targetProgress.current = 0
        }
        // ЕСЛИ МЫ НАХОДИМСЯ В КОНЦЕ СЛЕДУЮЩЕЙ СЦЕНЫ
        if (props.currentScene.current === 2 && props.progress.current >= 0.99) {
            targetProgress.current = 1
        }
        // Плавно интерполируем sceneProgress к targetProgress
        sceneProgress.current = THREE.MathUtils.lerp(sceneProgress.current, targetProgress.current, delta * 5)
        sceneProgress.current = Math.min(1, sceneProgress.current)
        sceneProgress.current = Math.max(0.001, sceneProgress.current)


        if (props.currentScene.current === 1) {
          easing.damp(groupRef.current.position, 'y', (props.progress.current - 0) * 2, 0.05);
        } else if (props.currentScene.current === 0) {
          easing.damp(groupRef.current.position, 'y', (props.progress.current - 1) * 2, 0.05);
        }
    })

    return <>
    <scene ref={ref.scene}>
        <color attach="background" args={["#0000ff"]} />
        <perspectiveCamera {...three.camera} ref={ref.camera}/>
        <group ref={groupRef}>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]}/>
                <meshBasicMaterial color={'green'} />
            </mesh>
        </group>
    </scene>
    </>
})