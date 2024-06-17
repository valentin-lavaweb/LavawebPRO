import { expose } from 'comlink';

// Функция, которая рандомно возвращает число
function range(start, end){
    let r = Math.random()
    return r * (end - start) + start
}
const get = () => {
    const number = 1000
    const positions = new Float32Array(number * 3)
    const sizes = new Float32Array(number)
    const radius = new Float32Array(number)
    // Задаем здесь значения для атрибутов, для каждого партикля
    for (let i = 0; i < number; i++) {
        let i3 = i * 3;
        const sphereRadius = 30; // радиус полусферы
        const theta = Math.PI * Math.random() * 0.58; // угол от 0 до PI/2
        const phi = 2 * Math.PI * Math.random(); // угол от 0 до 2*PI

        positions[i3] = sphereRadius * Math.sin(theta) * Math.cos(phi); // X
        positions[i3 + 1] = sphereRadius * Math.cos(theta); // Y, высота полусферы
        positions[i3 + 2] = sphereRadius * Math.sin(theta) * Math.sin(phi); // Z, глубина

        sizes[i] = range(0.01, 0.05); // размер каждого партикля
    }

    return { positions, sizes, radius };
};

expose({ get });