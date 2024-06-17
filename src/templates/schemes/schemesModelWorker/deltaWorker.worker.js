import { expose } from 'comlink';

let currentTime = 0;

const updateTime = (delta) => {
    currentTime += delta * (Math.random() * (1.1 - 1.0) + 1.0);
    return currentTime;
};

expose({ updateTime });