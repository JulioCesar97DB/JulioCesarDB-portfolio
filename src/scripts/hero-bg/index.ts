import { mountHeroBackground } from "./runtime";
import { createParticles } from "./particles";

export function initHeroBackground(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-hero-bg]");
  if (!canvas) return;
  mountHeroBackground(canvas, createParticles);
}
