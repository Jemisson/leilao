/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        redDark: "#8B0000", // Vermelho escuro
        gold: "#D4AF37", // Dourado
        redBright: "#FF0000", // Vermelho brilhante
        beige: "#F5F5DC" // Bege
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
