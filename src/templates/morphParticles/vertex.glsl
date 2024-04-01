uniform float uTime;
uniform float uSize;
uniform vec2 uCursor;
uniform vec2 uResolution;
uniform float uProgress;

// attribute float aSize;
// attribute float aVelocity;
// attribute float aDistance;
// attribute float aRadius;
// attribute float aAngle;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.14592653589793238;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax) {
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main() {
    vUv = uv;
    vPosition = position;
    // Final position
    vec4 modelPosition = modelMatrix * vec4(vPosition.x, vPosition.y, vPosition.z, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = (uSize) * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);
}