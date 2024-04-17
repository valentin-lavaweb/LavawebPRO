#include ../shaders/includes/simplexNoise3D.glsl

uniform float uTime;
uniform float uSize;
uniform vec3 uCursor;
uniform vec2 uResolution;
uniform float uProgress;
uniform float uDuration;
uniform float uFrequency;

uniform vec3 uPrevCursor; // Добавьте этот uniform в начало шейдера
uniform float uCursorRadius; // Радиус реакции на курсор
uniform float uSpreadIntensity; // Интенсивоность разброса
uniform float uAlpha;

attribute vec3 aPositionTarget;
attribute float aSize;
attribute vec3 aDirection;
attribute float aRandom;
// attribute float aDistance;
// attribute float aRadius;
// attribute float aAngle;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;

float PI = 3.14592653589793238;

void main() {

    // Рассчитываем разброс в разных направлениях с использованием шума
    vec3 noiseDirection = vec3(
        simplexNoise3d(vec3(position * uFrequency + (uTime * 0.05 * aRandom * aRandom))),
        simplexNoise3d(vec3(position * uFrequency + (uTime * 0.05 * aRandom * aRandom))), // Смещаем координаты для Y
        simplexNoise3d(vec3(position * uFrequency + (uTime * 0.05 * aRandom * aRandom)))  // и Z, чтобы получить разные значения шума
    );

    // Mixed position
    float noiseStart = simplexNoise3d(position * uFrequency);
    float noiseTarget = simplexNoise3d(aPositionTarget * uFrequency);
    float noise = mix(noiseStart, noiseTarget, uProgress);

    noise = smoothstep(-1.0, 1.0, noise);
    float delay = (1.0 - uDuration) * noise;
    float end = delay + uDuration;


    float progress = smoothstep(delay, end, uProgress);
    vec3 mixedPosition = mix(position, aPositionTarget, progress);

    // Расстояние от курсора до партиклы
    float distanceToCursor = distance(uCursor, mixedPosition);
    float effectFactor = smoothstep(uCursorRadius * noise * 10.0, 0.0, distanceToCursor);

    // Вычисление фактора влияния курсора
    float cursorEffect = smoothstep(uCursorRadius, 0.0, distanceToCursor);

    // Дополнительное хаотичное движение
    vec3 chaoticMovement = noiseDirection * 0.1 + noise *0.1; // Множитель хаоса, можно регулировать
    // chaoticMovement = clamp(chaoticMovement, -2.0, 2.0);

    // Разброс в разных направлениях
    vec3 spreadMovement = aDirection * effectFactor * uSpreadIntensity * chaoticMovement; // aRandom добавляет вариативность
    // spreadMovement = clamp(spreadMovement, -3.0, 3.0);

    mixedPosition += vec3(spreadMovement.x, spreadMovement.y, spreadMovement.z);
    // mixedPosition += chaoticMovement;

    // float effectFactor = (1.0 - smoothstep(0.0, uCursorRadius, distanceToCursor));

    // Разброс в разных направлениях
    // vec3 spreadMovement = aDirection * effectFactor * uSpreadIntensity * aRandom;

    // Умножаем на noiseDirection Если хотим получить движение партиклей
    // spreadMovement *= noiseDirection;


    // Применяем positionMovement к mixedPosition
    // mixedPosition += vec3(spreadMovement.x, spreadMovement.y, spreadMovement.z);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixedPosition.x, mixedPosition.y, mixedPosition.z, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;


    // Point size
    gl_PointSize = aSize * uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Send varyings to fragment
    vUv = uv;
    vPosition = mixedPosition;
    // vColor = vec3(noise);
    // Передаем влияние курсора в фрагментный шейдер
    vColor = vec3(cursorEffect);  // Уже определено как varying vec3 vColor;
}