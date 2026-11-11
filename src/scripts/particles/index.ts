import { mountBackground } from "./runtime";
import { createParticles } from "./field";

/** Mount a particle field on every background canvas on the page. */
export function initParticleBackgrounds(): void {
  for (const canvas of document.querySelectorAll<HTMLCanvasElement>("[data-particles]")) {
    mountBackground(canvas, createParticles);
  }
}
