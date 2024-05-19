import * as THREE from 'three'
import { useMemo, useRef } from "react";
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

export default function SchemeCurveParticles(props) {


    const particlesRef = useRef();
    const randomRange = (min, max) => Math.random() * (max - min) + min;

    // Генерация позиций партиклов вдоль кривой
    const particles = useMemo(() => {
        const pointsArray = [];
        const lifesArray = [];
        const sizesArray = [];

        // Тут мы говорим сколько будет партиклей
        const particlesCount = 300

        // Мы используем эту кривую, вдоль неё будут идти партикли
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-4, 0, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(1, 2, 0),
            new THREE.Vector3(5, -2, 0),
        ], false, 'catmullrom', 0.0)

        const lengths = curve.getLengths(particlesCount);
        const totalLength = lengths[lengths.length - 1];
        const delayBetweenParticles = totalLength / particlesCount; // равномерное распределение по длине
        
        for (let i = 0; i < particlesCount; i++) {
            // Равномерное распределение по длине кривой
            const distance = i * delayBetweenParticles;
            const t = curve.getUtoTmapping(0, distance, totalLength); // Получаем t по текущему расстоянию
            const point = curve.getPoint(t);

            pointsArray.push(point.x + Math.random()* 0.03, point.y + Math.random() * 0.03, point.z);
            lifesArray.push(i * 0.01);  // Для упрощения используем простую инкрементацию
            sizesArray.push(randomRange(1, 4))
        }
        const positions = new Float32Array(pointsArray)
        const lifes = new Float32Array(lifesArray)
        const sizes = new Float32Array(sizesArray)
        return { positions, lifes, sizes };
    }, []);

    const ParticlesShaderMaterial = shaderMaterial(
        {
            time:  0,
            color: new THREE.Vector3(1, 1, 10),
        },
        /*glsl*/`
        uniform float time;
        attribute float lifeTime; // Время жизни каждого партикла
        attribute float randomSize;
        varying float vLife;

        void main() {
            float cycleTime = 5.0; // время цикла
            vLife = mod(time - lifeTime, cycleTime) / cycleTime; // нормализуем vLife от 0 до 1 для каждого цикла
            float visiblePhase = 0.01; // Фаза видимости, когда партиклы полностью видимы
            float alpha = step(visiblePhase, vLife); // Партиклы появляются внезапно
        
            vec3 pos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (randomSize * 1.0 - vLife) * 1.0;
            // gl_PointSize = (vLife < visiblePhase) ? randomSize * (1.0 - vLife / visiblePhase) * 3.0 : 0.0; // Быстрое уменьшение размера после видимой фазы
        }
        `,
        /*glsl*/`
        varying float vLife;
        uniform vec3 color;
        
        void main() {
            float visiblePhase = 0.2; // Фаза полной видимости
            float alpha = (vLife < visiblePhase) ? 1.0 - pow(vLife / visiblePhase, 2.0) : 0.0; // Быстрое уменьшение прозрачности после видимой фазы
        
            // Создание круглой формы
            vec2 center = gl_PointCoord - vec2(0.5, 0.5);
            float radius = length(center);
            float gradient = smoothstep(0.5, 0.0, radius); // Радиальный градиент
        
            alpha *= gradient - vLife; // Применение градиента к альфа-каналу
        
            if (alpha <= 0.0) discard; // Игнорируем полностью прозрачные партиклы
        
            gl_FragColor = vec4(color * 2.0, alpha);
        }
        `
    );

    extend({ParticlesShaderMaterial})

    useFrame((renderer, delta) => {
        const material = particlesRef.current.material;
        // const maxTime = 1; // Последний lifetime плюс длительность видимости
        material.uniforms.time.value += delta * randomRange(0.5, 1.5);
        // if (material.uniforms.time.value > maxTime) {
        //     material.uniforms.time.value = 0; // Рестарт цикла
        // }
    })

    return <>
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
                depthTest={false} //можно изменить
                depthWrite={false} //можно изменить
                transparent={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    </>
}