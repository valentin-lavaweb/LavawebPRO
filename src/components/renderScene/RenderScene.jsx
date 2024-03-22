import * as THREE from "three";
import React, { forwardRef, useEffect, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

export default forwardRef(function RenderScene(props, ref) {
    const three = useThree()
    const sceneRef = useRef()
    useEffect(()=>{
        ref.current.scene.current.visible = false
    }, [])

    const TransitionMaterial = shaderMaterial(
    {
        progression: undefined,
        tex: undefined,
        tex2: undefined,
        activeMenu: false,
        darkness: 1.0,
    },
    /*glsl*/ `
        varying vec2 vUv;
        void main() {
        vUv = uv;
        // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position = vec4(position, 1.0);
        }`,
    /*glsl*/ ` 
        varying vec2 vUv;
        uniform sampler2D tex;
        uniform sampler2D tex2;
        uniform float progression;
        uniform float darkness;
        uniform bool activeMenu;
        // uniform int transition;

    

        void main() {    
        // gl_FragColor = vec4(vUv, 0.0, 1.0);
        if(activeMenu == false) {
            vec4 t = texture2D(tex, vUv);
            vec4 t1 = texture2D(tex2, vUv);
            // float sweep = step(vUv.y / 1.2, progression - 0.1);
            // Calculate diagonal gradient
            float diagonal = (vUv.y / 1.45) - (vUv.x * 0.15);
            float sweep = step(diagonal, progression - 0.225);
        
            vec4 finalTexture = mix(t, t1, sweep);
            finalTexture.rgb *= darkness;
            gl_FragColor = finalTexture;
        } else {
            // gl_FragColor = 
        }
    
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }`
    );
    extend({
        TransitionMaterial,
    });

    return <>
    <scene ref={ref.current.scene}>
        <mesh onClick={() => {
            props.activeMenu.current = !props.activeMenu.current
        }}>
            <planeGeometry args={[2.0, 2.0]} />
            {/* <planeGeometry args={[three.viewport.width, three.viewport.height]} /> */}
            <transitionMaterial
            ref={ref.current.material}
            tex={props.renderTarget.texture}
            tex2={props.renderTarget2.texture}
            progression={props.progress.current}
            darkness={1.0}
            // toneMapped={false}
            />
        </mesh>
    </scene>
    </>
})