import * as THREE from 'three'
import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { forwardRef, useEffect, useRef, useState } from "react"
import DigitalBackground from './background/DigitalBackground.jsx'

export default forwardRef( function SceneMenu(props, ref) {
    useEffect(() => {
      ref.current.visible = false
    }, [])
    return <>
    <scene ref={ref}>
        <color attach="background" args={["#0a0f12"]} />
        {/* <DigitalBackground activeMenu={props.activeMenu}/> */}
        {/* <pointLight position={[0,0,3]} intensity={10}/> */}
        
    </scene>
    </>
})