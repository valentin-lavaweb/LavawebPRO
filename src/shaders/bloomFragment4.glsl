precision highp float;

uniform sampler2D uTexture;     // Оригинальная сцена
uniform float bloomExposure;    // Экспозиция
uniform float bloomThreshold;   // Пороговое значение для определения ярких пикселей
uniform vec2 uTextureSize;      // Размер текстуры
varying vec2 vUv;

void main() {
    vec4 originalColor = texture2D(uTexture, vUv);
    vec3 hdrColor = originalColor.rgb;
    
    // Определение, является ли пиксель ярким
    float luminance = dot(hdrColor, vec3(0.2126, 0.7152, 0.0722));
    bool isBright = luminance > bloomThreshold;
    
    // Применение bloom только на яркие пиксели
    if (isBright) {
        // Рассчитываем яркость bloom
        vec3 bloom = hdrColor - vec3(bloomThreshold);
        bloom = max(bloom, 0.0);
        bloom *= bloomExposure;
        
        // Добавляем bloom к исходной яркости
        hdrColor += bloom;
    }
    
    // Отображаем измененный цвет на экране
    gl_FragColor = vec4(hdrColor, originalColor.a);
}