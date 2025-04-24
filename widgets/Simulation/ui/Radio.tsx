import React, { useRef, useEffect, useState, useCallback } from 'react';

const CANVAS_WIDTH = 1400;
const CANVAS_HEIGHT = 1008;

// Предзагрузка изображений для избежания мерцания
const preloadImages = () => {
  const images = {
    radio: new Image(),
    tuner1: new Image(),
    tuner2: new Image(),
    tuner3: new Image(),
    pointer: new Image(),
  };

  images.radio.src = '/radio/Radio.svg';
  images.tuner1.src = '/radio/tuner.svg';
  images.tuner2.src = '/radio/tuner.svg';
  images.tuner3.src = '/radio/tuner.svg';
  images.pointer.src = '/radio/pointer.svg';

  return images;
};

export const Radio = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<{
    [name: string]: HTMLImageElement;
  } | null>(null);
  const imagesLoadedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const [pointerPosition, setPointerPosition] = useState(500);
  const [tuner1Angle, setTuner1Angle] = useState(0);
  const [tuner2Angle, setTuner2Angle] = useState(0);
  const [tuner3Angle, setTuner3Angle] = useState(0);

  useEffect(() => {
    imagesRef.current = preloadImages();
  }, []);

  // Функция для генерации параметров волны на основе положения тюнеров
  const getWaveParameters = useCallback(() => {
    // Нормализуем углы в диапазон 0-360
    const normalizeAngle = (angle: number) => {
      let normalized = angle % 360;
      if (normalized < 0) normalized += 360;
      return normalized;
    };

    const angle1 = normalizeAngle(tuner1Angle);
    const angle2 = normalizeAngle(tuner2Angle);
    const angle3 = normalizeAngle(tuner3Angle);

    // Преобразуем углы в параметры волны
    // Первый тюнер контролирует амплитуду первой гармоники
    const amplitude1 = Math.sin((angle1 * Math.PI) / 180) * 50; // Амплитуда ±50px

    // Второй тюнер контролирует амплитуду второй гармоники
    const amplitude2 = Math.sin((angle2 * Math.PI) / 180) * 30; // Амплитуда ±30px

    // Третий тюнер контролирует частоту волны
    const frequency = 1 + Math.abs(Math.sin((angle3 * Math.PI) / 180) * 5); // Частота от 1 до 6

    return {
      baseY: 277, // Базовая Y-координата линии
      amplitude1,
      amplitude2,
      frequency,
    };
  }, [tuner1Angle, tuner2Angle, tuner3Angle]);

  // Функция для рисования повернутого изображения
  const drawRotatedImage = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      image: HTMLImageElement,
      x: number,
      y: number,
      width: number,
      height: number,
      degrees: number,
    ) => {
      ctx.save();
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(image, -width / 2, -height / 2, width, height);
      ctx.restore();
    },
    [],
  );

  // Обработчик вращения тюнеров
  const handleTunerRotation = useCallback(
    (
      e: MouseEvent,
      tunerX: number,
      tunerY: number,
      tunerSize: number,
      setAngle: React.Dispatch<React.SetStateAction<number>>,
    ) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const centerX = tunerX + tunerSize / 2;
      const centerY = tunerY + tunerSize / 2;
      const distance = Math.sqrt(
        Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2),
      );

      if (distance <= tunerSize / 2) {
        const angle =
          (Math.atan2(mouseY - centerY, mouseX - centerX) * 180) / Math.PI;
        setAngle(angle + 90);
      }
    },
    [],
  );

  // Функция отрисовки всего содержимого
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Проверяем загрузку изображений
    const images = imagesRef.current;
    if (!images) return;

    const allImagesLoaded =
      images.radio.complete &&
      images.tuner1.complete &&
      images.tuner2.complete &&
      images.tuner3.complete &&
      images.pointer.complete;

    if (!allImagesLoaded && !imagesLoadedRef.current) {
      // Если изображения не загружены, пробуем снова через requestAnimationFrame
      animationFrameRef.current = requestAnimationFrame(drawCanvas);
      return;
    }

    imagesLoadedRef.current = true;

    // Очищаем canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Получаем параметры волны на основе положения тюнеров
    const waveParams = getWaveParameters();

    // Рисуем волнистую линию
    ctx.beginPath();
    ctx.strokeStyle = '#047EFD';
    ctx.lineWidth = 2;

    // Используем кривую Безье для плавной волны
    const segments = 100; // Количество сегментов для плавности
    const width = CANVAS_WIDTH;

    // Начинаем путь
    ctx.moveTo(0, waveParams.baseY);

    // Рисуем волну с помощью множества маленьких линий
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;

      // Комбинируем две гармоники с разными частотами
      const y =
        waveParams.baseY +
        waveParams.amplitude1 *
          Math.sin((x / width) * Math.PI * 2 * waveParams.frequency) +
        waveParams.amplitude2 *
          Math.sin((x / width) * Math.PI * 4 * waveParams.frequency);

      ctx.lineTo(x, y);
    }

    ctx.stroke();

    // Координаты и размеры радио
    const radioX = 191;
    const radioY = CANVAS_HEIGHT - (398 + 37);
    const radioWidth = 1018;
    const radioHeight = 398;

    // Рисуем основное изображение радио
    ctx.drawImage(images.radio, radioX, radioY, radioWidth, radioHeight);

    // Рассчитываем позиции тюнеров
    const tunerSize = 130;
    const tunerY = radioY + radioHeight * 0.75;

    // Рисуем тюнеры с поворотом
    const tuner1X = radioX + radioWidth * 0.161 - tunerSize / 2;
    const tuner1Y = tunerY - tunerSize / 1.9;
    drawRotatedImage(
      ctx,
      images.tuner1,
      tuner1X,
      tuner1Y,
      tunerSize,
      tunerSize,
      tuner1Angle,
    );

    const tuner2X = radioX + radioWidth * 0.49 - tunerSize / 2;
    const tuner2Y = tunerY - tunerSize / 1.9;
    drawRotatedImage(
      ctx,
      images.tuner2,
      tuner2X,
      tuner2Y,
      tunerSize,
      tunerSize,
      tuner2Angle,
    );

    const tuner3X = radioX + radioWidth * 0.817 - tunerSize / 2;
    const tuner3Y = tunerY - tunerSize / 1.9;
    drawRotatedImage(
      ctx,
      images.tuner3,
      tuner3X,
      tuner3Y,
      tunerSize,
      tunerSize,
      tuner3Angle,
    );

    // Рисуем указатель
    const pointerWidth = 16;
    const pointerHeight = 165;
    ctx.drawImage(
      images.pointer,
      pointerPosition - pointerWidth / 2,
      radioY + radioHeight * 0.31 - pointerHeight / 2,
      pointerWidth,
      pointerHeight,
    );
  }, [
    pointerPosition,
    tuner1Angle,
    tuner2Angle,
    tuner3Angle,
    drawRotatedImage,
    getWaveParameters,
  ]);

  // Эффект для инициализации canvas и обработчиков событий
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Устанавливаем размер canvas
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Запускаем отрисовку
    drawCanvas();

    // Обработчик для вращения тюнеров
    const handleMouseDown = (e: MouseEvent) => {
      const tunerSize = 130;
      const radioX = 191;
      const radioY = CANVAS_HEIGHT - (398 + 37);
      const radioWidth = 1018;
      const radioHeight = 398;
      const tunerY = radioY + radioHeight * 0.75;

      // Координаты тюнеров
      const tuner1X = radioX + radioWidth * 0.161 - tunerSize / 2;
      const tuner1Y = tunerY - tunerSize / 1.9;

      const tuner2X = radioX + radioWidth * 0.49 - tunerSize / 2;
      const tuner2Y = tunerY - tunerSize / 1.9;

      const tuner3X = radioX + radioWidth * 0.817 - tunerSize / 2;
      const tuner3Y = tunerY - tunerSize / 1.9;

      // Проверяем, на какой тюнер кликнули
      handleTunerRotation(e, tuner1X, tuner1Y, tunerSize, setTuner1Angle);
      handleTunerRotation(e, tuner2X, tuner2Y, tunerSize, setTuner2Angle);
      handleTunerRotation(e, tuner3X, tuner3Y, tunerSize, setTuner3Angle);
    };

    // Добавляем обработчик события
    canvas.addEventListener('mousedown', handleMouseDown);

    // Очистка при размонтировании
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawCanvas, handleTunerRotation]);

  // Эффект для перерисовки при изменении состояний
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas, pointerPosition, tuner1Angle, tuner2Angle, tuner3Angle]);

  // Функция для перемещения указателя при клике
  const handlePointerMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Ограничиваем движение указателя в пределах радио
    const radioX = 191;
    const radioWidth = 1018;
    const minX = radioX + 100; // Минимальная позиция (левый край шкалы)
    const maxX = radioX + radioWidth - 100; // Максимальная позиция (правый край шкалы)

    if (x >= minX && x <= maxX) {
      setPointerPosition(x);
    }
  };

  return (
    <div className="flex justify-center">
      <canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={canvasRef}
        className="rounded-[24px] bg-[#F0F0F0]"
        onClick={handlePointerMove}
      />
    </div>
  );
};
