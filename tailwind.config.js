/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        redDark: "#3a2618", // Marrom escuro
        gold: "#d8b91f", // dourado
        redBright: "#533825", // Marrom claro
        beige: "#8e6d49" // bege
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
