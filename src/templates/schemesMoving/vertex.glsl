uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uCurvePoints[4];

attribute float aSize;
attribute vec3 positionEnd;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vStartPosition;



void main() {
    float t = mod(uTime, 1.0); // Убедитесь, что t нормализовано от 0 до 1

    vec3 pos = uCurvePoints[0] * pow(1.0 - t, 3.0) + 
               uCurvePoints[1] * 3.0 * pow(1.0 - t, 2.0) * t + 
               uCurvePoints[2] * 3.0 * (1.0 - t) * pow(t, 2.0) + 
               uCurvePoints[3] * pow(t, 3.0);
               
    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (aSize / 7.67) * uResolution.y;
}