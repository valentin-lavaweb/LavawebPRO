import * as THREE from "three";
import React, { forwardRef, useEffect, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

export default forwardRef(function RenderScene(props, ref) {
    useEffect(()=>{
        ref.current.scene.current.visible = false
    }, [])

    useFrame(() => {
        ref.current.material.current.uniforms.activeSceneMenu.value = props.activeSceneMenu.current
    })

    const TransitionMaterial = shaderMaterial(
    {
        progression: undefined,
        tex: undefined,
        tex2: undefined,
        texMenu: undefined,
        activeSceneMenu: props.activeSceneMenu.current,
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
        uniform sampler2D texMenu;
        uniform float progression;
        uniform float darkness;
        uniform bool activeSceneMenu;
        // uniform int transition;

    

        void main() {    
            vec4 t = texture2D(tex, vUv);
            vec4 t1 = texture2D(tex2, vUv);
            vec4 tMenu = texture2D(texMenu, vUv);

            // Calculate diagonal gradient
            float diagonal = (vUv.y / 1.45) - (vUv.x * 0.15);
            float sweep = step(diagonal, progression - 0.225);
        
            vec4 finalTexture = mix(t, t1, sweep);
            finalTexture.rgb *= darkness;
            if (!activeSceneMenu) {
                gl_FragColor = finalTexture;
            } else {
                gl_FragColor = tMenu;
            };
    
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
        }`
    );
    extend({
        TransitionMaterial,
    });

    return <>
    <scene ref={ref.current.scene}>
        <mesh>
            <planeGeometry args={[2.0, 2.0]} />
            {/* <planeGeometry args={[three.viewport.width, three.viewport.height]} /> */}
            <transitionMaterial
            ref={ref.current.material}
            tex={props.renderTarget.texture}
            tex2={props.renderTarget2.texture}
            texMenu={props.renderTargetMenu.texture}
            progression={props.progress.current}
            activeSceneMenu={props.activeSceneMenu.current}
            darkness={1.0}
            // toneMapped={false}
            />
        </mesh>
    </scene>
    </>
})