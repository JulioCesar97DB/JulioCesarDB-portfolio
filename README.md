# Julio César Díaz — Portfolio

Source code for my personal portfolio at **[juliocesardb.com](https://www.juliocesardb.com)**: a single-page site that presents who I am, where I've worked, what I've built and how to reach me, plus a full project archive.

It's a static site built with Astro and Tailwind CSS. All the content lives in one JSON file, so updating the portfolio means editing data, not markup.

## Stack

- **[Astro 7](https://astro.build)**: static output, no client framework. The only client-side JavaScript is two small scripts: scroll-spy navigation and the cursor spotlight.
- **[Tailwind CSS 4](https://tailwindcss.com)**: CSS-first configuration through `@theme` in `src/styles/global.css`, via `@tailwindcss/vite`.
- **TypeScript**: typed CV data (`src/cv.d.ts`), checked by `astro check` on every build.
- **Fonts**: Inter Variable and JetBrains Mono, self-hosted through Fontsource.

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Sticky sidebar (name, role, tagline, in-page nav, social links) next to the About, Experience, Projects, Skills, Education and Contact sections |
| `/archive` | Every project in a table, newest first, with year, company, stack and links |

## Content: `cv.json`

Everything on the site comes from `cv.json` at the project root, imported through the `@cv` alias (see `astro.config.mjs`). Its shape is typed in `src/cv.d.ts`.

| Key | Used for |
| --- | --- |
| `basics` | Name, role (`label`), `tagline`, location, email, social `profiles`, the About paragraphs (`aboutParagraphs`) and the phrases highlighted in them (`summaryHighlights`), plus the page description and Open Graph image |
| `work` | Experience entries: summary, location, skills, and the responsibilities/achievements shown under "View details" |
| `projects` | Featured projects, the "Other Noteworthy Projects" grid and the archive |
| `skills` | The Skills section, grouped by `level` (`Expert` vs. everything else) |
| `education`, `certificates` | The Education & Certifications section |

### Adding a project

1. Add a screenshot to `public/projects/` (WebP, around 16:10).
2. Add an entry to `projects` in `cv.json`:

   ```json
   {
     "name": "Project name",
     "image": "/projects/project-name.webp",
     "isActive": true,
     "description": "One or two sentences on what it is and what it does.",
     "url": "https://example.com",
     "github": "",
     "year": "2026",
     "madeAt": "Company or Personal",
     "keywords": ["Next.js", "TypeScript"]
   }
   ```

The first five projects with `isActive: true` are shown as featured cards with their screenshot. The rest appear in the smaller grid below. Leave `url` or `github` empty to render a project without that link.

## Design system

The tokens live in the `@theme` block of `src/styles/global.css`:

- **Palette**: navy surfaces, three slate text tones, a dimmed slate for secondary metadata, and a single teal accent.
- **Type steps**: `text-meta` (dates, locations), `text-card` (job and project copy), `text-lead` (About and Contact prose) and `text-section` (section titles), on top of Tailwind's default scale.
- **Fluid sizing**: the root font size grows from 16px (up to 1280px wide) to 18px at 1920px and caps at 20px from 2560px. Because type, spacing and the page container are all in `rem`, the whole layout scales together on large monitors while breakpoints stay put.

Base element styles sit in `@layer base` and the custom classes (`.tag-badge`, `.glass-card`, `.sibling-dim`, `.text-highlight`) in `@layer components`. Keep new global CSS inside a layer: in Tailwind 4, unlayered rules override every utility class.

Interaction details: the nav highlights the section in view, hovering a card dims its siblings on desktop, and a soft spotlight follows the cursor. The spotlight is turned off on touch devices and when the visitor prefers reduced motion.

## Getting started

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Then open [http://localhost:4321](http://localhost:4321).

| Command | Action |
| --- | --- |
| `npm run dev` / `npm start` | Start the dev server at `localhost:4321` |
| `npm run build` | Type-check with `astro check`, then build the static site into `dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```text
.
├── cv.json                  # All site content
├── astro.config.mjs         # Tailwind plugin and the @cv / @ path aliases
├── public/
│   ├── projects/            # Project screenshots (WebP)
│   ├── og.png               # Social preview image
│   └── favicon.*, icon-*    # Favicons, app icons and site.webmanifest
└── src/
    ├── components/
    │   ├── sections/        # About, Experience, Projects, Skills, Education, Contact
    │   ├── Sidebar.astro    # Name, role, tagline, nav and social links
    │   ├── Section.astro    # Shared section wrapper and title
    │   ├── FeaturedProject.astro
    │   ├── ProjectCard.astro
    │   ├── ArchiveTable.astro
    │   └── SocialLinks.astro
    ├── icons/               # SVG icon components
    ├── layouts/Layout.astro # <head>, SEO / Open Graph tags, fonts, spotlight
    ├── pages/               # index.astro (/) and archive.astro (/archive)
    ├── scripts/             # scrollspy.ts, spotlight.ts
    ├── styles/global.css    # Theme tokens, base and component layers
    ├── utils/               # Date formatting, icon map
    └── cv.d.ts              # Types for cv.json
```

## License

[MIT](LICENSE.txt) © Julio César Díaz
