uniform sampler2D uTexture; // Оригинальная сцена
uniform sampler2D uTextureBloom; // Размытое изображение
uniform float bloomExposure; // Экспозиция
uniform float bloomThreshold; // Пороговое значение для определения ярких пикселей
varying vec2 vUv;
void main()
{             
    vec4 hdrColor = texture2D(uTexture, vUv);
    vec4 bloomColor = texture2D(uTextureBloom, vUv);
    // Применяем эффект Bloom только для ярких пикселей
    if (hdrColor.r > bloomThreshold || hdrColor.g > bloomThreshold || hdrColor.b > bloomThreshold) {
        hdrColor += bloomColor;
    }
    // Применяем экспозицию
    hdrColor *= bloomExposure;
    // Тонеотображение
    gl_FragColor = mix(bloomColor, hdrColor, 1.0);
}