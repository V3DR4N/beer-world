/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        amber: '#E8920A',
        'amber-light': '#F7B731',
        cream: '#F5F0E8',
        navy: '#1A2340',
      },
    },
  },
  plugins: [],
}
