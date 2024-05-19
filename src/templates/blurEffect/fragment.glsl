uniform sampler2D tex; // Текстура сцены
uniform sampler2D depthTex; // Текстура глубины
uniform float focus; // Расстояние фокусировки
uniform float nearFocus; // Ближний предел фокусировки
uniform float farFocus; // Дальний предел фокусировки
uniform float focusScale; // Масштаб фокуса
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float depth = texture(depthTex, uv).r; // Чтение глубины в текущей точке
    float blurAmount;

    // Определяем нужно ли размытие в зависимости от глубины
    if (depth > farFocus || depth < nearFocus) {
        blurAmount = abs(depth - focus) * focusScale; // Размытие увеличивается с расстоянием от фокуса
    } else {
        blurAmount = 0.0; // В пределах фокуса нет размытия
    }

    vec4 sum = vec4(0.0);
    float total = 0.0;
    float samples = 8.0; // Увеличим количество образцов для лучшего размытия

    // Перебор пикселей вокруг текущего для создания эффекта размытия
    for (float x = -samples / 2.0; x <= samples / 2.0; ++x) {
        for (float y = -samples / 2.0; y <= samples / 2.0; ++y) {
            float sampleWeight = 1.0 - length(vec2(x, y)) / (samples / 2.0);
            vec2 sampleUV = uv + vec2(x, y) * blurAmount;
            vec4 sampleColor = texture(tex, sampleUV);
            sum += sampleColor * sampleWeight;
            total += sampleWeight;
        }
    }

    // Вычисляем средний цвет с учётом веса каждого образца
    outputColor = sum / total;
}