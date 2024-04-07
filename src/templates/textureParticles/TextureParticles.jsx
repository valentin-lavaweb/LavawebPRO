import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useEffect, useMemo, useRef } from 'react'

export default function TextureParticles(props) {
    // Картинка
    const pictureTexture = useLoader(THREE.TextureLoader, '/images/logoTexture.png')
    
    // Используем размеры окна для корректировки соотношения сторон текстуры
    const three = useThree();
    const aspectRatioRef = useRef(three.size.width / three.size.height)
    const aspectRatio = aspectRatioRef.current // соотношение сторон
    const particlesCount = 128 // Количество партиклей
    const geometryWidth = 8; // Ширина
    const geometryHeight = 8; // Высота

    // Невидимый канвас для создания текстуры канваса.
    const displacement = useMemo(() => {
        const displacement = {
            canvas: props.displacementCanvasRef.current,
            context: props.displacementCanvasRef.current.getContext('2d'),
            interactivePlane: {
                geometry: new THREE.PlaneGeometry(geometryWidth, geometryHeight, 1, 1),
                material: new THREE.MeshBasicMaterial({
                    transparent: true,
                    opacity: 0.1,
                    color: 'white'
                })
            },
            texture: new THREE.CanvasTexture(props.displacementCanvasRef.current),
            canvasCursor: new THREE.Vector2(9999, 9999),
            canvasCursorPrev: new THREE.Vector2(9999, 9999),
            canvasCursorDistance: new THREE.Vector2(0, 0)
        }
    
        displacement.canvas.width = particlesCount
        displacement.canvas.height = particlesCount
    
        displacement.context.fillStyle = 'black'
        displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)
    
        const glowImage = new Image
        displacement.glowImage = glowImage
        displacement.glowImage.src = '/images/textureParticles/glowTexture64.png'
    
        displacement.canvas.style.position = 'fixed'
        displacement.canvas.style.right = '0px'
        displacement.canvas.style.top = '0px'
        displacement.canvas.style.width = `${64}px`
        displacement.canvas.style.height = `${64}px`
        // displacement.canvas.style.display = 'none'
        displacement.canvas.style.pointerEvents = 'none'
        displacement.canvas.style.opacity = '1'
        displacement.texture.needsUpdate = true

        return displacement
    }, [])
    
    // Обновляем позицию курсора НА НЕВИДИМОМ КАНВАСЕ согласно uv-координатам НЕВИДИМОГО КАНВАСА
    function updateCanvasCursor(uv) {
        displacement.canvasCursor.x = uv.x * displacement.canvas.width
        displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height
    }
    
    
    // Объект партиклей
    const particles = useMemo(() => {
        const particles = {
            material: new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    uPictureTexture: {value: pictureTexture},
                    uDisplacementTexture: {value: displacement.texture},
                    uColor: {value: new THREE.Vector3(1.0, 1.0, 8.0)},
                    uGlowIntensity: {value: 1.0},
                    uSize: {value: 0.01},
                    uTime: {value: 0.0},
                    uCursor: {value: new THREE.Vector2(0.0, 0.0)},
                    uResolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)} ,
                },
                blending: THREE.AdditiveBlending,
                // transparent: true,
                depthWrite: false
            }),
            geometry: new THREE.PlaneGeometry(geometryWidth, geometryHeight, particlesCount, particlesCount),
        }

        // Создаем массивы для атрибутов
        const intensitiesArray = new Float32Array(particles.geometry.attributes.position.count) // взяли каждую точку каждого партикля
        const directionMoveArray = new Float32Array(particles.geometry.attributes.position.count) // взяли каждую точку каждого партикля

        // Заполняем массивы
        for (let i = 0; i < particles.geometry.attributes.position.count; i++) {
            intensitiesArray[i] = Math.random()
            directionMoveArray[i] = Math.random() * Math.PI * 2
        }

        // Добавляем атрибуты
        particles.geometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
        particles.geometry.setAttribute('aDirectionMove', new THREE.BufferAttribute(directionMoveArray, 1))

        // Оптимизация
        particles.geometry.setIndex(null)
        particles.geometry.deleteAttribute('normal')
        return particles
    }, [pictureTexture, aspectRatio])

    
    useFrame((renderer, delta) => {
        particles.material.uniforms.uTime.value += delta;

        // Обновляем курсор
        particles.material.uniforms.uCursor.value.x = renderer.pointer.x;
        particles.material.uniforms.uCursor.value.y = renderer.pointer.y;

        // Закрашиваем всё в черный и потихоньку убираем нашу текстуру
        displacement.context.globalCompositeOperation = 'source-over'
        displacement.context.globalAlpha = 0.02
        displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

        // Скорость курсора
        // Получаем дистанцию
        displacement.canvasCursorDistance = displacement.canvasCursorPrev.distanceTo(displacement.canvasCursor)
        displacement.canvasCursorPrev.copy(displacement.canvasCursor)
        const alpha = Math.min(displacement.canvasCursorDistance * 0.1, 1);

        // закрашиваем квадрат нашей белой текстурой
        displacement.context.globalCompositeOperation = 'lighten'
        displacement.context.globalAlpha = alpha
        if( displacement.glowImage != undefined ) {
            displacement.context.drawImage(
                displacement.glowImage,
                displacement.canvasCursor.x - (displacement.canvas.width * 0.15 * 0.5), // texture x pos
                displacement.canvasCursor.y - (displacement.canvas.width * 0.15 * 0.5), // texture y pos
                displacement.canvas.width * 0.15,                                       // texture width  
                displacement.canvas.width * 0.15)                                       // texture height
        }

        // Обновляем текстуру
        displacement.texture.needsUpdate = true
    })

    return <>
    <points material={particles.material} geometry={particles.geometry}/>
    <mesh visible={false} material={displacement.interactivePlane.material} geometry={displacement.interactivePlane.geometry} position={[0, 0, 0]} onPointerMove={(e) => {
        updateCanvasCursor(e.uv)
    }}
    onPointerDown={(e) => {
        updateCanvasCursor(e.uv)
    }}/>
    </>
}