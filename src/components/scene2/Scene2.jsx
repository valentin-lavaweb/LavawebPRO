import { forwardRef } from "react"

export default forwardRef( function Scene2(props, ref) {
    return <>
    <scene ref={ref}>
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color={'green'} />
        </mesh>
    </scene>
    </>
})