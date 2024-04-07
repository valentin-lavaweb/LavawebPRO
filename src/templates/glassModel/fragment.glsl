uniform float uRefractionRatio; // Коэффициент преломления
uniform float uReflectivity; // Коэффициент отражения
uniform float uOpacity; // Коэффициент прозрачности
uniform vec4 uColor; // цвет
uniform samplerCube uEnvMap; // Карта окружения

varying vec3 vWorldPosition; // Позиция вершины в мировых координатах
varying vec3 vNormal; // Нормаль вершины

void main() {
    vec3 viewDir = normalize(vWorldPosition - cameraPosition);
    vec3 reflectDir = reflect(viewDir, vNormal);
    vec3 refractDir = refract(viewDir, vNormal, uRefractionRatio);

    // Использование refractDir для усиления эффекта искажения
    vec4 refractColor = textureCube(uEnvMap, refractDir);
    vec4 reflectColor = textureCube(uEnvMap, reflectDir);

    // Модификация выборки текстуры для создания эффекта искажения
    vec4 result = mix(refractColor, reflectColor, uReflectivity);
    result.a = uOpacity;
    result *= uColor; // Применение цветового фильтра

    gl_FragColor = result;
}