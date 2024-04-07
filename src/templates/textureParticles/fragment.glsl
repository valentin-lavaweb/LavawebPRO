uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uCursor;
uniform vec3 uColor;
uniform sampler2D uTexture1;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;

float PI = 3.14592653589793238;

void main() {
    
    // vUv - это uv координаты всего плейна, а gl_PointCoord - это uv координаты каждого партикля
    vec2 uv = gl_PointCoord;
    // float distanceToCenter = distance(uv, vec2(0.5, 0.5)); // То же самое, но немного хуже оптимизация
    float distanceToCenter = length(uv - vec2(0.5, 0.5));
    if(distanceToCenter > 0.5) {
        discard;
    }
    
    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}