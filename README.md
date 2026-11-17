# Portfolio Site — Darkroom / Polaroid Archive

A from-scratch HTML/CSS/JavaScript build of my personal portfolio, styled as a running photo archive — projects presented as tilted, "developing" polaroids filed into a personal darkroom. No page builder, no framework.

## Design Direction

The site treats each project like a photograph being filed into an archive:

- **Palette:** near-black with a purple undertone, antique gold flash, dusty mauve, and deep burgundy/wine duotones — against aged ivory polaroid paper (not stark white).
- **Type:** Space Grotesk (display), Inter (body), IBM Plex Mono (labels/meta), Caveat (handwritten polaroid captions).
- **Motion:** polaroids and project cards "develop" into color from grayscale as they scroll into view, with a quick camera-flash flicker the instant each one resolves, a staggered cascade across each row/grid, and a gentle idle sway on the hero strip once developed (`prefers-reduced-motion` respected throughout; everything still renders fully visible without JavaScript).
- **Texture:** a fixed film-grain/vignette overlay runs behind every page.

## Features

- Fully responsive layout (desktop down to mobile, with a custom mobile nav toggle)
- Custom CSS design system (color tokens, type scale, consistent spacing) — no CSS framework
- Scroll-triggered "develop" animation via `IntersectionObserver`
- Interactive project grid — each project links to its own dedicated case study page, presented as a polaroid
- Chronological experience timeline with connecting line and date markers
- Contact form with client-side interaction (static demo — not connected to a backend)
- Accessibility basics: skip link, visible focus states, `prefers-reduced-motion` support, semantic landmarks

## Project Structure

All files sit in a single flat directory (no subfolders) so relative links resolve correctly regardless of hosting setup:

```
├── index.html                                 Homepage: hero, polaroid strip, portfolio grid, experience, contact
├── portfolio.html                             Dedicated Archive page — alternating polaroid case-study rows
├── styles.css                                 Design tokens, layout, and responsive styles
├── script.js                                  Mobile nav toggle, contact form interaction, develop animation
├── rutgers-hr-site.html                       HR & Employment resource page rebuild
├── rutgers-club-website.html                  Rutgers Club hero, menu & staff directory rebuild
├── rutgers-welcome-week.html                  Rutgers Welcome Week site build
├── rutgers-dining-website.html                Rutgers Dining Services department site
├── rutgers-residence-life.html                Rutgers Residence Life department site
├── volunteer-website.html                     YesMiss, Inc. nonprofit website
├── freelance-doctor-website.html              Freelance client project
└── fellowship-project.html                    UI/UX Fellowship case study (Forest app redesign)
```

Each project page follows a consistent case-study format: role, project type, timeline, an overview, what I actually did, and current status (live, in development, or concluded) — written honestly rather than overstating scope.

## Tech Stack

- HTML5 (semantic markup)
- CSS3 (custom properties, Flexbox, Grid, no framework)
- Vanilla JavaScript (mobile nav toggle, form interaction, IntersectionObserver reveal)
- Google Fonts: Space Grotesk, Inter, IBM Plex Mono, Caveat

## Running Locally

No build step required. Either:
- Open `index.html` directly in a browser, or
- Serve the folder locally, e.g. `python3 -m http.server 8080` and visit `localhost:8080`

## Deploying

This repo is deployed via GitHub Pages — see the repository settings for the live URL.
