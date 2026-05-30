import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    resolve: {
      alias: {
        "@cv": fileURLToPath(new URL("./cv.json", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
