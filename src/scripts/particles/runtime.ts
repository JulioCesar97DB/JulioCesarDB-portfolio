/**
 * Shared runtime for the animated backgrounds: sizing for the device
 * pixel ratio, a pointer eased toward the cursor, theme-aware colours, and a
 * render loop that only runs while the hero is on screen and the tab is
 * visible. Under reduced motion a variant draws a single still frame.
 */

export type RGB = [number, number, number];

export interface Palette {
  /** Page background. */
  bg: RGB;
  /** Quiet foreground (ink-3) for marks. */
  mark: RGB;
  /** The accent, used only near the pointer. */
  accent: RGB;
  dark: boolean;
}

export interface Pointer {
  /** Eased position in CSS px relative to the canvas. */
  x: number;
  y: number;
  /** 0..1, fades in while the pointer is over the hero and out after it leaves. */
  presence: number;
}

export interface Variant {
  resize(width: number, height: number, dpr: number): void;
  setPalette(palette: Palette): void;
  /** time in ms; return false when nothing will change until the next input. */
  draw(time: number, pointer: Pointer): boolean | void;
  destroy?(): void;
}

export type VariantFactory = (canvas: HTMLCanvasElement) => Variant | null;

/** Resolve any CSS colour (including oklch and light-dark) to sRGB 0..255. */
function toRGB(color: string, probe: CanvasRenderingContext2D): RGB {
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = "#000";
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

/**
 * The tokens are light-dark() pairs, which a canvas fillStyle cannot parse.
 * Resolve each one through an element's computed `color` first: the browser
 * picks the branch for the active color-scheme and returns a plain colour.
 */
function readPalette(canvas: HTMLCanvasElement): Palette {
  const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  const el = document.createElement("span");
  el.style.display = "none";
  (canvas.parentElement ?? document.body).appendChild(el);
  const resolve = (token: string) => {
    el.style.color = `var(${token})`;
    return toRGB(getComputedStyle(el).color, probe);
  };
  const bg = resolve("--bg");
  const palette = {
    bg,
    mark: resolve("--ink-3"),
    accent: resolve("--accent"),
    dark: (bg[0] + bg[1] + bg[2]) / 3 < 128,
  };
  el.remove();
  return palette;
}

export function mountBackground(canvas: HTMLCanvasElement, factory: VariantFactory): void {
  const variant = factory(canvas);
  if (!variant) return;

  // Pointer input comes from the whole region the background covers.
  const host = canvas.closest<HTMLElement>("[data-bg-region]") ?? canvas.parentElement ?? canvas;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer: Pointer = { x: -9999, y: -9999, presence: 0 };
  const target = { x: -9999, y: -9999, inside: false };

  let visible = true;
  let raf = 0;

  // Budget: draw at most 30 times a second, and stop entirely after a spell
  // with no pointer or scroll activity. Any activity starts it again.
  const FRAME_MS = 1000 / 30;
  const IDLE_MS = 8000;
  let timer = 0;
  let lastActivity = performance.now();

  const loop = (time: number) => {
    raf = 0;
    // Ease the pointer: quick but never snappy (tuned for 30fps).
    const k = 0.28;
    if (target.inside) {
      if (pointer.presence === 0) {
        pointer.x = target.x;
        pointer.y = target.y;
      }
      pointer.x += (target.x - pointer.x) * k;
      pointer.y += (target.y - pointer.y) * k;
    }
    pointer.presence += ((target.inside ? 1 : 0) - pointer.presence) * 0.16;
    if (pointer.presence < 0.002) pointer.presence = 0;

    const animating = variant.draw(time, pointer) !== false;
    const settling = pointer.presence > 0 && pointer.presence < 0.998;
    const awake = performance.now() - lastActivity < IDLE_MS;
    if (!reduced.matches && visible && !document.hidden && animating && (awake || settling)) {
      timer = window.setTimeout(() => {
        timer = 0;
        raf = requestAnimationFrame(loop);
      }, FRAME_MS);
    }
  };

  const kick = () => {
    lastActivity = performance.now();
    if (!raf && !timer && visible && !document.hidden) raf = requestAnimationFrame(loop);
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    variant.resize(rect.width, rect.height, dpr);
    kick();
  };

  const repaint = () => {
    variant.setPalette(readPalette(canvas));
    kick();
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) kick();
  }).observe(canvas);
  document.addEventListener("visibilitychange", kick);
  window.addEventListener("scroll", () => visible && kick(), { passive: true });
  reduced.addEventListener("change", kick);

  // Theme: the menu flips data-theme; "System" follows the OS.
  new MutationObserver(repaint).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", repaint);

  if (window.matchMedia("(pointer: fine)").matches) {
    host.addEventListener(
      "pointermove",
      (e) => {
        const r = canvas.getBoundingClientRect();
        target.x = e.clientX - r.left;
        target.y = e.clientY - r.top;
        target.inside = true;
        kick();
      },
      { passive: true },
    );
    host.addEventListener("pointerleave", () => {
      target.inside = false;
      kick();
    });
  }

  variant.setPalette(readPalette(canvas));
  resize();
}
