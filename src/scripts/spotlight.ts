import gsap from "gsap";

export function initSpotlight(): void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const el = document.getElementById("spotlight");
  if (!el || reduce || !finePointer) return;

  // Establish px units before quickTo so it animates in pixels.
  gsap.set(el, {
    "--x": window.innerWidth / 2 + "px",
    "--y": window.innerHeight / 2 + "px",
  });

  const xTo = gsap.quickTo(el, "--x", { duration: 0.6, ease: "power3" });
  const yTo = gsap.quickTo(el, "--y", { duration: 0.6, ease: "power3" });

  window.addEventListener(
    "pointermove",
    (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    },
    { passive: true },
  );
}
