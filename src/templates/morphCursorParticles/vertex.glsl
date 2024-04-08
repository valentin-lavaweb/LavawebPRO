#include ../shaders/includes/simplexNoise3D.glsl

uniform float uTime;
uniform float uSize;
uniform vec2 uCursor;
uniform vec2 uResolution;
uniform float uProgress;
uniform float uDuration;
uniform float uFrequency;

uniform float uMoveIntensity; // Интенсивность движения
uniform float uRadius; // Радиус реакции на курсор
uniform float uMinDistance;
uniform float uGeometryWidth;
uniform float uGeometryHeight;

attribute vec3 aPositionTarget;
attribute float aSize;
attribute vec3 aDirection;
// attribute float aDistance;
// attribute float aRadius;
// attribute float aAngle;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;

float PI = 3.14592653589793238;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax) {
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main() {

    // Mixed position
    float noiseStart = simplexNoise3d(position * uFrequency);
    float noiseTarget = simplexNoise3d(aPositionTarget * uFrequency);
    float noise = mix(noiseStart, noiseTarget, uProgress);

    noise = smoothstep(-1.0, 1.0, noise);
    float delay = (1.0 - uDuration) * noise;
    float end = delay + uDuration;

    float progress = smoothstep(delay, end, uProgress);
    vec3 mixedPosition = mix(position, aPositionTarget, progress);

    // Нормализация и масштабирование позиции курсора
    vec2 normalizedCursorPosition = (uCursor + 1.0) / 2.0; // Преобразование к диапазону 0..1
    normalizedCursorPosition.x = normalizedCursorPosition.x * uGeometryWidth - (uGeometryWidth / 2.0);
    normalizedCursorPosition.y = normalizedCursorPosition.y * uGeometryHeight - (uGeometryHeight / 2.0);

    vec4 worldPosition = modelMatrix * vec4(mixedPosition, 1.0);

    // Вычисление смещения на основе расстояния до курсора
    float distance = distance(worldPosition.xy, normalizedCursorPosition);
    float moveThreshold = max(uGeometryWidth, uGeometryHeight) / 10.0;

    if(distance < moveThreshold) {
        // Разлет партиклов в случайных направлениях
        mixedPosition += aDirection * (moveThreshold - distance) * uMoveIntensity;
    }

    vec4 finalWorldPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * finalWorldPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Final position
    // vec4 modelPosition = modelMatrix * vec4(mixedPosition.x, mixedPosition.y, mixedPosition.z, 1.0);
    // vec4 viewPosition = viewMatrix * modelPosition;
    // vec4 projectedPosition = projectionMatrix * viewPosition;
    // gl_Position = projectedPosition;


    // Point size
    gl_PointSize = aSize * uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Send varyings to fragment
    vUv = uv;
    vPosition = mixedPosition;
    vColor = vec3(noise);
}