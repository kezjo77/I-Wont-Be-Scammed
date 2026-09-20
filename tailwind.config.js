/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2537',
          light: '#1a3a52',
          dark: '#0a1a28',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#e6c653',
          dark: '#b8932b',
        },
        warmgray: {
          DEFAULT: '#F5F5F3',
          dark: '#e8e8e5',
        },
      },
    },
  },
  plugins: [],
};
