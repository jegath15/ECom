/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F2C94C',
          hover: '#E0B843',
        },
        slate: {
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        gray: {
          50: '#F5F7FA', // Off-white for subtle contrasts
          200: '#E2E8F0',
          500: '#94A3B8',
          700: '#475569',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
