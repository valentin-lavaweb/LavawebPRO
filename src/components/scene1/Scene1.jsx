import { useFrame } from "@react-three/fiber"
import { forwardRef } from "react"

export default forwardRef( function Scene1(props, ref) {
    useFrame((renderer, delta) =>{
        ref.current.children[0].rotation.x += delta
    }, 1)
    return <>
    <scene ref={ref}>
        <mesh position={[-1, 0, 0]}>
            <boxGeometry />
            <meshBasicMaterial color={'orange'} />
        </mesh>
    </scene>
    </>
})