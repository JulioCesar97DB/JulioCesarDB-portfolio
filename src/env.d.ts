/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "@cv" {
	import type { CV } from "./cv";
	export const basics: CV["basics"];
	export const work: CV["work"];
	export const volunteer: CV["volunteer"];
	export const education: CV["education"];
	export const awards: CV["awards"];
	export const certificates: CV["certificates"];
	export const publications: CV["publications"];
	export const skills: CV["skills"];
	export const languages: CV["languages"];
	export const interests: CV["interests"];
	export const references: CV["references"];
	export const projects: CV["projects"];
}

/** Resume PDF size label (e.g. "1.5 MB"), injected at build time. */
declare const __RESUME_SIZE__: string;

/** Full SHA of the commit the site was built from, or "unknown", injected at build time. */
declare const __BUILD_COMMIT__: string;

declare namespace App {
  interface Locals {
    /** Ids of the technology marks already written on the page being rendered. */
    techMarks?: Set<string>;
  }
}
