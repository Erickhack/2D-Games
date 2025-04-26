// widgets/Simulation/model/constants/puzzle.constants.ts

// Размеры канваса
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const CANVAS_PADDING = 50;

// Размеры кусочков пазла
export const PIECE_WIDTH = 100;
export const PIECE_HEIGHT = 100;

// Константы для физического движка
export const WORLD_SCALE = 30; // Масштаб для конвертации пикселей в физические единицы
export const PIECE_DENSITY = 1.0;
export const PIECE_FRICTION = 0.3;
export const PIECE_RESTITUTION = 0.2; // Упругость

// Допуск для проверки близости кусочка к целевой позиции
export const HINT_TOLERANCE = 30;

// Длительность показа подсказки в миллисекундах
export const HINT_DURATION = 3000;

// Сообщения
export const MESSAGES = {
  START: "Перетаскивайте кусочки пазла из нижней панели на игровое поле. Соберите полную картинку, размещая кусочки на правильных местах.",
  HINT: "Выделенный кусочек должен быть размещен на подсвеченной области игрового поля.",
  HINT_PLACED: "Найдите подсвеченную область на игровом поле и разместите там подходящий кусочек.",
  COMPLETION: {
    FAST: "Отличная работа! Вы собрали пазл очень быстро!",
    MEDIUM: "Хорошая работа! Вы собрали пазл за разумное время.",
    SLOW: "Пазл собран! Продолжайте практиковаться, чтобы улучшить свое время."
  }
};

// Изображение для пазла
export const PUZZLE_IMAGE = '/images/puzzle-image.jpg';

// Количество кусочков по горизонтали и вертикали
export const GRID_SIZE = {
  COLS: 4,
  ROWS: 3
};

// Общее количество кусочков
export const TOTAL_PIECES = GRID_SIZE.COLS * GRID_SIZE.ROWS;