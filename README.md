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
  styles/global.css             Design tokens, fonts, shared rules
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
projects/                       Static HTML entries for each project page
pointly project/                Archived source, extracted study, and assets
scripts/generate-assets.py       Optional artwork regeneration
scripts/import-pointly.py        Source archive and image extraction
scripts/scaffold-project-pages.mjs  Generates page entries before dev/build
tests/portfolio.spec.js          Browser smoke checks
tests/hero-animation.spec.js     Original animation comparison and sticky header checks
tests/hero-layout.spec.js        Fixed framing, responsive placement, colors, and transparent logo checks
tests/hero-canvas.spec.js        Canvas containment and removal of temporary inspection UI
Assets/clarifying-chaos-solid-colors.html  Original animation reference
specs/                          Original specifications, preserved
Design Template/                Original design reference, preserved
```

## Replace prototype content

- Edit `src/data/site.js` for branding, hero copy, and the contact email. The email matches the design reference.
- Set `resumeUrl` to the final résumé URL, for example `${import.meta.env.BASE_URL}assets/resume.pdf`, and place the PDF in `public/assets/`.
- Set `linkedInUrl` to the actual LinkedIn profile URL. Until these links are supplied, the controls explain that they are coming soon.
- Put real project artwork in `public/assets/projects/`, then edit each record in `src/data/projects.js`. Replace its title, image, alt text, category, status, and description.
- Each card has a `slug` and `caseStudyUrl` pointing to its project page. Point.ly contains the imported case study; the other pages use the reusable template with labeled placeholder content.
- Edit the About text in `src/App.jsx` when final biography copy is ready.

The hero renders the native SVG from `Assets/clarifying-chaos-solid-colors.html` in `HeroArtwork.jsx` with scoped animation styles in `HeroArtwork.css`. It preserves the five moving labels, 10-second CSS cycle, 25 rotating spirograph ellipses with 12–16-second SVG animation cycles, and the final glowing outline and “Clarity” text. The four ring colors are `#9cbabc`, `#e5ef18`, `#afddb1`, and `#5fd1d3`; the spirograph and final outline use the same palette. It starts automatically and loops continuously. Reduced-motion visitors see the static final circle and labels. The SVG has a transparent background. Its final glowing circle uses native SVG arcs and a blur filter, replacing absolutely positioned HTML inside `foreignObject` that Safari can render in the wrong location. A scene clipPath, hidden SVG overflow, and a contained figure keep every drawing layer within the hero canvas.

All page backgrounds use `--color-page: #fff` in `src/styles/global.css`. Each home-page project card has white space around its image and caption. The original thin horizontal and vertical rules delineate the cards, with no gutters between them. The project grid becomes one column on phones.

Header and footer use `public/assets/brand/ki-logo.png`, a transparent extraction of the six colored shapes in `Assets/Ki Logo.jpg`. The displayed logo remains 54 × 36 pixels on desktop and 45 × 30 on phones. The replacement was made with the built-in imagegen tool; its exact extraction prompt is recorded in `Assets/ki-logo-transparent-prompt.txt`.

The shared header stays at the top while scrolling, with a translucent frosted-glass layer that blurs content behind the sharp navigation text. The glass fades to transparent along its lower edge so scrolling content passes smoothly behind it. Its measured height offsets anchor links and the desktop case-study sidebar so content stays visible below it. System sans-serif and monospace fonts approximate the reference without remote font requests.

## Hero artwork placement

`src/data/heroArtwork.json` and `Assets/heroArtwork-1.json` contain the fixed settings: viewBox `50 0 1000 900`, maximum width 960 pixels, horizontal/vertical ring offsets of 200/200 SVG units, and 60% label spread. All visitors use these settings; the former adjustment controls, browser overrides, and local save endpoint have been removed. Keep both JSON files synchronized when changing future published settings.

The 200/200-unit offsets spread the four rings around the center during the opening phase. The chosen 1000 × 900 viewBox provides additional room on the right. The original animation timings and indefinite repeat behavior remain intact.

On desktop (1024 pixels and wider), the canvas's left edge starts 80 pixels left of the first S in the header's INSIGHTS. The center of the two-line Clarifying Chaos heading aligns with the canvas's vertical midpoint, directly to its left. `placement.x` defaults to -80 pixels of horizontal shift from the S anchor. `placement.y` defaults to a 20-pixel gap below the navigation bar; the heading adjusts to its center so neither needs to overlap the navigation. Measurements update on resizing without changing when the sticky header is scrolled. The canvas shrinks to the available page width and occupies normal grid space, keeping Select Work below it. On phones and tablets, the heading and artwork stack with a gap to preserve legibility.

## Hero artwork settings

The temporary canvas border, center lines, and Hero canvas inspector have been removed. Run `npm run dev`, then open **http://127.0.0.1:5173/** to view the saved animation. To adjust its settings in the future, edit both JSON files below and reload the preview.

| Setting in `src/data/heroArtwork.json` | Saved value | Effect |
| --- | --- | --- |
| `placement.x` | `-80` px | Shift the canvas from the S anchor; negative moves left, positive moves right. On desktop its width adapts to the remaining page space. |
| `placement.y` | `20` px | Gap below navigation; increasing it moves the canvas and centered heading down. |
| `maxWidth` | `960` px | Maximum rendered canvas width, capped by the available page width. |
| `viewBox.x` | `50` SVG units | Internal frame's left coordinate; increasing it shifts the drawing left within the canvas. |
| `viewBox.y` | `0` SVG units | Internal frame's top coordinate; increasing it shifts the drawing up within the canvas. |
| `viewBox.width` | `1000` SVG units | Internal horizontal drawing area; increasing it reveals more and scales the drawing down at the same canvas width. |
| `viewBox.height` | `900` SVG units | Internal vertical drawing area; increasing it makes the rendered canvas taller at the same width. |
| `movement.x` / `movement.y` | `200` / `200` SVG units | How far the circles spread horizontally and vertically during the cycle. |
| `movement.labelSpread` | `60` percent | Scale of the labels' movement offsets. |

Desktop position is calculated in `HeroSection.jsx`: left = page-container left + measured S anchor + `placement.x`; top = navigation bottom + `placement.y`. The height is rendered width × viewBox height ÷ viewBox width. The heading follows the canvas's vertical midpoint. Below 1024 pixels, the canvas stacks beneath the text and desktop position offsets are ignored.

The saved viewBox ends at x=1050 (left 50 + width 1000). The original full framing is `0 0 1200 900`. The tests sample ring boundaries including their strokes, labels, and spirograph through the cycle. Changing the frame width preserves the choreography; reducing circle offsets or label spread changes the movement. Shifting `viewBox.x` alone can trade right-side clipping for left-side clipping. With the chosen -80-pixel placement, INSIGHTS still briefly overlaps the heading during the cycle; moving `placement.x` to 0 separates the frame from the text.

## Project pages and reusable template

Open `/projects/pointly/` for the Point.ly case study or `/projects/template/` for the six-section template preview. The remaining home page tiles open their own placeholder project pages. All pages reuse `SiteHeader`, `Navigation`, and `SiteFooter`; Work and the header logo return to the home page. Images can be enlarged in an accessible dialog or opened at full size.

The six required modules are **About**, **Deliverable**, **Completed**, **User Persona**, **Research**, and **Design Evolution**, in that order. Each has its own component in `src/components/CaseStudySections/` and uses the shared section layout. The template supplies placeholder text and imagery for all six. Case studies fill those sections with appropriate evidence rather than forcing an unrelated image into each section.

Point.ly includes the source's interview profiles and quotes, research questions and findings, product strategy, early concepts, usability feedback, visual system, onboarding iterations, hackathon, final screens, outcomes, and reflection. All 21 unique source images are used. Product strategy is a subsection of Research; Outcomes and Reflection are optional sections following the six core modules. No quantified business results were supplied or invented.

To add another case study:

1. Add its `{ slug, title, description }` to `src/data/projectRoutes.js`. Page entries are generated automatically before `npm run dev` and `npm run build`.
2. Add its home card to `src/data/projects.js`, using `assetUrl()` for imagery and `projectUrl(slug)` for its link.
3. Start with `createProjectTemplate({ slug, title, number, image, imageAlt })` from `src/data/caseStudies/template.js`, then replace the six sections with the project's content.
4. Register that data in `src/data/caseStudies/index.js`. The shared page needs no layout changes.

Sections accept `text`, `list`, `cards`, `quote`, and `gallery` blocks. Gallery images have `src`, `alt`, optional `width`/`height`, `caption`, and `stage`. Cards support `title`, `body`, `quote`, and `attribution`. Optional sections use the same renderer and can be added to the `sections` array.

For future projects, useful additions are a project overview (role, team, timeline, scope), product strategy, outcomes with measured results when available, reflection and next steps, and a live prototype link when one is provided. The current Point.ly source does not include a working external prototype URL or quantified impact metrics.

The original shareable file is copied byte-for-byte into `pointly project/index.html`. `pointly project/case-study.html` extracts just the Point.ly case study with local image files. Its manifest records original image positions, alt text, dimensions, and checksums. The images are also copied to `public/assets/pointly/` for the new website; the archived source pages are not part of the production site.

The build includes a real `index.html` under every project path, so direct links and reloads work on static hosts without a special SPA redirect. Relative asset paths and `src/lib/urls.js` support publishing the entire `dist/` folder at the domain root or below a directory.

## Verification

```sh
npm test
```

To run the same checks against the built website:

```sh
npm run build
PORTFOLIO_TEST_TARGET=production npm test
```

Browser checks use locally installed Google Chrome. If Chrome is unavailable, install Playwright Chromium (`npx playwright install chromium`) and remove `channel: 'chrome'` from the Playwright configuration. Tests cover media loading, the four project tiles, shared navigation and dialogs, project links and reloads, all imported images, image enlargement, the reusable template, keyboard focus, automatic animation startup and a complete repeat after 10 seconds, reduced motion, fixed artwork settings, transparent logo pixels, and responsive overflow. Animation checks compare rendered transforms, opacity, easing, and spirograph rotation with the supplied HTML at 12 times across the cycle and its repeat. Header checks cover scrolling and anchor visibility on every page.

The generated artwork is already included; Python is not needed to run or build the website. To regenerate it, install Pillow and NumPy in a Python environment, then run `python3 scripts/generate-assets.py`.
