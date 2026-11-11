import { mountHeroBackground, type VariantFactory } from "./runtime";

/**
 * The gradient is the default background; the particle variant stays
 * available for comparison via ?bg=particles. Each variant is code-split and
 * fetched only when used.
 */
const variants: Record<string, () => Promise<VariantFactory>> = {
  gradient: async () => (await import("./gradient")).createGradient,
  particles: async () => (await import("./particles")).createParticles,
};

export async function initHeroBackground(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-hero-bg]");
  if (!canvas) return;
  const requested = new URLSearchParams(location.search).get("bg") ?? "gradient";
  const key = requested in variants ? requested : "gradient";
  canvas.dataset.variant = key;
  mountHeroBackground(canvas, await variants[key]());
}
