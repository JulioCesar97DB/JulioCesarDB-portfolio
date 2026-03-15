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
