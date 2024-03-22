varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vertexNormal;
void main() 
{
    vertexNormal = normal;
    vUv = uv;
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // gl_Position = vec4(position.x, position.y, position.z + 1.0, 1.0);
    gl_Position = vec4(position, 1.0);

}