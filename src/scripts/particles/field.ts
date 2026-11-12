import type { Palette, Pointer, RGB, Variant } from "./runtime";

/**
 * Drifting particles joined by hairlines when they come close (a
 * constellation). The pointer gathers nearby particles and its links light up
 * in the accent. Density scales with area so it stays constant across sizes.
 *
 * Depth: every particle has a z from 0 (far) to 1 (near). Nearer ones are
 * larger and brighter, drift faster and travel faster with the page scroll,
 * so scrolling reads as layers at different distances instead of one sheet.
 * Links only join particles at similar depths: those keep pace with each
 * other while the page scrolls, so the lines hold instead of flickering.
 *
 * Cost notes: links are bucketed into a few opacity levels and each bucket is
 * stroked as one path, so a frame issues a handful of draw calls instead of
 * one per line; dots are batched by depth level the same way. The runtime
 * caps this at 30fps (display rate while scrolling) and stops it when idle.
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Depth, 0 far .. 1 near. */
  z: number;
  /** Share of the scroll speed it travels at on screen. */
  follow: number;
  /** Dot radius in CSS px. */
  r: number;
  /** Opacity level its dot is filled with. */
  dotLevel: number;
}

const LINK = 120; // px: max distance for a link between particles
const POINTER_LINK = 140; // px: max distance for a link to the pointer
// Only particles at similar depths link, which spreads the links thinner than
// in a flat field, so the field carries more particles to keep the same web.
const MAX_PARTICLES = 90;
const MIN_PARTICLES = 50; // phones: area alone would give ~20, too sparse to link
const AREA_PER_PARTICLE = 16000; // px² per particle
const BUCKETS = 5; // opacity levels for batched strokes
const DOT_LEVELS = 4; // opacity levels for batched dots, by depth
// Scroll parallax: the far layer travels at FOLLOW_FAR of the scroll speed,
// the near one at FOLLOW_NEAR. Depths are uniform, so the field as a whole
// still averages 0.6.
const FOLLOW_FAR = 0.35;
const FOLLOW_NEAR = 0.85;
const LINK_DEPTH = 0.6; // max depth gap between two linked particles
const LINK_ALPHA = 0.28; // link opacity at full strength, before depth
// px the field extends past the top and bottom edges. Scrolling wraps
// particles from one edge to the other all the time; with a band one link
// long, a particle wraps only once it is too far off screen to link to
// anything visible, so no line pops in or out at the edges.
const EDGE = LINK;

/** Opacity factor for a depth: far marks recede, near ones stand forward. */
const shine = (z: number) => 0.45 + 0.75 * z;

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
  // Mean dot diameter; slightly larger on touch screens, seen at arm's length.
  const dot = window.matchMedia("(pointer: fine)").matches ? 1.5 : 2;

  const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r},${g},${b},${a.toFixed(3)})`;
  // One reusable path per opacity bucket.
  const linkPaths: Path2D[] = [];
  const pointerPaths: Path2D[] = [];
  const dotPaths: Path2D[] = [];
  const bucketOf = (weight: number) => Math.min(BUCKETS - 1, Math.floor(weight * BUCKETS));

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
      const z = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.05 + Math.random() * 0.08) * (0.6 + 0.8 * z);
      return {
        x: Math.random() * w,
        y: Math.random() * (h + EDGE * 2) - EDGE,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        z,
        follow: FOLLOW_FAR + (FOLLOW_NEAR - FOLLOW_FAR) * z,
        r: (dot / 2) * (0.7 + 0.8 * z),
        dotLevel: Math.min(DOT_LEVELS - 1, Math.floor(z * DOT_LEVELS)),
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
    scroll(page, carried) {
      for (const p of particles) p.y = wrapY(p.y + carried - p.follow * page);
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
              // Near particles answer the pointer more readily than far ones.
              const f =
                (1 - Math.sqrt(d2) / POINTER_LINK) * 0.0006 * (0.6 + 0.8 * p.z) * pointer.presence;
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
      for (let lv = 0; lv < DOT_LEVELS; lv++) dotPaths[lv] = new Path2D();
      const link2 = LINK * LINK;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const gapZ = Math.abs(a.z - b.z);
          if (gapZ >= LINK_DEPTH) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < link2) {
            const strength = 1 - Math.sqrt(d2) / LINK; // 0..1
            // Full weight at equal depths, easing out toward the depth limit.
            const match = 1 - (gapZ / LINK_DEPTH) ** 2;
            const weight = strength * match * shine((a.z + b.z) / 2);
            const bucket = bucketOf(weight);
            linkPaths[bucket].moveTo(a.x, a.y);
            linkPaths[bucket].lineTo(b.x, b.y);
          }
        }
        if (pointer.presence > 0) {
          const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (d < POINTER_LINK) {
            const bucket = bucketOf((1 - d / POINTER_LINK) * shine(a.z));
            pointerPaths[bucket].moveTo(a.x, a.y);
            pointerPaths[bucket].lineTo(pointer.x, pointer.y);
          }
        }
        const dots = dotPaths[a.dotLevel];
        dots.moveTo(a.x + a.r, a.y);
        dots.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let b = 0; b < BUCKETS; b++) {
        const level = (b + 1) / BUCKETS; // bucket's upper strength
        ctx.strokeStyle = rgba(palette.mark, level * LINK_ALPHA * boost);
        ctx.stroke(linkPaths[b]);
        if (pointer.presence > 0) {
          ctx.strokeStyle = rgba(palette.accent, level * 0.32 * boost * pointer.presence);
          ctx.stroke(pointerPaths[b]);
        }
      }
      for (let lv = 0; lv < DOT_LEVELS; lv++) {
        const z = (lv + 0.5) / DOT_LEVELS; // the level's middle depth
        ctx.fillStyle = rgba(palette.mark, Math.min(1, 0.38 * boost * shine(z)));
        ctx.fill(dotPaths[lv]);
      }

      return moving;
    },
  };
}
