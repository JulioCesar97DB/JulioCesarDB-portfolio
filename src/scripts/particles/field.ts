import type { Palette, Pointer, RGB, Variant } from "./runtime";

/**
 * Drifting particles joined by hairlines when they come close (a
 * constellation). The pointer gathers nearby particles and its links light up
 * in the accent. Density scales with area so it stays constant across sizes.
 *
 * Cost notes: links are bucketed into a few opacity levels and each bucket is
 * stroked as one path, so a frame issues a handful of draw calls instead of
 * one per line; dots are one path too. The runtime caps this at 30fps and
 * stops it when idle.
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const LINK = 120; // px: max distance for a link between particles
const POINTER_LINK = 140; // px: max distance for a link to the pointer
const MAX_PARTICLES = 70;
const MIN_PARTICLES = 40; // phones: area alone would give ~20, too sparse to link
const AREA_PER_PARTICLE = 16000; // px² per particle
const BUCKETS = 5; // opacity levels for batched strokes
// px the field extends past the top and bottom edges. Scrolling wraps
// particles from one edge to the other all the time; with a band one link
// long, a particle wraps only once it is too far off screen to link to
// anything visible, so no line pops in or out at the edges.
const EDGE = LINK;

export function createParticles(canvas: HTMLCanvasElement): Variant | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let w = 0;
  let h = 0;
  let dpr = 1;
  let palette: Palette | null = null;
  let boost = 1;
  let particles: Particle[] = [];
  let last = 0;
  // Slightly larger points on touch screens, where they are seen at arm's length.
  const dot = window.matchMedia("(pointer: fine)").matches ? 1.5 : 2;

  const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r},${g},${b},${a.toFixed(3)})`;
  // One reusable path per opacity bucket.
  const linkPaths: Path2D[] = [];
  const pointerPaths: Path2D[] = [];

  // Wrap a y coordinate into the band [-EDGE, h + EDGE), however far it went.
  const wrapY = (y: number) => {
    const span = h + EDGE * 2;
    return ((((y + EDGE) % span) + span) % span) - EDGE;
  };

  const seed = () => {
    const byArea = (w * h) / AREA_PER_PARTICLE;
    const onScreen = Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, byArea));
    // The off-screen bands get the same density, so what is visible is unchanged.
    const count = Math.round((onScreen * (h + EDGE * 2)) / h);
    particles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.05 + Math.random() * 0.08;
      return {
        x: Math.random() * w,
        y: Math.random() * (h + EDGE * 2) - EDGE,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      };
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
    scroll(dy) {
      for (const p of particles) p.y = wrapY(p.y + dy);
    },
    draw(time, pointer: Pointer) {
      if (!palette) return false;
      // Elapsed time in 60fps frames; a long gap (resuming from idle) counts as one frame.
      const gap = last ? time - last : 16.67;
      const dt = gap > 200 ? 1 : Math.min(3, gap / 16.67);
      last = time;

      const moving = !reduced.matches;
      if (moving) {
        for (const p of particles) {
          if (pointer.presence > 0) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < POINTER_LINK * POINTER_LINK) {
              const f = (1 - Math.sqrt(d2) / POINTER_LINK) * 0.0006 * pointer.presence;
              p.vx += dx * f * dt;
              p.vy += dy * f * dt;
            }
          }
          // Gentle damping back toward cruising speed.
          if (Math.hypot(p.vx, p.vy) > 0.3) {
            p.vx *= 0.95;
            p.vy *= 0.95;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.x < -10) p.x = w + 10;
          else if (p.x > w + 10) p.x = -10;
          p.y = wrapY(p.y);
        }
      }

      for (let b = 0; b < BUCKETS; b++) {
        linkPaths[b] = new Path2D();
        pointerPaths[b] = new Path2D();
      }
      const dots = new Path2D();
      const link2 = LINK * LINK;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < link2) {
            const strength = 1 - Math.sqrt(d2) / LINK; // 0..1
            const bucket = Math.min(BUCKETS - 1, Math.floor(strength * BUCKETS));
            linkPaths[bucket].moveTo(a.x, a.y);
            linkPaths[bucket].lineTo(b.x, b.y);
          }
        }
        if (pointer.presence > 0) {
          const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (d < POINTER_LINK) {
            const bucket = Math.min(BUCKETS - 1, Math.floor((1 - d / POINTER_LINK) * BUCKETS));
            pointerPaths[bucket].moveTo(a.x, a.y);
            pointerPaths[bucket].lineTo(pointer.x, pointer.y);
          }
        }
        dots.rect(a.x - dot / 2, a.y - dot / 2, dot, dot);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let b = 0; b < BUCKETS; b++) {
        const level = (b + 1) / BUCKETS; // bucket's upper strength
        ctx.strokeStyle = rgba(palette.mark, level * 0.2 * boost);
        ctx.stroke(linkPaths[b]);
        if (pointer.presence > 0) {
          ctx.strokeStyle = rgba(palette.accent, level * 0.32 * boost * pointer.presence);
          ctx.stroke(pointerPaths[b]);
        }
      }
      ctx.fillStyle = rgba(palette.mark, Math.min(1, 0.38 * boost));
      ctx.fill(dots);

      return moving;
    },
  };
}
