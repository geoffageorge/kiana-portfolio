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
    Logo/                       Small six-color brand mark
    BrandName/                  Name and UX design descriptor
    SiteHeader/                 Sticky logo, name, and navigation bar
    Navigation/                 Work, About, Resume, Contact
    HeroSection/                Clarifying Chaos heading and introduction
    HeroArtwork/                Native SVG animation, Pause and Replay controls
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

The hero renders the native SVG from `Assets/clarifying-chaos-solid-colors.html` in `HeroArtwork.jsx` with scoped animation styles in `HeroArtwork.css`. It preserves the original pink, sage, gray, and yellow rings, five moving labels, 10-second CSS cycle, 25 rotating spirograph ellipses with 12–16-second SVG animation cycles, and the final glowing outline and “Clarity” text. Pause freezes both CSS and SVG clocks; Play resumes them; Replay resets both. Reduced-motion visitors see the static final circle and labels. The SVG scales with the hero and has a transparent background.

All page backgrounds use `--color-page: #fbfaf7` in `src/styles/global.css`. The shared header stays at the top while scrolling. Its measured height offsets anchor links and the desktop case-study sidebar so content stays visible below it. System sans-serif and monospace fonts approximate the reference without remote font requests. The project grid becomes one column on phones.

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

Browser checks use locally installed Google Chrome. If Chrome is unavailable, install Playwright Chromium (`npx playwright install chromium`) and remove `channel: 'chrome'` from the Playwright configuration. Tests cover media loading, the four project tiles, shared navigation and dialogs, project links and reloads, all imported images, image enlargement, the reusable template, keyboard focus, animation controls, reduced motion, and responsive overflow. Animation checks compare rendered transforms, opacity, easing, and spirograph rotation with the supplied HTML at 12 times across the cycle and its repeat. Header checks cover scrolling and anchor visibility on every page.

The generated artwork is already included; Python is not needed to run or build the website. To regenerate it, install Pillow and NumPy in a Python environment, then run `python3 scripts/generate-assets.py`.
