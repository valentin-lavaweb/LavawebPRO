uniform float uTime;
uniform float uSize;
uniform vec2 uResolution;
uniform vec2 uCursor;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.14592653589793238;

void main() {

    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    float alpha = 0.005 / distanceToCenter - (0.005 * 2.0);
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(1.0, 1.0, 3.0, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}