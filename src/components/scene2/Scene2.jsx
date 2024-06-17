import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber"
import React, { forwardRef, useEffect, useMemo, useRef } from "react"
const Scene2Model = React.lazy(() => import("./scene2Model/Scene2Model.jsx"));
import { easing } from 'maath'
import SchemeCurveParticles from '../../templates/schemes/SchemeCurveParticlesExample.jsx';

export default forwardRef(function Scene2(props, ref) {
    const three = useThree()
    const groupRef = useRef()
    const sceneProgress = useRef(0.0)
    const targetProgress = useRef(0.0)
    const pointer = useRef({ x: 0, y: 0 })
    const position = useRef(new THREE.Vector3())
    const targetPosition = useRef(new THREE.Vector3())
    const cameraQuaternion = useRef(new THREE.Quaternion())
    const targetQuaternion = useRef(new THREE.Quaternion())
    const lookAtOffset = useRef(new THREE.Vector3())
    const currentPointer = useRef(new THREE.Vector2())
    const targetPointer = useRef(new THREE.Vector2())
    const lookAtPosition = useRef(new THREE.Vector3())
    const factor = 3

    // КРИВАЯ ДЛЯ КАМЕРЫ
    const positionPoints = [
        new THREE.Vector3(0, 0.0, 5),
        new THREE.Vector3(-3, -1, 5),
        new THREE.Vector3(-10.43, -5.21, 9.01),
        new THREE.Vector3(1.67, -9.0, 10.47),
        new THREE.Vector3(7.0, -9.2, 9.5),
        new THREE.Vector3(7.0, -11.2, 9.5)
    ]
    const targetPoints = [
        new THREE.Vector3(0, 3.5, -10),
        new THREE.Vector3(2.5, 3.5, -10),
        new THREE.Vector3(-3, -2.45, 0.27),
        new THREE.Vector3(-3.5, -3.05, 1.58),
        new THREE.Vector3(-3.5, -2.85, 0.11),
        new THREE.Vector3(-3.5, -4.85, 0.11)
    ]
    const positionCurve = useMemo(() => new THREE.CatmullRomCurve3(positionPoints), [positionPoints]);
    const targetCurve = useMemo(() => new THREE.CatmullRomCurve3(targetPoints), [targetPoints]);

    // MOUSEMOVE + SCENE VISIBILITY
    useEffect(() => {
        ref.scene.current.visible = false

        const handleMouseMove = (e) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        // const handleWindowFocus = () => {
        //     ref.camera.current.position.copy(position.current);
        //     ref.camera.current.quaternion.copy(cameraQuaternion.current);
        // };

        window.addEventListener('mousemove', handleMouseMove);
        // window.addEventListener('focus', handleWindowFocus);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            // window.removeEventListener('focus', handleWindowFocus);

        }
    }, [])


    // CAMERA START SETTINGS
    useEffect(() => {
        ref.camera.current.position.copy(positionPoints[0]);
        ref.camera.current.lookAt(targetPoints[0]);
        ref.camera.current.updateProjectionMatrix();
        // cameraQuaternion.current.slerp(targetQuaternion.current, delta * 3.25)
        // ref.camera.current.quaternion.copy(cameraQuaternion.current)
    }, []);




    function cameraMoving(renderer, delta) {        
        // Плавно интерполируем sceneProgress к targetProgress
        if (delta > 0.02) {
            delta = 0.01
        }
        targetProgress.current = props.scroll.current
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
        // Если мы не в конце сцены
        if (props.progress.current === 0) {
            if (ref.camera.current.position.y < -8.5) {
                pointer.current.y = Math.max(pointer.current.y, -0.25)
            }
            targetPointer.current.set(pointer.current.x, pointer.current.y)
        } else { // Если мы в конце сцены
            targetPointer.current.set(pointer.current.x * 0.25, pointer.current.y * 0.25)
        }
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
    }

    useFrame((renderer, delta) => {
        cameraMoving(renderer, delta)
        if (props.currentScene.current === 0) {
            easing.damp(groupRef.current.position, 'y', props.progress.current * 3.5, 0.0001);
        } else if (props.currentScene.current === props.scenes.current.length - 1) {
            easing.damp(groupRef.current.position, 'y', (props.progress.current - 1) * 1.5, 0.025);
        }
    })

    return (
        <>
            <scene ref={ref.scene}>
                <color attach="background" args={["#181c20"]} />
                <perspectiveCamera {...three.camera} position={positionPoints[0]} target={targetPoints[0]} ref={ref.camera} />
                <group ref={groupRef}>
                    <Scene2Model />
                </group>
            </scene>
        </>
    )
})