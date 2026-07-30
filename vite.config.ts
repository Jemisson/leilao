import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const BACKEND_BASE_URL = process.env.NODE_ENV === "production"
  ? "https://api.leiloescapuci.com.br"
  : "http://localhost:3000";

const FRONTEND_BASE_URL = process.env.VITE_FRONTEND_BASE_URL || "http://localhost:5173";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: BACKEND_BASE_URL,
        changeOrigin: true,
      },
      "/compartilhar/produto": {
        target: BACKEND_BASE_URL,
        changeOrigin: true,
        autoRewrite: true,
        selfHandleResponse: true,
        rewrite: (path) =>
          path.replace(
            /^\/compartilhar\/produto\/([^/?#]+)/,
            "/share/products/$1"
          ),
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes, _request, response) => {
            const location = proxyRes.headers.location;

            if (location) {
              proxyRes.headers.location = location
                .replace(BACKEND_BASE_URL, FRONTEND_BASE_URL)
                .replace("https://api.leiloescapuci.com.br", FRONTEND_BASE_URL)
                .replace("http://localhost:3000", FRONTEND_BASE_URL);
            }

            const chunks: Buffer[] = [];

            proxyRes.on("data", (chunk: Buffer) => {
              chunks.push(chunk);
            });

            proxyRes.on("end", () => {
              const contentType = proxyRes.headers["content-type"] || "";
              const body = Buffer.concat(chunks);

              if (!String(contentType).includes("text/html")) {
                response.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
                response.end(body);
                return;
              }

              const rewrittenBody = body
                .toString("utf-8")
                .replaceAll(BACKEND_BASE_URL, FRONTEND_BASE_URL)
                .replaceAll("https://api.leiloescapuci.com.br", FRONTEND_BASE_URL)
                .replaceAll("http://localhost:3000", FRONTEND_BASE_URL);

              proxyRes.headers["content-length"] = String(Buffer.byteLength(rewrittenBody));

              response.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
              response.end(rewrittenBody);
            });
          });
        },
      },
      "/share/products": {
        target: BACKEND_BASE_URL,
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            const location = proxyRes.headers.location;

            if (!location) return;

            proxyRes.headers.location = location
              .replace(BACKEND_BASE_URL, FRONTEND_BASE_URL)
              .replace("https://api.leiloescapuci.com.br", FRONTEND_BASE_URL)
              .replace("http://localhost:3000", FRONTEND_BASE_URL);
          });
        },
      },
    },
  },
});
