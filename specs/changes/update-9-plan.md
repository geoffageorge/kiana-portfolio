# New Hero animation section update version 9

Reviewed November 9, 2026 against `specs/changes/update 9.md`, all six supplied files and the existing home integration before implementation.

## Source review

The authoritative animation source is `Assets/new hero 2/`. Its README describes four close-ups, a faster four-circle/diamond transition, a merged ring, a gradient line and the final headline, with no spirograph. It plays once on visibility, rests on the final message, respects an initial reduced-motion preference, and retains readable fallback text without JavaScript. There are no external libraries, fonts, tracking or network dependencies.

The six files were reviewed: README.txt, animation.html, embed.html, component.html, animation.css and animation.js. The complete HTML/embed variants contain the same standalone CSS/JavaScript. The source includes a Replay button and its event listener. The explicit version 9 no-controls instruction takes precedence: remove that button and its listener in the runtime copy, while retaining the source files, artwork, timing, live text, colors and fallback behavior unchanged. The iframe should match the remaining 560px desktop/460px phone scene after removing the control row.

The previously tracked `Assets/new hero section/` has already been renamed by the user to `Assets/new hero section 1/`. All three files match the committed originals byte-for-byte. Preserve that rename, keep the prior source available and include it in the scoped Git instructions. Unrelated deletions, placeholders and personal documents stay outside this update.

The live Figma inventory of the relevant page has two Hero 1 frames: one empty and one older About/portrait layout (354:108 and 354:129). No separate Hero 2 match was found in that inspected page. The high-fidelity context confirmed the populated frame is unrelated to this replacement. The explicitly supplied local animation is therefore the source of truth for version 9; existing Figma-based page/card layouts remain covered by regression checks.

## Checked plan

1. Archive the current runtime HTML, HeroSection JSX/CSS and hero test snapshots outside the public build, recording hashes and the existing source-folder rename.
2. Add a reproducible import script that reviews/records all six source files and copies the complete new animation into `public/assets/hero-v9/`, removing the Replay markup and event binding and applying the minimal responsive repairs documented below. Do not introduce play, pause or replay controls.
3. Update the home iframe URL/title and size it to the supplied scene (560px desktop, 460px at widths up to 480px). Keep its eager loading, accessible headline, direct placement below the shared header, existing spacing to Featured, all routes, cards, navigation and footer.
4. Replace obsolete spirograph/replay assertions with checks for source-preserving adaptation, four circle/label close-ups, convergence/gradient/final states, actual autoplay on initial load and reload, no controls, reduced motion, readable no-JavaScript fallback and responsive containment. Compare intermediate animation states to the unmodified supplied source.
5. Build production and verify playback in the integrated production preview. Run full Chrome/WebKit/Firefox desktop and phone regressions, review screenshots of intermediate/final states and confirm direct/subdirectory home URLs. Record the browser-engine/real-device limits.
6. Update README.md and this plan with validation and scoped GitHub/Cloudflare instructions. The user will perform the commit, push and production deployment; provide a live-site playback check after deployment.

## Plan check

Each requirement maps to the steps above. The supplied self-contained document fits the established iframe approach and isolates its styles from the portfolio. Removing Replay requires removing its binding too, preventing a null-element initialization error. Source hashes and state comparisons preserve the approved sequence while the no-controls override is explicit. No new dependencies or hosting configuration changes are needed.

The initial integrated Chrome check confirmed two supplied-source responsiveness issues: the final headline retains its desktop inline size after resizing, and the no-JavaScript phone fallback uses 34px text that overflows its line box. The runtime adaptation applies the source draw() sizing formula to the fallback and redraws the current state on resize, cancelling the pending frame first. This preserves the sequence's timing and artwork while keeping the message contained; the original six source files remain unchanged.

## Completed implementation and validation

All six implementation steps are complete. The prior hero/runtime/test snapshots and renamed original source are preserved with hashes. The new iframe autoplays once and rests on its final message without any playback controls. The source importer is reproducible, all six original source hashes match, the rebuilt runtime matches its manifest, and the old runtime/archive is absent from the production build.

Production build and `git diff --check` pass. Final unique regression coverage is **385 passing checks and one existing skip** across Chrome desktop/mobile, WebKit desktop/mobile and Firefox desktop/phone viewports. The original full run passed 383 checks; two deterministic Firefox source comparisons failed because navigation replaced the performance instance carrying the test clock. Overriding `Performance.prototype.now` and asserting the clock in both documents corrected the harness without changing the runtime. All 12 affected checks passed across the six browser projects. No unresolved failures or flaky checks remain.

Fourteen animation states match the unmodified source. Independent real-clock tests verify autoplay on load/reload and the final resting message. Other checks cover no controls, initial reduced motion, no-JavaScript fallback, 320–1920px layouts, desktop-to-phone resizing, source/archive hashes, subdirectory deployment and existing routes, cards, case studies, dividers, Careers laptop, About and navigation. Intermediate/final desktop and phone screenshots were reviewed in all three engines. WebKit is Safari's engine; native Safari and real mobile hardware were not automated.

`Assets/new hero 2/validation.json` records detailed results, source/runtime hashes, the resolved harness failures and local QA artifact paths. README.md contains the scoped commit/push commands and post-deployment playback checks. No commit, GitHub push or production deployment has been performed. After Cloudflare deploys the user's push, verify live home autoplay, reload, final message, no controls, responsive/reduced-motion behavior and existing navigation.
