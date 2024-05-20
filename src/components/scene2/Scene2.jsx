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
        if (props.currentScene.current === 1 && props.letScrollScene.current === true && props.progress.current === 0) {
            targetProgress.current -= (e.deltaY / 1000)
            targetProgress.current = Math.min(targetProgress.current, 1)
            targetProgress.current = Math.max(0, targetProgress.current)
            if (sceneProgress.current >= 0.99) {
              if (e.deltaY < 0) {
                props.letScrollScene.current = false
              }
            }
            if (sceneProgress.current <= 0.01) {
              if (e.deltaY > 0) {
                props.letScrollScene.current = false
              }
            }
        }
        if (props.letScrollScene.current === false) {
            if (props.currentScene.current === 1 && sceneProgress.current <= 0.01) {
                if (e.deltaY < 0) {
                    props.letScrollScene.current = true
                }
            }
            if (props.currentScene.current === 1 && sceneProgress.current >= 0.99) {
                if (e.deltaY > 0) {
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
      // if (props.currentScene.current === 2) {
        console.log(
            `scene3:
            scene3Progress: ${sceneProgress.current}
            scene3TargetProgress: ${targetProgress.current}
            progress: ${props.progress.current}
            letScrollScene: ${props.letScrollScene.current}`
          )
        // }
        if (props.currentScene.current === 2) {
          targetProgress.current = 1
        }
        if (props.currentScene.current === 0 && props.progress.current === 0) {
          targetProgress.current = 0
        }
        // Плавно интерполируем sceneProgress к targetProgress
        sceneProgress.current = THREE.MathUtils.lerp(sceneProgress.current, targetProgress.current, delta * 5)
        sceneProgress.current = Math.min(1, sceneProgress.current)
        sceneProgress.current = Math.max(0, sceneProgress.current)


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