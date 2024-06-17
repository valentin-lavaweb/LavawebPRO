// cameraPositionWorker.js
import * as THREE from 'three';
import { expose } from 'comlink';

const getCameraPosition = (progress, positionPoints) => {
  const deserializedPoints = positionPoints.map(point => new THREE.Vector3(...point));
  const positionCurve = new THREE.CatmullRomCurve3(deserializedPoints);
  const position = new THREE.Vector3();
  positionCurve.getPointAt(progress, position);
  return [position.x, position.y, position.z];
};

expose({ getCameraPosition });
