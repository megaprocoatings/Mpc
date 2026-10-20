# MPC Website — Animation Enhancement Report

Restrained motion layer added to the existing site. No sections, content, images, navigation or page structure changed. No libraries added: plain CSS transitions and keyframes, plus one IntersectionObserver in the existing `main.js`. The site remains English-only, with no language switch.

## Files modified
| File | Change |
|---|---|
| `assets/css/mpc.css` | Motion tokens in `:root`. Existing button, card, link, nav, header, footer and drawer transitions retimed to the tokens. Hover effects moved behind `@media (hover:hover) and (pointer:fine)`. New "Motion layer" block at the end of the file. |
| `assets/js/main.js` | New block at the end: header scroll state and one-time scroll reveals. |

No HTML file was edited.

## Motion tokens
- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` — strong ease-out used for every entrance and hover. No `ease-in` anywhere.
- `--d-ui: 180ms` — colour, border and background feedback.
- `--d-reveal: 640ms` (480 ms on phones) — scroll reveals of marketing content.
- `--rv-y: 18px` (10 px on phones) — reveal travel.

## Effects added
| Area | Effect | Timing |
|---|---|---|
| A. Page entrance | Hero breadcrumb, heading, text and buttons rise 14 px and fade in, staggered 60 ms. Hero image fades only, so its size and crop don't change. Home background image fades. Product-detail gallery and info columns rise in. | 620 ms content, 700–900 ms images; last item starts by 280 ms |
| B. Scroll reveals | Section headings, image-and-text splits, card grids, process steps, stats, partner tiles, contact columns and map rise 18 px and fade once, when entering the viewport. Card groups stagger 60 ms per item, capped at 6 (40 ms capped at 3 on phones). | 640 ms |
| C. Cards | Lift 2 px with a shadow (existing effect, now hover-gated and retimed). Image scales to 1.04 inside its existing `overflow:hidden` frame. Feature, certificate, partner and stat tiles get a border and shadow change only. | 220 ms lift, 450 ms image |
| C. Links and buttons | Arrow nudges 3 px. Buttons ease colour, border and shadow, and press to 0.97 scale. | 180 ms, press 120 ms |
| D. Header and navigation | The existing sticky header gains a soft shadow once the page is scrolled 8 px. Nav underline grows from the left on hover, in grey; the active page keeps the accent underline. The mobile menu drops in 6 px with a fade. | 240 ms shadow, 220 ms underline and menu |
| E. Manufacturing and Quality | Same restrained reveals on the authentic factory photos and text columns. Translate-only, so columns, wrapping and buttons are unaffected. | 640 ms |
| F. Product detail | Gallery and product info columns rise in on load. Thumbnails ease their border on hover. Product content unchanged. | 620 ms |
| G. Footer | Footer columns and bottom bar reveal with stagger. Links and social buttons ease their colour. | 640 ms / 180 ms |

## Safety rules built in
- **Visible without JS.** The hidden state (`.rv`) is added only by JavaScript, and only to elements that start below the fold. Anything on screen at load is never hidden. Without JavaScript or IntersectionObserver, nothing is hidden.
- **One-time reveals.** Each element is unobserved after it reveals. Its `.rv` classes and delay are removed once the transition ends (with a 1.6 s fallback), so the original hover and transition styles return untouched.
- **Back/forward cache.** Restoring a page from the cache reveals anything still pending.
- **Print.** Printing forces everything visible.
- **No layout impact.** Only `transform` and `opacity` animate, so there is no layout shift and no horizontal overflow, including mid-animation.
- **Reduced motion.** `prefers-reduced-motion: reduce` keeps only short opacity fades (300 ms). All movement, image scaling, button press scaling and the underline animation are removed.
- **Touch devices.** Touch-only devices get no hover motion, so there are no sticky-hover states.

## Checks actually performed
All checks ran in headless Chromium with fallback fonts; Google Fonts and Maps were blocked in this environment.

**Motion suite — 92/92 passed:**
- All 17 pages × 5 widths (1440, 1280, 1024, 768, 390) — 85 checks: nothing hidden above the fold at load; after scrolling the full page, no element left invisible and no `.rv` class left behind; no horizontal scroll.
- Mid-animation horizontal overflow at 390 px: none.
- Reduced motion (emulated): reveals have no transform; the hero uses fade only.
- JavaScript disabled: no hidden elements.
- Header shadow appears only after scrolling.
- Jumping to an anchor (`quality.html#systems`) leaves the target section fully visible.
- Card hover scales the image to 1.04 inside its frame.

**Regression suite — 48/48 passed:** contact form validation and honest mailto flow, callback, subject prefill, news filters, newsletter, mobile menu, skip link, official logo on all 17 pages, and no language switch.

**Layout check — clean:** 12 pages × 5 widths, with no overflow, clipped text or buttons, narrow-text wrapping or broken images.

**Feel check (frames):** captured the Manufacturing hero at 60, 180, 320 and 900 ms, plus a scroll reveal of the process steps. The stagger reads left to right and settles within about 0.9 s. No JavaScript errors in any run.

## Not verified / remaining
- **Feel with the real fonts and real devices.** Not judged on a physical phone or with real web fonts. Please review once in a normal browser, ideally with DevTools' animation panel at 25% speed.
- **The reference site's motion.** The Makkah Paints site was not studied frame by frame, because its motion isn't visible to the page-fetch tool. The motion here follows the brief's description (subtle fades, small rises, gentle image reveals) rather than a measured copy.
- **Screen readers.** Not tested with a screen reader. The motion doesn't change focus order, visible focus styles or text.
