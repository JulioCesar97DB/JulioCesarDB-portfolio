import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@cv": fileURLToPath(new URL("./cv.json", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
