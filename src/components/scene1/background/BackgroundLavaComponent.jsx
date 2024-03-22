import * as THREE from 'three'
import { shaderMaterial, useTexture } from "@react-three/drei"
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useRef } from "react"
// import { useControls } from 'leva'
import { RGBELoader } from 'three-stdlib'
import { easing } from 'maath'
import CustomShaderMaterial from 'three-custom-shader-material'
import lavaFragment from '../../../shaders/lavaFragment.glsl'
import lavaVertex from '../../../shaders/lavaVertex.glsl'

export default function BackgroundLavaComponent(props) {
    const three = useThree()
    const lavaMesh = useRef()
    const materialRef = useRef()
    const noiseTexture = useTexture('/backgrounds/perlinNoise.png')
    const backgroundTexture = useLoader(RGBELoader, '/backgrounds/backLavaweb.hdr')
    const materialParams = {
        distortionPower: 0.3,
        distortionScale: 0.3
    }
    const LavaMaterial = shaderMaterial(
        {
            // wireframe: true,
          backgroundTexture: backgroundTexture,
          noiseTexture: noiseTexture,
          distortionPower: materialParams.distortionPower,
          distortionScale: materialParams.distortionScale,
          distortionColor: new THREE.Color("#1b476f"),
        //   distortionColor: new THREE.Color("#ffffff"),
          uResolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
          uLiquidScale: 1,
          uTime: 0.0,
        },
        
        /* glsl */
        `
        varying vec2 vUv;
        uniform vec2 uResolution;
        uniform float uLiquidScale;    
        uniform float uTime;    
        void main() {
            // Изменение позиции вершины в зависимости от её исходной позиции
            vUv = uv;
            vec3 pos = position;

            // Применяем параболическую функцию к координате Y каждой вершины
            pos.z -= pow(position.x, 2.0) * -0.05;
            
            vec2 center = vec2(0.5);
            vec2 liquidScaleXY = vec2(uLiquidScale, uLiquidScale);
            
            // Масштабируем uv относительно центра
            vUv = center + (vUv - center) * liquidScaleXY;
            
            // Вычисляем разницу в соотношении сторон между экраном и текстурой
            float aspectX = uResolution.x / uResolution.y;
            float aspectY = 1.0;
            
            // Если экран шире, чем текстура, то корректируем масштаб по Y
            if (aspectX > 1.0) {
                aspectY = 1.0 / aspectX;
                aspectX = 1.0;
            }
            
            // Вычисляем сдвиг по X и Y, чтобы центрировать текстуру
            float xOffset = (1.0 - aspectX) / 2.0;
            float yOffset = (1.0 - aspectY) / 2.0;
            
            // Применяем масштабирование по соотношению сторон и сдвиг
            vUv.x = vUv.x * aspectX + xOffset;
            vUv.y = vUv.y * aspectY + yOffset;
            
            // Применяем искажение к однородным координатам uv
            // gl_Position = projectedPosition;
            // gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.z, 1.0 );
            // gl_Position = vec4( position.x, position.y, position.z, 1.0 );
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            // gl_Position = vec4( pos, 1.0 );  
        }`
        ,
        
        /* glsl */
        `
        varying vec2 vUv;
        uniform sampler2D backgroundTexture;
        uniform sampler2D noiseTexture;
        uniform vec3 distortionColor;
        uniform float distortionPower;
        uniform float uTime;
    
        void main() {  
            // Получаем шум
            float noise = texture(noiseTexture, vUv).r;
    
            vec2 offset = distortionPower * vec2(fract(noise + uTime) * 0.75);
            
        
            // Получаем искаженные координаты UV с использованием uTime в качестве коэффициента масштабирования
            vec2 distortedUV = vUv + offset;
        
            // Используем искаженные координаты UV для сэмплирования текстуры
            vec4 color = texture2D(backgroundTexture, distortedUV);
        
            // Изменяем цвет
            color.rgb *= distortionColor.rgb;
        
            // Затемняем цвет
            float darkeningFactor = 0.25;
            color.rgb *= darkeningFactor;
        
            gl_FragDepth = 1.0;
            gl_FragColor = color;
            // gl_FragColor = vec4(0.5, 0.0, 0.0, 1.0);
    
            // #include <encodings_fragment>
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
        }`
    )
    extend({LavaMaterial})
    useFrame((renderer, delta) => {
        // console.log(lavaMesh)
        materialRef.current.uniforms.uTime.value += delta * 0.05
    })

    useEffect(() => {
        materialRef.current.precision = "lowp"
    }, [])


    return <>
    <mesh ref={lavaMesh} position={[0, 0, -1]} rotation={[0, 0, 0]} scale={4.2}>
        {/* <planeGeometry args={[three.viewport.width, three.viewport.height, 20, 20]}/> */}
        <planeGeometry args={[three.viewport.width, three.viewport.height]}/>
        <lavaMaterial ref={materialRef}/>
    </mesh>
    </>
}

// extend({LavaMaterial, LavaMaterial2})