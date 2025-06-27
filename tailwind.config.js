/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sophisticated earth-tone palette
        'palette': {
          'night': '#171614',      // Night - Primary dark background
          'bistre': '#3A2618',     // Bistre - Secondary dark backgrounds
          'garnet': '#754043',     // Garnet - Accent color, highlights
          'beaver': '#9A8873',     // Beaver - Text, subtle elements
          'olive': '#37423D',      // Black olive - Alternative dark, borders
        }
      }
    },
  },
  plugins: [],
} 