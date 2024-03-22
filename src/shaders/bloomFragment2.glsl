uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform float bloomStrength;
uniform float bloomRadius;
varying vec2 vUv;

void main() {
    vec2 texelSize = 1.0 / uTextureSize;

    // Проход 1: Выделение ярких областей (поиск "маски")
    vec3 color = texture2D(uTexture, vUv).rgb;
    vec3 thresholdColor = max(color - 0.25, vec3(0.0)); // Пороговое значение для выделения ярких областей
    vec3 bloomColor = (color - thresholdColor) * bloomStrength;

    // Проход 2: Размытие блестящих областей и наложение на исходную сцену
    vec3 blurredColor = vec3(0.0);
    for(int i = -5; i <= 5; i++) {
        vec2 offset = vec2(float(i)) * texelSize;
        blurredColor += texture2D(uTexture, vUv + offset).rgb;
    }
    blurredColor /= 11.0; // Нормализация размытой текстуры

    vec3 finalColor = color + mix(bloomColor, blurredColor, bloomRadius);

    gl_FragColor = vec4(finalColor, 1.0);
}