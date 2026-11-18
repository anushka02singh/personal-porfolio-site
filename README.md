# Portfolio Site: Darkroom Archive

My personal portfolio, built from scratch in plain HTML, CSS and JavaScript with no framework and no build step. It's styled as a darkroom: projects are developing polaroids, work in progress is a viewfinder test shot, experience is a roll of film, and the contact form is a camera.

Live site: https://anushka02singh.github.io

## Design direction

- **Palette:** near-black with a purple undertone, chrome and pink highlights, and aged ivory polaroid paper. Y2K by way of the darkroom.
- **Type:** Cormorant Garamond (headings), Space Grotesk (display), Inter (body), IBM Plex Mono (labels), Caveat (handwritten captions). All self-hosted.
- **Motion:** projects "develop" from blurry and faded to sharp as they scroll into view, with sparkle cursor trails, 3D tilt and holo glare on project photos, and a clothesline that sways with the cursor. `prefers-reduced-motion` is respected throughout, and the content stays fully readable without JavaScript.

## What's on the site

- **Home:** hero, a clothesline of recent work, a scrolling skills ticker, the Archive (client and department sites), the Design Lab, Experience and Contact.
- **Archive:** department and client websites, each with its own case-study page in an OS-window layout with tabs.
- **Design Lab:** developed pieces (PeerConnect, Fellowship project, CardFlow, UI Component Library, Music Visualizer, Info Tech term project) as polaroids, and test shots (Cafe Paris, Craigslist, Instagram Stories, Rec2Go redesign, Zingers) as viewfinders. Test shots are in-progress or exploratory work, labeled as such.
- **Experience:** a film roll that unspools sideways. Drag it, use the arrows or arrow keys, or click a frame to pull its print.
- **Contact:** a point-and-shoot camera. Sending a message fires the flash and prints a photo.

## Contact form

The form posts to [Formspree](https://formspree.io) from `script.js`, using the endpoint in the form's `data-endpoint` attribute in `index.html`. Bots are filtered with a hidden honeypot field, and messages have length limits. If the endpoint is ever missing or still a placeholder, the form falls back to opening the visitor's email app with the message pre-filled.

## Security notes

GitHub Pages can't set response headers, so protections live in the pages themselves:

- A Content Security Policy `<meta>` tag on every page allows only the site's own files, a hashed inline script, and Formspree for the form.
- Referrer policy meta tag, and `rel="noopener noreferrer"` on every link that opens a new tab.
- A small frame-busting check in `script.js` so other sites can't embed the page.
- Fonts are self-hosted, so no third-party requests are made when the page loads.

If you change the small inline script in the `<head>` of each page (the one that adds the `js` class), its hash in the CSP must be updated to match.

## Project structure

Pages, styles and script sit in one flat directory so relative links work on any host. The only subfolder is `fonts/`.

```
├── index.html                      Homepage
├── portfolio.html                  Archive page: every project as an alternating row
├── styles.css                      Design tokens, layout, animations, @font-face rules
├── script.js                       Nav, sparkles, develop reveal, film roll, camera form, case-page tabs
├── fonts/                          Self-hosted .woff2 files (SIL Open Font License)
├── *.html                          One case-study page per project (Archive and Design Lab)
└── README.md
```

Each case-study page follows the same format: role, type, timeline, an overview, what I did, and where things stand, written plainly rather than overstating scope. Work that isn't finished says so.

## Tech stack

- HTML5 (semantic markup, ARIA tabs on case pages)
- CSS3 (custom properties, Flexbox, Grid; no framework)
- Vanilla JavaScript (IntersectionObserver reveals, pointer events for the film roll, fetch for the form)
- Fonts: Cormorant Garamond, Space Grotesk, Inter, IBM Plex Mono and Caveat, via the Fontsource packages

## Running locally

No build step. Either open `index.html` in a browser, or serve the folder (needed to test the form and the Content Security Policy):

```
python3 -m http.server 8080
```

then visit `localhost:8080`.

## Deploying

Deployed with GitHub Pages. Push to the main branch, wait a minute or two, then hard-refresh to bypass the cache.
