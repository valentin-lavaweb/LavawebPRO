import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import { forwardRef, useEffect, useRef } from "react"

export default forwardRef( function Scene2(props, ref) {
    const three = useThree()
    const groupRef = useRef()
    useEffect(() => {
        ref.scene.current.visible = false
    }, [])

    useFrame(({pointer}) => {
        easing.damp(ref.camera.current.position, 'x', -pointer.x * 0.25, 0.2);
        easing.damp(ref.camera.current.position, 'y', -pointer.y * 0.25, 0.2);
        ref.camera.current.lookAt(0, 0, 0)
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