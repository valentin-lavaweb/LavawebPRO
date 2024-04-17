uniform float uBrightness;
uniform float uBlur;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;

float PI = 3.14592653589793238;

void main() {

    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    float alpha = uBlur / distanceToCenter - (uBlur * 2.0);
    alpha = clamp(alpha, 0.0, 1.0);
    vec3 color = uColor * (uBrightness + vPosition.x * 0.7); // Чтобы не потерять оптимизацию - мы увеличиваем uBrightness, а не uSize. 

    // Изменяем яркость на основе vColor, который теперь является фактором, переданным из вершинного шейдера
    // vec3 color = uColor * (uBrightness + vColor.x); // Усиливаем яркость на основе приближения курсора
    vec3 newColor = color;
    // vec3 newColor = vColor * color; // Добавляем vColor(это шум из vertex), если хотим рандомно затемненные цвета

    gl_FragColor = vec4(newColor, alpha);
    // gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}