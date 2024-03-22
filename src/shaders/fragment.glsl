uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
void main() 
{
    vec4 t = texture2D(uTexture1, vUv);
    vec4 t1 = texture2D(uTexture2, vUv);
    // float sweep = step(vUv.y / 1.2, uProgress - 0.1);
    // Calculate diagonal gradient
    float diagonal = (vUv.y / 1.45) - (vUv.x * 0.15);
    float sweep = step(diagonal, uProgress - 0.225);

    vec4 finalTexture = mix(t, t1, sweep);

    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    gl_FragColor = finalTexture;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}