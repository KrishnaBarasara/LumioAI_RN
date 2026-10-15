/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#6D28FF',
        secondary: {
          DEFAULT: '#8B5CF6',
          light: '#A855F7',
          lighter: '#C084FC',
        },
        background: '#F7F4FB',
        card: '#FFFFFF',
        text: {
          DEFAULT: '#121212',
          secondary: '#6B7280',
        },
        border: '#EAEAEA',
      },
      borderRadius: {
        card: '20px',
        lg: '24px',
        xl: '28px',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
