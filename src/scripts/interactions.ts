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
 * Each frame also emits "topbar:frame" so the name morph can stay in step.
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

  // Small screens / reduced motion: the wordmark simply fades in once the
  // hero name has scrolled under the bar.
  let named = false;
  new IntersectionObserver(
    ([entry]) => {
      named = !entry.isIntersecting;
      if (!morphing) bar.toggleAttribute("data-named", named);
    },
    { rootMargin: "-64px 0px 0px 0px" },
  ).observe(name);

  // Large screens: the hero name itself flies into the bar.
  let morphing = false;
  const query = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
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
 * Horizontally the name slides to the wordmark, scales to its size and eases
 * its width axis, weight and tracking to the wordmark's values, finishing at
 * BAR_END together with the bar, so name and pill settle as one. Vertically it
 * scrolls with the page until its centre meets the wordmark's, then rides
 * inside the bar while the bar finishes contracting. When it lands it hides
 * and the real wordmark shows in the same place. Scrolling up reverses it.
 */
function createNameMorph(bar: HTMLElement, name: HTMLElement) {
  const target = bar.querySelector<HTMLElement>("[data-wordmark-full]");
  if (!target) return null;

  const root = document.documentElement;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Hero name at rest, measured without any morph styles applied.
  let base = { left: 0, centerY: 0, size: 1, stretch: 118, weight: 640, tracking: -0.04 };
  let active = false;
  let smoothY = 0;

  const clear = () => {
    name.style.transform = "";
    name.style.fontStretch = "";
    name.style.fontWeight = "";
    name.style.letterSpacing = "";
    name.style.opacity = "";
    name.style.pointerEvents = "";
  };

  const measure = () => {
    clear();
    const r = name.getBoundingClientRect();
    const cs = getComputedStyle(name);
    const size = parseFloat(cs.fontSize);
    base = {
      left: r.left,
      centerY: r.top + window.scrollY + r.height / 2,
      size,
      stretch: parseFloat(cs.fontStretch) || 118,
      weight: parseFloat(cs.fontWeight) || 640,
      tracking: (parseFloat(cs.letterSpacing) || -0.04 * size) / size,
    };
  };

  const frame = () => {
    if (!active) return;
    const t = target.getBoundingClientRect();
    const ts = getComputedStyle(target);
    const targetSize = parseFloat(ts.fontSize);
    const targetCenterY = t.top + t.height / 2;
    const targetTracking = (parseFloat(ts.letterSpacing) || 0) / targetSize;

    // Finish with the bar, but never before the name has risen to the bar.
    const meet = base.centerY - targetCenterY;
    const progress = clamp01(smoothY / Math.max(BAR_END, meet));
    const e = easeInOut(progress);

    // Vertical: follow the page, then ride inside the bar once it gets there.
    const naturalCenterY = base.centerY - window.scrollY;
    const dy = Math.max(0, targetCenterY - naturalCenterY);
    const dx = (t.left - base.left) * e;
    const scale = lerp(1, targetSize / base.size, e);

    name.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    name.style.fontStretch = `${lerp(base.stretch, 100, e).toFixed(1)}%`;
    name.style.fontWeight = lerp(base.weight, 600, e).toFixed(0);
    name.style.letterSpacing = `${lerp(base.tracking, targetTracking, e).toFixed(4)}em`;

    const landed = progress >= 1;
    name.style.opacity = landed ? "0" : "";
    // Once it has left its place the name sits over the bar (invisibly, after
    // landing); it must not take the pointer from the wordmark underneath.
    name.style.pointerEvents = progress > 0 ? "none" : "";
    bar.toggleAttribute("data-named", landed);
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
      document.fonts?.ready.then(onResize);
      frame();
    },
    disable() {
      if (!active) return;
      active = false;
      root.classList.remove("name-morph");
      bar.removeEventListener("topbar:frame", onBarFrame);
      window.removeEventListener("resize", onResize);
      clear();
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
const LENS_FROST = 9;
const LENS_BEND = 24;

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
  initReveals();
  initScrollSpy();
  initFrames();
  initCopyEmail();
}
