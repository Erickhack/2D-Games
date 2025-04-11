// Типы транспортных средств и колес
type VehicleType = 'car' | 'truck';
type WheelType = 'normal' | 'caterpillar';
type TerrainType = 'asphalt' | 'sand';

// Добавляем тип для декоративных элементов
type DecorationItem = {
  x: number; // позиция x относительно центра транспорта
  y: number; // позиция y относительно центра транспорта
  w: number; // ширина
  h: number; // высота
  image: string; // путь к изображению
  angle?: number; // опциональный угол поворота (в радианах)
};

// Обновляем существующие типы
type WheelConfig = {
  radius: number;
  scale: number;
  density: number;
  friction: number;
  restitution: number;
  positions: { x: number; y: number }[];
  motorTorque: number;
  motorSpeed: number;
  imagePath: string;
  decoration?: DecorationItem[]; // Добавляем опциональное поле для декораций
};

export type { VehicleType, TerrainType, WheelType };

// Конфигурация симуляции - все настройки в одном месте
export const CONFIG = {
  // Общие настройки
  canvas: {
    width: 1400,
    height: 706,
    backgroundImage: 'tractor/images/background.png', // Добавляем путь к фону здесь
  },
  physics: {
    gravity: 97,
    timeStep: 1 / 60,
    velocityIterations: 8,
    positionIterations: 3,
  },

  // Настройки транспорта
  vehicle: {
    car: {
      width: 312,
      height: 177,
      scale: 1, // Меньше значение = больше размер
      density: 1.0,
      friction: 0.3,
      restitution: 0.2, // Упругость
      position: { x: 1 / 4, y: 1 / 2 }, // Доля от размеров холста
      imagePath: 'tractor/images/car-body.png',
    },
    truck: {
      width: 457,
      height: 220,
      scale: 1, // Больше размер для грузовика
      density: 1.5, // Тяжелее
      friction: 0.4,
      restitution: 0.1,
      position: { x: 1 / 4, y: 1 / 2 },
      imagePath: 'tractor/images/track-vehicle.png',
    },
  },

  // Настройки колес - увеличиваем крутящий момент и скорость
  wheel: {
    normal: {
      radius: 50,
      scale: 1,
      density: 0.8,
      friction: 0.9, // Хорошее сцепление на асфальте // Увеличиваем трение для лучшего сцепления
      sandFriction: 0.3, // Плохое сцепление на песке
      restitution: 0.1,
      // Позиции колес относительно центра транспорта (в долях от размера транспорта)
      positions: [
        { x: -1 / 4, y: 1 / 1.8 }, // Левое колесо
        { x: 1 / 5, y: 1 / 1.8 }, // Правое колесо
      ],
      motorTorque: 150.0, // Увеличиваем крутящий момент для лучшего движения
      motorSpeed: 3.0, // Увеличиваем скорость вращения
      imagePath: 'tractor/images/normal-wheel.png',
      decoration: [],
    },
    caterpillar: {
      radius: 44,
      scale: 1,
      density: 1.2, // Тяжелее
      friction: 1.0, // Максимальное сцепление на асфальте // Максимальное сцепление для гусениц
      sandFriction: 0.8, // Хорошее сцепление на песке
      restitution: 0.05,
      // Позиции колес относительно центра транспорта (в долях от размера транспорта)
      positions: [
        { x: -1.45 / 4, y: 1.2 / 2 }, // Левое колесо
        { x: -0.45 / 4, y: 1.2 / 2 }, // Правое колесо
        { x: 0.45 / 4, y: 1.2 / 2 }, // Правое колесо
        { x: 1.45 / 4, y: 1.2 / 2 }, // Правое колесо
      ],
      motorTorque: 200.0, // Еще больше крутящий момент для гусениц
      motorSpeed: 25.0, // Быстрее, чем было
      imagePath: 'tractor/images/caterpillar-wheel.png',
      decoration: [
        {
          x: 0,
          y: 1.2 / 2,
          w: 429,
          h: 91,
          image: 'tractor/images/track-wheel.png',
          angle: 0,
        },
      ],
    },
  },

  // Настройки поверхностей - увеличиваем трение
  terrain: {
    asphalt: {
      friction: 1.0,
      color: 'transparent',
      height: 15,
      positionY: 510, // Добавляем новый параметр для позиции Y (меньшее значение = выше)
    },
    sand: {
      friction: 0.3, // Низкое трение для песка
      restitution: 0.1, // Низкая упругость
      density: 0.8, // Плотность частиц
      color: '#F2D16B', // Цвет песка
      particleRadius: 3, // Радиус частиц песка
      particleCount: 300, // Количество частиц
      positionX: 700, // Начальная X-координата зоны с песком
      width: 400, // Ширина зоны с песком
      positionY: 510 - 100, // Верхняя граница песка (совпадает с верхней границей асфальта)
      depth: 40, // Глубина слоя песка
    },
  },

  // Настройки симуляции
  simulation: {
    // Настройки для отладки
    debug: {
      showInfo: true, // Показывать отладочную информацию
      showTerrainLabels: true, // Показывать названия поверхностей
    },
    // Настройки для управления
    controls: {
      leftKey: 'ArrowLeft',
      rightKey: 'ArrowRight',
      forwardKey: 'ArrowUp', // Добавляем клавишу для движения вперед
      backwardKey: 'ArrowDown', // Добавляем клавишу для движения назад
      // Скорости движения в разных направлениях (множители для базовой скорости)
      forwardSpeedMultiplier: 1.0,
      backwardSpeedMultiplier: 0.7, // Назад обычно медленнее
      horizontalForceMultiplier: 30.0, // Увеличиваем множитель силы для бокового движения
    },
  },
};
