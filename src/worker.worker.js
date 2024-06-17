import * as Comlink from 'comlink';

const workerFunctions = {
  scroll({ progress, progressTo, scenes, currentScene, nextScene }) {
    console.log(progress)

    // if (progress === 0) {
    //   scenes[currentScene].scroll -= e.deltaY / scrollCoefficent;
    //   scenes[currentScene].scroll = Math.min(Math.max(scenes[currentScene].scroll, 0), 1);
    // }

    // if (scenes[currentScene].scroll === 1) {
    //   progressTo -= e.deltaY / 1000;
    // } else if (scenes[currentScene].scroll === 0 && progress === 0) {
    //   progressTo -= e.deltaY / 1000;
    // }
    
    // const result = { progress, progressTo, currentScene, nextScene, scenes };
    // console.log('Возвращаемые данные из worker:', result);
    // return result;
  },
};

Comlink.expose(workerFunctions);
