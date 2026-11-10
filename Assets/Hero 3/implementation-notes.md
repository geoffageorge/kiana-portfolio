# Change Hero section update version 11

The original six supplied files are unchanged. `public/assets/hero-v11/manifest.json` records their hashes and the generated runtime hash. Run `node scripts/import-hero-v11.mjs` to regenerate the runtime. The importer checks that the standalone, embed and separate-file variants agree before adapting them.

Hero 3 uses CSS rings and live text rather than a separate bitmap image. Its complete centered opening ring expands and fades through GATHER, CONNECT, SYNTHESIZE and SHAPE, assembles four rings, converges, compresses into a gradient line, and reveals the final headline. The supplied timing, geometry, colors and text are preserved.

The runtime removes the supplied Replay button and its event binding to meet the explicit no-controls requirement. It retains the earlier integration's fluid no-JavaScript headline size (the source's width/14.3 formula, capped at 62px) and redraws the current state after resizing, cancelling the pending frame first. These repairs avoid narrow-screen fallback clipping and stale desktop font sizing without restarting the animation. Original source files, including their Replay preview, remain intact.

The eager iframe begins directly below the shared home navigation, with the supplied scene height of 560px on desktop and 460px up to 480px wide. The 32px gap before Featured and existing navigation/cards/footer remain. Playback begins when the hero is visible on loading the page, plays once, and rests on its message; reloading starts it again. An initial reduced-motion preference shows the final message immediately. There are no play, pause or replay controls in the website's hero.

The exact outgoing version 9 integration is archived in `Assets/archived pages/Hero section version 2 old/`, with nine file snapshots and an integrity manifest. Its runtime and importer are removed from their active locations. The original Hero 2 source and earlier version 7 archive remain available outside the production build.

`figma-review.json` records the live Figma inspection. No matching Hero 3 appears on the inspected existing page; this explicitly supplied package is the replacement's reference. The site's Figma-based page, navigation, card and footer regression tests continue to apply.

Validation covers 24 source animation states, independent real-clock load/reload playback, the complete centered opening, final resting message, no controls, reduced motion, standalone no-JavaScript fallback, 320–1920px layouts, resizing after completion, archive hashes/build exclusion, subdirectory asset resolution and existing site functionality. Final coverage validates 403 checks with one existing mobile skip after correcting a case-insensitive archive-path assertion; all six affected rechecks pass. Browser results, screenshot comparisons and verification limits are recorded in `validation.json`. The no-JavaScript fallback describes the standalone hero document; the surrounding React application still requires JavaScript.

See `specs/changes/update-11-plan.md` and the current version 11 section of README.md for the implementation plan, final validation and scoped GitHub instructions.
