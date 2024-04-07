import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import gsap from 'gsap'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'

export default function MorphCursorParticles(props) {

    // Список моделей
    const logoModel = useGLTF('/models/lava_logo.glb')
    const model1 = useGLTF('/models/earth.glb')
    const model2 = useGLTF('/models/factory.glb')

    const pointsRef = useRef()
    const secondMeshRef = useRef()
    const currentSceneIndexRef = useRef(0)
    const targetSceneIndexRef = useRef(1)
    const letGeometrySwapRef = useRef(true);
    let currentSceneIndex = currentSceneIndexRef.current
    let targetSceneIndex = targetSceneIndexRef.current
    
    // Партикли
    const particles = useMemo(() => {
        // Объект партиклей
        const particles = {
            geometry: new THREE.BufferGeometry(),
            material: new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    uTime: {value: 0.0},
                    uColor: {value: new THREE.Vector3(1.0, 1.0, 8.0)}, //Не рекомендую увеличивать значения цвета, лучше работать с uBrightness для яркости, эффект такой же
                    uSize: {value: 0.03}, //Влияет на размер свечения партиклей, сильно жрёт ФПС при больших значениях
                    uBrightness: {value: 1.0}, //Влияет на яркость партиклей, не жрёт ФПС.
                    uBlur: {value: 0.01}, //Влияет на блюр партиклей, не жрёт фпс
                    uResolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)} ,
                    uCursor: {value: new THREE.Vector2(0.0, 0.0)},
                    uProgress: {value: 0.0},
                    uDuration: {value: 0.5}, 
                    uFrequency: {value: 3.5},
                },
                // transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            }),
            models: [
                logoModel,
                model1,
                model2
            ],
            maxCount: 0,
            positions: [],
            sizes: [],
        }

        // console.log(particles.models[0])
        
        // Получаем positions из атрибутов геометрий всех моделей.
        const positions = particles.models.map((model) => {
            //Проходимся по всем детям всех моделей, чтобы получить их атрибут - позицию
            for (let i = 0; i < model.scene.children.length; i++) {
                const position = model.scene.children[i].geometry.attributes.position;            
                return position
            }
        })

        
        // Получаем максимальное количество партиклей
        for(const position of positions) {
            if (position.count > particles.maxCount) {
                particles.maxCount = position.count
            }
        }
        
        // Массив новых размеров партиклей
        const sizesArray = new Float32Array(particles.maxCount)
        for (let i = 0; i < particles.maxCount; i++) {
            sizesArray[i] = Math.random() // В vertex мы умножаем размеры на рандомное число
        }

        // Выставляем новые позиции для новых партиклей и берём старые позиции уже существующих партиклей.        
        for(const position of positions) {    
            const originalArray = position.array // массив стандартных позиций всех моделей.
            const newArray = new Float32Array(particles.maxCount * 3) // массив, в котором будут новые позиции(*3) партиклей для каждой модели.
            


            // Создаём новые партикли и новые позиции для них.
            for (let i = 0; i < particles.maxCount; i++) {
                const i3 = i * 3 // каждый партикль
                
                // Если не надо создавать новый партикль, то выставляем ему старую позицию
                if (i3 < originalArray.length) {
                    newArray[i3 + 0] = originalArray[i3 + 0] // postition.Х
                    newArray[i3 + 1] = originalArray[i3 + 1] // position.Y
                    newArray[i3 + 2] = originalArray[i3 + 2] // position.Z
                }
                // Если придётся создать новый партикль - выставляем ему новую позицию
                else {
                    // Распределяем позиции новых партиклей по геометрии текущей модели
                    const randomIndex = Math.floor(position.count * Math.random()) * 3 // то же самое, что i3, но рандомный индекс, чтобы новые партикли распределились рандомно
                    newArray[i3 + 0] = originalArray[randomIndex + 0] // position.X
                    newArray[i3 + 1] = originalArray[randomIndex + 1] // position.Y
                    newArray[i3 + 2] = originalArray[randomIndex + 2] // position.Z

                    // Распределяем позиции новых партиклей рандомно вокруг сцены
                    // newArray[i3 + 0] = (Math.random() - 0.5) * 8 // position.X
                    // newArray[i3 + 1] = (Math.random() - 0.5) * 8 // position.Y
                    // newArray[i3 + 2] = (Math.random() - 0.5) * 8 // position.Z
                }
            }
            // засовываем в наш массив с позициями новые массивы с новыми позициями
            particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3)) //берём число 3, потому что у каждого партикля есть xyz
        }

        // Добавляем атрибут позиций, т.е. выставляем нашим партиклям новые позиции
        particles.geometry.setAttribute('position', particles.positions[0]) //Стартовая форма
        particles.geometry.setAttribute('aPositionTarget', particles.positions[1]) //Конечная форма
        particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1)) //Размер партиклей
    
        // Делаем это для того, чтобы улучшить оптимизацию, необязательно, надо узнать в chatGPT зачем это нужно.
        particles.geometry.setIndex(null)
        particles.geometry.deleteAttribute('normal')

        return particles
    }, []) // в [] добавляем переменную, которую хотим затестить с помощью useControls.

    // Вычисляем геометрию
    const swapGeometry = () => {
        // Меняем геометрию на нужную для корректной смены геометрии
        particles.geometry.attributes.position = particles.positions[(currentSceneIndex + 1) % particles.models.length]
        particles.geometry.attributes.aPositionTarget = particles.positions[(targetSceneIndex + 1) % particles.models.length]

        // Вычисляем размеры нынешней модели
        particles.geometry.computeBoundingBox();
        const boundingBox = particles.geometry.boundingBox;
    
        // Вычисляем размеры для BoxGeometry
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
    
        // Создаём и обновляем геометрию второстепенного меша
        const newGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        secondMeshRef.current.geometry.dispose(); // Освобождаем ресурсы старой геометрии
        secondMeshRef.current.geometry = newGeometry;

        // Возвращаем геометрию
        particles.geometry.attributes.position = particles.positions[currentSceneIndex]
        particles.geometry.attributes.aPositionTarget = particles.positions[targetSceneIndex]
        
        // Запрещаем выполнение функции
        letGeometrySwapRef.current = false

        return newGeometry
    }

    // Меняем сцену
    const changeSceneIndex = () => {
        // Вычисляем нынешнюю и текущую модели
        currentSceneIndex = targetSceneIndex
        targetSceneIndex = (currentSceneIndex + 1) % particles.models.length

        // Выставляем стартовые точки и точки таргета
        particles.geometry.attributes.position = particles.positions[currentSceneIndex]
        particles.geometry.attributes.aPositionTarget = particles.positions[targetSceneIndex]

        // Выставляем новый индекс, чтобы понять новые стартовые точки
        particles.material.uniforms.uProgress.value = 0.0

        // Разрешаем смену геометрии
        letGeometrySwapRef.current = true
    }

    // Анимация
    useFrame((renderer, delta)=> {
        particles.material.uniforms.uTime.value += delta
        particles.material.uniforms.uCursor.value.x = renderer.pointer.x
        particles.material.uniforms.uCursor.value.y = renderer.pointer.y
        // particles.material.uniforms.uTime.value = particles.material.uniforms.uTime.value % 1.05

        easing.damp(particles.material.uniforms.uProgress, 'value', 1.0, 0.5)

        // Меняем вторичную геометрию
        if (particles.material.uniforms.uProgress.value >= 0.45 && particles.material.uniforms.uProgress.value <= 0.55 && letGeometrySwapRef.current === true) {
            // swapGeometry()
        }

        // Меняем индекс сцены для анимации
        if (particles.material.uniforms.uProgress.value === 1) {
            changeSceneIndex()
        }
    })

    return <>
    <points geometry={particles.geometry} material={particles.material} ref={pointsRef}
    // onPointerMove={(e) => {
    //     // console.log(e);
    // }}
    />
    <mesh
        ref={secondMeshRef}
        onPointerMove={(e) => {
            // console.log(e);
        }}
        geometry={particles.models[0].scene.children[0].geometry}
        >
        <meshBasicMaterial transparent={false} opacity={1} depthWrite={false} depthTest={true}/>
    </mesh>
    <ambientLight />
    {/* <directionalLight /> */}
    </>
}