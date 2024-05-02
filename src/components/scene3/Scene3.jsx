import { useFrame, useThree } from "@react-three/fiber"
import { easing } from "maath"
import { forwardRef, useEffect, useRef } from "react"

export default forwardRef( function Scene3(props, ref) {
    const three = useThree()
    const groupRef = useRef()
    useEffect(() => {
        ref.scene.current.visible = false
    }, [])

    useFrame(({pointer}) => {
        // easing.damp(ref.camera.current.position, 'x', pointer.x * 0.02, 0.2);
        // ref.camera.current.lookAt(0, 0, 0)
        if (props.currentScene.current === 2) {
          easing.damp(groupRef.current.position, 'y', (props.progress.current - 0) * 2, 0.05);
        } else if (props.currentScene.current === 1) {
          easing.damp(groupRef.current.position, 'y', (props.progress.current - 1) * 2, 0.05);
        }
    })

    return <>
    <scene ref={ref.scene}>
        <color attach="background" args={["#000000"]} />
        <perspectiveCamera {...three.camera} ref={ref.camera}/>
        <group ref={groupRef}>
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.5, 0.5, 0.5]}/>
                <meshBasicMaterial color={'red'} />
            </mesh>
        </group>
    </scene>
    </>
})