export // Цветовая карта
const colorMap = {
  // Базовые цвета
  white: { rgb: '255, 255, 255' },
  red: { rgb: '255, 0, 0' },
  green: { rgb: '0, 255, 0' },
  blue: { rgb: '0, 120, 255' },
  yellow: { rgb: '255, 255, 0' },
  purple: { rgb: '128, 0, 128' },

  // Оттенки белого
  warmWhite: { rgb: '255, 244, 229' },
  coolWhite: { rgb: '240, 255, 255' },
  neutralWhite: { rgb: '255, 250, 244' },

  // Пастельные тона
  pink: { rgb: '255, 182, 193' },
  lightBlue: { rgb: '173, 216, 230' },
  mint: { rgb: '152, 255, 152' },
  lavender: { rgb: '230, 230, 250' },
  peach: { rgb: '255, 218, 185' },

  // Насыщенные цвета
  orange: { rgb: '255, 165, 0' },
  magenta: { rgb: '255, 0, 255' },
  cyan: { rgb: '0, 255, 255' },
  lime: { rgb: '50, 205, 50' },
  crimson: { rgb: '220, 20, 60' },

  // Глубокие тона
  navy: { rgb: '0, 0, 128' },
  teal: { rgb: '0, 128, 128' },
  maroon: { rgb: '128, 0, 0' },
  olive: { rgb: '128, 128, 0' },
  indigo: { rgb: '75, 0, 130' },

  // Неоновые цвета
  neonPink: { rgb: '255, 20, 147' },
  neonGreen: { rgb: '57, 255, 20' },
  neonBlue: { rgb: '31, 81, 255' },
  neonOrange: { rgb: '255, 96, 0' },
  neonPurple: { rgb: '159, 0, 255' },

  // Специальные эффекты
  gold: { rgb: '255, 215, 0' },
  silver: { rgb: '192, 192, 192' },
  aqua: { rgb: '0, 255, 255' },
  coral: { rgb: '255, 127, 80' },
  turquoise: { rgb: '64, 224, 208' },

  // Приглушенные тона
  amber: { rgb: '255, 191, 0' },
  rose: { rgb: '255, 0, 128' },
  forestGreen: { rgb: '34, 139, 34' },
  skyBlue: { rgb: '135, 206, 235' },
  plum: { rgb: '221, 160, 221' },
} as const;
