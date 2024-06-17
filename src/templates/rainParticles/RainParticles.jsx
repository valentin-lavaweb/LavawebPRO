import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function RainParticles(props) {
    const { count, xScale, zScale, zPosition, lengthScale, opacity, speedScale, position } = props;
    const linesRef = useRef();
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

    const createParticles = () => {
        const positions = new Float32Array(count * 6);
        const lengths = new Float32Array(count * 2);

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * xScale;
            const y = Math.random() * 220 * speedScale * 2 - 20;
            const z = (Math.random() - 0.5) * zScale + zPosition;
            const length = Math.random() * (1.25 * lengthScale - 0.05) + 0.05;

            positions.set([x, y, z, x, y - length, z], i * 6);
            lengths.set([0.0, 1.0], i * 2);
        }

        return { positions, lengths };
    };

    const particles = useMemo(createParticles, [count, xScale, zScale, zPosition, lengthScale, speedScale]);
    const { positions, lengths } = particles;

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

    useEffect(() => {
        particlesGeometry.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.current.setAttribute('lineLength', new THREE.BufferAttribute(lengths, 1));
        linesRef.current.frustumCulled = false;

        const handleResize = () => {
            const newParticles = createParticles();
            particlesGeometry.current.setAttribute('position', new THREE.BufferAttribute(newParticles.positions, 3));
            particlesGeometry.current.setAttribute('lineLength', new THREE.BufferAttribute(newParticles.lengths, 1));
            linesRef.current.frustumCulled = false;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [positions, lengths]);

    useFrame((state, delta) => {
        if (linesRef.current) {
            linesRef.current.material.uniforms.uTime.value += delta;
            if (linesRef.current.material.uniforms.uTime.value > 4) {
                linesRef.current.material.uniforms.uTime.value = 0;
            }
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
