import * as THREE from 'three'
import { useEffect, useMemo, useRef } from "react";
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

export default function Stars(props) {
    const pointsRef = useRef()
    const letterMap = useTexture("/images/letter1.png");

    // Количество партиклей
    let number = 1000;

    // Позиции партиклей, умножаем на 3. Потому что у каждого партикля есть x, y, z
    const positions = useMemo(() => {
        const positions = new Float32Array(number * 3)
        return positions;
    }, [])

    // Размер партиклей
    const sizes = useMemo(() => {
        const sizes = new Float32Array(number)
        return sizes;
    }, [])

    // Радиус для круга
    const radius = useMemo(() => {
        const radius = new Float32Array(number)
        return radius;
    }, [])
    
    // Функция, которая рандомно возвращает число
    function range(start, end){
        let r = Math.random()
        return r * (end - start) + start
    }

    // Создаём гемотерию и материал
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        // Униформы обязательно создавать с помощью new THREE.Uniform(), иначе их значения не будут меняться в самом шейдере
        uniforms: {
            uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
            uColor: {value: new THREE.Vector3(5.0, 5.0, 10.0)}, //Не рекомендую увеличивать значения цвета, лучше работать с uBrightness для яркости, эффект такой же
            uBrightness: {value: 1.0}, //Влияет на яркость партиклей, не жрёт ФПС.
            uBlur: {value: 0.01}, //Влияет на блюр партиклей, не жрёт фпс
        },
        // ОБЯЗАТЕЛЬНО ВЫСТАВИТЬ
        transparent: true,
    })

    useEffect(() => {
        // Задаем здесь значения для атрибутов, для каждого партикля
        for (let i = 0; i < number; i++) {
            let i3 = i * 3;
            const radius = 30; // радиус полусферы
            const theta = Math.PI * Math.random() * 0.58; // угол от 0 до PI/2
            const phi = 2 * Math.PI * Math.random(); // угол от 0 до 2*PI
    
            positions[i3] = radius * Math.sin(theta) * Math.cos(phi); // X
            positions[i3 + 1] = radius * Math.cos(theta); // Y, высота полусферы
            positions[i3 + 2] = radius * Math.sin(theta) * Math.sin(phi); // Z, глубина
    
            sizes[i] = range(0.01, 0.05); // размер каждого партикля
        }

        // Атрибут для каждой вершины - свой. Униформа - глобальная переменная, для всех одинаковая.
        // sizes - много разных, у каждой вершины - свой size, все партикли разного размера. Если бы я выставил size как униформу, то все были бы одного размера.
        particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        particlesGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1))
        particlesGeometry.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1))
        particlesGeometry.setIndex(null)
        particlesGeometry.computeVertexNormals()
    }, [])

    return <>
    <points ref={pointsRef} geometry={particlesGeometry} material={particlesMaterial} rotation={[0, 0, 0]}/>
    </>
}