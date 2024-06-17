import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function RainDrops(props) {
  const pointsRef = useRef();
  const count = 50;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    velocities[i * 3] = (Math.random() - 0.5) * 0.1;
    velocities[i * 3 + 1] = 0;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }

  useFrame(() => {
    const positions = pointsRef.current.geometry.attributes.position.array;
    const velocities = pointsRef.current.geometry.attributes.velocity.array;

    for (let i = 0; i < count; i++) {
      velocities[i * 3 + 1] -= 0.001; // Gravity
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // If the droplet hits the ground
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = 0;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
        velocities[i * 3] = (Math.random() - 0.5) * 0.2;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

        // Create a splash effect
        const splashRadius = 0.5;
        const angle = Math.random() * Math.PI * 2;
        velocities[i * 3] = Math.cos(angle) * splashRadius * Math.random();
        velocities[i * 3 + 1] = Math.random() * 0.1;
        velocities[i * 3 + 2] = Math.sin(angle) * splashRadius * Math.random();
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          count={count}
        />
        <bufferAttribute
          attach="attributes-velocity"
          array={velocities}
          itemSize={3}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial color="blue" size={0.1} />
    </points>
  );
};