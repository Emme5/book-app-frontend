/** @type {import('tailwindcss').Config} */
import aspectRatio from '@tailwindcss/aspect-ratio';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    require('flowbite/plugin')
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FF5841',
        'secondary': '#0D0842',
        'blackBG': '#828282',
        'Favorite': '#FF9500'
      },
      fontFamily: {
        'primary': ["Roboto", "sans-serif"],
        'secondary':["Faculty Glyphic", "sans-serif"]
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out'
      }
    },
  },
  plugins: [aspectRatio],
}

