import { expose } from 'comlink';

const get = (props) => {
    const positions = new Float32Array(props.count * 6);
    const lengths = new Float32Array(props.count * 2);


    for (let i = 0; i < props.count; i++) {
        const x = (Math.random() - 0.5) * props.xScale;
        const y = Math.random() * 220 * props.speedScale * 2 - 20;
        const z = (Math.random() - 0.5) * props.zScale + props.zPosition;
        const length = Math.random() * (1.25 * props.lengthScale - 0.05) + 0.05;

        positions.set([x, y, z, x, y - length, z], i * 6);
        lengths.set([0.0, 1.0], i * 2);
    }

    return { positions, lengths };
}


let uTime = 0;

const updateUniformTime = (delta) => {
    uTime += delta;
    if (uTime > 4) {
        uTime = 0;
    }
    return uTime;
};

expose({ get, updateUniformTime });