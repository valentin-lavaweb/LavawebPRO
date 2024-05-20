import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useCallback, useEffect, useRef } from "react"
import CurvesModel from '../../templates/curvesModel/CurvesModel.jsx'
import { OrbitControls } from '@react-three/drei'
import SchemesModel from '../../templates/schemes/SchemesModel.jsx'
import SchemeCurveParticles from '../../templates/schemes/SchemeCurveParticles.jsx'
import Scene1Model from './scene1Model/Scene1Model.jsx'
import VirtualScroll from 'virtual-scroll'
import { easing } from 'maath'

export default forwardRef(function Scene1(props, ref) {
    const three = useThree()
    const groupRef = useRef()
    const sceneProgress = useRef(0.0)
    const targetProgress = useRef(0.0)
    const position = useRef(new THREE.Vector3())
    const targetPosition = useRef(new THREE.Vector3())
    const cameraQuaternion = useRef(new THREE.Quaternion())
    const targetQuaternion = useRef(new THREE.Quaternion())
    const lookAtOffset = useRef(new THREE.Vector3())
    const currentPointer = useRef(new THREE.Vector2())
    const targetPointer = useRef(new THREE.Vector2())
    const lookAtPosition = useRef(new THREE.Vector3())
    const currentLookAtPosition = useRef(new THREE.Vector3())
    const factor = 3

    // КРИВАЯ
    const positionPoints = [
        new THREE.Vector3(0, 3.45, 1),
        new THREE.Vector3(0, 1.6, 1),
        new THREE.Vector3(0, 0.0, 5),
        new THREE.Vector3(-3, -1, 5),
        new THREE.Vector3(-10.43, -5.21, 9.01),
        new THREE.Vector3(1.67, -9.0, 10.47),
        new THREE.Vector3(7.0, -9.2, 9.5),
        new THREE.Vector3(7.0, -12.56, 9.5)
    ]
    const targetPoints = [
        new THREE.Vector3(0, 3.4, -10),
        new THREE.Vector3(0, 1.6, -10),
        new THREE.Vector3(0, 3.5, -10),
        new THREE.Vector3(2.5, 3.5, -10),
        new THREE.Vector3(-3, -2.45, 0.27),
        new THREE.Vector3(-3.5, -3.05, 1.58),
        new THREE.Vector3(-3.5, -2.85, 0.11),
        new THREE.Vector3(-3.5, -4.85, 0.11)
    ]
    const positionCurve = new THREE.CatmullRomCurve3(positionPoints)
    const targetCurve = new THREE.CatmullRomCurve3(targetPoints)

    useEffect(() => {
        ref.scene.current.visible = false
    }, [])

    const scrollFunction = useCallback((targetProgress) => (e) => {
        // ПРИ СКРОЛЛЕ ВНИЗ
        if (e.deltaY < 0) {
            // ЕСЛИ НАХОДИМСЯ НА ТЕКУЩЕЙ СЦЕНЕ И ОНА ОТКРЫТА ЦЕЛИКОМ
            if (props.currentScene.current === 0 && props.progress.current <= 0.001) {
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
            if (props.currentScene.current === props.scenes.current.length - 1 && props.progress.current >= 0.999) {
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
            if (props.currentScene.current === 0 && props.progress.current <= 0.001) {
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
            if (props.currentScene.current === props.scenes.current.length - 1 && props.progress.current >= 0.999) {
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
        const vs1 = new VirtualScroll()
        vs1.on(scrollEventHandler);
        return () => {
            vs1.off(scrollEventHandler);
        }
    }, [])

    useFrame((renderer, delta) => {
        // ЕСЛИ МЫ НАХОДИМСЯ В НАЧАЛЕ ПРЕДЫДУЩЕЙ СЦЕНЫ
        if (props.currentScene.current === props.scenes.current.length - 1 && props.progress.current <= 0.01) {
            targetProgress.current = 0
        }
        // ЕСЛИ МЫ НАХОДИМСЯ В КОНЦЕ СЛЕДУЮЩЕЙ СЦЕНЫ
        if (props.currentScene.current === 1 && props.progress.current >= 0.99) {
            targetProgress.current = 1
        }
        // Плавно интерполируем sceneProgress к targetProgress
        sceneProgress.current = THREE.MathUtils.lerp(sceneProgress.current, targetProgress.current, delta * 5)
        sceneProgress.current = Math.min(1, sceneProgress.current)
        sceneProgress.current = Math.max(0, sceneProgress.current)

        // Получаем точку на кривой в зависимости от значения progress
        positionCurve.getPointAt(sceneProgress.current, position.current)
        targetCurve.getPointAt(sceneProgress.current, targetPosition.current)

        // Двигаем камеру к точке на кривой с использованием lerp для плавной интерполяции
        ref.camera.current.position.lerp(position.current, delta * 1.25)

        // Плавное изменение кватерниона камеры с использованием slerp
        ref.camera.current.lookAt(targetPosition.current)
        ref.camera.current.getWorldQuaternion(targetQuaternion.current)
        cameraQuaternion.current.slerp(targetQuaternion.current, delta * 3.25)
        ref.camera.current.quaternion.copy(cameraQuaternion.current)

        // Плавное движение курсора
        targetPointer.current.set(renderer.pointer.x, renderer.pointer.y)
        currentPointer.current.lerp(targetPointer.current, delta * 5)

        // Обновляем смещение для lookAt
        lookAtOffset.current.set(
            targetPosition.current.x + (currentPointer.current.x) * factor,
            targetPosition.current.y + (currentPointer.current.y) * factor,
            targetPosition.current.z
        )

        // Плавное обновление позиции lookAt
        lookAtPosition.current.lerp(lookAtOffset.current, delta * 5)
        ref.camera.current.lookAt(lookAtPosition.current)
    })

    return (
        <>
            <scene ref={ref.scene}>
                <color attach="background" args={["#181c20"]} />
                <perspectiveCamera {...three.camera} position={positionPoints[0]} ref={ref.camera} />
                <group ref={groupRef}>
                    <Scene1Model />
                    <SchemesModel />
                </group>
                {/* <OrbitControls ref={orbitRef}/> */}
            </scene>
        </>
    )
})