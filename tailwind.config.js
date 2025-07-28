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
        redDark: "#00AEEF", // Vermelho escuro
        gold: "#FFFFFF", // Dourado
        redBright: "#EC008C", // Vermelho brilhante
        beige: "#F5F5DC", // Bege
        pinkDark: "#EC008C",
        blueBright: "#00aeef",
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
