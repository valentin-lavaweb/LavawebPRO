import * as THREE from 'three';
import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useRef, useState } from "react";

// Импортируем Web Worker
import Worker from './workers/worker.js?worker';

export default forwardRef(function Scene1Test(props, ref) {
  const three = useThree();
  const groupRef = useRef();
  const [worker, setWorker] = useState();
  const previousPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Создаем новый Web Worker и сохраняем его в состоянии
    const newWorker = new Worker();
    setWorker(newWorker);

    // Обработка сообщений от Web Worker
    newWorker.onmessage = (e) => {
      const result = e.data;
      if (ref.camera.current) {
        // Обновление позиции камеры на основе данных от Web Worker
        ref.camera.current.position.set(result.x, result.y, ref.camera.current.position.z);
      }
    };

    return () => newWorker.terminate();
  }, [ref.camera]);

  useEffect(() => {
    ref.scene.current.visible = false;
  }, [ref.scene]);

  useFrame((state, delta) => {
    const pointer = {
      x: state.pointer.x,
      y: state.pointer.y
    };

    // Проверка, изменилось ли положение указателя
    if (pointer.x !== previousPointer.current.x || pointer.y !== previousPointer.current.y) {
      previousPointer.current = pointer;

      if (worker) {
        // Отправка текущих координат указателя в Web Worker
        worker.postMessage(pointer);
      }
    }
  });

  return (
    <scene ref={ref.scene}>
      <color attach="background" args={["#00ffff"]} />
      <perspectiveCamera {...three.camera} ref={ref.camera} />
      <group ref={groupRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial color={'red'} />
        </mesh>
      </group>
    </scene>
  );
});
