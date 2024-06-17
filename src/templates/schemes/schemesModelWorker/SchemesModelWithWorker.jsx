import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from "react";
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import vertex from './vertex.glsl';
import fragment from './fragment.glsl';
import { wrap } from 'comlink';
import deltaWorkerImport from './deltaWorker.worker.js?worker';
import curvesWorkerImport from './curvesWorker.worker.js?worker';

const deltaWorker = wrap(new deltaWorkerImport());
const curvesWorker = wrap(new curvesWorkerImport());

export default function SchemesModelWithWorker(props) {

    const particlesRef = useRef();
    const curves = useRef()

    useEffect(() => {
        particlesRef.current.frustumCulled = false;
        const fetchCurves = async () => {
            curves.current = await curvesWorker.get(props);

            particlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(curves.current.positions, 3))
            particlesRef.current.geometry.setAttribute('lifeTime', new THREE.BufferAttribute(curves.current.lifes, 1))
            particlesRef.current.geometry.setAttribute('randomSize', new THREE.BufferAttribute(curves.current.sizes, 1))
        };
        fetchCurves();

        const handleResize = async () => {
            curves.current = await starsWorker.get(props);
            particlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(curves.current.positions, 3))
            particlesRef.current.geometry.setAttribute('lifeTime', new THREE.BufferAttribute(curves.current.lifes, 1))
            particlesRef.current.geometry.setAttribute('randomSize', new THREE.BufferAttribute(curves.current.sizes, 1))
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const ParticlesShaderMaterial = shaderMaterial(
        {
            time:  0,
            color: new THREE.Vector3(1, 1, 5),
            brightness: 5.0,
            sizeScale: 1.0,
            cycleTime: 4.0
        },
        vertex,
        fragment
    );

    extend({ParticlesShaderMaterial})

    useFrame(async (renderer, delta) => {
        const updatedTime = await deltaWorker.updateTime(delta);
        particlesRef.current.material.uniforms.time.value = updatedTime;
    });

    return <>
        {/* PARTICLES */}
        <points ref={particlesRef}>
            <bufferGeometry attach="geometry" />
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