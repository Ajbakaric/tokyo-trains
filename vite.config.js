import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Dev-only proxy to bypass CORS locally
      "/metro": {
        target: "https://service.api.metro.tokyo.lg.jp",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/metro/, ""),
      },
    },
  },
});
