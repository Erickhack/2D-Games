// widgets/Simulation/lib/utils/puzzleUtils.ts
import { 
  WORLD_SCALE, 
  PIECE_WIDTH, 
  PIECE_HEIGHT, 
  CANVAS_PADDING, 
  GRID_SIZE,
  PUZZLE_IMAGE,
  HINT_TOLERANCE,
  MESSAGES,
  TOTAL_PIECES
} from '../../model/constants/puzzle.constants';
import type { PuzzlePiece } from '../../model/types/puzzle.types';

// Конвертация пикселей в физические единицы
export const pixelsToPhysics = (pixels: number): number => {
  return pixels / WORLD_SCALE;
};

// Конвертация физических единиц в пиксели
export const physicsToPixels = (physicsUnits: number): number => {
  return physicsUnits * WORLD_SCALE;
};

// Проверка, находится ли кусочек близко к целевой позиции
export const isPieceNearTarget = (piece: PuzzlePiece, tolerance: number = HINT_TOLERANCE): boolean => {
  const distanceX = Math.abs(piece.x - piece.targetX);
  const distanceY = Math.abs(piece.y - piece.targetY);
  
  return distanceX <= tolerance && distanceY <= tolerance;
};

// Создание начальных кусочков пазла
export const createInitialPieces = (): PuzzlePiece[] => {
  const pieces: PuzzlePiece[] = [];
  
  // Размеры одного кусочка в исходном изображении
  const srcPieceWidth = 800 / GRID_SIZE.COLS;
  const srcPieceHeight = 600 / GRID_SIZE.ROWS;
  
  // Создаем кусочки
  for (let row = 0; row < GRID_SIZE.ROWS; row++) {
    for (let col = 0; col < GRID_SIZE.COLS; col++) {
      const id = row * GRID_SIZE.COLS + col;
      
      // Координаты кусочка в исходном изображении
      const srcX = col * srcPieceWidth;
      const srcY = row * srcPieceHeight;
      
      // Целевые координаты кусочка на канвасе
      const targetX = CANVAS_PADDING + col * PIECE_WIDTH;
      const targetY = CANVAS_PADDING + row * PIECE_HEIGHT;
      
      // Начальные координаты в свайпере (все кусочки изначально в свайпере)
      const initialX = 0;
      const initialY = 0;
      
      pieces.push({
        id,
        x: initialX,
        y: initialY,
        width: PIECE_WIDTH,
        height: PIECE_HEIGHT,
        targetX,
        targetY,
        placed: false,
        inSwiper: true,
        image: `${PUZZLE_IMAGE}#${srcX},${srcY},${srcPieceWidth},${srcPieceHeight}`
      });
    }
  }
  
  // Перемешиваем кусочки
  return shuffleArray(pieces);
};

// Перемешивание массива (алгоритм Фишера-Йейтса)
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray;
};

// Форматирование времени в формат MM:SS
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Получение сообщения о завершении в зависимости от времени и использованных подсказок
export const getCompletionMessage = (elapsedTime: number, hintsUsed: number): string => {
  let message = '';
  
  // Базовое сообщение в зависимости от времени
  if (elapsedTime < 60) { // Меньше минуты
    message = MESSAGES.COMPLETION.FAST;
  } else if (elapsedTime < 180) { // Меньше 3 минут
    message = MESSAGES.COMPLETION.MEDIUM;
  } else {
    message = MESSAGES.COMPLETION.SLOW;
  }
  
  // Добавляем информацию о времени и подсказках
  message += ` Ваше время: ${formatTime(elapsedTime)}.`;
  
  if (hintsUsed === 0) {
    message += ' Вы не использовали подсказки!';
  } else if (hintsUsed === 1) {
    message += ' Вы использовали 1 подсказку.';
  } else {
    message += ` Вы использовали ${hintsUsed} подсказок.`;
  }
  
  return message;
};

// Расчет прогресса в процентах
export const calculateProgressPercentage = (completedCount: number): number => {
  return Math.round((completedCount / TOTAL_PIECES) * 100);
};

// Генерация уникального идентификатора
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};