import * as THREE from 'three'
import { useEffect, useMemo, useRef } from "react";
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

export default function Stars(props) {
    const pointsRef = useRef()

    // Количество партиклей
    const number = useRef(1000);
    
    // Функция, которая рандомно возвращает число
    function range(start, end){
        let r = Math.random()
        return r * (end - start) + start
    }
    const createParticles = () => {
        const positions = new Float32Array(number.current * 3)
        const sizes = new Float32Array(number.current)
        const radius = new Float32Array(number.current)
        // Задаем здесь значения для атрибутов, для каждого партикля
        for (let i = 0; i < number.current; i++) {
            let i3 = i * 3;
            const sphereRadius = 30; // радиус полусферы
            const theta = Math.PI * Math.random() * 0.58; // угол от 0 до PI/2
            const phi = 2 * Math.PI * Math.random(); // угол от 0 до 2*PI
    
            positions[i3] = sphereRadius * Math.sin(theta) * Math.cos(phi); // X
            positions[i3 + 1] = sphereRadius * Math.cos(theta); // Y, высота полусферы
            positions[i3 + 2] = sphereRadius * Math.sin(theta) * Math.sin(phi); // Z, глубина
    
            sizes[i] = range(0.01, 0.05); // размер каждого партикля
        }

        return { positions, sizes, radius };
    };
    const particles = useMemo(createParticles, []);
    const { positions, sizes, radius } = particles;

    // Создаём гемотерию и материал
    const particlesGeometry = useRef(new THREE.BufferGeometry());
    const particlesMaterial = useMemo(() => new THREE.ShaderMaterial({
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
    }), [window.innerWidth, window.innerHeight]);

    useEffect(() => {

        // Атрибут для каждой вершины - свой. Униформа - глобальная переменная, для всех одинаковая.
        // sizes - много разных, у каждой вершины - свой size, все партикли разного размера. Если бы я выставил size как униформу, то все были бы одного размера.
        particlesGeometry.current.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        particlesGeometry.current.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1))
        particlesGeometry.current.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1))
        particlesGeometry.current.setIndex(null)
        particlesGeometry.current.computeVertexNormals()
        pointsRef.current.frustumCulled = false;

        const handleResize = () => {
            const newParticles = createParticles();
            particlesGeometry.current.setAttribute("position", new THREE.BufferAttribute(newParticles.positions, 3))
            particlesGeometry.current.setAttribute("aSize", new THREE.BufferAttribute(newParticles.sizes, 1))
            particlesGeometry.current.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1))
            particlesGeometry.current.setIndex(null)
            particlesGeometry.current.computeVertexNormals()
            pointsRef.current.frustumCulled = false;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [positions, sizes, radius])

    return <>
    <points ref={pointsRef} geometry={particlesGeometry.current} material={particlesMaterial}/>
    </>
}