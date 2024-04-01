import * as THREE from 'three'
import { RGBELoader } from 'three-stdlib'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useLoader, useThree } from '@react-three/fiber'
import { PMREMGenerator } from 'three';
import { useControls } from 'leva'
import { useCubeTexture } from '@react-three/drei'

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
          value: 0.05,
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
            envMap: { value: envMap },
            refractionRatio: { value: controls.refractionRatio },
            reflectivity: { value: controls.reflectivity },
            opacity: { value: controls.opacity }
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
            {/* <boxGeometry args={[1, 1, 0.1]}/> */}
            <sphereGeometry args={[1, 32, 64]}/>
        </mesh>
        <mesh position={[1, 0, -2]}>
            <boxGeometry />
            <meshStandardMaterial color="green"/>
        </mesh>
        <ambientLight />
        <directionalLight />
        
    </>
}