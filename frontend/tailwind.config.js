/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cs: {
          bg: '#000000',
          surface: '#080808',
          card: '#0d0d0d',
          cardHover: '#141414',
          border: '#1c1c1c',
          red: '#ff2020',
          redDark: '#cc1010',
          blue: '#2563eb',
          covert: '#eb4b4b',
          classified: '#d32ce6',
          restricted: '#8847ff',
          milspec: '#4b69ff'
        }
      },
      fontFamily: {
        sans: ['Reversal', 'Inter', 'sans-serif'],
        display: ['Reversal', 'sans-serif'],
      },
      boxShadow: {
        redGlow: '0 0 20px rgba(255, 32, 32, 0.4)',
        redSoft: '0 0 12px rgba(255, 32, 32, 0.25)',
      }
    },
  },
  plugins: [],
}
