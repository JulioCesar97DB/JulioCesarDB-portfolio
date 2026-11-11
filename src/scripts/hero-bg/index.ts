import { mountHeroBackground, type VariantFactory } from "./runtime";
import { createGrid } from "./grid";

/**
 * The dot grid is the shipped background. The gradient and particle variants
 * stay loadable for comparison via ?bg=gradient|particles and are fetched
 * only when asked for, so they add nothing to the default page.
 */
const variants: Record<string, () => Promise<VariantFactory>> = {
  grid: async () => createGrid,
  gradient: async () => (await import("./gradient")).createGradient,
  particles: async () => (await import("./particles")).createParticles,
};

export async function initHeroBackground(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-hero-bg]");
  if (!canvas) return;
  const requested = new URLSearchParams(location.search).get("bg") ?? "grid";
  const key = requested in variants ? requested : "grid";
  canvas.dataset.variant = key;
  mountHeroBackground(canvas, await variants[key]());
}
