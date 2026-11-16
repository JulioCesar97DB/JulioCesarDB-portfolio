import type { CV } from "@/cv";

type Profile = CV["basics"]["profiles"][number];

/** Networks the page links to, in display order, with the icon each one uses. */
const shown = [
  ["LinkedIn", "linkedin"],
  ["GitHub", "github"],
  ["X", "x"],
] as const;

export type SocialIcon = (typeof shown)[number][1];

/** The profiles the page links to; the rest of cv.json stays unlisted. */
export function socialLinks(profiles: Profile[]): Array<Profile & { icon: SocialIcon }> {
  return shown.flatMap(([network, icon]) => {
    const profile = profiles.find((p) => p.network === network);
    return profile ? [{ ...profile, icon }] : [];
  });
}
