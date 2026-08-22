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
          bg: '#0b0e14',
          surface: '#121824',
          card: '#161e2e',
          border: 'rgba(255, 255, 255, 0.08)',
          gold: '#f0b232',
          goldDark: '#c28b18',
          orange: '#e87722',
          blue: '#3d78f5',
          covert: '#eb4b4b',
          classified: '#d32ce6',
          restricted: '#8847ff',
          milspec: '#4b69ff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 20px rgba(240, 178, 50, 0.3)',
        covert: '0 0 20px rgba(235, 75, 75, 0.4)',
        glow: '0 0 15px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
