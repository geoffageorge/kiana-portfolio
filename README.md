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

## Publish through GitHub and Cloudflare Pages

This follows the workflow documented in `Green_Tea/zen-tea-v2/README.md`: push the source repository to GitHub, then connect it to Cloudflare Pages Git integration. Commit `src/`, `public/` (including all artwork and the GIF), the package files, and configuration. `node_modules/`, `dist/`, and browser test output are excluded by `.gitignore`; Cloudflare installs dependencies and builds the website from source.

Create a new repository such as `geoffageorge/kiana-portfolio`. In the [Cloudflare dashboard](https://dash.cloudflare.com/), choose **Workers & Pages → Create application → Pages → Connect to Git**, then select the repository.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Vite` (or use the explicit settings below) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Leave blank |
| Node version | `22.16.0`, set by `.node-version` |
| Environment variables | None required |

Select **Save and Deploy**. Cloudflare gives the project a `pages.dev` URL and automatically republishes changes pushed to `main`. Refer to the official [Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/) and [build environment documentation](https://developers.cloudflare.com/pages/configuration/build-image/) for the current dashboard and version settings.

## File structure

```text
src/
  App.jsx                       Page composition and dialog content
  main.jsx                      React entry point
  data/
    site.js                     Brand, hero, email, résumé, LinkedIn
    projects.js                 Four replaceable project records
  styles/global.css             Design tokens, fonts, shared rules
  components/                   Each folder contains JSX and its CSS
    Logo/                       Small six-color brand mark
    BrandName/                  Name and UX design descriptor
    SiteHeader/                 Logo, name, and navigation composition
    Navigation/                 Work, About, Resume, Contact
    HeroSection/                Clarifying Chaos heading and introduction
    HeroArtwork/                Animated GIF, process labels, pause control
    SectionHeading/             Reusable title and subtitle
    ProjectCard/                Independent project image and caption tile
    SelectedWork/               Heading and two-column project grid
    SiteFooter/                 Black footer, brand, and contact links
    Modal/                      Accessible reusable native dialog
public/assets/
  favicon.svg
  hero/                         Looping GIF and static poster
  projects/                     Four original SVG placeholder images
scripts/generate-assets.py       Optional artwork regeneration
tests/portfolio.spec.js          Browser smoke checks
specs/                          Original specifications, preserved
Design Template/                Original design reference, preserved
```

## Replace prototype content

- Edit `src/data/site.js` for branding, hero copy, and the contact email. The email matches the design reference.
- Set `resumeUrl` to the final résumé URL, for example `${import.meta.env.BASE_URL}assets/resume.pdf`, and place the PDF in `public/assets/`.
- Set `linkedInUrl` to the actual LinkedIn profile URL. Until these links are supplied, the controls explain that they are coming soon.
- Put real project artwork in `public/assets/projects/`, then edit each record in `src/data/projects.js`. Replace its title, image, alt text, category, status, and description.
- Set a project's `caseStudyUrl` to open an actual case study. Without a URL, its card opens a placeholder preview. The initial project titles and imagery are intentionally placeholders, with no invented project results.
- Edit the About text in `src/App.jsx` when final biography copy is ready.

The GIF is generated from original gradient rings and orbit lines based on the reference. It includes a pause control and a static poster for visitors who prefer reduced motion. System sans-serif and monospace fonts approximate the reference without remote font requests. The project grid becomes one column on phones.

## Verification

```sh
npm test
```

Browser checks use locally installed Google Chrome. If Chrome is unavailable, install Playwright Chromium (`npx playwright install chromium`) and remove `channel: 'chrome'` from the Playwright configuration. Tests cover media loading, the four project tiles, navigation and dialogs, keyboard focus, animation controls, reduced motion, and responsive overflow.

The generated artwork is already included; Python is not needed to run or build the website. To regenerate it, install Pillow and NumPy in a Python environment, then run `python3 scripts/generate-assets.py`.
