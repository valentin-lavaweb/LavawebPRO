uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    vec4 sum = vec4(0.0);
    vec2 texelSize = vec2(1.0) / vec2(textureSize(uTexture, 0));

    for(int x = -4; x <= 4; x++) {
        for(int y = -3; y <= 3; y++) {
            vec2 offset = vec2(float(x), float(y)) * texelSize;
            sum += texture2D(uTexture, vUv + offset);
        }
    }

    gl_FragColor = sum / 49.0;
    float l = length(gl_FragColor);
    gl_FragColor *= vec4(vec3(l * 3.5), 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}