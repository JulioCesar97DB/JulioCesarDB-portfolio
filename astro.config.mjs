import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// The resume's size, shown next to its download link, measured from the file
// so the label never goes stale. Empty if the file is missing.
function resumeSize() {
  try {
    const bytes = statSync(new URL("./public/resume.pdf", import.meta.url)).size;
    return bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.round(bytes / 1e3)} KB`;
  } catch {
    return "";
  }
}

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/archive": "/#work",
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      __RESUME_SIZE__: JSON.stringify(resumeSize()),
    },
    resolve: {
      alias: {
        "@cv": fileURLToPath(new URL("./cv.json", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
