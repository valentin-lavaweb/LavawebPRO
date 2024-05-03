import { useFrame } from "@react-three/fiber"
import { forwardRef, useEffect, } from "react"
import MorphCursorParticles from '../../templates/morphCursorParticles/MorphCursorParticles.jsx'
import { easing } from 'maath'

export default forwardRef( function SceneMenu(props, ref) {
    useEffect(() => {
      ref.current.visible = false
    }, [])

    useFrame((renderer, delta) => {
      // easing.damp(renderer.camera.position, 'x', renderer.pointer.x * 0.7, 0.2);
      // easing.damp(renderer.camera.position, 'y', renderer.pointer.y * 0.7 + 1, 0.2);
      // renderer.camera.lookAt(0, 0, 0)
    })
    return <>
    <scene ref={ref}>
        <color attach="background" args={["#181c20"]} />
        <MorphCursorParticles hoveredElement={props.hoveredElement} activeMenu={props.activeMenu}/>
    </scene>
    </>
})