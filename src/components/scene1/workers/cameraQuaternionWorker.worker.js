// cameraQuaternionWorker.js
import * as THREE from 'three';
import { expose } from 'comlink';

const getCameraQuaternion = (cameraPosition, targetPosition, delta) => {
  const deserializedCameraPosition = new THREE.Vector3(...cameraPosition);
  const deserializedTargetPosition = new THREE.Vector3(...targetPosition);

  const camera = new THREE.PerspectiveCamera();
  camera.position.copy(deserializedCameraPosition);
  camera.lookAt(deserializedTargetPosition);

  const targetQuaternion = new THREE.Quaternion();
  camera.getWorldQuaternion(targetQuaternion);

  const cameraQuaternion = new THREE.Quaternion();
  cameraQuaternion.slerp(targetQuaternion, delta * 3.25);
  return [cameraQuaternion.x, cameraQuaternion.y, cameraQuaternion.z, cameraQuaternion.w];
};

expose({ getCameraQuaternion });
