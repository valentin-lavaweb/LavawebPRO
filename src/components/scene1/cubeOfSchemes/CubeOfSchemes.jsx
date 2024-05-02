import { forwardRef } from "react"
export default forwardRef(function CubeOfSchemes(props, ref) {


    return <>
    <mesh ref={ref}>
        <boxGeometry args={[1, 1, 1]}/>
        <meshBasicMaterial color={'red'}/>
    </mesh>
    </>
})