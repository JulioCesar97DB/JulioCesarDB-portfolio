import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Once an element has revealed, drop the data-reveal hook and any inline opacity
// GSAP left behind, so CSS hover states (e.g. the focus/dim effect) take over.
function settle(el: HTMLElement): void {
  el.removeAttribute("data-reveal");
  gsap.set(el, { clearProps: "opacity,transform" });
}

export function initReveal(): void {
  const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  if (!els.length) return;

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", () => {
    els.forEach(settle);
  });

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
          overwrite: true,
          onComplete: () => (batch as HTMLElement[]).forEach(settle),
        }),
    });
  });

  // Recalculate trigger positions once webfonts have loaded (layout shift).
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
