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
  pages/CaseStudyPage.jsx        Shared project page composition
  pages/PointlyCaseStudyPage.jsx Point.ly layout matching the pointly_2 design
  pages/ObayashiCaseStudyPage.jsx Obayashi layout and research from Obayashi.png
  data/caseStudies/obayashi_old.js Preserved original Obayashi placeholder
  styles/global.css             Design tokens, fonts, shared rules
  styles/case-study-theme.css    Local fonts shared by case studies and header
  components/                   Each folder contains JSX and its CSS
    Logo/                       Supplied Ki Logo, at the original displayed size
    BrandName/                  Name and UX design descriptor
    SiteHeader/                 Sticky logo, name, and navigation bar
    Navigation/                 Work, About, Resume, Contact
    HeroSection/                Clarifying Chaos heading and introduction
    HeroArtwork/                Continuous native SVG animation
    SectionHeading/             Reusable title and subtitle
    ProjectCard/                Independent project image and caption tile
    SelectedWork/               Heading and two-column project grid
    SiteFooter/                 Black footer, brand, and contact links
    Modal/                      Accessible reusable native dialog
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
  pointly-2/                    23 lossless reference crops and 3 MVP screenshots
  obayashi/                     6 lossless research exhibits and crop manifest
  fonts/                        Locally hosted Inter, Roboto, Roboto Mono and OFL licenses
projects/                       Static HTML entries for each project page
pointly project/                Archived source, extracted study, and assets
scripts/generate-assets.py       Optional artwork regeneration
scripts/import-pointly.py        Source archive and image extraction
scripts/import-pointly-design.py  Extracts artwork from the pointly_2 Figma PNG
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

- Edit `src/data/site.js` for branding, hero copy, and the contact email. The email matches the design reference.
- Set `resumeUrl` to the final résumé URL, for example `${import.meta.env.BASE_URL}assets/resume.pdf`, and place the PDF in `public/assets/`.
- Set `linkedInUrl` to the actual LinkedIn profile URL. Until these links are supplied, the controls explain that they are coming soon.
- Put real project artwork in `public/assets/projects/`, then edit each record in `src/data/projects.js`. Replace its title, image, alt text, category, status, and description.
- Each card has a `slug` and `caseStudyUrl` pointing to its project page. Obayashi and Point.ly have dedicated case studies; the archived and reserved pages use the reusable template with labeled placeholder content.
- Only Obayashi and Point.ly appear on the home page. Project 03 and Project 04 remain defined with `showOnHome: false` in `src/data/projects.js`; their project pages and assets are retained. To add the next project, update Project 03's card details and case-study content, then set `showOnHome: true` to display its tile again.
- Edit the About text in `src/App.jsx` when final biography copy is ready.

The hero renders the native SVG from `Assets/clarifying-chaos-solid-colors.html` in `HeroArtwork.jsx` with scoped animation styles in `HeroArtwork.css`. It preserves the five moving labels, 10-second CSS cycle, 25 rotating spirograph ellipses with 12–16-second SVG animation cycles, and the final glowing outline and “Clarity” text. The four ring colors are `#9cbabc`, `#e5ef18`, `#afddb1`, and `#5fd1d3`; the spirograph and final outline use the same palette. It starts automatically and loops continuously. Reduced-motion visitors see the static final circle and labels. The SVG has a transparent background. Its final glowing circle uses native SVG arcs and a blur filter, replacing absolutely positioned HTML inside `foreignObject` that Safari can render in the wrong location. A scene clipPath, hidden SVG overflow, and a contained figure keep every drawing layer within the hero canvas.

All page backgrounds use `--color-page: #fff` in `src/styles/global.css`. Each home-page project card has white space around its image and caption. The original thin horizontal and vertical rules delineate the cards, with no gutters between them. The project grid becomes one column on phones.

On devices with a mouse or trackpad, project tiles rise 8 pixels and tilt 2 degrees with a soft shadow on hover. The raised tile appears above adjacent tiles, and its image and arrow respond to the hover. Keyboard focus gives the tile the same lift while retaining the visible focus outline. Touch devices keep the static layout; reduced-motion preferences disable the transforms while retaining the shadow cue.

Header and footer use `public/assets/brand/ki-logo.png`, a transparent extraction of the six colored shapes in `Assets/Ki Logo.jpg`. The displayed logo remains 54 × 36 pixels on desktop and 45 × 30 on phones. The replacement was made with the built-in imagegen tool; its exact extraction prompt is recorded in `Assets/ki-logo-transparent-prompt.txt`.

The shared header stays at the top while scrolling, with a translucent frosted-glass layer that blurs content behind the sharp navigation text. The glass fades to transparent along its lower edge so scrolling content passes smoothly behind it. Its measured height offsets anchor links and the desktop case-study sidebar so content stays visible below it. System sans-serif and monospace fonts approximate the reference without remote font requests.

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

Open `/projects/obayashi/` and `/projects/pointly/` for the current case studies, `/projects/obayashi_old/` for the original Obayashi placeholder, or `/projects/template/` for the six-section template preview. The home page shows Obayashi and Point.ly; reserved Project 03 and Project 04 tiles are hidden until their content is ready. Every page uses the same sticky glass header with Work / About / Resume / Contact, the same header typography and spacing, and the shared footer. Work returns to the home page's selected projects; the brand returns home. Exhibit images can be enlarged in an accessible dialog or opened at full size.

The reusable template's six modules are **About**, **Deliverable**, **Completed**, **User Persona**, **Research**, and **Design Evolution**, in that order. Each has its own component in `src/components/CaseStudySections/` and uses the shared section layout. The template supplies placeholder text and imagery for all six. Point.ly now has its own layout in `PointlyCaseStudyPage.jsx` so the supplied redesign does not change other project templates.

Point.ly follows `Assets/pointly_2/Pointly Case Study 2.png`: an overview and six-column fact row, two blue product showcases, challenge and circular goals, then Interviews, Research, Design, and Retrospective. Text is semantic HTML; screenshots, illustrations, logos, sketches and the visual-system exhibit are extracted losslessly from the supplied image. `public/assets/pointly-2/manifest.json` records each extraction rectangle and the original file's SHA-256. Regenerate these assets with `python3 scripts/import-pointly-design.py` (Pillow required).

The reference is a flattened PNG without editable font metadata. Browser-rendered font samples were compared against it: locally hosted Inter is the closest heading match, Roboto is used for body copy, and Roboto Mono for labels and navigation. Fonts come from the official [Google Fonts repository](https://github.com/google/fonts); their OFL licenses are included under `public/assets/fonts/`. Colors are sampled from the reference: blue `#88cffd`, lime `#e7ef52`, card gray `#f7f7f7`, and white page background. The desktop content is 1200 pixels wide at a 1440-pixel viewport. Native content reflows on small screens.

“From Research to MVP Prototype” uses the supplied `02-connected-wallet 1.png`, `06-recommended-stays 1.png`, and `07-stay-details 1.png` files in `Assets/pointly_2/`, copied unchanged into the public assets by the import script. They appear in that order as Rewards Dashboard, Personalized Recommendations, and Property Detail. Each full, uncropped image has the supplied heading and description to its right on desktop and below it on phones. The section shares the surrounding white background and body typography, with a 96-pixel gap before “What I Learned.” Images can be enlarged using the shared dialog. The original shared footer remains below the case study.

Obayashi follows `Assets/obayashi/Obayashi.png`: overview, six-column facts, challenge, stakeholder interviews and five numbered research findings. Its photographs and annotated screenshots are extracted without changing their pixels into `public/assets/obayashi/`; the manifest records crop rectangles and the reference SHA-256. Regenerate with `python3 scripts/import-obayashi-design.py` (Pillow required). The green quote uses sampled `#e3f2e7`; the embedded pink annotations retain `#ffc9c9`. Native text shares Point.ly's local Inter / Roboto / Roboto Mono fonts and white background. Obayashi is labeled `01 /` and Point.ly `02 /`, matching the home tiles. The Obayashi Methodology sidebar stays 24 pixels below the shared header throughout Challenge, Research, Design and Reflection, with the content in its own column to avoid overlap. On phones and tablets below 1024 pixels, the section links wrap above the content like Point.ly's navigation.

The supplied Obayashi export has a truncated introductory sentence and no content below “Four principles guided the redesign”; the remainder is an empty artboard. The website ends the introduction at the last complete fact, includes Design and Reflection as title-only sections with navigation links, and removes the excess blank space before research and after the supplied content. No design principles, final outcomes, or reflection claims have been invented. Add content beneath those headings in `ObayashiCaseStudyPage.jsx` when it is available. The earlier placeholder is preserved independently in `src/data/caseStudies/obayashi_old.js` and built at `/projects/obayashi_old/`. Obayashi's home tile opens Obayashi; the Point.ly tile opens Point.ly; the Obayashi footer also links to Point.ly as the next project.

To add another case study:

1. Add its `{ slug, title, description }` to `src/data/projectRoutes.js`. Page entries are generated automatically before `npm run dev` and `npm run build`.
2. Update the reserved Project 03 card in `src/data/projects.js` and set `showOnHome: true`, or add a new card using `assetUrl()` for imagery and `projectUrl(slug)` for its link. Do the same for Project 04 when needed.
3. Start with `createProjectTemplate({ slug, title, number, image, imageAlt })` from `src/data/caseStudies/template.js`, then replace the six sections with the project's content.
4. Register that data in `src/data/caseStudies/index.js`. The shared page needs no layout changes.

Sections accept `text`, `list`, `cards`, `quote`, and `gallery` blocks. Gallery images have `src`, `alt`, optional `width`/`height`, `caption`, and `stage`. Cards support `title`, `body`, `quote`, and `attribution`. Optional sections use the same renderer and can be added to the `sections` array.

For future projects, useful additions are a project overview (role, team, timeline, scope), product strategy, outcomes with measured results when available, reflection and next steps, and a live prototype link when one is provided. The current Point.ly source does not include a working external prototype URL or quantified impact metrics.

The original shareable file is copied byte-for-byte into `pointly project/index.html`. `pointly project/case-study.html` extracts the earlier Point.ly case study with local image files. Its manifest records original image positions, alt text, dimensions, and checksums. Those earlier images remain archived in `public/assets/pointly/` and the earlier content in `src/data/caseStudies/pointly.js`; the active Point.ly route uses the new design. The archived source HTML pages are not part of the production site.

The build includes a real `index.html` under every project path, so direct links and reloads work on static hosts without a special SPA redirect. Relative asset paths and `src/lib/urls.js` support publishing the entire `dist/` folder at the domain root or below a directory. `useInitialHashNavigation.js` scrolls incoming fragment links after React, lazy content and fonts are ready, so Work returns directly to `/#work` from project pages and shared section links open at the correct heading.

## Verification

```sh
npm test
```

To run the same checks against the built website:

```sh
npm run build
PORTFOLIO_TEST_TARGET=production npm test
```

Browser checks use locally installed Google Chrome. If Chrome is unavailable, install Playwright Chromium (`npx playwright install chromium`) and remove `channel: 'chrome'` from the Playwright configuration. Tests cover media loading, the two visible project tiles, shared navigation and dialogs, project links and reloads, all imported images, image enlargement, the archived Obayashi page, the reusable template, keyboard focus, automatic animation startup and a complete repeat after 10 seconds, reduced motion, fixed artwork settings, transparent logo pixels, and responsive overflow. Obayashi and Point.ly artwork is compared pixel by pixel to the supplied PNGs. Animation checks compare rendered transforms, opacity, easing, and spirograph rotation with the supplied HTML at 12 times across the cycle and its repeat. Header checks cover scrolling, consistent menu options and Work links on every page.

The generated artwork is already included; Python is not needed to run or build the website. To regenerate it, install Pillow and NumPy in a Python environment, then run `python3 scripts/generate-assets.py`.
