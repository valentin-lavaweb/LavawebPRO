uniform sampler2D uTexture;
uniform vec2 uTextureSize; // Размер текстуры
uniform float threshold; // Пороговое значение для определения ярких пикселей
uniform float blurPower; // Степень размытия
varying vec2 vUv;
varying vec3 vertexNormal;

void main() {             
    vec3 color = texture2D(uTexture, vUv).rgb;
    
    // Вычисляем яркость пикселя как среднее значение его компонентов
    float brightness = (color.r + color.g + color.b) / 3.0;
    
    // Если яркость пикселя превышает порог, применяем размытие
    if (brightness > threshold) {
        vec3 blurredColor = vec3(0.0);
        float blurSize = 1.0 / uTextureSize.x * blurPower; // Размер размытия
        
        // Применяем размытие в горизонтальном направлении
        for (float i = -2.0; i <= 2.0; i += 0.5) {
            blurredColor += texture2D(uTexture, vUv + vec2(i * blurSize, 0.0)).rgb;
        }
        blurredColor /= 10.0; // Количество семплов

        // Применяем размытие в вертикальном направлении
        for (float i = -2.0; i <= 2.0; i += 0.5) {
            blurredColor += texture2D(uTexture, vUv + vec2(0.0, i * blurSize)).rgb;
        }
        blurredColor /= 10.0; // Количество семплов

        gl_FragColor = vec4(blurredColor, 1.0);
    } else {
        gl_FragColor = vec4(color, 1.0); // Используем исходный цвет для черных пикселей
    }
}
