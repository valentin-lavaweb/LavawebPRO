#include ../shaders/includes/simplexNoise3D.glsl

uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;
uniform vec3 uColor;
uniform float uGlowIntensity;
uniform float uSize;
uniform float uTime;
uniform vec2 uCursor;
uniform vec2 uResolution;

attribute float aIntensity;
attribute float aDirectionMove;
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

    // Varyings
    vPosition = position;

    // Меняем позицию
    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);
    vec3 displacement = vec3(
        cos(aDirectionMove),
        sin(aDirectionMove),
        0.0
        );
    displacement = normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= aIntensity;
    displacement *= 0.25;
    // displacement *= aDirectionMove;

    vPosition += displacement;

    // Picture
    float pictureIntensity = texture(uPictureTexture, uv).r;
    pictureIntensity *= uGlowIntensity;


    // Final position
    vec4 modelPosition = modelMatrix * vec4(vPosition.x, vPosition.y, vPosition.z, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;


    // Point size
    gl_PointSize = uSize * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Send varyings to fragment
    vUv = uv;
    vColor = vec3(pow(pictureIntensity, 3.0));
    vColor *= uColor;
    // vColor = smoothstep(0.0, 1.0, vColor);
}