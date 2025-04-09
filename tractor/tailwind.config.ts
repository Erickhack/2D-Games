import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,tsx,ts,js}'],
  theme: {
    extend: {
      colors: {
        blue: '#1fb6ff',
        purple: '#7e5bef',
        pink: '#ff49db',
        orange: '#ff7849',
        green: '#13ce66',
        yellow: '#ffc82c',
        'gray-dark': '#273444',
        gray: '#8492a6',
        'gray-light': '#d3dce6',
        // Добавленный цвет
        neon: '#39ff14',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        'custom-1':
          '0px 20px 25px -5px rgba(161, 161, 161, 0.04), 0px 10px 10px -5px rgba(161, 161, 161, 0.04)',
      },
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      // Новые стили
      fontSize: {
        'mega': '6rem', // Огромный текст
      },
      borderWidth: {
        'thick': '10px', // Толстая граница
      },
      backgroundColor: {
        'danger': '#ff0000', // Красный фон для проверки
      },
    },
  },
  plugins: [],
};

export default config;
