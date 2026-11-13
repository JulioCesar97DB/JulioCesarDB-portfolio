/** Scroll range over which the bar turns into the glass pill (px). */
const BAR_START = 24;
const BAR_END = 260;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Top bar. Its shape is scroll-linked: a smoothed scroll position (eased
 * toward the real one every frame, so stepped mouse wheels still glide) is
 * mapped onto three overlapping phases written as CSS custom properties:
 *   --glass   0 -> 1 over the first half of the range (material appears)
 *   --shrink  0 -> 1 from 12% to the end (contraction into the pill)
 * The Resume button fills with ink (data-filled, an animated --fill) only
 * once the hero's own Resume button has left the viewport, so two black
 * Resume buttons are never on screen together.
 * Each frame also emits "topbar:frame", which the name morph redraws on.
 */
function initTopBar(): void {
  const bar = document.querySelector<HTMLElement>("[data-topbar]");
  if (!bar) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let smoothY = window.scrollY;
  let last = 0;
  let raf = 0;

  const apply = () => {
    const p = clamp01((smoothY - BAR_START) / (BAR_END - BAR_START));
    const glass = smoothstep(0, 0.5, p);
    const shrink = smoothstep(0.12, 1, p);
    bar.style.setProperty("--glass", glass.toFixed(4));
    bar.style.setProperty("--shrink", shrink.toFixed(4));
    bar.dispatchEvent(new CustomEvent("topbar:frame", { detail: { smoothY, glass, shrink } }));
  };

  const tick = (time: number) => {
    raf = 0;
    const target = window.scrollY;
    // Frame-rate independent easing toward the real scroll position.
    const dt = last ? Math.min(64, time - last) : 16.67;
    last = time;
    const k = reduced.matches ? 1 : 1 - Math.pow(1 - 0.14, dt / 16.67);
    smoothY += (target - smoothY) * k;
    if (Math.abs(target - smoothY) < 0.25) smoothY = target;
    apply();
    if (smoothY !== target) raf = requestAnimationFrame(tick);
    else last = 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", kick, { passive: true });
  apply();

  const heroResume = document.querySelector("[data-hero-resume]");
  if (heroResume) {
    new IntersectionObserver(([entry]) => bar.toggleAttribute("data-filled", !entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
    }).observe(heroResume);
  } else {
    bar.setAttribute("data-filled", "");
  }

  const name = document.querySelector<HTMLElement>("[data-hero-name]");
  if (!name) {
    bar.setAttribute("data-named", "");
    return;
  }

  // Reduced motion: the wordmark simply fades in once the hero name has
  // scrolled under the bar.
  let named = false;
  new IntersectionObserver(
    ([entry]) => {
      named = !entry.isIntersecting;
      if (!morphing) bar.toggleAttribute("data-named", named);
    },
    { rootMargin: "-64px 0px 0px 0px" },
  ).observe(name);

  // Otherwise, at every width, the hero name itself flies into the bar.
  let morphing = false;
  const query = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const morph = createNameMorph(bar, name);
  const sync = () => {
    morphing = query.matches && !!morph;
    if (morphing) morph?.enable(smoothY);
    else {
      morph?.disable();
      bar.toggleAttribute("data-named", named);
    }
  };
  query.addEventListener("change", sync);
  sync();
}

/**
 * Scroll-linked handoff of the hero name into the top bar's wordmark.
 *
 * The heading keeps its place in the page but turns invisible; what is seen is
 * a copy fixed to the viewport (the flyer), so scrolling itself never moves it
 * and it cannot shake against the page. Each frame the flyer is placed from
 * one clock, the bar's smoothed scroll position (held within MAX_LAG of the
 * real one, so a hard flick cannot leave it behind): it starts where the
 * heading is and eases from there to the wordmark, shrinking ahead of its
 * rise so that it enters the bar already wordmark-sized. Then it hides and the real wordmark
 * shows in the same place. Scrolling up reverses it.
 *
 * Where the bar shows the full name the flyer moves as one piece, easing its
 * width axis, weight and tracking to the wordmark's. Where it shows initials
 * (phones) it is split into words: each word flies to its own initial while
 * the rest of the word fades out.
 */
function createNameMorph(bar: HTMLElement, name: HTMLElement) {
  const marks = Array.from(bar.querySelectorAll<HTMLElement>("[data-wordmark]"));
  const text = name.textContent?.trim() ?? "";
  if (!marks.length || !text) return null;

  const root = document.documentElement;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  /** The name lands once the page has scrolled this far past the bar. */
  const OVERRUN = 1.25;
  /** How far the flyer's clock may trail the real scroll position (px). */
  const MAX_LAG = 64;

  /** A word of the flyer; left and centerY are page coordinates at rest. */
  type Word = { el: HTMLElement; rest: HTMLElement; left: number; centerY: number };

  let target: HTMLElement | null = null;
  let fly: HTMLElement | null = null;
  let active = false;
  let mono = false;
  let smoothY = 0;
  let words: Word[] = [];
  let initials: Range[] = [];
  // The heading at rest, in page coordinates.
  let base = { left: 0, top: 0, height: 0, size: 1, stretch: 118, weight: 640, tracking: -0.04 };

  /** Fills the heading with its invisible text and the flyer over it. */
  const build = (asWords: boolean) => {
    mono = asWords;
    root.classList.toggle("name-mono", asWords);
    const rest = document.createElement("span");
    rest.className = "name-rest";
    rest.textContent = text;
    fly = document.createElement("span");
    fly.className = "name-fly";
    fly.setAttribute("aria-hidden", "true");
    words = [];
    if (asWords) {
      text.split(/\s+/).forEach((part, i) => {
        const el = document.createElement("span");
        el.className = "name-word";
        const tail = document.createElement("span");
        tail.textContent = part.slice(1);
        el.append(part.charAt(0), tail);
        if (i) fly?.append(" ");
        fly?.append(el);
        words.push({ el, rest: tail, left: 0, centerY: 0 });
      });
    } else {
      fly.textContent = text;
    }
    name.replaceChildren(rest, fly);
  };

  const teardown = () => {
    name.textContent = text;
    root.classList.remove("name-mono");
    fly = null;
    mono = false;
    words = [];
  };

  const measure = () => {
    target = marks.find((m) => m.getClientRects().length > 0) ?? null;
    if (!target) return;
    const label = target.textContent?.trim() ?? "";
    const asWords = label !== text;
    if (!fly || asWords !== mono) build(asWords);
    if (!fly) return;

    // Back to rest: the flyer untransformed sits at the viewport's corner.
    fly.removeAttribute("style");
    for (const w of words) {
      w.el.removeAttribute("style");
      w.rest.removeAttribute("style");
    }
    const r = name.getBoundingClientRect();
    const cs = getComputedStyle(name);
    const size = parseFloat(cs.fontSize);
    base = {
      left: r.left,
      top: r.top + window.scrollY,
      height: r.height,
      size,
      stretch: parseFloat(cs.fontStretch) || 118,
      weight: parseFloat(cs.fontWeight) || 640,
      tracking: (parseFloat(cs.letterSpacing) || -0.04 * size) / size,
    };
    // Same width as the heading, so the flyer wraps exactly as it does.
    fly.style.width = `${r.width}px`;
    if (!mono) return;

    for (const w of words) {
      const wr = w.el.getBoundingClientRect();
      w.left = base.left + wr.left;
      w.centerY = base.top + wr.top + wr.height / 2;
    }
    const node = target.firstChild;
    initials = [];
    if (node?.nodeType === Node.TEXT_NODE) {
      const offset = (node.textContent ?? "").indexOf(label);
      for (let i = 0; i < label.length; i++) {
        const range = document.createRange();
        range.setStart(node, offset + i);
        range.setEnd(node, offset + i + 1);
        initials.push(range);
      }
    }
  };

  /** 0..1 over the scroll it takes a name centred at `centerY` to land. */
  const progressTo = (scroll: number, centerY: number, targetCenterY: number) =>
    clamp01(scroll / Math.max(1, (centerY - targetCenterY) * OVERRUN));

  /** The name shrinks and slides across ahead of its rise, so it is already
   *  wordmark-sized when it enters the bar and never runs over the links. */
  const closing = (progress: number) => smoothstep(0, 0.55, progress);

  const land = (el: HTMLElement, progress: number) => {
    const landed = progress >= 1;
    el.style.opacity = landed ? "0" : "";
    bar.toggleAttribute("data-named", landed);
  };

  const frameFull = (el: HTMLElement, mark: HTMLElement, scroll: number) => {
    const t = mark.getBoundingClientRect();
    const ts = getComputedStyle(mark);
    const targetSize = parseFloat(ts.fontSize);
    const targetCenterY = t.top + t.height / 2;
    const targetTracking = (parseFloat(ts.letterSpacing) || 0) / targetSize;

    const centerY = base.top + base.height / 2;
    const progress = progressTo(scroll, centerY, targetCenterY);
    const e = easeInOut(progress);
    const close = closing(progress);

    // From where the heading is on screen to the wordmark, along one curve.
    const x = lerp(base.left, t.left, close);
    const y = lerp(centerY - scroll, targetCenterY, e) - base.height / 2;
    const scale = lerp(1, targetSize / base.size, close);

    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    el.style.fontStretch = `${lerp(base.stretch, 100, close).toFixed(1)}%`;
    el.style.fontWeight = lerp(base.weight, 600, close).toFixed(0);
    el.style.letterSpacing = `${lerp(base.tracking, targetTracking, close).toFixed(4)}em`;
    land(el, progress);
  };

  const frameMono = (el: HTMLElement, mark: HTMLElement, scroll: number) => {
    const first = words[0];
    const rects = initials.map((range) => range.getBoundingClientRect());
    if (!first || !rects.length) return;
    const targetSize = parseFloat(getComputedStyle(mark).fontSize);
    const targetCenterY = rects[0].top + rects[0].height / 2;

    const progress = progressTo(scroll, first.centerY, targetCenterY);
    const e = easeInOut(progress);
    const close = closing(progress);
    const scale = lerp(1, targetSize / base.size, close);
    // The rest of each word is gone before the initials close up.
    const fade = (1 - smoothstep(0, 0.45, close)).toFixed(3);

    // The flyer follows the heading; each word leaves it for its initial.
    el.style.transform = `translate3d(${base.left.toFixed(2)}px, ${(base.top - scroll).toFixed(2)}px, 0)`;
    words.forEach((w, i) => {
      // A word with no initial in the bar folds into the end of the monogram.
      const kept = i < rects.length;
      const slot = rects[Math.min(i, rects.length - 1)];
      const dx = ((kept ? slot.left : slot.right) - w.left) * close;
      // Lines of a wrapped name close up into one as they rise.
      const dy = (targetCenterY - (w.centerY - scroll)) * e;
      w.el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      w.rest.style.opacity = fade;
      w.el.style.opacity = kept ? "" : fade;
    });
    land(el, progress);
  };

  const frame = () => {
    if (!active || !target || !fly) return;
    const y = window.scrollY;
    const scroll = Math.min(y + MAX_LAG, Math.max(y - MAX_LAG, smoothY));
    if (mono) frameMono(fly, target, scroll);
    else frameFull(fly, target, scroll);
  };
  const onBarFrame = (event: Event) => {
    smoothY = (event as CustomEvent<{ smoothY: number }>).detail.smoothY;
    frame();
  };
  const onResize = () => {
    measure();
    frame();
  };

  return {
    enable(initialY: number) {
      if (active) return;
      active = true;
      smoothY = initialY;
      root.classList.add("name-morph");
      measure();
      bar.addEventListener("topbar:frame", onBarFrame);
      window.addEventListener("resize", onResize, { passive: true });
      document.fonts?.ready.then(() => active && onResize());
      frame();
    },
    disable() {
      if (!active) return;
      active = false;
      bar.removeEventListener("topbar:frame", onBarFrame);
      window.removeEventListener("resize", onResize);
      teardown();
      root.classList.remove("name-morph");
    },
  };
}

/**
 * Liquid glass in the top bar: a capsule of glass that slides under whichever
 * control is hovered or keyboard-focused, and a specular highlight that
 * follows the pointer across the bar. Positions are written as CSS custom
 * properties; the motion itself is CSS.
 */
function initNavGlass(): void {
  const bar = document.querySelector<HTMLElement>("[data-bar]");
  const header = document.querySelector<HTMLElement>("[data-topbar]");
  const glass = bar?.querySelector<HTMLElement>("[data-nav-glass]");
  if (!bar || !header || !glass) return;

  let current: HTMLElement | null = null;

  let lastLeft = 0;
  const place = (el: HTMLElement, instant: boolean) => {
    const b = bar.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const left = r.left - b.left;
    const right = b.right - r.right;
    glass.toggleAttribute("data-instant", instant);
    if (!instant) glass.dataset.dir = left < lastLeft ? "left" : "right";
    glass.style.setProperty("--gl", `${left.toFixed(1)}px`);
    glass.style.setProperty("--gr", `${right.toFixed(1)}px`);
    lastLeft = left;
  };

  const moveTo = (el: HTMLElement) => {
    if (el.offsetWidth === 0) return; // e.g. the wordmark before it appears
    // First appearance blooms in place instead of travelling from the last spot.
    place(el, !glass.hasAttribute("data-active"));
    glass.setAttribute("data-active", "");
    current = el;
  };
  const hide = () => {
    glass.removeAttribute("data-active");
    current = null;
  };

  for (const el of bar.querySelectorAll<HTMLElement>("[data-glass-target]")) {
    el.addEventListener("pointerenter", () => moveTo(el));
    el.addEventListener("focus", () => {
      if (el.matches(":focus-visible")) moveTo(el);
    });
    el.addEventListener("blur", () => {
      if (current === el) hide();
    });
  }
  bar.addEventListener("pointerleave", hide);

  // The bar contracts while scrolling; keep the capsule under its control.
  header.addEventListener("topbar:frame", () => {
    if (current) place(current, true);
  });

  // Specular highlight follows the pointer.
  if (window.matchMedia("(pointer: fine)").matches) {
    bar.addEventListener(
      "pointermove",
      (e) => {
        const b = bar.getBoundingClientRect();
        bar.style.setProperty("--sx", `${(e.clientX - b.left).toFixed(0)}px`);
        bar.style.setProperty("--sy", `${(e.clientY - b.top).toFixed(0)}px`);
        header.setAttribute("data-hovering", "");
      },
      { passive: true },
    );
    bar.addEventListener("pointerleave", () => header.removeAttribute("data-hovering"));
  }
}

/** Blur of the lens's frosted middle and its edge displacement, in px. */
const LENS_FROST = 6;
const LENS_BEND = 28;

/**
 * Paints the lens map for a w x h capsule as a data URL. Red and green hold
 * the displacement (128 = none): inside a bezel along the edge every pixel
 * samples from further in, growing toward the rim, so what passes under the
 * edge is squeezed and bent the way a thick, rounded pane would bend it.
 * Blue holds how much frost that pixel gets: little at the rim, where the
 * refraction should stay crisp, full in the middle, where the labels sit.
 */
function paintLensMap(w: number, h: number, radius: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const image = ctx.createImageData(w, h);
  const r = Math.min(radius, w / 2, h / 2);
  const bezel = Math.min(r * 0.5, 13);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - w / 2;
      const py = y + 0.5 - h / 2;
      // Signed distance to the rounded rectangle's edge and its outward normal.
      const ax = Math.abs(px) - (w / 2 - r);
      const ay = Math.abs(py) - (h / 2 - r);
      let depth: number;
      let nx = 0;
      let ny = 0;
      if (ax > 0 && ay > 0) {
        const len = Math.hypot(ax, ay);
        depth = r - len;
        nx = (ax / len) * Math.sign(px);
        ny = (ay / len) * Math.sign(py);
      } else if (ax > ay) {
        depth = r - ax;
        nx = Math.sign(px);
      } else {
        depth = r - ay;
        ny = Math.sign(py);
      }
      const t = clamp01(1 - Math.max(0, depth) / bezel);
      const bend = t * t;
      const i = (y * w + x) * 4;
      image.data[i] = 128 - nx * bend * 127;
      image.data[i + 1] = 128 - ny * bend * 127;
      image.data[i + 2] = 255 * (0.4 + 0.6 * smoothstep(0, 0.8, depth / bezel));
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

/**
 * The bar as a lens. Only Chromium runs SVG filters on a backdrop, so this is
 * an enhancement there (html.lens swaps the bar's backdrop-filter for
 * #bar-lens); everywhere else the bar keeps its plain blur. The map is painted
 * for the settled pill and stretched over the bar while it contracts, when
 * the bend is still weak; bend and frost follow the same scroll phases as the
 * rest of the bar's material.
 */
function initBarLens(): void {
  const header = document.querySelector<HTMLElement>("[data-topbar]");
  const bar = header?.querySelector<HTMLElement>("[data-bar]");
  const map = header?.querySelector<SVGFEImageElement>("[data-lens-map]");
  const bend = header?.querySelector<SVGFEDisplacementMapElement>("[data-lens-bend]");
  const frost = header?.querySelector<SVGFEGaussianBlurElement>("[data-lens-frost]");
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
  if (!header || !bar || !map || !bend || !frost || !brands?.some((b) => b.brand === "Chromium")) return;

  let mapW = 0;
  let mapH = 0;
  const paint = (w: number, h: number) => {
    w = Math.round(w);
    h = Math.round(h);
    if (w < 1 || h < 1 || (w === mapW && h === mapH)) return;
    const url = paintLensMap(w, h, h / 2);
    if (!url) return;
    mapW = w;
    mapH = h;
    map.setAttribute("href", url);
  };

  /** The pill's size once fully contracted, from the same numbers as the CSS. */
  const settledSize = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const style = getComputedStyle(header);
    const inner = header.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    return { w: Math.min(46 * rem, inner), h: 3.25 * rem };
  };

  const update = (glass: number, shrink: number) => {
    const { width, height } = bar.getBoundingClientRect();
    if (shrink === 1) paint(width, height);
    map.setAttribute("width", width.toFixed(1));
    map.setAttribute("height", height.toFixed(1));
    bend.setAttribute("scale", (LENS_BEND * shrink * shrink).toFixed(2));
    frost.setAttribute("stdDeviation", (LENS_FROST * glass).toFixed(2));
  };

  const read = (name: string) => parseFloat(header.style.getPropertyValue(name)) || 0;
  const { w, h } = settledSize();
  paint(w, h);
  update(read("--glass"), read("--shrink"));
  document.documentElement.classList.add("lens");

  header.addEventListener("topbar:frame", (e) => {
    const { glass, shrink } = (e as CustomEvent<{ glass: number; shrink: number }>).detail;
    update(glass, shrink);
  });
  let resizing = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizing);
    resizing = requestAnimationFrame(() => {
      const size = settledSize();
      paint(size.w, size.h);
      update(read("--glass"), read("--shrink"));
    });
  });
}

/**
 * Adaptive glass. The bar is clear enough that a dark screenshot passing
 * behind would swallow dark labels, so, like a small Liquid Glass bar, it
 * flips to the other scheme when what is behind it calls for it. Each product
 * screenshot is reduced once to a small grid of luminance; while scrolling,
 * the cells under the bar are averaged with the page colour around them, and
 * the bar flips when the mean crosses a threshold (with hysteresis, so it
 * does not flicker at the boundary).
 */
function initBarAdapt(): void {
  const header = document.querySelector<HTMLElement>("[data-topbar]");
  const bar = header?.querySelector<HTMLElement>("[data-bar]");
  if (!header || !bar || !("IntersectionObserver" in window)) return;

  const COLS = 16;
  const ROWS = 10;
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const grids = new WeakMap<HTMLImageElement, Float32Array>();
  const near = new Set<HTMLImageElement>();

  const sample = (img: HTMLImageElement) => {
    if (!img.naturalWidth) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = COLS;
      canvas.height = ROWS;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, COLS, ROWS);
      const { data } = ctx.getImageData(0, 0, COLS, ROWS);
      const grid = new Float32Array(COLS * ROWS);
      for (let i = 0; i < grid.length; i++) {
        grid[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
      }
      grids.set(img, grid);
    } catch {
      // A canvas the image has tainted cannot be read; the bar just stays as it is.
    }
  };

  const pageIsDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : prefersDark.matches);

  let over: "light" | "dark" | null = null;
  let flipTimer = 0;
  const evaluate = () => {
    const page = pageIsDark() ? "dark" : "light";
    const b = bar.getBoundingClientRect();
    let lit = 0;
    let covered = 0;
    for (const img of near) {
      const grid = grids.get(img);
      if (!grid) continue;
      const r = img.getBoundingClientRect();
      const x0 = Math.max(b.left, r.left);
      const x1 = Math.min(b.right, r.right);
      const y0 = Math.max(b.top, r.top);
      const y1 = Math.min(b.bottom, r.bottom);
      if (x1 <= x0 || y1 <= y0) continue;
      const c0 = Math.floor(((x0 - r.left) / r.width) * COLS);
      const c1 = Math.min(COLS - 1, Math.floor(((x1 - r.left) / r.width) * COLS));
      const r0 = Math.floor(((y0 - r.top) / r.height) * ROWS);
      const r1 = Math.min(ROWS - 1, Math.floor(((y1 - r.top) / r.height) * ROWS));
      let sum = 0;
      let count = 0;
      for (let row = r0; row <= r1; row++) {
        for (let col = c0; col <= c1; col++) {
          sum += grid[row * COLS + col];
          count++;
        }
      }
      const area = (x1 - x0) * (y1 - y0);
      lit += (sum / count) * area;
      covered += area;
    }
    const total = b.width * b.height;
    const mean = total > 0 ? (lit + (total - covered) * (page === "dark" ? 0.1 : 0.98)) / total : 1;
    const current = over ?? page;
    const next = mean < 0.42 ? "dark" : mean > 0.56 ? "light" : current;
    const value = next === page ? null : next;
    if (value === over) return;
    over = value;
    header.setAttribute("data-flipping", "");
    window.clearTimeout(flipTimer);
    flipTimer = window.setTimeout(() => header.removeAttribute("data-flipping"), 500);
    if (value) header.setAttribute("data-over", value);
    else header.removeAttribute("data-over");
  };

  // Only screenshots near the top of the viewport can be under the bar.
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const img = entry.target as HTMLImageElement;
        if (entry.isIntersecting) near.add(img);
        else near.delete(img);
      }
      evaluate();
    },
    { rootMargin: "0px 0px -80% 0px" },
  );
  for (const img of document.querySelectorAll<HTMLImageElement>(".frame img")) {
    if (img.complete) sample(img);
    img.addEventListener("load", () => {
      sample(img);
      evaluate();
    });
    io.observe(img);
  }

  header.addEventListener("topbar:frame", evaluate);
  prefersDark.addEventListener("change", evaluate);
  new MutationObserver(evaluate).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
}

/**
 * Illumination: glass buttons light from within under a fine pointer. This
 * only reports where the pointer is over the button; the glow is CSS.
 */
function initGlassGlow(): void {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  document.addEventListener(
    "pointermove",
    (e) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(".btn, .btn-group");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", `${(e.clientX - r.left).toFixed(0)}px`);
      el.style.setProperty("--py", `${(e.clientY - r.top).toFixed(0)}px`);
    },
    { passive: true },
  );
}

/**
 * One-shot reveals: each .reveal / .reveal-solid gets .is-in the first time it
 * enters the viewport and keeps it, so text always ends fully opaque.
 */
function initReveals(): void {
  const items = document.querySelectorAll<HTMLElement>(".reveal, .reveal-solid");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    // Reveal as soon as any part enters, so nothing is ever visible yet hidden.
    { threshold: 0 },
  );
  items.forEach((el) => {
    // Anything already above the fold on load shows at once, without motion.
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
    else io.observe(el);
  });
}

/** Marks the nav link of the section under the top third of the viewport. */
function initScrollSpy(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"));
  const pairs = links
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter((p): p is { link: HTMLAnchorElement; section: HTMLElement } => !!p.section);
  if (!pairs.length) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.33;
    let active: HTMLAnchorElement | null = null;
    for (const { link, section } of pairs) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) active = link;
    }
    for (const { link } of pairs) {
      if (link === active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

/**
 * Product frames: the border highlight follows the pointer, and the frame tilts
 * a few degrees toward it in perspective. Writes are batched to one per frame.
 */
function initFrames(): void {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const tilt = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MAX_TILT = 4; // degrees

  for (const host of document.querySelectorAll<HTMLElement>("[data-frame]")) {
    const frame = host.querySelector<HTMLElement>(".frame");
    if (!frame) continue;
    let raf = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      raf = 0;
      const r = frame.getBoundingClientRect();
      const px = (x - r.left) / r.width; // 0..1
      const py = (y - r.top) / r.height;
      frame.style.setProperty("--mx", `${x - r.left}px`);
      frame.style.setProperty("--my", `${y - r.top}px`);
      if (tilt) {
        frame.style.setProperty("--ry", `${((px - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
        frame.style.setProperty("--rx", `${((0.5 - py) * 2 * MAX_TILT).toFixed(2)}deg`);
      }
    };

    host.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        frame.dataset.tilting = "";
        if (!raf) raf = requestAnimationFrame(paint);
      },
      { passive: true },
    );
    host.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      raf = 0;
      delete frame.dataset.tilting;
      frame.style.setProperty("--rx", "0deg");
      frame.style.setProperty("--ry", "0deg");
    });
  }
}

/** Copy-email buttons swap to a check and announce the result. */
function initCopyEmail(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-copy-email]")) {
    const root = button.closest("[data-copy-root]");
    const status = root?.querySelector<HTMLElement>("[data-copy-status]");
    const idle = button.querySelector(".copy-idle");
    const done = button.querySelector(".copy-done");
    let timer: number | undefined;

    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail ?? "";
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        if (status) status.textContent = `Couldn't copy. The address is ${email}.`;
        return;
      }
      idle?.classList.add("hidden");
      done?.classList.remove("hidden");
      button.setAttribute("aria-label", "Email address copied");
      if (status) status.textContent = "Email address copied to clipboard.";
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        idle?.classList.remove("hidden");
        done?.classList.add("hidden");
        button.setAttribute("aria-label", "Copy email address");
        if (status) status.textContent = "";
      }, 2000);
    });
  }
}

export function initInteractions(): void {
  initTopBar();
  initNavGlass();
  initBarLens();
  initBarAdapt();
  initGlassGlow();
  initReveals();
  initScrollSpy();
  initFrames();
  initCopyEmail();
}
