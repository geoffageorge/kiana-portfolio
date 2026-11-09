# Add Video Page update version 6

Source: `specs/changes/update 6.md`. Plan checked against the saved requirements, existing implementation, and live Figma design on November 8, 2026 before implementation.

Figma MCP access and the design-to-code and Plugin API skills are available with a Pro plan and Full seat. Source frame `609:115`, Video, in file `wZSRbIZZXfUlrq902OXE2W` is 1440 × 2583. It contains Corporate Video, Multimedia Journalism, and Broadcast Journalism, two featured previews, six broadcast cards, two section dividers, and eight distinct external destinations.

| Requirement | Implementation | Validation |
| --- | --- | --- |
| Inspect all relevant design/prototype settings | Archive 102 nodes, independent geometry, text ranges/styles, fills, masks, constraints, export settings and URL actions | Source files under `Assets/figma files/video-v6-2026-11-08/` |
| Corporate Video | Original Obayashi thumbnail, copy, caption, play icon and Watch Video button | Figma positions/fonts/crops; matching YouTube destination |
| Multimedia Journalism | Original AAPI thumbnail, three-paragraph description, caption, play icon and package button | Figma positions and exact Wix destination; live page contains a loaded MP4 video |
| Broadcast Journalism | Six original preview images and captions in a three-column desktop/two-row grid; responsive two/one-column reflow | Original asset hashes, crop geometry, captions and containment |
| Tile interaction | Reuse existing project-card 3D pointer/keyboard effect and reduced-motion rules | Shared effect comparison, focus, hover and reduced-motion checks |
| Video links | Keep each active Figma URL; open in a new tab without an opener | Compare inspected actions with buttons/tiles, popup checks, separate live video checks |
| Shared template | Retain the version 5 four-option navigation, existing logo/name and footer | Active Video navigation, About/Journalism/UX routing and footer regressions |
| Section lines | Native CSS half-pixel borders retain Figma width and offsets | Visible stroke in Chrome, WebKit and Firefox, including phone device pixel ratios |
| Deployment | Keep `/video/`, direct `index.html`, and subdirectory support; update metadata | Production build, direct/reload/subdirectory tests |
| Full regression | Add Video coverage to all six projects and retain existing checks | Complete Chrome/WebKit/Firefox desktop/phone suite and screenshots |

The source has one empty legacy click action on the Food Co-Operatives group; the active URL action is used. Featured play icons and posters share one accessible link rather than nested controls. An older play icon fully covered by the current AAPI thumbnail is not added as a second visible control. Trailing blank lines in caption boxes are omitted while visible wording and line breaks are retained.

The plan check identified the same subpixel SVG divider issue previously corrected for the case studies; native borders preserve the source appearance in Safari/WebKit. The website uses the shared version 5 header/footer as explicitly requested, omitting Social Media despite its presence in the Figma header.

The Corporate YouTube video is private. The user explicitly requested keeping its exact Figma URL and will update its visibility to public/unlisted. Website behavior can be validated independently, while public playback of that external video remains the owner's deployment prerequisite. All other destinations were checked for their video content.

The work stays in the existing GitHub checkout; commit, push and Cloudflare deployment are left to the user using README.md instructions.

## Completion and validation

Implemented and validated November 8, 2026. The production build passed. The complete six-project Playwright regression run passed 275 checks, with no failures or flaky results. One existing desktop-only Obayashi image geometry check was skipped on mobile. All seven new Video checks passed in each of the six browser projects.

| Project | Passed | Skipped |
| --- | ---: | ---: |
| Desktop Chrome | 60 | 0 |
| Mobile Chrome | 59 | 1 |
| Desktop WebKit | 39 | 0 |
| Mobile WebKit | 39 | 0 |
| Desktop Firefox | 39 | 0 |
| Mobile Firefox | 39 | 0 |

The production page's desktop content positions and image crops match the independent Figma inspection within one pixel. Screenshots were reviewed for all three engines at 1440px and 390px; responsive checks also cover 320px, 768px, 1024px, and 1920px. No horizontal overflow, broken media, clipped captions, missing dividers or runtime errors were found. These are engine-based/emulated or phone-sized checks; native Safari and real mobile hardware were not automated.

All active tile and button actions were validated against the source URLs, including new-tab behavior and opener protection. Separate live checks verified video content at seven of eight unique destinations. The retained Corporate link's private visibility is the sole pending owner action, as explicitly accepted by the user. Detailed results are in the archived `validation.json` and `link-validation.json`. GitHub/Cloudflare instructions are in README.md; no commit or deployment was performed.
