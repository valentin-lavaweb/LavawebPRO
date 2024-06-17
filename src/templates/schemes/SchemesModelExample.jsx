import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from "react";
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/Addons.js';
import vectors from './vectors.json'
RectAreaLightUniformsLib.init()

export default function SchemesModel(props) {

    const particlesRef = useRef();
    const randomRange = (min, max) => Math.random() * (max - min) + min;

    // Определение нескольких кривых
    const customCurves = useMemo(() => {
        const curvesArray = [

            new THREE.CatmullRomCurve3([
                new THREE.Vector3(1, 1.5, 1.5),
                new THREE.Vector3(1, 1.2, 1.5),
                new THREE.Vector3(1.2, 1.0, 1.5),
                new THREE.Vector3(1.2, -1.0, 1.5),
                new THREE.Vector3(1.3, -1.1, 1.5),
                new THREE.Vector3(1.3, -1.5, 1.5),
            ], false,'catmullrom', 0.0),

            new THREE.CatmullRomCurve3([
                new THREE.Vector3(-1, 1.5, 1.5),
                new THREE.Vector3(-1, 1.0, 1.5),
                new THREE.Vector3(-1.2, 0.8, 1.5),
                new THREE.Vector3(-1.2, 0.4, 1.5),
                new THREE.Vector3(-1.0, 0.2, 1.5),
                new THREE.Vector3(-1.0, -1.5, 1.5),
            ], false,'catmullrom', 0.0),

            new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.75, 1.5, 1.5),
                new THREE.Vector3(-0.75, 0.7, 1.5),
                new THREE.Vector3(-0.65, 0.6, 1.5),
                new THREE.Vector3(-0.65, 0.1, 1.5),
                new THREE.Vector3(-0.55, 0.0, 1.5),
                new THREE.Vector3(-0.55, -1.0, 1.5),
                new THREE.Vector3(-0.65, -1.1, 1.5),
                new THREE.Vector3(-0.65, -1.5, 1.5),
            ], false,'catmullrom', 0.0),


        ]
        const curvesCount = curvesArray.length

        return {curvesArray, curvesCount}
    }, []);

    const curves = useMemo(() => {
        let curvesArray = [];
        const curvesCount = 1
        const curveVectorsCount = 10

        function generateRandomCurvePoints(curveVectorsCount){
            let points = [];
            for (let i = 0; i < curveVectorsCount; i++) {
                points.push(new THREE.Vector3(randomRange(-1, 1), randomRange(-1, 1), randomRange(-1, 1)));
            }
            return points;
        };

        for (let i = 0; i < curvesCount; i++) {
            curvesArray.push(new THREE.CatmullRomCurve3(generateRandomCurvePoints(curveVectorsCount), false, 'catmullrom', 0.0));
        }
        return {curvesArray, curvesCount};
    }, []);

    const jsonCurves = useMemo( () => {
        const curvesArray = [];
        const curvesCount = vectors.objects.length
        function generateCurvePoints(index){
            let points = [];
            const pointsArray = vectors.objects[index].points
            for (let i = 0; i < pointsArray.length; i++) {
                points.push(new THREE.Vector3(pointsArray[i].x, pointsArray[i].y, pointsArray[i].z));
            }
            return points;
        };

        for (let i = 0; i < curvesCount; i++) {
            curvesArray.push(new THREE.CatmullRomCurve3(generateCurvePoints(i), false, 'catmullrom', 0.0));
        }

        return {curvesArray, curvesCount}
    }, [])

    const particles = useMemo(() => {
        const pointsArray = [];
        const lifesArray = [];
        const sizesArray = [];
        const particlesCount = 1500 * jsonCurves.curvesCount;
        const timeOffsets = jsonCurves.curvesArray.map(() => randomRange(1, jsonCurves.curvesArray.length));

        for (let i = 0; i < particlesCount; i++) {
            const curveIndex = Math.floor(Math.random() * jsonCurves.curvesArray.length); // случайный выбор кривой
            const curve = jsonCurves.curvesArray[curveIndex];
            const t = i / particlesCount;
            const point = curve.getPoint(t);
    
            pointsArray.push(point.x + Math.random() * 0.0015, point.y + Math.random() * 0.0015, point.z + Math.random() * 0.0015);
            const lifeTimeWithOffset = i * 0.0001 + timeOffsets[curveIndex]; // добавляем смещение времени
            // const lifeTimeWithOffset = i * 0.000075
            lifesArray.push(lifeTimeWithOffset);
            sizesArray.push(randomRange(2, 4));
        }
        const positions = new Float32Array(pointsArray);
        const lifes = new Float32Array(lifesArray);
        const sizes = new Float32Array(sizesArray);
        return { positions, lifes, sizes };
    }, [jsonCurves]);

    const ParticlesShaderMaterial = shaderMaterial(
        {
            time:  0,
            color: new THREE.Vector3(1, 1, 5),
            brightness: 5.0,
            sizeScale: 1.0,
            cycleTime: 4.0
        },
        /*glsl*/`
        uniform float time;
        uniform float sizeScale;
        uniform float cycleTime;
        attribute float lifeTime; // Время жизни каждого партикла
        attribute float randomSize;
        varying float vLife;

        void main() {
            // float cycleTime = 3.0; // время цикла
            vLife = mod(time - lifeTime, cycleTime) / cycleTime; // нормализуем vLife от 0 до 1 для каждого цикла
        
            vec3 pos = position;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

            gl_PointSize = (randomSize * sizeScale * (1.0 / -mvPosition.z)) - vLife;
        }
        `,
        /*glsl*/`
        varying float vLife;
        uniform vec3 color;
        uniform float brightness;
        
        void main() {
            float visiblePhase = 0.2; // Фаза полной видимости
            float alpha = (vLife < visiblePhase) ? 1.0 - pow(vLife / visiblePhase, 2.0) : 0.0; // Быстрое уменьшение прозрачности после видимой фазы
        
            // Создание круглой формы
            vec2 center = gl_PointCoord - vec2(0.5, 0.5);
            float radius = length(center);
            float gradient = smoothstep(0.5, 0.0, radius); // Радиальный градиент
        
            alpha *= gradient - vLife; // Применение градиента к альфа-каналу
        
            if (alpha <= 0.0) discard; // Игнорируем полностью прозрачные партиклы
        
            gl_FragColor = vec4(color * brightness, alpha);
        }
        `
    );

    extend({ParticlesShaderMaterial})

    useFrame((renderer, delta) => {
        const material = particlesRef.current.material;
        material.uniforms.time.value += delta * randomRange(1.0, 1.1);
    })
    useEffect(() => {
    }, [])

    extend({ RectAreaLightHelper });

    return <>
        {/* PARTICLES */}
        <points ref={particlesRef}>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-lifeTime"
                    count={particles.lifes.length}
                    array={particles.lifes}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-randomSize"
                    count={particles.sizes.length}
                    array={particles.sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <particlesShaderMaterial
                attach="material" 
                depthTest={true}
                depthWrite={true}
                transparent={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    </>
}