import * as THREE from 'three'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';

export default function SchemesMoving(props) {
    const pointsRef = useRef()
    const texture = useTexture("/images/schemes/testScheme.png");

    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(5, -5, 0)
    ]);

    // Количество партиклей
    let number = 50;

    // Позиции партиклей, умножаем на 3. Потому что у каждого партикля есть x, y, z
    const positionsStart = useMemo(() => {
        const positions = new Float32Array(number * 3)
        return positions;
    }, [])

    // Размер партиклей
    const sizes = useMemo(() => {
        const sizes = new Float32Array(number)
        return sizes;
    }, [])

    const curvePoints = useMemo(() => {
        return new Float32Array(curve.points.reduce((acc, point) => {
            acc.push(point.x, point.y, point.z);
            return acc;
        }, []));
    }, [curve]);

    // Создаём гемотерию и материал
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // Униформы обязательно создавать с помощью new THREE.Uniform(), иначе их значения не будут меняться в самом шейдере 
        uniforms: {
            uResolution: {value :new THREE.Vector2(window.innerWidth, window.innerHeight)},
            uTime: {value: 0},
            uTexture: {value: texture},
            uCurvePoints: {value: curvePoints}
        },
        // ОБЯЗАТЕЛЬНО ВЫСТАВИТЬ
        transparent: true,
    })

    // Функция, которая рандомно возвращает число
    function range(start, end){
        let r = Math.random()
        return r * (end - start) + start
    }


    useEffect(() => {
        // Задаем здесь значения для атрибутов, для каждого партикля
        // for (let i = 0; i < number; i++) {
        //     let i3 = i * 3 // переменная, которая нужна, чтобы для каждого партикля задать свои атрибуты

        //     positions[i3] = range(-5, 5)       //Позиция каждого партикля по X
        //     positions[i3 + 1] = range(-5, 5)   //Позиция каждого партикля по Y
        //     positions[i3 + 2] = 0               //Позиция каждого партикля по Z

        //     sizes[i] = range(0.001, 0.04) //Размер каждого партикля
        // }

        const startPoints = curve.getPoints(number);
        for (let i = 0; i < number; i++) {
            let i3 = i * 3;
            positionsStart[i3] = startPoints[i].x;
            positionsStart[i3 + 1] = startPoints[i].y;
            positionsStart[i3 + 2] = startPoints[i].z;
            sizes[i] = range(0.001, 0.04) //Размер каждого партикля
        }

        particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positionsStart, 3))
        particlesGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1))
        particlesGeometry.setIndex(null)
        console.log(particlesGeometry)
        particlesGeometry.computeVertexNormals()
    }, [])

    useFrame((renderer, delta) => {
        pointsRef.current.material.uniforms.uTime.value += delta; // Теперь это значение колеблется между 0 и 1
    })

    return <>
        <points ref={pointsRef} geometry={particlesGeometry} material={particlesMaterial} rotation={[0, 0, 0]}/>
    </>
}