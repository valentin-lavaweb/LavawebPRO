import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from "react";
import {Grid, useGLTF } from '@react-three/drei';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/Addons.js';
import Stars from '../../../templates/stars/Stars.jsx'
RectAreaLightUniformsLib.init()

export default function Scene1Model(props) {
    const schemesModel = useGLTF('/models/screen1/BuildingScene.glb')
    const color = new THREE.Color( 5, 5, 50 )

    // CIRCLE LIGHT
    const planes = useMemo(() => {
        
        const planes = []
        const radius = 2.6
        const segments = 8

        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const positions = new THREE.Vector3(x, 1.45, z - 0.25);
            const rotationY = Math.atan2(-x, -z) + Math.PI * 1;
            planes.push({positions, rotationY});
        }
        return planes
    }, [])

    const lightRefs = useRef([]);
    lightRefs.current = [];

    // LIGHTS
    useEffect(() => {
        // console.log(schemesModel.materials.StripeMaterial)
        // schemesModel.materials.StripeMaterial.transparent = true

        // Очистка, если компонент будет размонтирован
        return () => {
            lightRefs.current.forEach(light => light.dispose());
        };
    }, [])

    const gridConfig = {
        cellSize: 0.5,
        cellThickness: 0.5,
        cellColor: '#6f6f6f',
        sectionSize: 3,
        sectionThickness: 1,
        sectionColor: '#9d4b4b',
        fadeDistance: 30,
        fadeStrength: 1,
        followCamera: false,
        infiniteGrid: true
    }

    return <>
        <Stars />

        {/* LIGHTS */}
        {/* {planes.map((plane, index) => (
            <React.Fragment key={index}>
                <rectAreaLight
                    position={plane.positions}
                    rotation={[0, plane.rotationY, 0]}
                    width={2.2}
                    height={0.025}
                    color={color}
                    intensity={1}
                    power={0.1}
                />
            </React.Fragment>
        ))} */}
        {/* <ambientLight intensity={1} /> */}
        <directionalLight intensity={0.1} color={color} position={[-10, 10, 5]}/>
        <directionalLight intensity={0.2} color={color} position={[0, 10, 5]}/>

        {/* MODEL */}
        <primitive object={schemesModel.scene} />

        <Grid position={[0, -12.01, 0]} args={[20.5, 20.5]} {...gridConfig} />
    </>
}