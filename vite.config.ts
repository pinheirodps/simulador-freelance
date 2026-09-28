import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  base: "/simulador-freelance/",
  plugins: [vue()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});