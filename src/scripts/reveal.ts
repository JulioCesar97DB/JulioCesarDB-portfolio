import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initReveal(): void {
  const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  if (!els.length) return;

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(els, { autoAlpha: 1, y: 0 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(els, { autoAlpha: 0, y: 24 });
    ScrollTrigger.batch(els, {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          overwrite: true,
        }),
    });
  });

  // Recalculate trigger positions once webfonts have loaded (layout shift).
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
