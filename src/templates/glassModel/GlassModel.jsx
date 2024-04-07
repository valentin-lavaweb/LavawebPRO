import * as THREE from 'three'
import { RGBELoader } from 'three-stdlib'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useLoader, useThree } from '@react-three/fiber'
import { PMREMGenerator } from 'three';
import { useControls } from 'leva'
import { Text, useCubeTexture } from '@react-three/drei'

export default function GlassModel(props) {

    const { gl, scene } = useThree();

    // const envMap = useLoader(RGBELoader, '/backgrounds/backLavaweb.hdr')
    // const pmremGenerator = new PMREMGenerator(gl);
    // pmremGenerator.compileEquirectangularShader();
    // const processedEnvMap = pmremGenerator.fromEquirectangular(envMap).texture;

    const envMap = useCubeTexture(
        ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
        { path: "/cube/" }
      );

    const controls = useControls('values',{
        refractionRatio: {
          value: 0.9,
          min: 0,
          max: 1,
          step: 0.001
        },
        reflectivity: {
          value: 0.23,
          min: 0,
          max: 1,
          step: 0.01
        },
        opacity: {
          value: 0.5,
          min: 0,
          max: 1,
          step: 0.01
        }
      })

    const glassShader = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
            uTime: { value: 0.0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            uCursor: {value: new THREE.Vector2(0.0, 0.0)},
            uProgress: { value: 0.0 },
            uEnvMap: { value: envMap },
            uRefractionRatio: { value: controls.refractionRatio },
            uReflectivity: { value: controls.reflectivity },
            uOpacity: { value: controls.opacity },
            uColor: {value: new THREE.Vector4(0.0, 0.0, 1.0, 1.0)}
        },
        transparent: true,
        // blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.FrontSide,
    })

    return <>
        <mesh position={[0, 0, 0]} material={glassShader}>
        {/* <mesh position={[0, 0, 0]}> */}
            {/* <meshStandardMaterial envMap={envMap} transparent={true} opacity={0.5} metalness={0.2} roughness={0.0} color="black" emissive="black"/> */}
            <boxGeometry args={[5, 5, 0.1]}/>
            {/* <sphereGeometry args={[1, 32, 64]}/> */}
        </mesh>
        <Text>
            GGz
        </Text>
        <ambientLight />
        <directionalLight />
        
    </>
}