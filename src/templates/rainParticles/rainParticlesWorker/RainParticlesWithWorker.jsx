import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { wrap } from 'comlink';
import rainWorkerImport from './rainWorker.worker.js?worker';
const rainWorker = wrap(new rainWorkerImport());

export default function RainParticlesWithWorker(props) {
    const { count, xScale, zScale, zPosition, lengthScale, opacity, speedScale, position } = props;
    const linesRef = useRef();
    const particles = useRef()
    const updatedTime = useRef()
    const particlesGeometry = useRef(new THREE.BufferGeometry());

    const vertexShader = /*glsl*/`
        uniform float uTime;
        uniform float uSpeed;
        attribute float lineLength;
        varying float vLength;
        void main() {
            vec3 pos = position;
            pos.y -= uTime * 30.0 * uSpeed;
            vLength = lineLength;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const fragmentShader = /*glsl*/`
        uniform float uOpacity;
        varying float vLength;
        void main() {
            vec4 colorStart = vec4(0.5, 0.5, 1.0, 0.0);
            vec4 colorEnd = vec4(0.5, 0.5, 1.0, uOpacity);
            vec4 color = mix(colorStart, colorEnd, vLength);
            gl_FragColor = color;
        }
    `;

    useEffect(() => {
        linesRef.current.frustumCulled = false;
        const fetchParticles = async () => {
            particles.current = await rainWorker.get(props);            
            particlesGeometry.current.setAttribute('position', new THREE.BufferAttribute(particles.current.positions, 3));
            particlesGeometry.current.setAttribute('lineLength', new THREE.BufferAttribute(particles.current.lengths, 1));
        };
        fetchParticles();

        const handleResize = async () => {
            particles.current = await rainWorker.get(props);            
            particlesGeometry.current.setAttribute('position', new THREE.BufferAttribute(particles.current.positions, 3));
            particlesGeometry.current.setAttribute('lineLength', new THREE.BufferAttribute(particles.current.lengths, 1));
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [particles.current])

    const particlesMaterial = useMemo(() => new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uOpacity: { value: opacity },
            uSpeed: { value: speedScale },
        },
        transparent: true,
        depthWrite: false,
    }), [opacity, speedScale]);

    useFrame(async (state, delta) => {
        if (linesRef.current) {
            // Вызов функции Web Worker для обновления времени
            updatedTime.current = await rainWorker.updateUniformTime(delta);

            // Обновление значения юниформы uTime
            linesRef.current.material.uniforms.uTime.value = updatedTime.current;
        }
    }, [linesRef]);

    useEffect(() => {
        return () => {
            if (particlesGeometry.current) {
                particlesGeometry.current.dispose();
            }
            if (particlesMaterial.current) {
                particlesMaterial.current.dispose();
            }
        };
    }, []);

    return (
        <lineSegments 
            ref={linesRef} 
            geometry={particlesGeometry.current} 
            material={particlesMaterial} 
            position={position} 
            frustumCulled={false} 
        />
    );
}
