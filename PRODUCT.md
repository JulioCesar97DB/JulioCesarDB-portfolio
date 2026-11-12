# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers at US product companies filling **full-stack** roles (frontend as the strong side). They arrive from a resume, LinkedIn or an application link, skim in under a minute on desktop or phone, and need to answer: what has this person actually built, how deep does it go, and how do I get the resume or reach him.

Secondary: engineers on the hiring loop who click into projects and code to judge depth.

## Product Purpose

A personal portfolio for Julio César Díaz that shows what he knows and can do through real, shipped work. Success: a US full-stack hiring manager leaves convinced by the evidence, downloads the resume or gets in touch.

## Positioning

The work does the talking. Julio has taken several SaaS products from an empty repo to production — often as the sole frontend engineer with backend ownership — and cares about the frontend craft (performance, accessibility, clean architecture) and about the product and its users, not just the ticket.

The site must **show, not sell**. The owner explicitly rejects an openly self-promotional, "hire me" tone. Contact and resume must be easy to find but quiet; no hype, no sales copy, no availability banners.

## Operating Context

- Visitors usually come from a job application, resume link, LinkedIn or GitHub.
- English only, US market.
- Owner's background: Cuba (ETECSA, UCLV) → Spain (Alicante, Second Window, freelance) → Florida (Legacy BHC, ConsumrBuzz). He is willing to tell this story as part of who he is.

## Capabilities and Constraints

- Astro 5 + Tailwind CSS 4 static site; all content is data-driven from `cv.json` (aliased `@cv`). Keep that single source of truth.
- Routes: `/` (home) and `/archive`.
- Domain: juliocesardb.com.
- Resume PDF to offer for download: `~/Downloads/Resume_1.pdf` (3 pages; page 1 carries his phone number). It titles him "Senior Frontend Engineer" and his ConsumrBuzz role "Web Developer", which differs from `cv.json` ("Lead Frontend Developer") and from the new full-stack target — **open decision**: align job titles across site and resume.
- The owner did **not** approve using his photo (`public/JULIOCESAR.jpg`). Do not use it unless he says so.
- The owner did **not** approve an "open to work" / availability statement. Do not add one.

## Brand Commitments

- Voice: mixed — warm, first-person and personal in the About/story; direct, factual and number-backed in experience and projects. Never salesy.
- Standing visual preference (chosen 2026-11-11 after two direction re-rolls): **no themed metaphor** (no museum, datasheet, poster or retro concepts). A modern, direct portfolio executed at the craft level of Linear, Vercel, Stripe and Apple, with some personality of its own. Balance: restrained but not empty; attractive but not flashy.
- The previous design is a recognizable copy of Brittany Chiang's portfolio (v4 layout and palette, v2 section copy). The redesign must not reuse her layout, palette, section titles ("Where I've Worked", "Some Things I've Built", "Other Noteworthy Projects", "Get In Touch / Say Hello") or phrasing.

## Evidence on Hand

- Shipped products with live URLs and screenshots in `public/projects/`: ConsumrBuzz (app.consumrbuzz.com), BookEasely (bookeasely.com), ReviewBoost (review-boost.app). Turing Dream (Second Window client, no public link).
- Other work: Cloud infrastructure designer (Balsain Almena / Second Window, drag-and-drop multi-cloud builder), BetHomeWeb (sports betting), Employee Management Suite (Legacy BHC), Telecommunications Management System (ETECSA).
- Numbers in `cv.json`: 100/100 Lighthouse, 95% test coverage, sub-2s loads, 60% less administrative overhead, 200+ employees, 10,000+ daily users, solo delivery in 6 months. Use only these; do not invent metrics, testimonials, clients or logos.
- B.Sc. Software Engineering, Universidad Central "Marta Abreu" de Las Villas (2016–2021). Spanish native, English professional.

## Product Principles

1. **Evidence over claims.** Every statement about skill should sit next to the work or number that proves it.
2. **Quiet confidence.** No hype, no "hire me" pressure; contact and resume are present and obvious, never pushy.
3. **Lead with the best work.** Depth on the flagship products beats an even list of everything.
4. **Authored, not templated.** The site itself is a frontend work sample; it must look like his, not like a known template.
5. **Fast and accessible by default.** The site has to live up to the performance and accessibility it claims.

## Accessibility & Inclusion

WCAG 2.2 AA as the floor: keyboard navigation, visible focus, correct heading outline, 44px touch targets on mobile, reduced-motion support. Keep the existing skip link and focus styles.
