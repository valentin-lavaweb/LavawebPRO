import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
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
    const scene1Progress = useRef(0.0)
    const targetProgress = useRef(0.0)
    const position = useRef(new THREE.Vector3())
    const targetPosition = useRef(new THREE.Vector3())
    const cameraQuaternion = useRef(new THREE.Quaternion())
    const targetQuaternion = useRef(new THREE.Quaternion())

    // ORBIT-CONTROLS
    // const orbitRef = useRef()
    // useEffect(() => {
    //   orbitRef.current.object = ref.camera.current
    //   // console.log(ref.camera.current.rotation);
    //   // ref.camera.current.rotation = targetPoints[0]
    // }, [])

    // КРИВАЯ
    const positionPoints = [
        new THREE.Vector3(4.39, 2.93, 2.14),
        new THREE.Vector3(3.13, -1.28, 5.33),
        new THREE.Vector3(-10.43, -5.21, 9.01),
        new THREE.Vector3(1.67, -4.65, 8.47),
        new THREE.Vector3(8.36, -9.06, 8.74)
    ]
    const targetPoints = [
        new THREE.Vector3(1.11, 3.54, -1.94),
        new THREE.Vector3(-0.56, 1.38, -1.18),
        new THREE.Vector3(-2.68, -2.45, 0.27),
        new THREE.Vector3(-2.88, -6.05, 1.58),
        new THREE.Vector3(0.75, -3.85, 0.11)
    ]
    const positionCurve = new THREE.CatmullRomCurve3(positionPoints)
    const targetCurve = new THREE.CatmullRomCurve3(targetPoints)

    useEffect(() => {
        ref.scene.current.visible = false
    }, [])

    const scrollFunction = useCallback((targetProgress) => (e) => {
        if (props.letScrollScene.current === 1) {
            targetProgress.current -= (e.deltaY / 5000)
            targetProgress.current = Math.min(targetProgress.current, 1)
            targetProgress.current = Math.max(0, targetProgress.current)
            if (targetProgress.current === 1) {
                props.letScrollScene.current = 2
            }
            if (targetProgress.current === 0) {
                props.letScrollScene.current = 3
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

    useFrame((state, delta) => {
        // Плавно интерполируем scene1Progress к targetProgress
        scene1Progress.current = THREE.MathUtils.lerp(scene1Progress.current, targetProgress.current, delta * 5)

        // Получаем точку на кривой в зависимости от значения progress
        positionCurve.getPointAt(scene1Progress.current, position.current)
        targetCurve.getPointAt(scene1Progress.current, targetPosition.current)

        // Двигаем камеру к точке на кривой с использованием lerp для плавной интерполяции
        ref.camera.current.position.lerp(position.current, delta * 0.7)

        // Обновляем кватернион цели
        ref.camera.current.lookAt(targetPosition.current)
        ref.camera.current.getWorldQuaternion(targetQuaternion.current)

        // Плавное изменение кватерниона камеры с использованием slerp
        cameraQuaternion.current.slerp(targetQuaternion.current, delta * 0.7)
        ref.camera.current.quaternion.copy(cameraQuaternion.current)
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
