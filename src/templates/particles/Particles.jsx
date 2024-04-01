import * as THREE from 'three'
import { useEffect, useMemo, useRef } from "react";
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

export default function Particles(props) {
    const pointsRef = useRef()
    const letterMap = useTexture("/images/letter1.png");

    // Количество партиклей
    let number = 100;

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

    // Скорость движения
    const velocity = useMemo(() => {
        const velocity = new Float32Array(number)
        return velocity;
    }, [])

    // Дистанция движения
    const distance = useMemo(() => {
        const distance = new Float32Array(number)
        return distance;
    }, [])

    // Радиус для круга
    const radius = useMemo(() => {
        const radius = new Float32Array(number)
        return radius;
    }, [])

    // Угол для круга
    const angle = useMemo(() => {
        const angle = new Float32Array(number)
        return angle;
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
            uTime: new THREE.Uniform(0),
            uCursor: new THREE.Uniform(new THREE.Vector2(0, 0)),
            uTexture1: new THREE.Uniform(letterMap)
        },
        // ОБЯЗАТЕЛЬНО ВЫСТАВИТЬ
        transparent: true,
    })

    useEffect(() => {
        // Задаем здесь значения для атрибутов, для каждого партикля
        for (let i = 0; i < number; i++) {
            let i3 = i * 3 // переменная, которая нужна, чтобы для каждого партикля задать свои атрибуты

            radius[i] = 1 * (0.75 + Math.random() * 0.25) // Радиус
            angle[i] = (i / number) * Math.PI * 2; // Угол

            positions[i3] = 0        //Позиция каждого партикля по X
            positions[i3 + 1] = 0    //Позиция каждого партикля по Y
            positions[i3 + 2] = 0    //Позиция каждого партикля по Z

            sizes[i] = range(0.001, 0.04) //Размер каждого партикля
            velocity[i] = range(1.0, 2.0) //Скорость каждого партикля
            distance[i] = range(1.0, 2.0) //Дистанция каждого партикля
        }

        // Атрибут для каждой вершины - свой. Униформа - глобальная переменная, для всех одинаковая.
        // sizes - много разных, у каждой вершины - свой size, все партикли разного размера. Если бы я выставил size как униформу, то все были бы одного размера.
        particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        particlesGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1))
        particlesGeometry.setAttribute("aVelocity", new THREE.BufferAttribute(velocity, 1))
        particlesGeometry.setAttribute("aDistance", new THREE.BufferAttribute(distance, 1))
        particlesGeometry.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1))
        particlesGeometry.setAttribute("aAngle", new THREE.BufferAttribute(angle, 1))
        particlesGeometry.setIndex(null)
        particlesGeometry.computeVertexNormals()
    }, [])

    useFrame((renderer, delta) => {
        pointsRef.current.material.uniforms.uTime.value += delta
        pointsRef.current.material.uniforms.uCursor.value.x = renderer.pointer.x
        pointsRef.current.material.uniforms.uCursor.value.y = renderer.pointer.y
    })

    return <>
    <points ref={pointsRef} geometry={particlesGeometry} material={particlesMaterial} rotation={[0, 0, 0]}/>
    {/* <mesh>
    <planeGeometry />
    <meshBasicMaterial color={'red'}/>
    </mesh> */}
    </>
}