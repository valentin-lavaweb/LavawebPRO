import * as THREE from 'three'
import TubesMesh from "./TubesMesh.jsx";
import {data} from "./data.js"
import { shaderMaterial } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import CurvesParticles from './CurvesParticles.jsx';

export default function CurvesModel(props) {
    // Берём модель из путей
    const PATHS = data.economics[0].paths

    // Функция рандома
    const randomRange = (min, max) => Math.random() * (max - min) + min;

    const scale = 15.0

    // Стандартная кривая для тестов
    let curves = []
    for (let i = 0; i < 100; i++) {
        let points = []
        let length = randomRange(0.2, 0.8)
        for (let j = 0; j < 100; j++) {
            points.push(
                new THREE.Vector3().setFromSphericalCoords(
                    0.2, 
                    Math.PI * 1 - (j / 100) * Math.PI * length,
                    (i / 100) * Math.PI * 2
                )
            )
        }
        
        let tempcurve = new THREE.CatmullRomCurve3(points)
        curves.push(tempcurve)
    }

    // Кривая из модели
    let modelCurves = []
    PATHS.forEach((path) => {
        let points = []
        for (let i = 0; i < path.length; i+=3) {
            points.push(new THREE.Vector3(path[i], path[i+1], path[i+2]))
        }
        let tempcurve = new THREE.CatmullRomCurve3(points)
        modelCurves.push(tempcurve)
    });

    return <>
        <TubesMesh finalCurves={curves} scale={scale}/>
        <CurvesParticles finalCurves={curves} scale={scale} />
    </>
}