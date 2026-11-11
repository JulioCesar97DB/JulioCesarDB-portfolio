import type { Palette, Pointer, Variant } from "./runtime";

/**
 * Drifting particles joined by hairlines when they come close (a
 * constellation). The pointer gathers nearby particles and its links light up
 * in the accent. Particle count scales with area so density stays constant.
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function createParticles(canvas: HTMLCanvasElement): Variant | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const LINK = 120; // px: max distance for a link
  const POINTER_LINK = 170;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let w = 0;
  let h = 0;
  let dpr = 1;
  let palette: Palette | null = null;
  let boost = 1;
  let particles: Particle[] = [];
  let last = 0;

  const rgba = ([r, g, b]: [number, number, number], a: number) => `rgba(${r},${g},${b},${a.toFixed(3)})`;

  const seed = () => {
    const count = Math.round(Math.min(110, (w * h) / 11000));
    particles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.08 + Math.random() * 0.12;
      return { x: Math.random() * w, y: Math.random() * h, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
    });
  };

  return {
    resize(width, height, ratio) {
      const first = w === 0;
      w = width;
      h = height;
      dpr = ratio;
      if (first || particles.length === 0) seed();
    },
    setPalette(p) {
      palette = p;
      boost = p.dark ? 1.6 : 1;
    },
    draw(time, pointer: Pointer) {
      if (!palette) return false;
      const dt = last ? Math.min(48, time - last) / 16.67 : 1;
      last = time;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const moving = !reduced.matches;
      for (const p of particles) {
        if (moving) {
          if (pointer.presence > 0) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < POINTER_LINK * POINTER_LINK) {
              const f = (1 - Math.sqrt(d2) / POINTER_LINK) * 0.012 * pointer.presence;
              p.vx += dx * f * 0.05;
              p.vy += dy * f * 0.05;
            }
          }
          // Gentle damping back toward cruising speed.
          const speed = Math.hypot(p.vx, p.vy);
          if (speed > 0.35) {
            p.vx *= 0.96;
            p.vy *= 0.96;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.22 * boost;
            ctx.strokeStyle = rgba(palette.mark, alpha);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (pointer.presence > 0) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < POINTER_LINK) {
            ctx.strokeStyle = rgba(palette.accent, (1 - d / POINTER_LINK) * 0.55 * boost * pointer.presence);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = rgba(palette.mark, Math.min(1, 0.5 * boost));
        ctx.fillRect(a.x - 1, a.y - 1, 2, 2);
      }
      return moving;
    },
  };
}
