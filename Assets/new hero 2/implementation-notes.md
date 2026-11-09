# Version 9 integration notes

Implemented from the six original supplied files on November 9, 2026. Those original files remain unchanged; `public/assets/hero-v9/manifest.json` records their sizes and SHA-256 hashes and the generated runtime hash. This notes file documents the website integration and is not part of the original six-file package.

## Reviewed source

README.txt specifies four labelled close-ups, faster four-circle/diamond convergence, a merged ring, a gradient-line transition and the final headline, with no spirograph. The complete `animation.html` and `embed.html` variants contain the same markup, CSS and JavaScript as component.html, animation.css and animation.js. No external assets, libraries, fonts, tracking or network dependencies are required. The sequence plays once and rests on its final message; an initial reduced-motion preference shows that message immediately.

The supplied files include Replay. Update 9 explicitly prohibits playback controls, so the generated runtime removes the Replay button and its event binding. The source CSS is preserved, including unused control styling; no control element remains in the runtime DOM. The iframe now follows the remaining scene height: 560px desktop and 460px at widths up to 480px, without the former control row. It loads eagerly immediately below the existing header and retains the 32px gap before Featured.

Initial browser checks exposed two supplied-source responsiveness issues: an inline desktop font size remained after resizing, and the no-JavaScript phone fallback clipped its headline. The runtime adds a fallback font rule using the source draw() formula (width/14.3, capped at 62px), and redraws the current state on resize after cancelling its pending animation frame. This preserves progress/timing and avoids duplicate frame loops. The original artwork, copy, colors, circle geometry and animation formulas remain intact.

Run `node scripts/import-hero-v9.mjs` to regenerate the runtime and manifest. The importer checks that the six variants remain consistent and fails for review if its expected control or resize integration anchors change.

## Archive and design context

The previous runtime, HeroSection JSX/CSS and three hero test snapshots are preserved outside the public build in `Assets/archived pages/hero-v7-before-v9-2026-11-09/`. Its manifest verifies all six archived files and the three original source files already renamed by the user to `Assets/new hero section 1/`. The original `Assets/new hero section/` deletion and renamed source folder should be committed together.

Live Figma inspection of the relevant page found two named Hero 1 frames: an empty frame and an older About/portrait composition (354:108 and 354:129). No separate Hero 2 match was found in that inspected page. The explicit local files are the source of truth for this replacement; the existing Figma-based navigation, cards, footer and other pages remain unchanged and covered by regression tests.

## Verification approach

The runtime is compared against the unmodified supplied animation at fourteen deterministic points covering all close-ups, four-circle layout, convergence, ring fill/compression, gradient stretch and headline/subheading reveal. Separate tests use the real page clock to verify autoplay on load/reload and a settled final state with no controls. Other checks cover initial reduced motion, no-JavaScript fallback, resizing after completion, 320–1920px responsive widths, archive hashes/build exclusion, source consistency, direct/subdirectory routes and existing website functionality.

Production build passed. Final unique regression coverage validates 385 checks, with one existing desktop-only geometry check skipped on mobile. The full run passed 383 checks; two Firefox deterministic source comparisons lost their mocked clock during iframe navigation. Correcting the test clock on `Performance.prototype` and verifying it in both documents resolved the failures, with all 12 affected checks passing across six browser projects. The animation runtime required no changes for that correction. No unresolved failures or flaky checks remain.

Desktop and phone intermediate/final screenshots were reviewed in Chrome, WebKit (Safari's engine) and Firefox. Native Safari and real mobile hardware were not automated. `validation.json` records results, hashes, source comparison points, local screenshot/report paths and verification limits. `specs/changes/update-9-plan.md` and README.md include final results and scoped deployment instructions. The user performs the GitHub push and production deployment; the integrated production build is tested locally, with a live-site playback check to perform after Cloudflare deploys.
