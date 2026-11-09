# VIDEO section changes update version 8

Reviewed November 9, 2026 against `specs/changes/update 8.md`, the existing implementation and the live Figma source before coding.

## Source and access

Official Figma MCP access is confirmed with a Pro plan and Full seat. The design-to-code and Plugin API skills are available and in use. Frame `657:7`, Video 2, in file `wZSRbIZZXfUlrq902OXE2W` is 1440 × 2583. All 117 nodes' relevant design/prototype settings, independent geometry and text ranges/styles are archived in `Assets/figma files/video-v8-2026-11-09/`.

Video 2 retains Corporate Video, Multimedia Journalism and Broadcast Journalism, two featured previews, six broadcast cards and two half-pixel dividers. It replaces all eight thumbnails with clean screenshots, adds eight 28.184px play overlays, uses 32px Inter Bold section headings with 44px line height, and retains the main layout, visible wording and eight distinct preview destinations. One old 46px play icon is completely covered by the newer AAPI image; it remains an inspection reference, not a duplicate visible control. The shared four-option navigation/footer stay in use despite the stale Social Media label in the source header.

The source's eight small play-icon actions were copied with the AAPI destination on every icon, including unrelated videos. The user confirmed that each play icon should open its enclosing preview's matching destination. The user also confirmed image-only motion on the top two previews, with titles stationary. Corporate visibility follows the previously accepted instruction to retain its Figma URL; current live checks now verify public video metadata successfully.

## Checked plan

1. Archive the previous Video JSX, CSS, data, runtime assets, importer and tests outside the live route. Preserve its source Figma inspection. Keep `/video/` as the destination of the existing VIDEO menu option.
2. Import all original Video 2 assets unchanged and derive content, crop geometry, masks, play positions and active preview URLs from the new inspection. Reuse the existing React layout patterns while replacing old source IDs/data. Preserve the original separate Colette mask and Wasabi caption SVG, and native borders for Safari-compatible dividers. Make the page responsive without clipped text or media.
3. Set Selected Features on Journalism and Selected Case Studies on UX to 32px, preserving their existing 44px desktop line boxes and 40px phone line boxes. They currently use 36px desktop, despite the specification's reference to 38px; the requested result is 32px. Set all three new Video section headings to 32px as in Figma.
4. Replace the shared exaggerated perspective/tilt with the requested Apple hover treatment. The official Apple shop stylesheet uses scale3d(1.01,1.01,1.01), a 300ms cubic-bezier(0,0,.5,1) transition and a subtle shadow. Apply the same shared effect to linked case-study tiles, Journalism tiles and Video previews/cards, with keyboard focus/press feedback and reduced-motion support. Keep image layers from zooming independently. For the top two previews, the recommended interpretation is to animate only the image, leaving the title stationary; clarification was requested.
5. Validate source asset identity, exact copy/style/crop geometry, 32px headings, every preview/button/play destination, new-tab behavior, active shared navigation, keyboard interactions, subtle hover/focus/press and reduced motion, visible native dividers, responsive containment, direct/reloaded/index/subdirectory routes, and the archived version. Perform live checks of all eight destinations separately from deterministic popup tests.
6. Build production, run the full Chrome, WebKit and Firefox desktop/phone regression suite, and visually inspect the updated Video, Journalism and UX pages. Record browser-engine/real-device limitations. Supply scoped GitHub/Cloudflare instructions; do not commit, push or publish automatically.

## Plan check

Every saved requirement maps to these steps. The existing route/static-entry workflow and shared components support the change without new dependencies or hosting configuration. Archives remain outside the public build, source URLs are local after import, and native rules retain the previous Safari fix. Both clarifications were answered as recommended: image-only motion and matching play destinations. Unrelated user files and deletions remain outside this update.

Apple source: https://www.apple.com/shop/buy-mac and its linked official `rs-merch-4.20.3-cc4ae/dist/step0.css` stylesheet. Only the relevant motion rules and provenance are recorded; no Apple imagery or page content is imported.

## Completion and validation

Implemented and validated November 9, 2026. Both clarification answers were applied: only the top two image boxes animate, and every play icon opens its matching preview destination. The previous page is archived outside the build, and its 17 original files pass hash verification. All twelve new runtime assets preserve original export bytes. The additional typography/export/style-reference audit found no missing fonts or prototype flow starting point.

Production build passed. Final regression coverage verifies 367 passing checks and one existing desktop-only Obayashi geometry check skipped on mobile:

| Project | Final passing coverage | Existing skips |
| --- | ---: | ---: |
| Desktop Chrome | 70 | 0 |
| Mobile Chrome | 69 | 1 |
| Desktop WebKit | 57 | 0 |
| Mobile WebKit | 57 | 0 |
| Desktop Firefox | 57 | 0 |
| Mobile Firefox | 57 | 0 |

The full run passed 364 checks. Two mobile title assertions initially mistook focus-induced viewport scrolling for animation; they now compare document coordinates. One mobile press assertion was targeting during native smooth scrolling; the check now explicitly centers and hit-tests the visible link below the sticky header. A final per-asset audit found a global image-width cap narrowed the Wasabi caption SVG; its layer now permits the original width, and independent source geometry coverage includes that SVG. After rebuilding, all 18 source geometry and interaction rechecks passed in all six projects. No failures or flaky results remain unresolved. `validation.json` records the initial run, resolutions and final coverage.

The updated Video page matches independent Figma desktop geometry within one pixel, including all image/play positions and the original caption SVG. Responsive checks cover 320, 390, 768, 1024, 1440 and 1920px without overflow, broken media, clipped captions or missing dividers. The two featured titles remain stationary during image motion. Source-based tests and screenshots verify the 32px headings, shared 1% hover/focus/press treatment, reduced motion, routes, links and unchanged home/About/case-study functionality.

All eight external destinations returned HTTP 200 and exposed video content. Corporate now has public metadata. Separate browser checks confirm the AAPI video element uses media hosted by video.wixstatic.com. Preview/button/play navigation tests validate new-tab behavior and opener protection independently of external availability.

Screenshots of Video, Journalism and UX were reviewed at 1440px and 390px in Chrome, WebKit and Firefox. Video screenshots and caption geometry were reverified after the final SVG sizing repair. Native Safari and real mobile hardware were not automated; WebKit covers Safari's engine and phone layouts are emulated or phone-sized.

The scoped Git staging command was dry-run successfully, including archive moves and excluding unrelated user changes. README.md provides the commit/push and Cloudflare checks. No commit, push or deployment was performed.
