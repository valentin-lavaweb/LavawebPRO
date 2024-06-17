import * as THREE from 'three';
import { useFrame, useThree } from "@react-three/fiber";
import React, { forwardRef, useEffect, useMemo, useRef } from "react";
const Scene1Model = React.lazy(() => import("./scene1Model/Scene1Model.jsx"));
import { easing } from 'maath';
import { wrap } from 'comlink';
import cameraPositionWorkerImport from './workers/cameraPositionWorker.worker.js?worker';
import cameraQuaternionWorkerImport from './workers/cameraQuaternionWorker.worker.js?worker';

const cameraPositionWorker = wrap(new cameraPositionWorkerImport());
const cameraQuaternionWorker = wrap(new cameraQuaternionWorkerImport());

const serializeVector3 = (vector) => [vector.x, vector.y, vector.z];
const deserializeVector3 = (array) => new THREE.Vector3(array[0], array[1], array[2]);

export default forwardRef(function Scene1(props, ref) {
  const three = useThree();
  const groupRef = useRef();
  const sceneProgress = useRef(0.0);
  const targetProgress = useRef(0.0);
  const pointer = useRef({ x: 0, y: 0 });
  const position = useRef(new THREE.Vector3());
  const targetPosition = useRef(new THREE.Vector3());
  const cameraQuaternion = useRef(new THREE.Quaternion());
  const targetQuaternion = useRef(new THREE.Quaternion());
  const lookAtOffset = useRef(new THREE.Vector3());
  const currentPointer = useRef(new THREE.Vector2());
  const targetPointer = useRef(new THREE.Vector2());
  const lookAtPosition = useRef(new THREE.Vector3());
  const factor = 3;

  const positionPoints = [
    new THREE.Vector3(0, 0.0, 5),
    new THREE.Vector3(-3, -1, 5),
    new THREE.Vector3(-10.43, -5.21, 9.01),
    new THREE.Vector3(1.67, -9.0, 10.47),
    new THREE.Vector3(7.0, -9.2, 9.5),
    new THREE.Vector3(7.0, -11.2, 9.5)
  ];

  const targetPoints = [
    new THREE.Vector3(0, 3.5, -10),
    new THREE.Vector3(2.5, 3.5, -10),
    new THREE.Vector3(-3, -2.45, 0.27),
    new THREE.Vector3(-3.5, -3.05, 1.58),
    new THREE.Vector3(-3.5, -2.85, 0.11),
    new THREE.Vector3(-3.5, -4.85, 0.11)
  ];

  useEffect(() => {
    ref.scene.current.visible = false;

    const handleMouseMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    ref.camera.current.position.copy(positionPoints[0]);
    ref.camera.current.lookAt(targetPoints[0]);
    ref.camera.current.updateProjectionMatrix();
  }, []);

  async function cameraMoving(delta) {
    if (delta > 0.02) {
      delta = 0.01;
    }
    targetProgress.current = props.scroll.current;
    sceneProgress.current = THREE.MathUtils.lerp(sceneProgress.current, targetProgress.current, delta * 5);
    sceneProgress.current = Math.min(1, sceneProgress.current);
    sceneProgress.current = Math.max(0, sceneProgress.current);

    const serializedPositionPoints = positionPoints.map(serializeVector3);
    const serializedTargetPoints = targetPoints.map(serializeVector3);

    const newPosition = await cameraPositionWorker.getCameraPosition(sceneProgress.current, serializedPositionPoints);
    const newTargetPosition = await cameraPositionWorker.getCameraPosition(sceneProgress.current, serializedTargetPoints);

    position.current.copy(deserializeVector3(newPosition));
    targetPosition.current.copy(deserializeVector3(newTargetPosition));

    ref.camera.current.position.lerp(position.current, delta * 1.25);

    const newCameraQuaternion = await cameraQuaternionWorker.getCameraQuaternion(
      serializeVector3(ref.camera.current.position),
      newTargetPosition,
      delta
    );

    cameraQuaternion.current.copy(deserializeVector3(newCameraQuaternion));
    ref.camera.current.quaternion.copy(cameraQuaternion.current);

    if (props.progress.current === 0) {
      if (ref.camera.current.position.y < -8.5) {
        pointer.current.y = Math.max(pointer.current.y, -0.25);
      }
      targetPointer.current.set(pointer.current.x, pointer.current.y);
    } else {
      targetPointer.current.set(pointer.current.x * 0.25, pointer.current.y * 0.25);
    }
    currentPointer.current.lerp(targetPointer.current, delta * 5);

    lookAtOffset.current.set(
      targetPosition.current.x + currentPointer.current.x * factor,
      targetPosition.current.y + currentPointer.current.y * factor,
      targetPosition.current.z
    );

    lookAtPosition.current.lerp(lookAtOffset.current, delta * 5);
    ref.camera.current.lookAt(lookAtPosition.current);
  }

  useFrame((_, delta) => {
    cameraMoving(delta);
    if (props.currentScene.current === 0) {
      easing.damp(groupRef.current.position, 'y', props.progress.current * 3.5, 0.0001);
    } else if (props.currentScene.current === props.scenes.current.length - 1) {
      easing.damp(groupRef.current.position, 'y', (props.progress.current - 1) * 1.5, 0.025);
    }
  });

  return (
    <>
      <scene ref={ref.scene}>
        <color attach="background" args={["#181c20"]} />
        <perspectiveCamera {...three.camera} position={positionPoints[0]} target={targetPoints[0]} ref={ref.camera} />
        <group ref={groupRef}>
          <Scene1Model />
        </group>
      </scene>
    </>
  );
});
