/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'telegram-blue': '#2481cc',
        'telegram-light': '#e7ebf0',
        'telegram-dark': '#1f2937',
        'telegram-gray': '#8a8a8a',
      },
      borderRadius: {
        'message': '18px',
      },
      backgroundColor: {
        'dark-bg': '#1a1a1a',
        'dark-card': '#2a2a2a',
      },
      textColor: {
        'dark-text': '#e0e0e0',
        'dark-gray': '#a0a0a0',
      },
    },
  },
  plugins: [],
}
