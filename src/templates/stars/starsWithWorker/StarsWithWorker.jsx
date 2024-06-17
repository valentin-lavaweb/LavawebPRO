import * as THREE from 'three'
import { useEffect, useMemo, useRef } from "react";
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { wrap } from 'comlink';
import starsWorkerImport from './starsWorker.worker.js?worker';
const starsWorker = wrap(new starsWorkerImport());

export default function StarsWithWorker(props) {
    const pointsRef = useRef()
    const particles = useRef()

    useEffect(() => {
        pointsRef.current.frustumCulled = false;
        const calculations = async () => {
            particles.current = await starsWorker.get(props);
            particlesGeometry.current.setAttribute("position", new THREE.BufferAttribute(particles.current.positions, 3))
            particlesGeometry.current.setAttribute("aSize", new THREE.BufferAttribute(particles.current.sizes, 1))
            particlesGeometry.current.setAttribute("aRadius", new THREE.BufferAttribute(particles.current.radius, 1))
            particlesGeometry.current.setIndex(null)
            particlesGeometry.current.computeVertexNormals()
        };
        calculations();

        const handleResize = async () => {
            particles.current = await starsWorker.get(props);
            particlesGeometry.current.setAttribute("position", new THREE.BufferAttribute(particles.current.positions, 3))
            particlesGeometry.current.setAttribute("aSize", new THREE.BufferAttribute(particles.current.sizes, 1))
            particlesGeometry.current.setAttribute("aRadius", new THREE.BufferAttribute(particles.current.radius, 1))
            particlesGeometry.current.setIndex(null)
            particlesGeometry.current.computeVertexNormals()
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [particles.current])

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

    return <>
    <points ref={pointsRef} geometry={particlesGeometry.current} material={particlesMaterial}/>
    </>
}