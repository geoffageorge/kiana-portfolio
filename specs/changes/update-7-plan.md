# Change Hero section update version 7

Source: `specs/changes/update 7.md`, reviewed November 8, 2026. This plan was checked against the saved requirements, the existing code, the supplied animation, and the live Figma UX frame before implementation. The isolated reference to the Video frame in the specification is carried over from version 6; the requested source for this update is UX.

## Access and source

Official Figma MCP access is confirmed with a Pro plan and Full seat. The Figma design-to-code and Plugin API skills are available and in use. Frame `619:58`, UX, in file `wZSRbIZZXfUlrq902OXE2W` is 1440 × 1257 and contains an introductory header and exactly two case-study tiles. All 49 nodes' relevant design/prototype settings and independent geometry are archived under `Assets/figma files/ux-v7-2026-11-08/`. No Figma design changes are required.

The UX introduction uses Inter: label 15px/26px at x120/y205; title 36px bold/44px at x121/y255; description 16px/26px at x123/y312. The two 577px square tiles sit at x120 and x743, y429, with a 46px gap and 16px corners. Card wording, crop geometry, colors, laptop/screen layers and fonts match the existing home card components. The frame has no active prototype actions; both case-study routes are explicitly specified by update 7. Retain the shared four-option navigation despite the stale Social Media label in Figma and reuse the existing header/footer and logo.

`Assets/new hero section/animation.html` is the supplied self-contained hero. Its own instructions recommend an iframe at 630px desktop/540px phone height. It plays once on visibility, starts automatically at the top of the page, reveals the supplied headline and subheading, provides Replay, and renders the final state for an initial reduced-motion preference. Use the original file unchanged rather than reproducing its artwork or timing.

## Checked implementation plan

1. Serve the supplied animation from `public/assets/hero-v7/animation.html` and embed it eagerly in the home hero directly below the navigation. Remove the old rendered Clarifying Chaos copy and SVG artwork; preserve a semantic accessible page heading using the supplied final headline. Keep the animation's original Replay and reduced-motion behavior.
2. Rename the home section heading to Featured, retaining CASE STUDIES, the divider, the existing two cards and their links.
3. Add `/ux/` using the exact Figma introduction and desktop geometry. Compose the existing two project cards; verify original downloaded assets against the reused local files and preserve each image/mask/crop layer. Reflow to one column on phones without clipping.
4. Point the shared UX menu option to `/ux/`, indicate it as current only there, and keep the brand link returning home. Preserve VIDEO, JOURNALISM, ABOUT+CONTACT and the footer. Add static entry generation, metadata and base-path recognition for direct, reloaded, index and subdirectory URLs.
5. Replace obsolete hero assertions with source-based animation, autoplay/replay/reduced-motion and responsive tests. Update existing navigation expectations for the new UX destination and Featured heading. Add independent Figma copy/geometry/asset checks for UX and verify both tiles by click and keyboard.
6. Build production, run the complete Chrome/WebKit/Firefox desktop and phone regression suite, and visually inspect both changed pages. Keep native Safari/real-device limits explicit. Record results and provide scoped GitHub commit/push instructions for the existing Cloudflare connection. Do not commit, push or publish automatically.

## Plan check

All saved requirements map to the steps above. No dependencies or hosting configuration changes are needed. The supplied HTML animation stays isolated from global CSS so its exact styling and timing are retained. Home and UX share the existing case-study card implementation and motion rules. Unrelated deletions, personal documents and placeholder assets remain outside this update.

## Completion and validation

Implemented and validated November 8, 2026. Production build passed. Final regression coverage contains 349 passing checks and one existing desktop-only Obayashi geometry check skipped on mobile. The initial full run passed 348 checks; its sole failure was an exact-string font-size assertion because WebKit reports 50px container-scaled text as 49.999992px. The test now compares numerically within three decimal places. The affected Figma typography/geometry check passed in all six projects after that test-only correction; no runtime code change was required. No failures or flaky results remain unresolved.

| Project | Final passing coverage | Existing skips |
| --- | ---: | ---: |
| Desktop Chrome | 67 | 0 |
| Mobile Chrome | 66 | 1 |
| Desktop WebKit | 54 | 0 |
| Mobile WebKit | 54 | 0 |
| Desktop Firefox | 54 | 0 |
| Mobile Firefox | 54 | 0 |

The supplied hero is served unchanged, plays automatically on a real page clock, reaches its final headline, responds to keyboard Replay, restarts on reload, and honors an initial reduced-motion preference. All four focus stages were checked. It sits directly below the header without iframe scrollbars at 320, 390, 768, 1024, 1440 and 1920px. Home retains Featured, CASE STUDIES, both original tiles and its native divider.

UX wording, typography, image/mask layers and geometry match the independent Figma inspection. At 1440px, the introduction and tile bounds match the exact source positions, with crop rounding below 0.6px. All six reused artwork files are byte-for-byte identical to current source exports. Both project routes, click/keyboard activation, shared 3D/reduced-motion behavior, active navigation, home branding link, direct/reloaded/index/subdirectory routes, and existing pages pass validation.

Screenshots of home and UX were reviewed in all three engines at 1440px and 390px. No broken media, missing dividers, clipped copy or horizontal overflow was found. The inline preview host was unavailable; the local production browser tests and screenshot review succeeded. Native Safari and real mobile hardware were not automated; WebKit covers Safari's engine, and phone layouts are emulated or phone-sized. `validation.json` records the original run, resolved precision assertion and passing rechecks.

README.md contains scoped GitHub/Cloudflare instructions. No commit, push or production deployment was performed.
