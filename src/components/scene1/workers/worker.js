self.onmessage = function (e) {
    const pointer = e.data;
    // Выполнение вычислений для новой позиции камеры
    const newPosition = computeNewCameraPosition(pointer);
    // Отправка нового положения обратно в основной поток
    self.postMessage(newPosition);
  };
  
  function computeNewCameraPosition(pointer) {
    // Пример вычислительной функции для новой позиции камеры
    let newX = pointer.x * 2; // Преобразуем координаты указателя для демонстрации
    let newY = pointer.y * 2;
    return { x: newX, y: newY };
  }
  