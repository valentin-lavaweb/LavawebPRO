import { shaderMaterial } from "@react-three/drei";

export const TransitionMaterial = shaderMaterial(
  {
    progression: undefined,
    tex: undefined,
    tex2: undefined,
    transition: 1.0,
    darkness: 0.0,
  },
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      // gl_Position = vec4(position, 1.0);
    }`,
  /*glsl*/ ` 
    varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform float progression;
    uniform float darkness;
    uniform int transition;

   

    void main() {
      vec4 t = texture2D(tex, vUv);
      vec4 t1 = texture2D(tex2, vUv);
      // float sweep = step(vUv.y / 1.2, progression - 0.1);
      // Calculate diagonal gradient
      float diagonal = (vUv.y / 1.45) - (vUv.x * 0.15);
      float sweep = step(diagonal, progression - 0.225);
  
      vec4 finalTexture = mix(t, t1, sweep);
      finalTexture.rgb *= darkness;
  
      // gl_FragColor = vec4(vUv, 0.0, 1.0);
      gl_FragColor = finalTexture;
  
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
  }`
);