import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
    allowedHosts: ["localhost", "whatsapp.local"],
  },
  plugins: [vue()],
  define: {
    global: 'window'
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
