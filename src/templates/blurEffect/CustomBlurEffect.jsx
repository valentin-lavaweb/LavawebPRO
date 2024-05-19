import { Uniform } from 'three';
import fragmentShader from './fragment.glsl'
import { Effect } from "postprocessing";

export default class CustomBlurEffect extends Effect {
    constructor(props) {
        super(
            'CustomBlurEffect',
            fragmentShader,
            {
                uniforms: new Map([
                    ["tex", new Uniform(props.tex)],
                    ["depthTex", new Uniform(props.depthTex)],
                    ["focus", new Uniform(props.focus)],
                    ["nearFocus", new Uniform(props.nearFocus)],
                    ["farFocus", new Uniform(props.farFocus)],
                    ["focusScale", new Uniform(props.focusScale)],
                ])
            }
        )
    }
}