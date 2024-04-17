import * as THREE from 'three'
import { useMemo, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

    export default forwardRef(function DisplacementMesh(props, ref) {

        return <>
            <mesh
            ref={ref}
            onPointerMove={(e) => {
                e.stopPropagation();
                const pointer = e.point; // Мировые координаты точки, на которую указывает курсор
                props.cursorWorldPositionRef.current.copy(pointer); // Сохраняем мировые координаты в useRef
            }}
            geometry={props.simpleModels[0].scene.children[0].geometry}
            visible={false}
            >
                <meshBasicMaterial transparent={true} opacity={0.05}/>
        </mesh>
        </>
})