---
name: Julio César Díaz, Portfolio
description: A calm, typographic portfolio where real product screenshots are the loudest thing on the page.
colors:
  paper: "oklch(0.992 0.002 270)"
  paper-surface: "oklch(0.972 0.003 270)"
  paper-raised: "oklch(1 0 0)"
  ink: "oklch(0.205 0.012 270)"
  ink-secondary: "oklch(0.42 0.014 270)"
  ink-tertiary: "oklch(0.53 0.014 270)"
  hairline: "oklch(0.905 0.005 270)"
  hairline-strong: "oklch(0.84 0.006 270)"
  ultramarine: "oklch(0.5 0.21 276)"
  ultramarine-soft: "oklch(0.5 0.21 276 / 0.09)"
  night: "oklch(0.155 0.006 270)"
  night-surface: "oklch(0.19 0.007 270)"
  night-raised: "oklch(0.215 0.008 270)"
  night-ink: "oklch(0.965 0.003 270)"
  night-ink-secondary: "oklch(0.77 0.01 270)"
  night-ink-tertiary: "oklch(0.66 0.012 270)"
  night-hairline: "oklch(0.27 0.008 270)"
  night-hairline-strong: "oklch(0.34 0.009 270)"
  ultramarine-night: "oklch(0.76 0.135 278)"
  ultramarine-night-soft: "oklch(0.76 0.135 278 / 0.12)"
typography:
  display:
    fontFamily: "Mona Sans Variable, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 5.2vw, 6rem)"
    fontWeight: 640
    lineHeight: 0.95
    letterSpacing: "-0.04em"
    fontVariation: "\"wdth\" 118"
  headline:
    fontFamily: "Mona Sans Variable, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.625rem, 1.35rem + 1.1vw, 2.25rem)"
    fontWeight: 620
    lineHeight: 1.15
    letterSpacing: "-0.025em"
    fontVariation: "\"wdth\" 108"
  title:
    fontFamily: "Mona Sans Variable, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Mona Sans Variable, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.125rem, 1.02rem + 0.45vw, 1.375rem)"
    fontWeight: 420
    lineHeight: 1.5
  body:
    fontFamily: "Mona Sans Variable, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 420
    lineHeight: 1.6
  body-sm:
    fontFamily: "Mona Sans Variable, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 420
    lineHeight: 1.55
  label:
    fontFamily: "Mona Sans Variable, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 420
    lineHeight: 1.5
  meta:
    fontFamily: "Geist Mono Variable, ui-monospace, SF Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "\"tnum\""
rounded:
  focus: "4px"
  nav: "0.5rem"
  control: "0.625rem"
  frame-inner: "0.6875rem"
  frame: "1rem"
  menu: "0.875rem"
  glass-bar: "1.75rem"
  pill: "9999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  control-x: "1rem"
  frame-mat: "0.375rem"
  grid-gap: "3rem"
  section: "6rem"
  section-lg: "8rem"
  container: "72rem"
components:
  button:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.75rem"
  button-hover:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-secondary}"
    textColor: "{colors.paper}"
  icon-button:
    textColor: "{colors.ink-tertiary}"
    rounded: "{rounded.control}"
    size: "2.75rem"
  icon-button-hover:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink}"
  link:
    textColor: "{colors.ultramarine}"
  frame:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.frame}"
    padding: "{spacing.frame-mat}"
  section-title:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  metric:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  stack:
    textColor: "{colors.ink-tertiary}"
    typography: "{typography.label}"
  meta:
    textColor: "{colors.ink-tertiary}"
    typography: "{typography.meta}"
---

# Design System: Julio César Díaz, Portfolio

## Overview

**Creative North Star: "The Quiet Product Page"**

The category standard executed at product-company craft (the Linear, Vercel, Stripe register): a calm, left-aligned, typographic page in which real product screenshots, held in raised frames, are the loudest objects. Everything else (type, hairlines, a single accent) recedes so the work carries the page. The world follows the OS: a near-white cool paper by day, a near-black cool ink by night, with identical structure in both.

Density is relaxed and editorial: generous section padding, a 12-column grid that splits into a 4/8 label-and-content rhythm for Experience and About, and a measure held to 64-68ch for prose. Hierarchy comes from Mona Sans's width axis and weight, not from colour or ornament. The display name is set wide and tight; section titles a little less wide; everything below sits at the normal width.

This world explicitly replaces the sticky-sidebar, dark-navy portfolio template the site previously wore, and refuses the hero-metric and pill-badge kit. Craft lives in small, honest interactions: the name hands off to a wordmark when it scrolls away, a hairline glow follows the pointer around product frames, disclosures ease open, and copying the email confirms inline.

**Key Characteristics:**
- Cool grey neutrals (hue 270) with one ultramarine-violet accent reserved for links and actions.
- Light and dark both. Every token is a `light-dark()` pair; the scheme follows the OS unless the visitor pins Light or Dark in the theme menu (`data-theme` on `<html>`, remembered in localStorage, applied before first paint).
- Mona Sans Variable throughout, with the width axis as the display lever; Geist Mono only for dates and years.
- Hairline 1px borders and tonal surface bands as structure; layered soft shadow only on product frames.
- No pills, no eyebrows, no cards-as-structure, no decorative monospace.

## Colors

A restrained cool-grey ladder with a single saturated ultramarine-violet voice; the dark theme is the same ladder inverted, with the accent lifted and softened for legibility on near-black.

### Primary
- **Ultramarine Violet** (light `ultramarine`, dark `ultramarine-night`): text links, the pointer-tracked frame glow, the focus ring, the copy-email confirmation check, linked-title hover, and the text-selection highlight. It marks what can be acted on and nothing else.
- **Ultramarine Wash** (`ultramarine-soft`, `ultramarine-night-soft`): a 9-12% tint of the accent, available for hover and pressed washes behind accent-bearing controls. Defined in the build but not yet used on the home surface.

### Neutral
- **Cool Paper** (`paper` / `night`): page background.
- **Paper Band** (`paper-surface` / `night-surface`): full-bleed tonal bands that separate the Experience and Contact sections, icon-button hover fill, and the image placeholder inside frames.
- **Raised Plate** (`paper-raised` / `night-raised`): the face of buttons and product frames, one step lighter than the page.
- **Ink** (`ink` / `night-ink`): headings, primary-button fill, emphasised body (lead paragraph, metrics, positions, definition values).
- **Ink Secondary** (`ink-secondary` / `night-ink-secondary`): default body text and fact items; primary-button hover fill.
- **Ink Tertiary** (`ink-tertiary` / `night-ink-tertiary`): metadata, roles, tech stacks, definition terms, nav links at rest, icon-button glyphs.
- **Hairline** (`hairline` / `night-hairline`): every structural rule: list dividers, section borders, frame edge, the scrolled top-bar underline.
- **Hairline Strong** (`hairline-strong` / `night-hairline-strong`): button borders, the scrollbar thumb, and the short dash that marks Experience highlights.

### Named Rules
**The Reserved Accent Rule.** Ultramarine is spent only on things a visitor can act on (links, focus, the frame a pointer is over, an action's confirmation). Headings, metrics, markers and backgrounds stay neutral.

**The Ink Button Rule.** The primary action is filled with ink, not accent. Accent is a link colour; the strongest button is the darkest neutral.

**The Shared Ladder Rule.** Light and dark use the same token names and the same roles; a new surface defines both values or none.

## Typography

**Display Font:** Mona Sans Variable (with ui-sans-serif, system-ui, -apple-system, sans-serif)
**Body Font:** Mona Sans Variable (same stack)
**Label/Mono Font:** Geist Mono Variable (with ui-monospace, SF Mono, monospace), dates and years only

**Character:** One grotesque doing all the work, its width axis stretched for the name and section titles and left at 100% for reading. The mono is a data face, not a mood.

### Hierarchy
- **Display** (640, clamp(2.75rem → 6rem), 0.95, width 118%, -0.04em): the hero name, once per page.
- **Headline** (620, clamp(1.625rem → 2.25rem), 1.15, width 108%, -0.025em): section titles and the closing contact statement.
- **Title** (600, 1.25rem, 1.3, -0.015em): product names, employers, sub-headings such as More work and Toolkit. The lead project title runs larger (clamp(1.75rem → 2.5rem), width 110%, -0.03em) as a single exception.
- **Lead** (420, clamp(1.125rem → 1.375rem), 1.5): the hero statement and the contact sub-line, held to 34-52ch.
- **Body** (420, 1rem on a root that scales 16-18px, 1.6): paragraphs at 64-68ch, `text-wrap: pretty`. Emphasis is weight 560-600 in ink, never colour.
- **Body small** (420, 0.9375rem, 1.55): fact lines, positions, More work descriptions, definition values, nav links, menu items, the hero meta line.
- **Label** (420, 0.875rem): roles, stacks, definition terms, metadata lines.
- **Meta** (Geist Mono, 0.8125rem, 1.4, tabular): employment date ranges and project years.

### Named Rules
**The Width-Axis Rule.** Display hierarchy comes from `font-stretch` on Mona Sans (118% name, 108-110% headlines), paired with tighter tracking. Don't reach for a second display family.

**The Data-Only Mono Rule.** Geist Mono appears only where a value is a date or a year. Labels, nav, buttons and stacks stay in Mona Sans. All numerals in dates use tabular figures.

## Layout

A single centred container (max 72rem) with fluid gutters (clamp(1.25rem, 4vw, 3rem)). Sections breathe with 6rem vertical padding, 8rem from the large breakpoint. On large screens the 12-column grid takes two shapes: a 7/5 split for the lead project (frame left, text right), and a 4/8 split for Experience and About in which the section title sits sticky in the narrow column (top 7rem). Feature projects fall into a 1/2/3-column grid with 2rem column and 3.5rem row gaps. The More work list becomes a four-column row (year, name, description, links) from the small breakpoint.

The hero is left-aligned with deep top padding (8 → 10 → 12rem) so the top edge of the first product frame peeks above the fold. A fixed 4rem top bar sits over everything; anchor targets scroll with 5rem padding to clear it. Section bands (Experience, Contact) alternate the page background with the surface tone, bounded by hairlines, instead of using cards.

## Elevation & Depth

Flat by default. Depth is carried by tonal steps (page, band, raised plate) and hairlines. Content casts exactly one shadow: the product frame, with a three-layer soft shadow whose colour is a tinted cool grey in light and a near-black in dark. Chrome that floats above content (the glass top bar once scrolled, and the theme menu) is the only other lifted layer, and it is glass, not a plate.

### Glass
The one place the page uses glass, because the bar genuinely floats over moving content. Fill `--glass-fill` (white 72% / ink 74%), `backdrop-filter: blur(20px) saturate(1.8)`, a 1px edge `--glass-edge`, a bright inset top rim `--glass-rim` (light catching the edge), a faint specular gradient over the upper half, and a soft drop (`0 10px 30px -10px` + `0 2px 6px -2px`). Without backdrop-filter support it falls back to the opaque raised plate. The theme menu uses the same recipe at blur 24px.

Three liquid-glass layers sit inside the bar, all scaled by `--glass`:
- **Rim:** a 1px gradient ring (masked to the border) bright at the top left, fading along the sides and catching light again at the bottom right, like the bevel of thick glass.
- **Specular:** a soft 9×4rem radial highlight that follows a fine pointer across the bar while it is hovered.
- **Hover capsule:** a small lens of glass (white 60% / white 9%, blur 8px, saturate 1.8, bright inset top rim, faint inner ring, soft drop) that appears under the hovered or keyboard-focused control (wordmark, nav links, theme button) and flows between controls: its two edges animate separately on an exponential ease-out, the leading edge in the direction of travel at 0.35s and the trailing edge at 0.7s, so it stretches as it travels and draws back in on arrival, with no overshoot. It blooms in place on first appearance and tracks its control while the bar contracts. It replaces the plain hover fill of bar icon buttons.
- **Résumé sheen:** on hover a diagonal highlight sweeps across the button (0.7s, expo-out).

### Shadow Vocabulary
- **Frame lift, light** (`box-shadow: 0 1px 1px hsl(270 20% 20% / 0.04), 0 4px 10px -2px hsl(270 20% 20% / 0.06), 0 24px 48px -16px hsl(270 20% 20% / 0.16)`): product frames only.
- **Frame lift, dark** (`box-shadow: 0 1px 1px hsl(270 30% 2% / 0.3), 0 6px 14px -4px hsl(270 30% 2% / 0.4), 0 30px 60px -20px hsl(270 30% 2% / 0.7)`): the same frames in dark mode.

### Named Rules
**The One Lifted Object Rule.** Among content, only screenshots of real work are raised. Text, buttons, lists and sections never cast shadows; only floating chrome (glass bar, theme menu) may.

## Shapes

Gently rounded and consistent: controls at 10px (0.625rem), nav and wordmark hit areas at 8px, product frames at 16px with the screenshot inset at 11px so the inner corner stays concentric inside the 6px mat. The focus ring is a 2px accent outline offset 3px with a 4px radius. Borders are always 1px. Screenshots hold a fixed 900:560 ratio. List markers are short 8px horizontal dashes, never bullets or glyphs. Icons are one inline stroke set on a 24px grid at 1.75 stroke; GitHub and LinkedIn are the only filled marks.

## Components

### Buttons
Quiet and hairline-bound; the fill is earned only by the primary action.
- **Shape:** gently rounded (0.625rem), 2.75rem minimum height, 1rem horizontal padding, 0.9375rem label at weight 540, 0.5rem icon gap.
- **Default:** raised-plate face, hairline-strong border, ink label. Hover shifts the border to ink tertiary.
- **Primary:** ink fill and border with a paper label; hover lightens fill and border to ink secondary. Used once per action group (the hero Résumé).
- **Active:** a 1px downward press on an expo-out curve (0.2s, cubic-bezier(0.16, 1, 0.3, 1)).
- **Icon button:** 2.75rem square, no border, ink-tertiary glyph; hover fills with the surface tone and darkens the glyph to ink.

### Email action (signature)
A joined pair: a button showing the visible address as a mailto link, fused (negative 1px margin, squared inner corners) to a 2.75rem copy button. On copy the glyph swaps to an accent check for 2s, the label changes to "Email address copied", and a polite live region announces it. On clipboard failure the live region speaks the address instead. Works without JavaScript as a plain mailto.

### Links
- **Text link:** accent colour, underline invisible at rest (1px, offset 0.22em) and fading in on hover over 0.2s.
- **Linked titles:** stay ink with a tertiary up-right arrow; hover turns the title accent.

### Product frame (signature)
- **Corner Style:** 1rem outer, 0.6875rem image.
- **Background:** raised plate with a 0.375rem mat around the screenshot; surface tone behind the image while it loads.
- **Shadow Strategy:** the frame lift (see Elevation & Depth).
- **Border:** 1px hairline. On a fine pointer, a 1px accent highlight (18rem radial, masked to the border ring) tracks the cursor and fades in over 0.35s on hover or when the wrapping link takes keyboard focus.
- **Tilt:** on a fine pointer the frame rotates up to 4° toward the cursor in 1200px perspective (`--rx/--ry`, written once per animation frame), tracking at 0.12s and easing home over 0.7s (expo-out) on leave. Disabled under reduced motion.

### Section title
Headline style in ink, used for every section heading. On large screens in the 4/8 sections it sticks in the left column.

### Metric
One visible proof line per Experience role, in ink at weight 560 on body size. Plain text: no badge, no tint, no oversized number.

### Fact list
Short proof lines under each project, inset 1.25rem with an 8px, 1px dash marker; body text in ink secondary. Experience highlights use the same pattern with a hairline-strong dash, behind a disclosure.

### Stack
Technologies as plain words in ink tertiary at 0.875rem, separated by space alone (0.25rem row, 1.5rem column gap) so nothing dangles at a line end. No chips, no separators, no logos.

### Meta
Geist Mono 0.8125rem, ink tertiary, tabular figures; date ranges and years only.

### Disclosure
"Show details / Hide details" summary in label size, ink tertiary to ink on hover, with a chevron that rotates 180° over 0.3s. Where the browser can interpolate to `auto`, the content eases open in height over 0.4s (expo-out) with a 0.3s fade; elsewhere it simply opens.

### Navigation
A fixed top bar, invisible chrome spanning the 72rem container at the top of the page. Its transformation into a floating glass pill (max 46rem wide, 3.25rem tall, 0.75rem from the top, 1.75rem radius; see Glass) is scroll-linked rather than toggled: between 40px and 360px of scroll a smoothed scroll position (eased toward the real one each frame, so stepped wheels glide) drives three overlapping phases written as CSS custom properties: `--glass` (material fades in over the first half), `--shrink` (contraction from 12% to the end) and `--fill` (the Résumé button fills with ink over the last third). Every visual property of the bar interpolates from them. On large screens the hero name morph completes at the same 360px, so name and pill settle together. On phones Résumé collapses to a round icon button. Nav links (Work, Experience, About) are body-small ink tertiary, ink on hover, and ink when their section crosses the top third of the viewport.
### Theme menu
An icon button in the bar (sun, moon or monitor for the current choice) opens a native `popover` menu of three `menuitemradio` options: Light, Dark, System, with an accent check on the active one. Open, close, Escape and light-dismiss come from the Popover API; it is anchored under its trigger with CSS anchor positioning (fixed top-right fallback), enters with a 0.25s fade, lift and scale via `@starting-style`, and supports arrow-key movement.

### Scroll motion
CSS scroll-driven animations only (`animation-timeline: view()`), inside `@supports` and `prefers-reduced-motion: no-preference`, so content is fully visible everywhere else.
- **Name handoff (large screens):** the hero name itself flies into the top bar. It scrolls with the page until its centre meets the wordmark's, then rides inside the bar; across the bar's full 360px range it slides to the wordmark, scales to its size and eases width (118% → 100%), weight (640 → 600) and tracking to the wordmark's values (ease-in-out cubic), then hides as the real wordmark appears in the same place. Scroll-linked and reversible, rendered above the glass bar while in flight; measured with `getBoundingClientRect`, one write per animation frame.
- **Recede (small screens):** where the handoff is off, the hero name fades to 15%, rises 2rem and scales to 0.96 as it exits, and the wordmark (initials on phones) fades in.
- **Rise:** the lead product frame lifts from `rotateX(18deg) scale(0.9)` to flat as it enters (range entry 0% to cover 45%), like a device lifting off a table.
- **Lift:** project text, feature projects, More work rows and Experience roles arrive with a 1.75rem rise and fade (entry 0% to 70%).

### Particle background
A particle constellation behind two regions: the hero plus Selected work (ending where the Experience band begins, bottom edge fading), and About (between the Experience and Contact bands, both edges fading over 10rem). Each region gets its own field via `ParticleBackground` inside a `relative` wrapper marked `data-bg-region`, which also receives pointer input. The field: drifting 2px points in ink tertiary, joined by hairlines when closer than 120px. Near a fine pointer, points within 170px are gathered gently toward it and linked to it in the accent. Density scales with area (capped at 110 points per canvas), and dark mode lifts line and point opacity so the field reads equally in both themes. The layer spans the whole region but the canvas inside is one viewport tall and `position: sticky`, so it stays behind whatever is on screen at the cost of a single screen; its bottom 14rem fades into the page. It renders only while on screen and the tab is visible, follows the theme (tokens resolved through computed style, since canvas cannot parse light-dark()), caps the pixel ratio at 2x, and holds still under reduced motion.

### Global states
Text selection is accent on paper. The scrollbar is hairline-strong on the page colour. Reduced-motion collapses every transition and disables smooth scrolling.

## Do's and Don'ts

### Do:
- **Do** reserve ultramarine for links, focus, frame hover glow and action confirmations.
- **Do** fill the primary action with ink and keep every other button a hairline-bordered raised plate.
- **Do** get display hierarchy from Mona Sans's width axis (118% name, 108-110% headlines) with negative tracking.
- **Do** set dates and years in Geist Mono with tabular figures, and nothing else.
- **Do** separate sections with hairlines and surface-tone bands rather than cards.
- **Do** raise only product screenshots, in the frame with its layered soft shadow.
- **Do** define every new colour as a `light-dark()` pair so the OS setting and the theme menu both drive it.
- **Do** keep every interactive target at least 2.75rem and honour reduced motion.

### Don't:
- **Don't** use pills, chips or badges for technologies, metrics or status.
- **Don't** place eyebrows or kickers above section titles.
- **Don't** use monospace for labels, nav, buttons or decoration.
- **Don't** use the accent for headings, markers, numbers or background fills.
- **Don't** return to the sticky-sidebar, dark-navy portfolio template or its section titles.
- **Don't** put shadows on text, buttons, lists or sections.
- **Don't** use glyph or emoji icons; use the single inline stroke set.
- **Don't** spread glass beyond floating chrome (top bar, menus); content surfaces stay solid.
- **Don't** animate on scroll outside the three motions above, or without the reduced-motion and `@supports` guards.
