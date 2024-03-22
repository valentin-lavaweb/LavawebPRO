import * as THREE from 'three'
import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { forwardRef, useEffect, useRef, useState } from "react"

export default forwardRef( function SceneMenu(props, ref) {
    useEffect(() => {
      ref.current.visible = false
    }, [])

    function Squares() {
        const [squaresRefs] = useState(() => []);
        const squares = [
            {
                x: 0,
                y: 0
            },
            {
                x: 0,
                y: 0.3
            },
            {
                x: 0,
                y: 0.6
            },
        ]
        useFrame(() => {
            // animate each sphere in the array
            squaresRefs.forEach((el) => {
            });
        });
        return <>
        {squares.map((square, index) => {
            return (
            <mesh position={[square.x, square.y, 0]} scale={1} key={`square$${index}`}
            ref={(squareRef) => (squaresRefs[index] = squareRef)}>
                <boxGeometry args={[0.2, 0.4, 0.05]} />
                <meshBasicMaterial color={[0, 0, 0]}/>
            </mesh>
            )
        })}
        </>
    }

    return <>
    <scene ref={ref}>
        <Squares />
    </scene>
    </>
})