export function initSpotlight(): void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const el = document.getElementById("spotlight");
  if (!el || reduce || !finePointer) return;

  // Track the cursor 1:1 with no easing/delay.
  window.addEventListener(
    "pointermove",
    (e) => {
      el.style.setProperty("--x", e.clientX + "px");
      el.style.setProperty("--y", e.clientY + "px");
    },
    { passive: true },
  );
}
