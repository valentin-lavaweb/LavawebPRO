varying vec2 vUv;
uniform vec2 uResolution;
uniform float uLiquidScale;
uniform float uY;

void main() {
    vUv = uv;
   
    vec2 center = vec2(0.5);
    vec2 liquidScaleXY = vec2(uLiquidScale, uLiquidScale);
    
    // Масштабируем uv относительно центра
    vUv = center + (vUv - center) * liquidScaleXY;
    
    // Вычисляем разницу в соотношении сторон между экраном и текстурой
    float aspectX = uResolution.x / uResolution.y;
    float aspectY = 1.0;
    
    // Если экран шире, чем текстура, то корректируем масштаб по Y
    if (aspectX > 1.0) {
        aspectY = 1.0 / aspectX;
        aspectX = 1.0;
    }
    
    // Вычисляем сдвиг по X и Y, чтобы центрировать текстуру
    float xOffset = (1.0 - aspectX) / 2.0;
    float yOffset = (1.0 - aspectY) / 2.0;
    
    // Применяем масштабирование по соотношению сторон и сдвиг
    vUv.x = vUv.x * aspectX + xOffset;
    vUv.y = vUv.y * aspectY + yOffset;
    
    // Применяем искажение к однородным координатам uv
    // gl_Position = projectedPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.z, 1.0 );
    // gl_Position = vec4( position.x, position.y, position.z, 1.0 );
}