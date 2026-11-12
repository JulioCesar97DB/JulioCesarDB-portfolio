/** "Second Window" -> "second-window". */
export function slug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Anchor id of a project shown in Selected work. */
export const projectAnchor = (title: string) => `work-${slug(title)}`;

/** Anchor id of a role in Experience. */
export const roleAnchor = (employer: string) => `experience-${slug(employer)}`;
