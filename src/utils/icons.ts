import HTML from "@/icons/html.astro";
import CSS from "@/icons/css.astro";
import JavaScript from "@/icons/javascript.astro";
import TypeScript from "@/icons/type.astro";
import React from "@/icons/react.astro";
import Node from "@/icons/node.astro";
import MySQL from "@/icons/sql.astro";
import Git from "@/icons/git.astro";
import GitHub from "@/icons/GitHub.astro";
import Tailwind from "@/icons/tailwind.astro";
import Next from "@/icons/next.astro";
import Redux from "@/icons/Redux.astro";
import MongoDB from "@/icons/mongodb.astro";
import Docker from "@/icons/docker.astro";
import Django from "@/icons/django.astro";
import Jest from "@/icons/Jest.astro";
import GraphQL from "@/icons/GraphQL.astro";
import Figma from "@/icons/Figma.astro";
import MariaDB from "@/icons/mariadb.astro";
import AWS from "@/icons/aws.astro";
import Azure from "@/icons/azure.astro";
import Zustand from "@/icons/zustand.astro";
import Stripe from "@/icons/stripe.astro";
import Zod from "@/icons/zod.astro";
import Shadcn from "@/icons/shadcn.astro";
import XYFlow from "@/icons/xyflow.astro";
import TanStack from "@/icons/tanstack.astro";
import ReactHookForm from "@/icons/reacthookform.astro";

export type IconComponent = (_props: Record<string, unknown>) => unknown;

/**
 * Maps display skill names from cv.json to their internal icon key.
 * Only entries where the cv.json name differs from the icon key need to be listed.
 */
export const SKILL_NAME_MAP: Record<string, string> = {
	"Next.js": "Next",
	"Tailwind CSS": "Tailwind",
	"shadcn/ui": "Shadcn",
	"Stripe API": "Stripe",
	"Azure AD": "Azure",
	"AWS Amplify": "AWS",
	"AWS Cognito": "AWS",
	"TanStack Query": "TanStack",
	"React Hook Form": "ReactHookForm",
	"Kinde Auth": "Shadcn",
	"next-intl": "Next",
};

export const SKILL_ICONS: Record<string, IconComponent> = {
	HTML,
	CSS,
	JavaScript,
	TypeScript,
	React,
	Node,
	MySQL,
	Git,
	GitHub,
	Next,
	Tailwind,
	Redux,
	MongoDB,
	Docker,
	Django,
	Jest,
	GraphQL,
	Figma,
	MariaDB,
	AWS,
	Azure,
	Zustand,
	Stripe,
	Zod,
	Shadcn,
	XYFlow,
	TanStack,
	ReactHookForm,
};

/**
 * Resolves a skill name (as it appears in cv.json) to its icon component.
 * Returns undefined if no icon exists for that skill.
 */
export function getSkillIcon(skillName: string): IconComponent | undefined {
	const iconKey = SKILL_NAME_MAP[skillName] ?? skillName;
	return SKILL_ICONS[iconKey];
}
