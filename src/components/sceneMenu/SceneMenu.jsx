import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useEffect, } from "react"
import MorphCursorParticles from '../../templates/morphCursorParticles/MorphCursorParticles.jsx'
import { easing } from 'maath'

export default forwardRef( function SceneMenu(props, ref) {
  const three = useThree()
    useEffect(() => {
      ref.current.scene.current.visible = false
    }, [])

    useFrame((renderer, delta) => {
      // easing.damp(renderer.camera.position, 'x', renderer.pointer.x * 0.7, 0.2);
      // easing.damp(renderer.camera.position, 'y', renderer.pointer.y * 0.7 + 1, 0.2);
      // renderer.camera.lookAt(0, 0, 0)
    })
    return <>
    <scene ref={ref.current.scene}>
        <color attach="background" args={["#181c20"]} />
        <perspectiveCamera {...three.camera} ref={ref.current.camera}/>
        <MorphCursorParticles hoveredElement={props.hoveredElement} activeMenu={props.activeMenu}/>
    </scene>
    </>
})