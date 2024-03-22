varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vertexNormal;
uniform float blurPower;
void main() 
{

    vUv = uv;
    float horizontalShift = (2.0 * fract(sin(dot(vUv.xy, vec2(12.9898, 78.233))) * 43758.5453) - 1.0) * blurPower;
    float verticalShift = (2.0 * fract(sin(dot(vUv.yx, vec2(12.9898, 78.233))) * 43758.5453) - 1.0) * blurPower;
    vUv += vec2(horizontalShift, verticalShift);
    gl_Position = vec4(position, 1.0);
}