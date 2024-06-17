import * as THREE from 'three'
import { expose } from 'comlink';

const get = (props) => {
    const randomRange = (min, max) => Math.random() * (max - min) + min;
    const curvesArray = [];
    const curvesCount = props.vectors.objects.length
    function generateCurvePoints(index){
        let points = [];
        const pointsArray = props.vectors.objects[index].points
        for (let i = 0; i < pointsArray.length; i++) {
            points.push(new THREE.Vector3(pointsArray[i].x, pointsArray[i].y, pointsArray[i].z));
        }
        return points;
    };

    for (let i = 0; i < curvesCount; i++) {
        curvesArray.push(new THREE.CatmullRomCurve3(generateCurvePoints(i), false, 'catmullrom', 0.0));
    }


    const pointsArray = [];
    const lifesArray = [];
    const sizesArray = [];
    const particlesCount = props.particlesCount * curvesCount;
    const timeOffsets = curvesArray.map(() => randomRange(1, curvesArray.length * props.delay));

    for (let i = 0; i < particlesCount; i++) {
        const curveIndex = Math.floor(Math.random() * curvesArray.length); // случайный выбор кривой
        const curve = curvesArray[curveIndex];
        const t = i / particlesCount;
        const point = curve.getPoint(t);

        pointsArray.push(point.x + Math.random() * 0.0015, point.y + Math.random() * 0.0015, point.z + Math.random() * 0.0015);
        const lifeTimeWithOffset = i * props.speed + timeOffsets[curveIndex]; // добавляем смещение времени
        lifesArray.push(lifeTimeWithOffset);
        sizesArray.push(randomRange(2, 4));
    }
    const positions = new Float32Array(pointsArray);
    const lifes = new Float32Array(lifesArray);
    const sizes = new Float32Array(sizesArray);;

    return {positions, lifes, pointsArray, sizes}
}

expose({ get });