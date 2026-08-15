# Portfolio Site — Hand-Coded Recreation

A from-scratch HTML/CSS/JavaScript build of my personal portfolio site, recreating the content and structure of my live site (currently hosted on Wix) as fully custom code — no page builder, no framework.

**Note:** This version isn't deployed live (no custom domain set up yet), but it runs locally or via any static host — just open `index.html` in a browser, or serve the folder with any static file server.

## Why I Built This

My live portfolio is built on Wix. This repo is a hand-coded version of the same content, built to demonstrate that I can design and implement a site like this entirely in code — semantic HTML, custom CSS (no framework), and vanilla JavaScript for interactivity.

## Features

- Fully responsive layout (desktop down to mobile, with a custom mobile nav toggle)
- Custom CSS design system (color tokens, type scale, consistent spacing) — no CSS framework
- Coded hero graphic (a generative "skyline" motif built with pure CSS, echoing the visual style of my live site's hero image)
- Interactive project grid — each project links to its own dedicated case study page
- Chronological experience timeline with connecting line and date markers
- Contact form with client-side interaction (static demo — not connected to a backend)
- Accessibility basics: skip link, visible focus states, `prefers-reduced-motion` support, semantic landmarks

## Project Structure

```
├── index.html                                 Homepage: hero, portfolio grid, experience, contact
├── styles.css                                  Design tokens, layout, and responsive styles
├── script.js                                    Mobile nav toggle, contact form interaction
└── projects/
    ├── fellowship-project.html               UI/UX Fellowship case study (Forest app redesign)
    ├── rutgers-welcome-week.html          Rutgers Welcome Week site build
    ├── freelance-doctor-website.html      Freelance client project
    ├── rutgers-residence-life.html         Rutgers Residence Life department site
    ├── volunteer-website.html                YesMiss, Inc. nonprofit website
    └── rutgers-dining-website.html         Rutgers Dining Services department site
```

Each project page follows a consistent case-study format: role, project type, timeline, an overview, what I actually did, and current status (live, in development, or concluded) — written honestly rather than overstating scope.

## Tech Stack

- HTML5 (semantic markup)
- CSS3 (custom properties, Grid, Flexbox, no framework)
- Vanilla JavaScript (mobile nav toggle, form interaction)
- Google Fonts: Space Grotesk, Inter, IBM Plex Mono

## Running Locally

No build step required. Either:
- Open `index.html` directly in a browser, or
- Serve the folder locally, e.g. `python3 -m http.server 8080` and visit `localhost:8080`

## Live Version

The live, deployed version of my portfolio (currently on Wix, pending migration to a custom domain) is at: https://anushka0singh.wixsite.com/myportfolio
