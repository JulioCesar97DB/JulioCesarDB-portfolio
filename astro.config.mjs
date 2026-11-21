import { execFileSync } from "node:child_process";
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

// The commit this build was made from, published in /version.json so the
// deployment check can tell when the live site serves a given push. Amplify
// sets AWS_COMMIT_ID to the full SHA, or to "HEAD" on a rebuild; anything that
// is not a full SHA falls through to git. "unknown" never matches a commit, so
// a build that cannot tell its commit can never pass the check.
function buildCommit() {
  const fromAmplify = process.env.AWS_COMMIT_ID ?? "";
  if (/^[0-9a-f]{40}$/i.test(fromAmplify)) return fromAmplify.toLowerCase();
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "unknown";
  }
}

// https://astro.build/config
export default defineConfig({
  site: "https://www.juliocesardb.com",
  // The stylesheet is small enough to ship inside the HTML, which removes
  // the one render-blocking request.
  build: {
    inlineStylesheets: "always",
  },
  redirects: {
    "/archive": "/#work",
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      __RESUME_SIZE__: JSON.stringify(resumeSize()),
      __BUILD_COMMIT__: JSON.stringify(buildCommit()),
    },
    resolve: {
      alias: {
        "@cv": fileURLToPath(new URL("./cv.json", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
