import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useEffect, useRef, useState } from "react"
import BackgroundLavaComponent from "./background/BackgroundLavaComponent"
import { Icosahedron, MeshDistortMaterial, useCubeTexture, useTexture } from "@react-three/drei"
import { easing } from 'maath'
import BackgroundNew from './background/GridBackground'

export default forwardRef( function Scene1(props, ref) {
    const three = useThree()
    const bumpMap = useTexture("/bump.jpg");
    const envMap = useCubeTexture(
      ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
      { path: "/cube/" }
    );
    const [material, setMaterial] = useState();
    const groupRef = useRef()

    useEffect(() => {
      ref.scene.current.visible = false
    }, [])

    useFrame(({pointer}) => {
      // console.log(ref.camera.current.aspect)
      // ref.camera.current.aspect = three.camera.aspect
      easing.damp(ref.camera.current.position, 'x', -pointer.x * 0.25, 0.2);
      easing.damp(ref.camera.current.position, 'y', -pointer.y * 0.25, 0.2);
      ref.camera.current.lookAt(0, 0, 0)
      if (props.currentScene.current === 0) {
        // console.log(props.progress.current)
        easing.damp(groupRef.current.position, 'y', (props.progress.current - 0) * 1.75, 0.05);
      } else if (props.currentScene.current === props.scenes.current.length - 1) {
        easing.damp(groupRef.current.position, 'y', (props.progress.current - 1) * 1.75, 0.05);
      }
    })
    function Sphere() {
      // We use `useResource` to be able to delay rendering the spheres until the material is ready
      const sphere = useRef();
      // sphere rotates following the mouse position
      useFrame(({ clock, pointer }) => {
        sphere.current.rotation.z = clock.getElapsedTime();
        sphere.current.rotation.y = THREE.MathUtils.lerp(
          sphere.current.rotation.y,
          pointer.x * Math.PI,
          0.1
        );
        sphere.current.rotation.x = THREE.MathUtils.lerp(
          sphere.current.rotation.x,
          pointer.y * Math.PI,
          0.1
        );
      });
      return (
        <>
          {material && <Icosahedron
              scale={1}
              args={[1, 8]}
              ref={sphere}
              material={material}
              position={[0, 0, 0]}
          />}
        </>
      );
    }

    function LittleSpheres() {
        const [sphereRefs] = useState(() => []);
        const littleSpheres = [
            [-4, 20, -12],
            [-10, 12, -15],
            [-11, -12, -23],
            [-16, -6, -10],
            [12, -2, -8],
            [13, 4, -12],
            [14, -2, -23],
            [8, 10, -20]
        ];

        // smaller spheres movement
        useFrame(() => {
          // animate each sphere in the array
          sphereRefs.forEach((el) => {
            el.position.y += 0.02;
            if (el.position.y > 19) el.position.y = -18;
            el.rotation.x += 0.06;
            el.rotation.y += 0.06;
            el.rotation.z += 0.02;
          });
        });
        return (
          <>
            {littleSpheres.map((pos, i) => (
              <Icosahedron
                scale={0.5}
                args={[1, 12]}
                position={[pos[0], pos[1], pos[2]]}
                material={material}
                key={i}
                ref={(ref) => (sphereRefs[i] = ref)}
              />
            ))}
          </>
        );
    }

    function Ring() {
        const [ringsRefs] = useState(() => []);
        const rings = [
            {
                x: -0.41,
                y: 0.1
            },
            // {
            //     x: -0.8,
            //     y: -0.8
            // },
            {
                x: -0.1,
                y: 0.7
            },
        ]
        useFrame(() => {
            // animate each sphere in the array
            ringsRefs.forEach((el) => {
            //   el.position.y += 0.02;
            //   if (el.position.y > 19) el.position.y = -18;
              el.rotation.x += 0.005;
              el.rotation.y += 0.006;
            //   el.rotation.z += 0.02;
            });
        });
        return <>
        {rings.map((ring, index) => {
            return (
            <mesh rotation={[Math.PI * ring.x, Math.PI * ring.y, 0]}scale={0.115} key={`ring$${index}`}
            ref={(ringRef) => (ringsRefs[index] = ringRef)}>
                <torusGeometry args={[10, 0.05, 30, 100, Math.PI * 2]} />
                <meshBasicMaterial color={[0.6, 0.6, 3]}/>
            </mesh>
            )
        })}
        </>
    }

    const bg = new THREE.TextureLoader().load('/backgrounds/bg1.png')

    return <>
    {/* <scene ref={ref.scene} background={bg}> */}
    <scene ref={ref.scene}>
    {/* <color attach="background" args={["#ff0000"]} /> */}
        <perspectiveCamera {...three.camera} ref={ref.camera}/>
        {/* <BackgroundLavaComponent progress={props.progress} currentScene={props.currentScene} scenes={props.scenes}/> */}
        {/* <BackgroundNew /> */}
        <MeshDistortMaterial
            ref={setMaterial}
            envMap={envMap}
            bumpMap={bumpMap}
            color={"#010101"}
            roughness={0}
            metalness={1}
            bumpScale={0.005}
            clearcoat={1}
            clearcoatRoughness={1}
            radius={1}
            distort={0.35}
        />
        <group ref={groupRef}>
          <Sphere />
          <LittleSpheres />
          <Ring />
        </group>
    </scene>
    </>
})