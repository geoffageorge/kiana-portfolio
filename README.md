# Kiana George — portfolio prototype

A local React + Vite portfolio built from `Design Template/KK design 1.png`, the prototype directions, and the architecture specifications. Tailwind CSS provides the base and utilities; each component owns its custom CSS. The build produces static files with no backend or external media services.

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. To create and preview the production build:

```sh
npm run build
npm run preview
```

The production output is in `dist/`. Its relative asset paths support hosting at a domain root or under a subdirectory. Upload the contents of `dist/` to a static host when ready.

## Publish through GitHub and Cloudflare Workers

The current Cloudflare deployment uses **Workers Builds**: it runs `npm run build`, followed by `npx wrangler deploy`. The root `wrangler.jsonc` configures an assets-only Worker named `kiana-portfolio` and uploads the built website from `dist/`. No Worker script or Cloudflare Vite plugin is required. The `auto-trailing-slash` HTML setting serves nested project entries such as `/projects/pointly/` directly, including on reload.

In the Cloudflare dashboard, open **Workers & Pages → kiana-portfolio → Settings → Build**, and use these settings:

| Setting | Value |
| --- | --- |
| Connected repository | `geoffageorge/kiana-portfolio` |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | Repository root (leave blank) |
| Node version | `22.16.0` (already detected in the build log) |

Commit `wrangler.jsonc` along with the source changes and push to `main` to trigger a new build. Re-running the failed deployment's old commit will not include the new configuration. Keep the Wrangler `name` identical to the Cloudflare Worker name. See Cloudflare's [Workers build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) and [static HTML routing](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/) documentation.

For a local deployment check that does not publish anything:

```sh
npm run build
npx wrangler deploy --dry-run
```

The October 4, 2026 log shows a successful Vite build, followed by `Error parsing file: /opt/buildhome/repo/vite.config.js` during Wrangler deployment. Without a Wrangler configuration, the deploy tool attempted to inspect the Vite configuration. The explicit assets configuration avoids that detection step and publishes the existing static build.

## Alternative: Cloudflare Pages (the Zen Tea workflow)

This follows the workflow documented in `Green_Tea/zen-tea-v2/README.md`: push the source repository to GitHub, then connect it to Cloudflare Pages Git integration. Commit `src/`, `public/` (including all artwork and the GIF), the package files, and configuration. Keep `node_modules/`, `dist/`, and browser test output out of Git; Cloudflare installs dependencies and builds the website from source. These Pages settings are an alternative to the current Workers deployment.

Create a new repository such as `geoffageorge/kiana-portfolio`. In the [Cloudflare dashboard](https://dash.cloudflare.com/), choose **Workers & Pages → Create application → Pages → Connect to Git**, then select the repository.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Vite` (or use the explicit settings below) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Leave blank |
| Node version | `22.16.0`, set with the `NODE_VERSION` build environment variable if needed |
| Environment variables | None required |

Select **Save and Deploy**. Cloudflare gives the project a `pages.dev` URL and automatically republishes changes pushed to `main`. Refer to the official [Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/) and [build environment documentation](https://developers.cloudflare.com/pages/configuration/build-image/) for the current dashboard and version settings.

## File structure

```text
src/
  App.jsx                       Page composition and dialog content
  main.jsx                      React entry point
  data/
    site.js                     Brand, hero, email, résumé, LinkedIn
    heroArtwork.json            Saved width, viewBox, and movement defaults
    projects.js                 Home page cards and case-study links
    projectRoutes.js            Project slugs and page metadata
    caseStudies/
      template.js               Reusable six-section template factory
      pointly.js                Point.ly content, captions, and image mapping
      index.js                  Project data registry
  lib/urls.js                   Links and assets on nested pages
  pages/AboutPage.jsx           Full About+Contact page from Figma frame 522:265
  pages/CaseStudyPage.jsx        Shared project page composition
  pages/PointlyCaseStudyPage.jsx Point.ly layout matching Figma frame 90:18
  pages/ObayashiCaseStudyPage.jsx Complete Obayashi case study from Figma frame 420:76
  data/caseStudies/obayashi_old.js Preserved original Obayashi placeholder
  styles/global.css             Design tokens, fonts, shared rules
  styles/case-study-theme.css    Local fonts shared by case studies and header
  components/                   Each folder contains JSX and its CSS
    Logo/                       Supplied Ki Logo, at the original displayed size
    BrandName/                  Name and UX design descriptor
    SiteHeader/                 Sticky logo, name, and navigation bar
    Navigation/                 Work and About+Contact links
    HeroSection/                Clarifying Chaos heading and introduction
    HeroArtwork/                Continuous native SVG animation
    SectionHeading/             Reusable title and subtitle
    ProjectCard/                Figma artwork layers and linked project tiles
    SelectedWork/               Heading and two-column project grid
    SiteFooter/                 Black footer, brand, and contact links
    Modal/                      Accessible image and project dialogs
    CaseStudyHero/              Project summary, facts, and hero image
    CaseStudyNavigation/        Section navigation
    CaseStudySections/          Six independent section components
    CaseStudySection/           Consistent section layout and content blocks
    CaseStudyGallery/           Images, stage labels, and captions
    CaseStudyCards/             Personas, insights, and comparison cards
public/assets/
  favicon.svg
  brand/                        Transparent six-shape Ki Logo PNG
  hero/                         Previous GIF and poster (unused by the hero)
  projects/                     Four original SVG placeholder images
  pointly/                      21 original images extracted from the source
  pointly-2/                    Original MVP screenshots and preserved earlier assets
  pointly-figma/                50 unchanged layer exports and their provenance manifest
  obayashi/                     Archived PNG-based research exhibits
  obayashi-figma/                40 unchanged Figma exports, crop/text/layer manifest
  fonts/                        Local case-study fonts and their OFL licenses
projects/                       Static HTML entries for each project page
pointly project/                Archived source, extracted study, and assets
scripts/generate-assets.py       Optional artwork regeneration
scripts/import-pointly.py        Source archive and image extraction
scripts/import-pointly-design.py  Extracts artwork from the pointly_2 Figma PNG
scripts/import-pointly-figma.py   Copies the layer exports without changing image bytes
scripts/scaffold-project-pages.mjs  Generates page entries before dev/build
tests/portfolio.spec.js          Browser smoke checks
tests/hero-animation.spec.js     Original animation comparison and sticky header checks
tests/hero-layout.spec.js        Fixed framing, responsive placement, colors, and transparent logo checks
tests/hero-canvas.spec.js        Canvas containment and removal of temporary inspection UI
tests/pointly-design.spec.js     Source-pixel, typography, color, geometry, and responsive checks
Assets/clarifying-chaos-solid-colors.html  Original animation reference
specs/                          Original specifications, preserved
Design Template/                Original design reference, preserved
```

## Replace prototype content

- Edit `src/data/site.js` for branding, hero copy, telephone, contact email, résumé, and LinkedIn destinations. The approved email is `kikig6204@gmail.com`; the new Figma phone is `650-817-5454`.
- Resume opens `public/assets/kiana-george-resume.pdf` in a new tab. It is an unchanged copy of `Assets/Kiana George Resume.pdf`.
- LinkedIn opens `https://www.linkedin.com/in/kiana-george-75b061209/` in a new tab from the About page.
- Put real project artwork in `public/assets/projects/`, then edit each record in `src/data/projects.js`. Replace its title, image, alt text, category, status, and description.
- Each card has a `slug` and `caseStudyUrl` pointing to its project page. Obayashi and Point.ly have dedicated case studies; the archived and reserved pages use the reusable template with labeled placeholder content.
- Only Obayashi and Point.ly appear on the home page. Project 03 and Project 04 remain defined with `showOnHome: false` in `src/data/projects.js`; their project pages and assets are retained. To add the next project, update Project 03's card details and case-study content, then set `showOnHome: true` to display its tile again.
- The current Figma biography is in `src/data/about.js` and rendered by `src/pages/AboutPage.jsx`; the portrait retains its original image, updated crop, rotation, and circular SVG mask.

The hero renders the native SVG from `Assets/clarifying-chaos-solid-colors.html` in `HeroArtwork.jsx` with scoped animation styles in `HeroArtwork.css`. It preserves the five moving labels, 10-second CSS cycle, 25 rotating spirograph ellipses with 12–16-second SVG animation cycles, and the final glowing outline and “Clarity” text. The four ring colors are `#9cbabc`, `#e5ef18`, `#afddb1`, and `#5fd1d3`; the spirograph and final outline use the same palette. It starts automatically and loops continuously. Reduced-motion visitors see the static final circle and labels. The SVG has a transparent background. Its final glowing circle uses native SVG arcs and a blur filter, replacing absolutely positioned HTML inside `foreignObject` that Safari can render in the wrong location. A scene clipPath, hidden SVG overflow, and a contained figure keep every drawing layer within the hero canvas.

All page backgrounds use `--color-page: #fff` in `src/styles/global.css`. Select Work now follows Figma's **Case Studies** frame (`28:2`): Obayashi's staircase tile is first, and the blue Point.ly laptop tile is second. Each tile has a 577px square reference size, 16px corner radius, and overlaid index, title, and caption. The desktop gap is 27px; tiles stack on phones. The black 0.5px rule above them uses a native CSS border to remain visible in WebKit. The separate source image, laptop, webpage, and SVG mask exports are retained in `public/assets/home-figma/`. The frame's obscured duplicate labels and old footer artwork remain archived. The CASE STUDIES subtitle is now 15px on all viewport sizes.

**Overall Kiana website updates version 2** implements `specs/changes/update 3.md`. About+Contact is a full page at `/about/`, replacing both profile popups. It follows Figma **About -NEW** (`522:265`, 1440 × 1315): the updated four-paragraph biography includes the University of Washington master's program, with a 659px text column, 16px/26px Inter body text, a 36px/44px heading, and the updated 266.141px circular portrait at the upper right. The contact section uses `kikig6204@gmail.com` and the new Figma number `650-817-5454`, with `mailto:` and `tel:` links. Resume and LinkedIn retain their existing destinations and open in new tabs. Both buttons change to `#828a8b` on hover or keyboard focus. A separate `about/index.html` is a Vite build entry, supporting direct visits, reloads, and deployment below a subdirectory.

Navigation is **Work / About+Contact** on every page. The hover underline now belongs to the text label, positioned 4px below its line box. Previously it was positioned 6px above the link's bottom edge, and the case-study headers' zero vertical padding moved it into the letters. Header positioning and the existing image-enlargement dialogs are retained.

The global footer follows Figma **Footer Revised** (`523:49`, 1440 × 234): slate `#3c444b`, a native 57 × 38px SVG logo, white Fira Mono brand text, and a two-line LET’S CONNECT link. The link changes to logo gold `#f4cf14` on hover/focus and opens `/about/`. Older footer labels covered by the revised background are excluded from the rendered page. All four source assets, native dimensions and checksums are in `public/assets/website-v2-figma/manifest.json`; complete frame settings, text runs, image transforms and local-path references are archived in `Assets/figma files/overall-website-v2-2026-10-21/`.

The 11 unchanged Figma exports and checksums are recorded in `public/assets/home-figma/manifest.json` and `public/assets/about-figma/manifest.json`. Complete frame metadata and generated reference layouts, with download URLs replaced by local paths, are archived in `Assets/figma files/home-about-2026-10-19/`. Figma reports Helvetica Neue Bold as missing on Select Work's heading; the existing Helvetica Neue / Helvetica / Arial system stack is retained. Inter and Fira Mono are served locally through `src/styles/portfolio-content.css`.

On devices with a mouse or trackpad, project tiles rise 8 pixels and tilt 2 degrees with a soft shadow on hover. Keyboard focus gives the tile the same lift while retaining the visible focus outline. The new tiles keep their image crops fixed. Touch devices keep the static layout; reduced-motion preferences disable the transforms while retaining the shadow cue.

The default header uses `public/assets/brand/ki-logo.png`, a transparent extraction of the six colored shapes in `Assets/Ki Logo.jpg`. The displayed logo remains 54 × 36 pixels on desktop and 45 × 30 on phones. The replacement was made with the built-in imagegen tool; its exact extraction prompt is recorded in `Assets/ki-logo-transparent-prompt.txt`.

The shared header stays at the top while scrolling, with a translucent frosted-glass layer that blurs content behind the sharp navigation text. The glass fades to transparent along its lower edge so scrolling content passes smoothly behind it. Its measured height offsets anchor links and the desktop case-study sidebar so content stays visible below it. All fonts are local files or system fallbacks, with no remote font requests.

## Hero artwork placement

`src/data/heroArtwork.json` and `Assets/heroArtwork-1.json` contain the fixed settings: viewBox `50 0 1000 900`, maximum width 960 pixels, horizontal/vertical ring offsets of 200/200 SVG units, and 60% label spread. All visitors use these settings; the former adjustment controls, browser overrides, and local save endpoint have been removed. Keep both JSON files synchronized when changing future published settings.

The 200/200-unit offsets spread the four rings around the center during the opening phase. The chosen 1000 × 900 viewBox provides additional room on the right. The original animation timings and indefinite repeat behavior remain intact.

On desktop (1024 pixels and wider), the canvas's left edge aligns with the first S in the header's INSIGHTS. The Clarifying Chaos heading and description move together using `copyPlacement.y: -26.7`, shifting the text block 26.7 pixels above its original heading-centered position. `placement.x` defaults to 0 pixels of horizontal shift from the S anchor. `placement.y` defaults to a 20-pixel gap below the navigation bar. Measurements update on resizing without changing when the sticky header is scrolled. The canvas shrinks to the available page width and occupies normal grid space, keeping Select Work below it. On phones and tablets, the heading and artwork stack with a gap to preserve legibility.

## Hero artwork settings

The temporary canvas border, center lines, and Hero canvas inspector have been removed. Run `npm run dev`, then open **http://127.0.0.1:5173/** to view the saved animation. To adjust its settings in the future, edit both JSON files below and reload the preview.

| Setting in `src/data/heroArtwork.json` | Saved value | Effect |
| --- | --- | --- |
| `placement.x` | `0` px | Shift the canvas from the S anchor; negative moves left, positive moves right. On desktop its width adapts to the remaining page space. |
| `placement.y` | `20` px | Gap below navigation; increasing it moves the canvas and centered heading down. |
| `copyPlacement.y` | `-26.7` px | Desktop vertical shift of the Clarifying Chaos heading and description together; negative moves up, positive moves down. |
| `maxWidth` | `960` px | Maximum rendered canvas width, capped by the available page width. |
| `viewBox.x` | `50` SVG units | Internal frame's left coordinate; increasing it shifts the drawing left within the canvas. |
| `viewBox.y` | `0` SVG units | Internal frame's top coordinate; increasing it shifts the drawing up within the canvas. |
| `viewBox.width` | `1000` SVG units | Internal horizontal drawing area; increasing it reveals more and scales the drawing down at the same canvas width. |
| `viewBox.height` | `900` SVG units | Internal vertical drawing area; increasing it makes the rendered canvas taller at the same width. |
| `movement.x` / `movement.y` | `200` / `200` SVG units | How far the circles spread horizontally and vertically during the cycle. |
| `movement.labelSpread` | `60` percent | Scale of the labels' movement offsets. |

Desktop position is calculated in `HeroSection.jsx`: left = page-container left + measured S anchor + `placement.x`; top = navigation bottom + `placement.y`. The height is rendered width × viewBox height ÷ viewBox width. The heading's vertical center follows the canvas's midpoint plus `copyPlacement.y`; the description moves with it. Below 1024 pixels, the canvas stacks beneath the text and desktop position offsets are ignored.

The saved viewBox ends at x=1050 (left 50 + width 1000). The original full framing is `0 0 1200 900`. The tests sample ring boundaries including their strokes, labels, and spirograph through the cycle. Changing the frame width preserves the choreography; reducing circle offsets or label spread changes the movement. Shifting `viewBox.x` alone can trade right-side clipping for left-side clipping. The chosen 0-pixel placement separates the frame from the text so INSIGHTS stays clear of the heading during the cycle.

The temporary text-alignment line and controls have been removed after saving the chosen -26.7-pixel offset. The normal local preview at **http://127.0.0.1:5173/** now uses that position; old `?heroAlign=1` URLs show the same clean page. To change the position again, edit `copyPlacement.y` in both saved JSON files.

## Project pages and reusable template

Open `/projects/obayashi/` and `/projects/pointly/` for the current case studies, `/projects/obayashi_old/` for the original Obayashi placeholder, or `/projects/template/` for the six-section template preview. The home page shows Obayashi and Point.ly; reserved Project 03 and Project 04 tiles are hidden until their content is ready. Pages retain the sticky glass header and shared footer. Both Figma case studies use their inspected logos, spacing, and Fira Mono, with Work / About+Contact navigation shared by every page. The brand returns home, and the Work menu returns to selected work. Exhibit images can be enlarged in an accessible dialog or opened at full size.

The reusable template's six modules are **About**, **Deliverable**, **Completed**, **User Persona**, **Research**, and **Design Evolution**, in that order. Each has its own component in `src/components/CaseStudySections/` and uses the shared section layout. The template supplies placeholder text and imagery for all six. Point.ly now has its own layout in `PointlyCaseStudyPage.jsx` so the supplied redesign does not change other project templates.

Point.ly follows the October 19, 2026 revision of the directly inspected Figma frame `90:18` (“Pointly Case Study 2”) in `wZSRbIZZXfUlrq902OXE2W`. Its desktop reference is 1440 × 10571, with 1200-pixel content and 120-pixel outer margins. `Assets/figma files/pointly-frame-90-18-2026-10-19.json` preserves the updated geometry, layer mapping, source hashes, and inspection limits. The original inspection remains in `Assets/figma files/pointly-frame-90-18.json`. CSS grid and normal document flow implement the layout; overlapping art uses local positioning. All 50 original PNG/SVG exports remain archived unchanged in `public/assets/pointly-figma/`; the four section-divider SVGs now have native CSS border replacements. Its manifest records source paths, hashes, dimensions, and original layer IDs; regenerate those original exports with `python3 scripts/import-pointly-figma.py`. The revision manifest in `public/assets/pointly-figma-update/` maps reused assets to their current Figma layer IDs and positions. The page renders one Methods column, as approved, and excludes competitor drafts outside the selected frame.

Point.ly uses the inspected Inter body/headings, Fira Mono labels/navigation, Instrument Sans palette labels, and Poppins type samples. Normal, medium, bold, and italic text ranges are separate HTML elements. The last specimen is labeled “Inter Bold Italic” but uses normal bold in the Figma layer; the implementation preserves that supplied style. Fonts are hosted locally from the official [Google Fonts repository](https://github.com/google/fonts), with their OFL licenses under `public/assets/fonts/`. The page makes no external font requests. Exact colors include blue `#88cffd`, lime `#e7ef52`, and card gray `#f7f7f7`. The Point.ly header uses its six exported SVG logo pieces and Fira Mono; other pages retain their existing header variant.

The horizontal lines in the live Figma frame “Pointly Case Study 2” (`90:18`) were re-inspected for the Safari fix. `public/assets/pointly-figma-update/dividers.json` records the five black 0.5-pixel dividers: Project Details (`101:3`, Line 61, 1200 px), Interviews (`143:16`, Line 69, 892 px), Research (`143:18`, Line 70, 892 px), Design (`163:12`, Line 71, 892 px), and What I Learned (`413:11`, Line 72, 892 px). These render as native CSS top borders using the inspected widths and offsets, matching the Obayashi fix. The two 63-pixel, 1-pixel-stroke Goals connectors (`130:33`, `130:34`) retain their original SVGs. The original five divider SVGs stay archived, including the short Project Details SVG that WebKit cannot decode.


“From Research to MVP Prototype” retains all three screens and captions originally supplied in `Assets/pointly_2/MVP Section.png`. The October revision uses the unmodified high-resolution Figma originals in `public/assets/pointly-figma-update/`: `connected-wallet.png`, `recommended-stays.png`, and `stay-details.png`. That folder also contains the Figma project-details divider. Its manifest records source hashes and dimensions; the earlier template copies remain archived in `public/assets/pointly-2/`. The three rows are Rewards Dashboard, Personalized Recommendations, and Property Detail, with the exact descriptions to the right on desktop and below the images on phones. Captions use local Inter at 15 px with 24 px line height and 0 letter spacing, with bold labels and regular body text. The revision updates section spacing, heading sizes, the visual-identity and MVP introductions, and the three Reflection paragraphs with bold lead-ins. The gallery occupies normal document flow, followed by “What I Learned.” Product screenshots and research exhibits open in the existing accessible image dialog. The shared contact footer and return-to-work link remain available.

Obayashi follows the directly inspected October 19, 2026 Figma frame `420:76` in `wZSRbIZZXfUlrq902OXE2W`. The reference is 1440 × 12278 with 1200-pixel content, 120-pixel side margins, a 12-column grid and 24-pixel gutters. It includes five project-detail columns, Home/Markets hero screens, the challenge, four green guiding principles, competitive benchmarking, four website-audit findings, priorities and strategy, stakeholder research, a quote, storyboard and brand imagery, sketches and wireframes, final designs, outcomes and reflection. `Assets/figma files/obayashi-inspection-2026-10-19/` retains the exact text, styles, geometry, image fills, constraints, masks, effects, exports and source assets. The original inspection remains intact. The approved revision is saved in `Assets/figma files/obayashi-update-2026-10-19/`, including the current 190-node snapshot, an object-by-object comparison, and seven original SVG exports for the revised dividers, masks, and 35-pixel audit icon. All 24 raster sources are unchanged. The 41 reference PNG/SVG assets in `public/assets/obayashi-figma/` combine those updated exports with the unchanged originals; the manifest records their SHA-256 values, source paths, layer IDs, crop geometry, and seven individually identified dividers. Regenerate using `python3 scripts/import-obayashi-figma.py` (Python standard library only). The older PNG-based assets remain archived.

The approved editorial changes keep Obayashi numbered `01 /` to match its home tile, render one Methodology label, and repair the forced break inside “relevant.” Body/headings use local Inter; labels/navigation use local Fira Mono. Exact colors include slate `#3a4855`, green `#0ba147`, lime `#e7ef52`, and label gray `#60676c`. The six section links stay 24 pixels beneath the glass header on desktop and wrap above the content below 1024 pixels. All seven black section dividers use native CSS top borders, requesting Figma’s 0.5-pixel stroke weight and retaining each line’s width and offset, including the 1200-pixel Project Details rule and six 892-pixel section rules. Browsers may snap that border to one pixel on a 1x display. The two original divider SVG exports remain archived for provenance but are not embedded: WebKit fails to decode their intrinsic heights below one pixel, while Chrome loads them. Native borders avoid that Safari rendering failure and keep the lines visible. The revision updates the Project Details labels to 12 pixels, the hero Home crop, 202 × 200 guiding-principle cards, competitive matrix and interview montage masks, audit icons and text alignment, Key Decision width, storyboard spacing, design heading, and outcomes/reflection spacing. The actual Figma timeline is 10 months. The four revised outcome bullets and implementation-status paragraph come directly from Figma; the status explicitly states that usability and engagement impact has not yet been measured. Outcomes and reflection come from the live frame; no new results or metrics were invented. The original placeholder remains at `/projects/obayashi_old/`. Obayashi's home tile opens `/projects/obayashi/`. Its sentence-case summary is “Aligning teams, audiences, and priorities into a unified experience”; the tools list omits Wix. Its ending contains only “Next Project: Point.ly,” linking to `/projects/pointly/`.

`src/components/CareersLaptop/CareersLaptop.jsx` preserves the original laptop PNG and places the unmodified `Careers 1` export inside the screen. The source display rectangle is `(180, 37, 1604, 1039)` within the 1964 × 1196 image. A clipped browser surface preserves the original bezel, camera notch and base. The page scrolls upward over a 48-second cycle, holds at the top and bottom, then fades briefly to reset. ResizeObserver calculates travel from the full page height and visible screen height, so the final footer appears without empty space. It starts automatically when visible, pauses off-screen or in a hidden tab, and displays a static preview for reduced-motion visitors. The Careers caption and the laptop's original desktop placement are retained. The approved final version displays no Pause/Play or full-page enlargement controls beneath the laptop; the automatic scrolling and loop timing remain unchanged.

### Deploy Overall Kiana website updates version 2 through GitHub

The earlier home/About update and Point.ly numbering correction are already committed. This update replaces the profile popups, adds the new About page and footer, fixes the navigation hover underline, and applies the requested subtitle and Obayashi edits. Build and verify, then stage this update, including removal of the two old popup components:

```sh
cd "/Users/geoffgeorge/Developer/Kiana Portfolio" &&
npm run build &&
PORTFOLIO_TEST_TARGET=production npx playwright test --workers=2 &&
git add -- \
  README.md vite.config.js about/ \
  src/App.jsx src/lib/urls.js src/data/site.js src/data/about.js \
  src/pages/AboutPage.jsx src/pages/AboutPage.css \
  src/pages/ObayashiCaseStudyPage.jsx src/pages/ObayashiCaseStudyPage.css \
  src/components/Navigation/ src/components/SiteFooter/ \
  src/components/SiteHeader/SiteHeader.jsx \
  src/components/SelectedWork/SelectedWork.css \
  src/components/Modal/Modal.css \
  src/components/Modal/AboutContent.jsx src/components/Modal/ContactContent.jsx \
  tests/portfolio.spec.js tests/case-study.spec.js tests/hero-layout.spec.js \
  tests/hero-animation.spec.js tests/home-about-design.spec.js tests/obayashi-design.spec.js \
  public/assets/website-v2-figma/ \
  "Assets/figma files/overall-website-v2-2026-10-21/" \
  "specs/changes/update 3.md" &&
git diff --cached --stat &&
git commit -m "Implement overall Kiana website updates version 2" &&
git push origin main
```

The selected files leave unrelated local edits unstaged. Source inspections use local asset paths; temporary download links, review screenshots, and nearby drafts are excluded. Keep `dist/` and `node_modules/` ignored; Cloudflare builds from the committed source.

The remote is `https://github.com/geoffageorge/kiana-portfolio.git`. For the existing Workers Builds setup, confirm **Workers & Pages → kiana-portfolio → Settings → Build** uses repository `geoffageorge/kiana-portfolio`, production branch `main`, build command `npm run build`, deploy command `npx wrangler deploy`, and the repository root. The existing `wrangler.jsonc` uploads `dist/` and serves trailing-slash project URLs. A successful push to the connected production branch triggers a deployment. Check that build's status, then open both home tiles and reload `/projects/obayashi/` and `/projects/pointly/` in Safari and Chrome on your live domain. These are the existing repository settings; the live Cloudflare connection is not changed by the local update. See the official [Cloudflare build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) and [GitHub push instructions](https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository).

To add another case study:

1. Add its `{ slug, title, description }` to `src/data/projectRoutes.js`. Page entries are generated automatically before `npm run dev` and `npm run build`.
2. Update the reserved Project 03 card in `src/data/projects.js` and set `showOnHome: true`, or add a new card using `assetUrl()` for imagery and `projectUrl(slug)` for its link. Do the same for Project 04 when needed.
3. Start with `createProjectTemplate({ slug, title, number, image, imageAlt })` from `src/data/caseStudies/template.js`, then replace the six sections with the project's content.
4. Register that data in `src/data/caseStudies/index.js`. The shared page needs no layout changes.

Sections accept `text`, `list`, `cards`, `quote`, and `gallery` blocks. Gallery images have `src`, `alt`, optional `width`/`height`, `caption`, and `stage`. Cards support `title`, `body`, `quote`, and `attribution`. Optional sections use the same renderer and can be added to the `sections` array.

For future projects, useful additions are a project overview (role, team, timeline, scope), product strategy, outcomes with measured results when available, reflection and next steps, and a live prototype link when one is provided. The current Point.ly source does not include a working external prototype URL or quantified impact metrics.

The original shareable file is copied byte-for-byte into `pointly project/index.html`. `pointly project/case-study.html` extracts the earlier Point.ly case study with local image files. Its manifest records original image positions, alt text, dimensions, and checksums. Those earlier images remain archived in `public/assets/pointly/` and the earlier content in `src/data/caseStudies/pointly.js`; the active Point.ly route uses the new design. The archived source HTML pages are not part of the production site.

The build includes a real `index.html` under `/about/` and every project path, so direct links and reloads work on static hosts without a special SPA redirect. Relative asset paths and `src/lib/urls.js` support publishing the entire `dist/` folder at the domain root or below a directory. `useInitialHashNavigation.js` scrolls incoming fragment links after React, lazy content and fonts are ready, so Work returns directly to `/#work` from project pages and shared section links open at the correct heading.

## Verification

```sh
npm test
```

To run the same checks against the built website:

```sh
npm run build
PORTFOLIO_TEST_TARGET=production npm test
```

Browser checks use locally installed Google Chrome. If Chrome is unavailable, install Playwright Chromium (`npx playwright install chromium`) and remove `channel: 'chrome'` from the Playwright configuration. Tests cover media loading, the two visible project tiles, shared navigation and dialogs, project links and reloads, imported asset hashes and usage, image enlargement, the archived Obayashi page, the reusable template, keyboard focus, animation startup and looping, reduced motion, fixed hero artwork settings, transparent logo pixels, and responsive overflow. Obayashi's desktop raster placements, updated guiding-principle cards, audit icons, Key Decision panel, outcomes, reflection and all seven dividers are checked against the independently inspected revision geometry. Every divider is checked for a visible native CSS border, its Figma stroke setting, width and offset on desktop and mobile. Its laptop checks cover screen containment, upward scroll, the loop boundary, absence of playback/enlargement controls, off-screen pausing and automatic resumption, and reduced motion. Existing hero checks compare rendered motion with the original animation; shared-header checks cover all project routes.

To check both case studies’ Safari divider regressions with WebKit, install the optional browser once, then run the focused check:

```sh
npx playwright install webkit
PORTFOLIO_TEST_TARGET=production PORTFOLIO_TEST_WEBKIT=1 npx playwright test --project=safari-webkit --grep "section dividers"
```

The version 2 checks verify all 11 archived exports and four revised assets, the updated biography and portrait geometry, full-page About routing/reloads, footer placement, grey and gold rollover states, underline clearance below the text, phone/email actions, PDF delivery, new-tab destinations, responsive layout, and subdirectory asset/link resolution. Run them with the same optional WebKit browser:

```sh
PORTFOLIO_TEST_TARGET=production PORTFOLIO_TEST_WEBKIT=1 npx playwright test --project=safari-webkit tests/home-about-design.spec.js
```

The generated artwork is already included; Python is not needed to run or build the website. To regenerate it, install Pillow and NumPy in a Python environment, then run `python3 scripts/generate-assets.py`.
