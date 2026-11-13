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
  control: "9999px"
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
    padding: "0 1.125rem"
    height: "2.75rem"
  button-hover:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 1.125rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-secondary}"
    textColor: "{colors.paper}"
  icon-button:
    textColor: "{colors.ink-tertiary}"
    rounded: "{rounded.control}"
    size: "2.75rem"
  icon-button-hover:
    backgroundColor: "{colors.paper-raised}"
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

Density is relaxed and editorial: generous section padding, a 12-column grid that splits into a 4/8 label-and-content rhythm for Experience, Skills and About, and a measure held to 64-68ch for prose. Hierarchy comes from Mona Sans's width axis and weight, not from colour or ornament. The display name is set wide and tight; section titles a little less wide; everything below sits at the normal width.

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
- **Raised Plate** (`paper-raised` / `night-raised`): the face of product frames, one step lighter than the page; also the opaque fallback for glass where `backdrop-filter` is missing.
- **Ink** (`ink` / `night-ink`): headings, primary-button fill, emphasised body (lead paragraph, metrics, positions, definition values).
- **Ink Secondary** (`ink-secondary` / `night-ink-secondary`): default body text and fact items; primary-button hover fill.
- **Ink Tertiary** (`ink-tertiary` / `night-ink-tertiary`): metadata, roles, tech stacks, definition terms, nav links at rest, icon-button glyphs.
- **Hairline** (`hairline` / `night-hairline`): every structural rule: list dividers, section borders, frame edge, the scrolled top-bar underline.
- **Hairline Strong** (`hairline-strong` / `night-hairline-strong`): the scrollbar thumb, jump-link underlines, and the short dash that marks Experience highlights.

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
- **Title** (600, 1.25rem, 1.3, -0.015em): product names, employers, sub-headings such as Also in the toolkit, and the core skill names. The lead project title runs larger (clamp(1.75rem → 2.5rem), width 110%, -0.03em) as a single exception.
- **Lead** (420, clamp(1.125rem → 1.375rem), 1.5): the hero statement and the contact sub-line, held to 34-52ch.
- **Body** (420, 1rem on a root that scales 16-18px, 1.6): paragraphs at 64-68ch, `text-wrap: pretty`. Emphasis is weight 560-600 in ink, never colour.
- **Body small** (420, 0.9375rem, 1.55): fact lines, positions, role highlights, skill evidence, definition values, nav links, menu items, the hero meta line.
- **Label** (420, 0.875rem): roles, stacks, definition terms, metadata lines.
- **Meta** (Geist Mono, 0.8125rem, 1.4, tabular): employment date ranges and project years.

### Named Rules
**The Width-Axis Rule.** Display hierarchy comes from `font-stretch` on Mona Sans (118% name, 108-110% headlines), paired with tighter tracking. Don't reach for a second display family.

**The Data-Only Mono Rule.** Geist Mono appears only where a value is a date or a year. Labels, nav, buttons and stacks stay in Mona Sans. All numerals in dates use tabular figures.

## Layout

A single centred container (max 72rem) with fluid gutters (clamp(1.25rem, 4vw, 3rem)). Sections breathe with 6rem vertical padding, 8rem from the large breakpoint. On large screens the 12-column grid takes two shapes: a 7/5 split for the lead project (frame left, text right), and a 4/8 split for Experience, Skills and About in which the section title sits sticky in the narrow column (top 7rem). Feature projects fall into a 1/2/3-column grid with 2rem column and 3.5rem row gaps. The lead project is a two-row grid: the text column spans both rows, and the architecture strip sits under the frame. Skills rows are a two-column definition list (11rem term, evidence beside it) from the small breakpoint.

The hero is left-aligned with deep top padding (8 → 10 → 12rem) so the top edge of the first product frame peeks above the fold. A fixed 4rem top bar sits over everything; anchor targets scroll with 5rem padding to clear it. Section bands (Experience, Contact) alternate the page background with the surface tone, bounded by hairlines, instead of using cards.

## Elevation & Depth

Depth is carried by tonal steps (page, band, raised plate) and hairlines. Two kinds of thing are lifted. Content casts exactly one shadow: the product frame, with a three-layer soft shadow whose colour is a tinted cool grey in light and a near-black in dark. Everything a visitor operates (the top bar once scrolled, the theme menu, buttons) is glass, and glass casts its own soft drop.

### Glass
Glass is the material of controls and floating chrome; content surfaces (product frames, text, sections) stay solid. Chosen 2026-11-12 at the owner's request, after Apple's Liquid Glass. There are two fills over one set of edges, all `light-dark()` tokens in global.css:
- **Panel** (`--glass-fill`: cool grey 93% lightness at 66% / ink at 68%): the top bar and the theme menu. In light it is a tint, not white, so it reads as a surface on white paper and a brighter lens can sit on it, the way a segmented control's thumb sits on its track.
- **Lens** (`--glass-lens` white 50% / white 8%, `--glass-lens-hover` white 92% / white 13%): buttons over the page, and the lens an icon button forms on hover.
- **Edges:** `--glass-edge` (the 1px contour), `--glass-rim` (light on the top edge, inset), `--glass-low` (shade inside the bottom edge, a hard 1px line plus a soft inner falloff), `--glass-sheen` (a highlight fading out over the upper half), `--glass-drop` (the shadow colour). `--glass-bevel` and `--glass-lift` / `--glass-lift-hover` compose them; use those rather than rebuilding the stack.
- **Clear** (`--glass-clear`: near-white at 40% / ink at 46%): the top bar only. Following Apple's own account of Liquid Glass, the bar is defined by light on its edge and the bend of what passes behind, not by a tint, so content scrolling under it shows through and colours it.
- **Fill on glass** (`--glass-tint`: ink 7.5% / white 12%): anything that sits on a pane (the hover capsule, the hovered menu option, the bar's Resume before it fills) is a thin fill with a lit top edge, never a second pane. No glass on glass.
- **Glow** (`--glass-glow`): light gathered just inside a pane's edge (part of `--glass-bevel`), and the illumination that rises under a fine pointer on buttons (`--px/--py`, 70% on hover, full on press).
- **Backdrop:** the menu `blur(24px) saturate(1.9)`, lenses `blur(7px) saturate(2)`, the bar `blur(5px) saturate(2.2)` (6px of frost where the lens runs) under a sheen held to 40%, so text and screenshots passing behind stay visible. Nothing inside the bar blurs again. Without `backdrop-filter` every glass surface falls back to the opaque raised plate.

**Adaptive bar.** Like a small Liquid Glass bar, it flips between its light and dark style to suit what is behind it. Each product screenshot is reduced once to a 16×10 luminance grid; while scrolling, the cells under the bar are averaged with the page colour around them, and below 0.42 the bar takes the dark scheme, above 0.56 the light one (hysteresis between). The flip is `color-scheme` on `.bar` (`data-over` on the header), so every `light-dark()` token inside follows, eased over 0.45s. The theme menu is too large to flip and keeps the page's scheme.

**The bar as a lens (Chromium only).** Where the browser can run an SVG filter on a backdrop, `html.lens` swaps the bar's blur for `#bar-lens`: a displacement map painted on a canvas for the settled pill (red/green = offset along the inward normal, growing toward the rim across a bezel of half the radius, 13px at most) bends what passes under the rounded edge, and the map's blue channel masks the frost so the rim stays crisp while the middle, where the labels sit, is fully blurred (6px). Bend (28px) and frost follow the same scroll phases as the rest of the material. WebKit (Safari, and every browser on iOS) cannot run the lens, so a bezel stands in for it there (`.bar-bezel`): along the top and bottom edges the backdrop is taken again almost unblurred and brighter, fading into the frosted middle. Firefox keeps the plain blur. The bar's contour is a single 1px hairline with the rim ring lighting part of it; no other line is drawn along its edge.

Three more layers sit inside the bar, all scaled by `--glass`:
- **Rim:** a 1px gradient ring (masked to the border) bright at the top left, fading along the sides and catching light again at the bottom right, like the bevel of thick glass.
- **Specular:** a soft 9×4rem radial highlight (white 50% / 10%) that follows a fine pointer across the bar while it is hovered. Kept weak in light so it never washes out the capsule.
- **Hover capsule:** a thin fill (`--glass-tint`, lit top edge) that appears under the hovered or keyboard-focused control (wordmark, nav links, theme button) and flows between controls: its two edges animate separately on an exponential ease-out, the leading edge in the direction of travel at 0.35s and the trailing edge at 0.7s, so it stretches as it travels and draws back in on arrival, with no overshoot. It blooms in place on first appearance and tracks its control while the bar contracts. It replaces the lens bar icon buttons would form on their own.
- **Resume sheen:** on hover a diagonal highlight sweeps across the button (0.7s, expo-out).

### Shadow Vocabulary
- **Frame lift, light** (`box-shadow: 0 1px 1px hsl(270 20% 20% / 0.04), 0 4px 10px -2px hsl(270 20% 20% / 0.06), 0 24px 48px -16px hsl(270 20% 20% / 0.16)`): product frames only.
- **Frame lift, dark** (`box-shadow: 0 1px 1px hsl(270 30% 2% / 0.3), 0 6px 14px -4px hsl(270 30% 2% / 0.4), 0 30px 60px -20px hsl(270 30% 2% / 0.7)`): the same frames in dark mode.

### Named Rules
**The One Lifted Object Rule.** Among content, only screenshots of real work are raised. Text, lists and sections never cast shadows; glass (bar, menu, buttons) casts the soft `--glass-drop` and nothing harder.

## Shapes

Gently rounded and consistent: controls are capsules (full radius; icon buttons are circles), the theme menu 18px with 13px options, product frames at 16px with the screenshot inset at 11px so the inner corner stays concentric inside the 6px mat. The focus ring is a 2px accent outline offset 3px with a 4px radius. Borders are always 1px. Screenshots hold a fixed 900:560 ratio. List markers are short 8px horizontal dashes, never bullets or glyphs. Icons are one inline stroke set on a 24px grid at 1.75 stroke; GitHub, LinkedIn and the technology marks in Skills are the only filled marks; technology marks are always one colour (ink tertiary, ink when their row is hovered), never their brand colour.

## Components

### Buttons
Quiet and hairline-bound; the fill is earned only by the primary action.
- **Shape:** a capsule, 2.75rem minimum height, 1.125rem horizontal padding, 0.9375rem label at weight 540, 0.5rem icon gap.
- **Default:** a glass lens: `--glass-lens` fill with the sheen, 1px contour, the bevel and `--glass-lift`; ink label. Hover brightens the fill to `--glass-lens-hover`, deepens the drop and lifts 1px.
- **Primary:** solid ink with the bevel of glass: a paper label, a faint top rim and a short sheen (`--primary-rim`, `--primary-sheen`; white 16% and 9% in light). Ink stays opaque: a white sheen over translucent ink turns it a milky grey. Hover retints to ink secondary. The bar's Resume fades from the clear-glass highlights to these as it fills. Used once per action group (the hero Resume).
- **Active:** a 1px downward press and a 1.5% squeeze with the drop collapsing (0.12s).
- **Icon button:** a 2.75rem circle, bare ink-tertiary glyph at rest; on hover or keyboard focus a lens forms under it (fill, bevel, contour, drop, blur easing in over 0.25s) and the glyph darkens to ink.

### Email action (signature)
A joined pair in one piece of glass (`.btn-group`): the visible address as a mailto link and a 2.75rem copy segment, flat inside the capsule and split by a 1px contour line; each segment tints faintly on hover. On copy the glyph swaps to an accent check for 2s, the label changes to "Email address copied", and a polite live region announces it. On clipboard failure the live region speaks the address instead. Works without JavaScript as a plain mailto.

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

### Jump link
- In-page links that connect a claim to its evidence (a skill to the projects that used it, a role to its project above). Ink text with a 1px hairline-strong underline; hover takes the accent on both. Never the accent at rest: a row of six would break the Reserved Accent Rule.
- **Arrival:** the target answers once, 0.45s after the jump: a project frame lights its accent border, a role name takes the accent, then both return over 2s. Off under reduced motion.

### Architecture strip
- The layers a request crosses in the lead project, as stops on one hairline: 7px ringed dots with the layer name beside (small screens, top to bottom) or below (large screens, left to right). The line runs from the first stop to the last.
- A short accent pulse travels the line twice when the strip is revealed and loops only while it is hovered, so nothing moves unattended for more than five seconds. Off under reduced motion.

### Navigation
A fixed top bar, invisible chrome spanning the 72rem container at the top of the page. Its transformation into a floating glass pill (max 46rem wide, 3.25rem tall, 0.75rem from the top, 1.75rem radius; see Glass) is scroll-linked rather than toggled: between 24px and 260px of scroll a smoothed scroll position (eased toward the real one each frame, so stepped wheels glide) drives three overlapping phases written as CSS custom properties: `--glass` (material fades in over the first half), `--shrink` (contraction from 12% to the end) plus `--fill` (the Resume button fills with ink, animated over 0.45s, only once the hero's own Resume button has scrolled out of view, so two ink buttons never share the screen). Every visual property of the bar interpolates from them. The hero name morph runs on the real scroll position instead and lands shortly after the name reaches the bar (near the same 260px on large screens), so name and pill settle together. On phones Resume collapses to a round icon button. Nav links (Work, Experience, About) are body-small ink tertiary, ink on hover, and ink when their section crosses the top third of the viewport.
### Theme menu
An icon button in the bar (sun, moon or monitor for the current choice) opens a native `popover` menu of three `menuitemradio` options: Light, Dark, System, with an accent check on the active one. Open, close, Escape and light-dismiss come from the Popover API; it is anchored under its trigger with CSS anchor positioning (fixed top-right fallback), enters with a 0.25s fade, lift and scale via `@starting-style`, and supports arrow-key movement. The menu is a glass panel; the option under the pointer or the keyboard is a thin fill on it.

### Scroll motion
Transform-only effects may be scroll-driven (`animation-timeline: view()`, inside `@supports` and `prefers-reduced-motion: no-preference`); anything that changes opacity is one-shot.
- **Name handoff:** the hero name itself flies into the top bar, at every width. It follows the real scroll position, the one that moves it up the page, so it has finished shrinking by the time it arrives however fast the page scrolls: it lands once it has scrolled 1.25 times the distance to the bar, riding inside the bar for the last stretch, then hides as the real wordmark appears in the same place. Scroll-linked and reversible, rendered above the glass bar while in flight; measured with `getBoundingClientRect`, one write per animation frame.
  - **Full name (from 640px):** the heading moves as one piece: it slides to the wordmark, scales to its size and eases width (118% → 100%), weight (640 → 600) and tracking to the wordmark's values (ease-in-out cubic).
  - **Initials (phones):** the bar holds the monogram "JCD" (the lone initial "J" below 375px, where nothing more fits), so the heading is split into words and each word flies to its own initial while the rest of the word fades out early; lines of a wrapped name close up as they rise, and a word with no initial in the bar folds into the end of the monogram. Screen readers still get the name as one string.
- **Recede (reduced motion):** where the handoff is off, the wordmark simply fades in once the hero name has scrolled under the bar.
- **Rise:** the lead product frame lifts from `rotateX(18deg) scale(0.9)` to flat as it enters (range entry 0% to cover 45%), like a device lifting off a table.
- **Lift (one-shot, not scroll-scrubbed):** project text, Skills rows and Experience roles rise 1.75rem and fade in once, the first time any part of them enters the viewport (IntersectionObserver adds `.is-in`; 0.6s fade, 0.9s expo-out rise), and stay fully opaque after. Product frames use a rise-only variant (`.reveal-solid`). Scroll-scrubbed opacity is not allowed for text: it leaves copy half-transparent wherever the page comes to rest. Without JS or with reduced motion nothing is hidden.

**The Solid Surfaces Rule.** Anything opaque that sits over the particle field (product frames and their screenshots) may move but never fade: no opacity in its keyframes or on any ancestor's animation. A half-transparent frame lets the particles show through the screenshot. Fades are for text only.

### Particle background
A particle constellation behind two regions: the hero plus Selected work (ending where the Experience band begins, bottom edge fading), and About (between the Experience and Contact bands, both edges fading over 10rem). Each region gets its own field via `ParticleBackground` inside a `relative` wrapper marked `data-bg-region`, which also receives pointer input.

The field: slow-drifting 1.5px points in ink tertiary (38% light, lifted in dark), joined by hairlines when closer than 120px; near a fine pointer, points within 140px drift gently toward it and link to it in the accent at low strength, so the links stay quiet when they cross text. Density is one point per 16,000px², with a floor of 40 (a phone screen would otherwise get about 20, too sparse to link) and a cap of 70 per canvas. Points are 2px on touch screens. On touch devices the finger plays the pointer's role while it is on the screen (passive touch listeners, so scrolling is never delayed). The layer spans the whole region but the canvas inside is one viewport tall and `position: sticky`, so it costs a single screen.

Budget, which any future variant must keep: at most 30 draws a second; links bucketed into 5 opacity levels and each bucket stroked as one path (about 10 strokes per frame); the loop stops after 8s without pointer or scroll activity and restarts on either; it renders only while on screen and the tab is visible; pixel ratio capped at 2x; still under reduced motion. Colours follow the theme (tokens resolved through computed style, since canvas cannot parse light-dark()).
### Global states
Text selection is accent on paper. The scrollbar is hairline-strong on the page colour. Reduced-motion collapses every transition and disables smooth scrolling.

## Do's and Don'ts

### Do:
- **Do** reserve ultramarine for links, focus, frame hover glow and action confirmations.
- **Do** fill the primary action with solid ink and keep every other button a clear glass lens.
- **Do** get display hierarchy from Mona Sans's width axis (118% name, 108-110% headlines) with negative tracking.
- **Do** set dates and years in Geist Mono with tabular figures, and nothing else.
- **Do** separate sections with hairlines and surface-tone bands rather than cards.
- **Do** raise only product screenshots, in the frame with its layered soft shadow.
- **Do** define every new colour as a `light-dark()` pair so the OS setting and the theme menu both drive it, and mirror the pair in the `@supports not (color: light-dark(...))` fallback block in global.css (Safari before 17.5 / iOS 16.4-17.4).
- **Do** keep every interactive target at least 2.75rem and honour reduced motion.

### Don't:
- **Don't** use pills, chips or badges for technologies, metrics or status.
- **Don't** place eyebrows or kickers above section titles.
- **Don't** use monospace for labels, nav, buttons or decoration.
- **Don't** use the accent for headings, markers, numbers or background fills.
- **Don't** return to the sticky-sidebar, dark-navy portfolio template or its section titles.
- **Don't** put shadows on text, lists or sections; glass casts only the soft `--glass-drop`.
- **Don't** use glyph or emoji icons; use the single inline stroke set.
- **Don't** put glass on content: product frames, text blocks and sections stay solid. Glass is for what a visitor operates (bar, menus, buttons).
- **Don't** animate on scroll outside the three motions above, or without the reduced-motion and `@supports` guards.
