import { mountHeroBackground } from "./runtime";
import { createGrid } from "./grid";

export function initHeroBackground(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-hero-bg]");
  if (!canvas) return;
  mountHeroBackground(canvas, createGrid);
}
