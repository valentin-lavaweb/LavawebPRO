import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Detailed, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import gsap from 'gsap'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import DisplacementMesh from './displacementMesh/DisplacementMesh'
import { log } from 'three/examples/jsm/nodes/Nodes.js'

export default function MorphCursorParticles(props) {

    const {gl} = useThree()

    // Список моделей
    const model1 = useGLTF('/models/iconMain.glb')
    const model2 = useGLTF('/models/iconPortfolio.glb')
    const model3 = useGLTF('/models/iconServices.glb')
    const model4 = useGLTF('/models/iconContacts.glb')
    const simpleModel1 = useGLTF('/models/displacementMenu.glb')

    // Использовать это, если хотим подключить несколько разных displacement
    // const simpleModel2 = useGLTF('/models/displacementMenu.glb')
    // const simpleModel3 = useGLTF('/models/displacementMenu.glb')
    // const simpleModel4 = useGLTF('/models/displacementMenu.glb')

    const pointsRef = useRef()
    const cursorWorldPositionRef = useRef(new THREE.Vector3(999.0, 999.0, 999.0))

    const cursorMeshRef = useRef()
    const prevCursorMeshRef = useRef()

    const cursorPathLength = 31; // Длина пути курсора, которую мы хотим сохранить
    const cursorPath = useRef(new Array(cursorPathLength).fill(new THREE.Vector3()))
    function updateCursorPath(cursorPosition) {
        cursorPath.current.pop(); // Удаляем самую старую позицию
        cursorPath.current.unshift(cursorPosition.clone()); // Добавляем текущую позицию в начало массива
    }

    const displacementMeshRef = useRef()
    const currentSceneIndexRef = useRef(0)
    const targetSceneIndexRef = useRef(1)
    const letGeometrySwapRef = useRef(true);
    let currentSceneIndex = currentSceneIndexRef.current
    let targetSceneIndex = targetSceneIndexRef.current

    // const controls = useControls('controls', {
    //     uSpreadIntensity: {
    //         value: 3.0,
    //         min: 0.0,
    //         max: 3.0,
    //         step: 0.01
    //     },
    //     uCursorRadius: {
    //         value: 0.11,
    //         min: 0.0,
    //         max: 3.0,
    //         step: 0.01
    //     },
    // })
    
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
                    uResolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},

                    uColor: {value: new THREE.Vector3(1.0, 1.0, 8.0)}, //Не рекомендую увеличивать значения цвета, лучше работать с uBrightness для яркости, эффект такой же
                    uSize: {value: 0.015}, //Влияет на размер свечения партиклей, сильно жрёт ФПС при больших значениях
                    uBrightness: {value: 2.0}, //Влияет на яркость партиклей, не жрёт ФПС.
                    uBlur: {value: 0.01}, //Влияет на блюр партиклей, не жрёт фпс
                    uDuration: {value: 0.5}, 
                    uFrequency: {value: 7.5},
                    uProgress: {value: 0.0},
                    
                    uCursor: {value: new THREE.Vector3(0.0, 0.0, 0.0)},
                    uPrevCursor: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
                    uCursorRadius: {value: 0.11},
                    uSpreadIntensity: {value: 3.0},
                    uAlpha: { value: 0.0 },
                    uCursorPath: { value: new THREE.Vector3(cursorPath.current) },
                    uCursorPathLength: { value: 31.0 },
                },
                // transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            }),
            models: [
                model1,
                model2,
                model3,
                model4,
            ],
            simpleModels: [
                simpleModel1,
                // simpleModel2,
                // simpleModel3,
                // simpleModel4,
            ],
            maxCount: 0,
            positions: [],
            sizes: [],
        }

        particles.material.uniforms.uTimeSinceInteraction = new Float32Array(particles.maxCount).fill(-1.0)
        
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
                }
            }

            // засовываем в наш массив с позициями новые массивы с новыми позициями
            particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3)) //берём число 3, потому что у каждого партикля есть xyz
        }

        // Генерация случайных направлений
        const directionsArray = new Float32Array(particles.maxCount * 3);
        for (let i = 0; i < particles.maxCount; i++) {
            directionsArray[i * 3] = Math.random() * 4 - 2; // X
            directionsArray[i * 3 + 1] = Math.random() * 4 - 2; // Y
            directionsArray[i * 3 + 2] = Math.random() * 4 - 2; // Z
        }

        // Улучшаем рандом
        const randoms = new Float32Array(particles.maxCount * 3);
        for (let i = 0; i < particles.maxCount; i++) {
            randoms[i] = Math.random() * 2 - 1;
        }
        
        // Добавляем атрибут позиций, т.е. выставляем нашим партиклям новые позиции
        particles.geometry.setAttribute('position', particles.positions[0]) //Стартовая форма
        particles.geometry.setAttribute('aPositionTarget', particles.positions[1]) //Конечная форма
        particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1)) //Размер партиклей
        particles.geometry.setAttribute('aDirection', new THREE.BufferAttribute(directionsArray, 3)); //Рандомное направление
        particles.geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
        
        // Делаем это для того, чтобы улучшить оптимизацию, необязательно, надо узнать в chatGPT зачем это нужно.
        particles.geometry.setIndex(null)
        particles.geometry.deleteAttribute('normal')

        return particles
    }, []) // в [] добавляем controls, если хотим чтобы useControls работал


    // Вычисляем геометрию
    const swapDisplacementGeometry = () => {
        // Меняем displacement геометрию на нужную
        displacementMeshRef.current.geometry = particles.simpleModels[(targetSceneIndex)].scene.children[0].geometry
        
        // Запрещаем выполнение функции после того как применили новую геометрию
        letGeometrySwapRef.current = false
    }

    const startAnimation = useRef(false)
    const endAnimation = useRef(false)
    const prevHovered = useRef(props.hoveredElement.current);
    // Анимация
    useFrame((renderer, delta)=> {
        if( props.activeMenu.current === false) {
            displacementMeshRef.current.position.z = -5
        } else {
            displacementMeshRef.current.position.z = 0
        }
        particles.material.uniforms.uTime.value += delta

        particles.material.uniforms.uCursor.value = cursorWorldPositionRef.current
        cursorMeshRef.current.position.x = cursorWorldPositionRef.current.x
        cursorMeshRef.current.position.y = cursorWorldPositionRef.current.y
        cursorMeshRef.current.position.z = cursorWorldPositionRef.current.z

        updateCursorPath(cursorWorldPositionRef.current)
        const delayIndex = 30; // Например, задержка в 20 позиций
        if (cursorPath.current.length > delayIndex) {
            const delayedPosition = cursorPath.current[delayIndex];
            // Обновляем положение "предыдущего" курсора
            prevCursorMeshRef.current.position.copy(delayedPosition);
        }

        // Меняем вторичную геометрию
        // ИСПОЛЬЗУЕМ ЭТО, ЕСЛИ НАДО ПОМЕНЯТЬ DISPLACEMENT
        // if (particles.material.uniforms.uProgress.value >= 0.4 && particles.material.uniforms.uProgress.value <= 0.6 && letGeometrySwapRef.current === true) {
        //     swapDisplacementGeometry()
        // }

        // Если меняется hoveredElement, то запускаем анимацию
        if (props.hoveredElement.current !== prevHovered.current) {   
            if (
            props.hoveredElement.current === 'hoveredLi0' || 
            props.hoveredElement.current === 'hoveredLi1' ||
            props.hoveredElement.current === 'hoveredLi2' ||
            props.hoveredElement.current === 'hoveredLi3'
            ) {
                startAnimation.current = true
                endAnimation.current = false
                prevHovered.current = props.hoveredElement.current
            }
        }

        // Скорость смены партиклей
        const cooficent = 1.1
        if (startAnimation.current === true) {
            if (particles.material.uniforms.uProgress.value > 0.5) {
                particles.material.uniforms.uProgress.value += delta * cooficent

                if (particles.material.uniforms.uProgress.value >= 1) {
                    particles.material.uniforms.uProgress.value = 0
                    currentSceneIndex = targetSceneIndex
                    particles.geometry.attributes.position = particles.positions[currentSceneIndex]

                    if (props.hoveredElement.current === 'hoveredLi0') {
                        targetSceneIndex = 0
                    }
                    if (props.hoveredElement.current === 'hoveredLi1') {
                        targetSceneIndex = 1
                    }
                    if (props.hoveredElement.current === 'hoveredLi2') {
                        targetSceneIndex = 2
                    }
                    if (props.hoveredElement.current === 'hoveredLi3') {
                        targetSceneIndex = 3
                    }
                    
                    particles.geometry.attributes.aPositionTarget = particles.positions[targetSceneIndex]
                    startAnimation.current = false
                    endAnimation.current = true
                }
            } else {
                particles.material.uniforms.uProgress.value -= delta * cooficent
                if (particles.material.uniforms.uProgress.value <= 0) {
                    if (props.hoveredElement.current === 'hoveredLi0') {
                        targetSceneIndex = 0
                    }
                    if (props.hoveredElement.current === 'hoveredLi1') {
                        targetSceneIndex = 1
                    }
                    if (props.hoveredElement.current === 'hoveredLi2') {
                        targetSceneIndex = 2
                    }
                    if (props.hoveredElement.current === 'hoveredLi3') {
                        targetSceneIndex = 3
                    }
                    particles.geometry.attributes.aPositionTarget = particles.positions[targetSceneIndex]
                    startAnimation.current = false
                    endAnimation.current = true
                }
            }
            letGeometrySwapRef.current = true
        }
        if (endAnimation.current === true) {
            particles.material.uniforms.uProgress.value += delta * cooficent
            if (particles.material.uniforms.uProgress.value >= 1) {
                endAnimation.current = false
            }
        }

        

        // particles.geometry.attributes.position = particles.positions[currentSceneIndex]
        // particles.geometry.attributes.aPositionTarget = particles.positions[targetSceneIndex]

    })

    return <>
    <points geometry={particles.geometry} material={particles.material} ref={pointsRef} />
    <DisplacementMesh ref={displacementMeshRef}
    // controls={controls}
    cursorWorldPositionRef={cursorWorldPositionRef}
    simpleModels={particles.simpleModels}
    />
    <mesh ref={cursorMeshRef} scale={0.1} visible={false}>
        <sphereGeometry />
        <meshBasicMaterial />
    </mesh>
    <mesh ref={prevCursorMeshRef} scale={0.1} visible={false}>
        <sphereGeometry />
        <meshBasicMaterial color={'red'}/>
    </mesh>
    <ambientLight />
    {/* <directionalLight /> */}
    </>
}