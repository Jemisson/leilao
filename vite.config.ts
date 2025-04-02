import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_BASE_URL = process.env.NODE_ENV === "production"
  ? "https://apileilao.codenova.com.br"
  : "http://localhost:3000";   

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_BASE_URL,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
