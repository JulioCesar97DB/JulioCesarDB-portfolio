import type { Palette, Pointer, Variant } from "./runtime";

/**
 * A fine dot grid. Near the pointer the dots brighten toward the accent and
 * are pushed gently outward, like a soft lens passing over the page. With no
 * pointer (touch, or the cursor elsewhere) a very slow diagonal swell keeps
 * the field faintly alive.
 */
export function createGrid(canvas: HTMLCanvasElement): Variant | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const GAP = 22; // css px between dots
  const RADIUS = 160; // pointer influence radius
  const PUSH = 7; // max displacement in px

  let w = 0;
  let h = 0;
  let dpr = 1;
  let palette: Palette | null = null;
  const touch = !window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const rgba = ([r, g, b]: [number, number, number], a: number) => `rgba(${r},${g},${b},${a.toFixed(3)})`;

  return {
    resize(width, height, ratio) {
      w = width;
      h = height;
      dpr = ratio;
    },
    setPalette(p) {
      palette = p;
    },
    draw(time, pointer: Pointer) {
      if (!palette) return false;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const base = palette.dark ? 0.42 : 0.22;
      const swell = touch && !reduced.matches;
      const r2 = RADIUS * RADIUS;
      const ox = (w % GAP) / 2;
      const oy = (h % GAP) / 2;

      for (let y = oy; y < h; y += GAP) {
        for (let x = ox; x < w; x += GAP) {
          let px = x;
          let py = y;
          let alpha = base;
          let k = 0;

          if (pointer.presence > 0) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < r2 * 2.2) {
              k = Math.exp(-d2 / r2) * pointer.presence;
              const d = Math.sqrt(d2) || 1;
              px += (dx / d) * PUSH * k;
              py += (dy / d) * PUSH * k;
            }
          }
          if (swell) {
            alpha += 0.12 * (0.5 + 0.5 * Math.sin((x + y) * 0.012 - time * 0.0006));
          }

          const size = 1.1 + 1.5 * k;
          ctx.fillStyle = rgba(palette.mark, alpha * (1 - k * 0.6));
          ctx.fillRect(px - size / 2, py - size / 2, size, size);
          if (k > 0.04) {
            ctx.fillStyle = rgba(palette.accent, Math.min(1, k * 1.4));
            ctx.fillRect(px - size / 2, py - size / 2, size, size);
          }
        }
      }
      // Keep running only while something moves.
      return swell;
    },
  };
}
