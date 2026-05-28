/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Brittany Chiang v4 palette (Tailwind slate + teal), in OKLCH.
        navy: {
          DEFAULT: "oklch(0.208 0.042 265.755 / <alpha-value>)", // slate-900 #0f172a
          light: "oklch(0.279 0.041 260.031 / <alpha-value>)", // slate-800 #1e293b
          lightest: "oklch(0.372 0.044 257.287 / <alpha-value>)", // slate-700 #334155
        },
        slate: {
          DEFAULT: "oklch(0.704 0.04 256.788 / <alpha-value>)", // slate-400 #94a3b8
          light: "oklch(0.869 0.022 252.894 / <alpha-value>)", // slate-300 #cbd5e1
          lightest: "oklch(0.929 0.013 255.508 / <alpha-value>)", // slate-200 #e2e8f0
        },
        accent: "oklch(0.855 0.138 181.071 / <alpha-value>)", // teal-300 #5eead4
      },
      fontFamily: {
        sans: ["'Inter Variable'", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
