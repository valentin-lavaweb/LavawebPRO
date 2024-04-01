uniform float refractionRatio; // Коэффициент преломления
uniform float reflectivity; // Коэффициент отражения
uniform float opacity; // Коэффициент прозрачности
uniform samplerCube envMap; // Карта окружения

varying vec3 vWorldPosition; // Позиция вершины в мировых координатах
varying vec3 vNormal; // Нормаль вершины

void main() {
    vec3 viewDir = normalize(vWorldPosition - cameraPosition); // Направление взгляда
    vec3 reflectDir = reflect(viewDir, vNormal); // Направление отражения
    vec3 refractDir = refract(viewDir, vNormal, refractionRatio); // Направление преломления

    vec4 reflectColor = textureCube(envMap, reflectDir);
    vec4 refractColor = textureCube(envMap, refractDir);
    vec4 result = mix(refractColor, reflectColor, reflectivity);
    result.a = opacity;

    gl_FragColor = result;
}