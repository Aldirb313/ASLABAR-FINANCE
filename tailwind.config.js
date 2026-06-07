/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B6B3A", // Islamic Green
          dark: "#0D4A28",
        },
        secondary: {
          DEFAULT: "#C9A84C", // Gold
          light: "#F5E6C8",
        },
        cream: "#FBF7F0",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
}
