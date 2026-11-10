# Change Hero section update version 11

Reviewed November 10, 2026 against `specs/changes/update 11.md`, the six supplied `Assets/Hero 3/` files, the current hero integration and existing browser tests.

## Source review and decisions

Hero 3 is a self-contained HTML/CSS/JavaScript animation, with no separate raster image or external dependencies. It opens on a complete centered ring, expands/fades through Gather, Connect, Synthesize and Shape, assembles four rings, then converges into a gradient line and the final headline. Preserve the source artwork, timing, colors and text.

The source's Replay button conflicts with the explicit no-visible-controls requirement. Remove the button and its event listener only in the runtime copy. Retain the existing responsive fallback/font-resize fixes, eager iframe loading, accessible page headline, 560px desktop/460px phone height and direct placement below navigation. Reduced-motion visitors see the final message immediately.

The live Figma page `0:1` in file `wZSRbIZZXfUlrq902OXE2W` still contains an empty Hero 1 (`354:108`) and an unrelated headline/image Hero 1 (`354:129`), with no matching Hero 3 frame found. The supplied local package is the source for this replacement. The existing Selected Works Tiles frame (`28:2`) and its Featured/Case Studies layout remain covered by the site's Figma-based regression tests. This does not claim an exact match to an unspecified new Figma hero.

## Implementation plan

1. Archive the outgoing runtime, manifest, importer, component/styles and hero test snapshots in `Assets/archived pages/Hero section version 2 old/`. Record original paths and SHA-256 hashes; remove the outgoing runtime from public build assets.
2. Add `scripts/import-hero-v11.mjs` to verify consistency across all six Hero 3 originals, generate the control-free runtime in `public/assets/hero-v11/`, apply the responsive repairs and record source/runtime hashes.
3. Point the home hero to the new runtime. Preserve the shared navigation, Featured section, routes, footer and other pages.
4. Update animation tests for the complete centered opening, four labeled phases, transitions, source equivalence, actual autoplay on load/reload, resting final message, reduced motion, no-JavaScript fallback, responsive layouts/resizing, no controls and archive integrity/build exclusion.
5. Build and run production regression tests in Chrome, WebKit (Safari engine) and Firefox at desktop and phone sizes. Review opening/intermediate/final screenshots against the supplied source; verify subdirectory deployment and existing site functionality. Report native Safari and real-device limitations.
6. Record results and provide scoped GitHub commit/push commands. Do not commit, push or deploy on the user's behalf.

## Completed implementation and validation

All six plan steps are complete. The requested archive contains nine byte-for-byte snapshots with verified hashes. The six Hero 3 originals are unchanged; its generated runtime is reproducible and exactly matches the production output. The previous hero runtime is absent from the build. No dependencies or hosting settings changed.

Validated November 10, 2026: production build, JavaScript syntax and `git diff --check` pass. Final unique regression coverage is **403 passing checks and one existing skip** across Chrome desktop/phone, WebKit desktop/phone and Firefox desktop/phone viewport projects. The skipped Obayashi image-geometry check applies only to the desktop Figma reference.

The initial full run passed 401 checks and exposed two archive-assertion failures. On this case-insensitive Mac, `dist/Assets` aliases the normal `dist/assets` output directory. The assertion now checks the specific archive/source folders instead. All six affected project checks passed on recheck. There are no unresolved failures or flaky tests; no runtime changes were needed for this correction.

Twenty-four deterministic animation states match the unmodified Hero 3 source, including label fades/expansion, assembly, convergence and final reveal. Independent real-clock checks verify complete autoplay on both load and reload. Other checks cover the fully visible centered opening, no controls, reduced motion, standalone no-JavaScript fallback, 320–1920px layouts, resizing, source/archive integrity, subdirectory deployment and existing pages/navigation/links.

Opening, assembly and final desktop/phone screenshots were reviewed in all three engines. Sixteen of eighteen source/runtime screenshot pairs are pixel-identical; the two Chrome differences affect at most 0.163% of pixels, with matching computed states/geometry and no observed visual integration problem. The source/runtime copies retain the original browser font rendering. Native Safari and physical mobile hardware were not automated. A new Hero 3 Figma frame was neither specified nor found on the inspected page, so the supplied local animation remains the hero reference.

`Assets/Hero 3/validation.json` contains results, browser versions, hashes, corrected test details, screenshot comparisons and verification limits. README.md contains the checked scoped GitHub staging/commit/push commands and live Cloudflare verification steps. Unrelated pre-existing deletions, placeholder images and RTF files remain outside this update. No commit, push or deployment has been performed.
