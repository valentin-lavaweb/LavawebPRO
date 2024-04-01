uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uCursor;
uniform sampler2D uTexture1;

varying vec2 vUv;
varying vec3 vPosition;
varying float vDistance;
varying float vVelocity;
varying float vRadius;
varying vec3 vStartPosition;

float PI = 3.14592653589793238;

void main() {
    // Рассчитываем расстояние от текущей позиции до стартовой позиции
    float distanceToStartPosition = distance(vPosition.xy, vStartPosition.xy);
    float transparency = 0.0;
    transparency = smoothstep(0.0, 1.0, distanceToStartPosition);

    // Прозрачность в зависимости от расстояния до центра круга
    // transparency += mix(1.0, 0.0, smoothstep(0.0, 0.05, distanceToStartPosition));
    // transparency += mix(1.0, 0.3, smoothstep(0.999, 0.989, distanceToStartPosition));

    // Ограничиваем прозрачность в диапазоне от 0.0 до 1.0
    // transparency = clamp(transparency, 0.0, 1.0);


    vec3 newColor = vec3(0.0, 1.0, 9.0);
    // newColor.g = smoothstep(0.2, 2.0, distanceToStartPosition - vRadius);
    // newColor.b = smoothstep(0.0, 10.0, (distanceToStartPosition - vRadius));
    vec4 result = vec4(newColor, transparency);
    // vec4 textureColor = texture2D(uTexture1, )
    

    // gl_FragColor = vec4(1.0, 1.0, blueValue, transparency);
    gl_FragColor = result;

    #include <tonemapping_fragment>
    #include <encodings_fragment>
}