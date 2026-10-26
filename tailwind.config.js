/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#07090E',
        cardBg: '#111827',
        cardBorder: '#1F2937',
        cyanAccent: '#06B6D4',
      },
    },
  },
  plugins: [],
}