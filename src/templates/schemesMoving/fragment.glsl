uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vStartPosition;

float PI = 3.14592653589793238;

void main() {
    // Получаем цвет из текстуры по текущим координатам UV
    vec4 textureColor = texture2D(uTexture, vUv);

    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}