# MPC Website — Implementation Report (revision 2)

Mega Pro Coatings Company (MPC), a Makkah Paints company. This revision applies the consolidated corrections brief to the existing static site (`*.html`, `assets/css/mpc.css`, `assets/js/main.js`). No rebuild, no new sections, no change to the approved section order.

> `IMPLEMENTATION_REPORT.md` and `CONTENT_VERIFICATION_REGISTER.md` are internal. They live in `_internal_docs/` inside the ZIP. **Do not upload that folder to the web server.**

---

## 1. Summary of changes in this revision

**Layout — the "Local production for Saudi buildings" split band.** This band (image + eyebrow, heading, paragraph, three features, Contact Us) is on the **Home** page, in the "Why Saudi Arabia. Why MPC." position; the Manufacturing page has no Contact Us button in a split band. Root causes and fixes:
- The three features were forced into three columns inside a column only ~430 px wide at 1024 px, so each description wrapped into ~128 px vertical strips. The features now stack as icon-plus-text rows by default, and switch to three across only when their own column is at least 660 px wide (a CSS container query, so it responds to the column rather than the window).
- The columns were 50/50 with heavy padding. They are now image ≈ 56% / content ≈ 44% (`14fr / 11fr`), padding reduced, `min-width:0` on both children, and content capped at a 600 px reading measure.
- The heading size is now clamped for that column (28–40 px). The Contact Us button keeps its own width (`align-self:flex-start`).
- The image keeps the authentic factory photo, `object-fit: cover` focused at 50% 40% so the vessels, platform and control panel stay visible. Below 860 px it becomes a 4:3 image stacked above the text.
- The Manufacturing "Facilities & strengths" list got the same treatment: two columns only when its column is ≥ 600 px wide, single column otherwise, and `min-width:0` on its text.

**Official MPC location.** "At Taniem, Makkah, MWBA6492, 5038, Saudi Arabia" now appears in the Contact page "Our location" item, the "Our location" section text and the footer. The Jeddah address is no longer shown as MPC's location. Get Directions, the footer address link and the map embed all use the supplied search `Mega Pro Coatings Company Makkah MWBA6492 5038`.

**Public-facing labels removed.** All highlighted "to be supplied / to be confirmed" markers, "Source:" notes, the News draft banner and "Draft"/"Undated" chips, article-page draft banners and "Not yet published", partner-slot "shown with approval" text, and "Arabic version in preparation" are gone. Each was replaced with complete wording (for example "See the technical data sheet", "Request the product list") or removed where it was only a note. Verification status now lives in `CONTENT_VERIFICATION_REGISTER.md`.

**External images.** The six Unsplash hot-links were removed. Unsplash could not be reached from the build environment, so they could not be inspected or downloaded as required. Every image on the site is now a local, authentic MPC photograph. Two new wide crops of the sample walls were made for the Home and Industries heroes. The site no longer makes any external image requests.

**Language control.** Removed from the header and mobile menu on all pages (client request, 14 Oct 2026). The site is English only.

**Legal page.** Fixed a broken heading from the previous build ("Privacy Privacy policy… amp; terms."). Replaced the placeholder boxes with a factual description of what the site actually does (no data stored, mailto form, Google Fonts/Maps) plus general terms wording, both flagged for legal review in the register.

**Other content.** Product pages now say TDS/SDS are "provided by our team on request" with request links instead of "not published online yet". Partner slots show the two verified group relationships (Makkah Paints, AKA Group) and four partner categories. Contact phone and email are labelled as Makkah Paints head-office details, not as MPC's own.

**Not changed.** The structure of all nine primary pages, card counts, the logo, the form logic, product and article routes, and the brand styles.

---

## 2. Status by item

### Completed and tested
| Item | Test performed |
|---|---|
| Home split band rebalanced (image 56% / content 44%), features no longer squeezed | Screenshots at 1024 and 1440; automated narrow-text check (flags any paragraph < 170 px wide with ≥ 4 lines at ≥ 1024 px) — 0 hits |
| Manufacturing facilities list | Screenshots 1024 / 1280; automated narrow-text check — 0 hits |
| No horizontal scroll, no clipped text or buttons | Automated check, 12 pages × 5 widths (1440, 1280, 1024, 768, 390) — 0 issues |
| MPC address on Contact (location item and location section) and footer | Interaction test asserts address text on Contact; footer verified in HTML |
| Get Directions and map embed point to the supplied MPC search | Interaction test asserts both URLs |
| No external images; all local images exist and load | Link/asset script: 0 missing files, 0 external `<img>`; browser check: 0 broken images on 12 pages × 5 widths |
| Public labels removed | Text search across all 17 pages for to be supplied/confirmed, draft, undated, not yet, pending, coming soon, placeholder text, unverified, temporary, in preparation, Source: — 0 public hits (only form-input `placeholder=` attributes remain) |
| Contact form honest behaviour | 11 interaction tests: validation, error summary, focus, email format, result panel says nothing has been sent, mailto content, callback flow, `?subject=` prefill |
| News search / category / sort / clear / empty state; no Draft labels | 8 interaction tests |
| Newsletter truthful feedback | 2 interaction tests |
| Language control removed from all 17 pages | Text search: 0 pages contain it |
| Mobile menu, skip link | 5 interaction tests |
| Official logo on all 17 pages, header + footer, aspect ratio intact | 17 interaction tests |
| Internal links and anchors | Script over all `href`s — 0 broken |
| No JavaScript errors | Recorded across all automated runs — 0 |

**Total: 48/48 interaction tests passed; layout check clean on 12 pages × 5 widths.**

### Completed but not fully tested
- **Real fonts and the live Google map.** Google Fonts and Google Maps are blocked in the build environment, so screenshots used fallback fonts and the map frame was empty. Wrapping was checked with fallback fonts, and Archivo/IBM Plex are slightly wider, so check the Home split band once in a normal browser.
- **The maps search link.** I could not confirm where `…query=Mega+Pro+Coatings+Company+Makkah+MWBA6492+5038` lands. Fetching it returned only Google's "enable JavaScript" page, and a web search found no public listing for Mega Pro Coatings in Makkah. No coordinates have been verified.
- **Real devices and screen readers.** Not tested on real iOS/Android devices or with a screen reader.

### Awaiting company confirmation
See `CONTENT_VERIFICATION_REGISTER.md` for the full list. Main items:
- MPC's own phone, email and website. Phone and email shown are Makkah Paints head office.
- Whether the parent's ISO 9001/14001/45001 cover MPC; certificate PDFs.
- That production happens at MPC's own Makkah site ("Local production for Saudi buildings"); process steps, capacity.
- That TDS/SDS exist and are available on request; official product names and colour codes.
- Named partners and logos.
- Editorial approval and dates for the three News articles.
- Legal review of the privacy and terms text.

### Blocked by missing functionality or dependencies
- **Contact form backend.** None. The form opens the visitor's email app; it never claims delivery.
- **Newsletter service.** None. The form validates the address and says truthfully that it was not stored.
- **Arabic version.** Doesn't exist; the language switch has been removed.
- **External stock images.** The network policy blocked Unsplash and Pexels, so none could be inspected or downloaded.

---

## 3. Images

All images are local in `assets/img/`. All are authentic MPC photographs supplied by the client, except `world-ksa.svg`.

| File | From | Used on |
|---|---|---|
| hero-scratch-wall.webp *(new)* | Scratch-texture sample wall, wide crop | Home hero |
| hero-stone-wall.webp *(new)* | Stone-effect sample wall, wide crop | Industries hero |
| fam-stone / fam-granite / fam-scratch / fam-brick / fam-fine / fam-colour.webp | Sample-wall crops | Product, Industry, Home and Partnership cards |
| wall-*.webp | Sample-wall photos | Heroes and section images |
| factory-*.webp | Factory photos | Manufacturing, About, Quality, Home |
| tex-*.jpg | Small swatch crops | Product detail colour chips and thumbnails |
| world-ksa.svg | Generated from Natural Earth data via `world-atlas` (public domain) | About / Markets |
| MPC_logo_only.png / mpc-logo.png | Supplied logo; proportional web-size copy | Header and footer |

**Removed external images (previously hot-linked, Unsplash License).** Not used anymore; listed in case you want to evaluate them in a browser:
- https://unsplash.com/photos/modern-twin-towers-with-balconies-against-blue-sky-92DS-TDzF_U (MO B.H)
- https://unsplash.com/photos/a-tall-building-with-lots-of-balconies-on-it-PdN1qX9BvlQ (Yasser Mutwakil)
- https://unsplash.com/photos/beige-concrete-building-under-blue-sky-during-daytime-B9_64BdLjcw (Nao Takabayashi)
- https://unsplash.com/photos/white-concrete-building-during-daytime-kKh9J8-UND4 (Hebert Marchesi)
- https://unsplash.com/photos/low-angle-photo-of-high-rise-apartment-building-5q1KnUjtjaM (Marlene Céline Nordvik)
- https://unsplash.com/photos/white-textured-plaster-wall-surface-0tgMnMIYQ9Y (Thomas Heintz)

The Unsplash License allows free commercial use without attribution. If you want any back, download it into `assets/img/` after viewing it and swap the `src`.

The trade-off: the Home and Industries pages now show sample walls rather than building facades. Some wall photos appear on more than one page.

---

## 4. Wireframe and IA audit (all nine primary pages)

The section order and card counts are unchanged from revision 1, which matched the wireframes. This revision changed content inside existing components only, plus CSS. Checked for every page:
- All approved sections present; none added or removed; order unchanged.
- Card counts unchanged: Home 4/5/3; About 5/5; Products 4/5/6; Industries 4/5/6; Manufacturing 5/6/6; Quality 5/4/6; Partnerships 5/6/6; News 3; Contact 4.
- Architectural scope only (search for automotive, marine, vehicle and industrial coating terms: 0 hits).
- No temporary or verification labels on public pages; logo correct; images local.

**IA routes**
- Products (`products.html`) → 4 detail pages. Each has breadcrumb Home / Products / ‹family› and links from the Home and Products cards.
- News (`news.html`) → 3 article pages. Each has breadcrumb Home / News & Insights / ‹article title› (previously "Draft article").
- Footer and header lead to all nine primary pages; legal anchors `#privacy` and `#terms` resolve.

**Open IA / wireframe conflicts (unchanged from revision 1)**
- Home has no "latest news" section (wireframe controls).
- News shows 3 articles in a 9-card grid design.
- Industries sub-pages don't exist and are out of scope.
- Partnership inquiries go to the Contact form.
- "Meet Our Leadership" is labelled "Visit Makkah Paints" because no leadership page exists.

---

## 5. Pages and widths tested

| Test | Pages | Widths |
|---|---|---|
| Automated layout (overflow, clipping, narrow text, broken images) | 9 primary + product-stone-effect, news-production-floor, legal | 1440, 1280, 1024, 768, 390 |
| Visual screenshots reviewed | Home split band (1024, 1440), Home hero (1440), Manufacturing facilities (1024, 1280), Partnerships partners (1280), Contact info/form/location (1280) | as listed |
| Interaction suite (48 tests) | Contact, News, Home, Products, all 17 pages for logo | 1280 desktop, 390 mobile |

The other three product pages and two article pages share templates with the tested ones and passed the link, asset and logo checks, but were not individually screenshotted in this revision.
