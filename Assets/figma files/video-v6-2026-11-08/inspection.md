# Video version 6 design and prototype inspection

Inspected November 8, 2026 with the official Figma MCP design-to-code and Plugin API skills. Source: [Video frame, 609:115](https://www.figma.com/design/wZSRbIZZXfUlrq902OXE2W/?node-id=609-115).

The 1440 × 2583 frame has a white background, fixed size, clipped contents, minimum constraints, layout mode NONE, no layout grid, no frame effects, no internal scroll, no overlay and no prototype flow starting point. Its export is a 1× PNG. The selected hierarchy contains 102 nodes: one frame, 30 text nodes, 28 groups, 23 rectangles, three ellipses, three polygons, 12 vectors, and two lines. Relevant design/prototype settings and text style ranges are retained in `design-inspection.json` and `text-inspection.json`; frame-relative independent bounds are in `geometry.json`.

## Layout and typography

- SELECTED VIDEO WORK: Inter Regular 15px/26px at x121/y217.
- Corporate Video: Inter Bold 36px/44px at x119/y329; description Inter Regular 16px/26px, x121/y393, width546. Its thumbnail is x732/y284, 588 × 331; caption x734/y629. Watch Video opens the corporate YouTube URL.
- Multimedia Journalism: Inter Bold 36px/44px at x119/y810; description Inter Regular 16px/26px, x121/y874, width529. Its thumbnail is x732/y866, 589 × 335; caption x734/y1216. The package button and play action open the Wix AAPI site.
- Broadcast Journalism: Inter Bold 36px/44px at x119/y1435; introduction Inter Regular 16px/26px at x121/y1492, width950.
- Featured/card titles: Inter Semi Bold 20px/28px, black. Publication labels: Inter Medium 15px/28px, #7C8B98. CTA labels: Fira Mono Regular 14px/16.8px in white, on #25261E with 4px corners.
- Broadcast cards: original 382 × 356 rounded masks, three columns/two rows. First row y1606, second row y1994, with the source's slight per-card horizontal offsets and raster crop offsets preserved. Caption backgrounds use #F7F7F7.
- Dividers `619:140` and `619:141`: x127, width1193, y732 and y1351, requested 0.5px black stroke. Native CSS borders avoid Safari/WebKit decoding failures with SVG heights below one pixel.

## Assets

Seventeen unique source exports were downloaded: eight PNG thumbnails, the broadcast-card mask, the play-button SVG, the divider SVG, and six brand-vector references. Ten unchanged runtime assets are copied into `public/assets/video-figma/`; its manifest records dimensions, byte counts, and SHA-256 hashes. Reproduce the import and normalized content using `node scripts/import-video-figma.mjs`. SVG root dimensions are unchanged. The existing shared logo/header/footer are retained as requested; the divider SVG and brand exports remain references rather than replacement runtime assets.

`content.json` derives all wording, active URLs, image placements and caption offsets from the independent inspection. Blank trailing caption lines are trimmed, while visible words and intended line breaks are preserved. Fixed Figma caption boxes contain extra empty space; normal flow retains the visible desktop layout and lets captions grow on smaller screens. Native section dividers use the source widths, offsets and stroke weights.

## Prototype behavior

Every active interaction is an ON_CLICK external URL action opening in a new tab. The Corporate button, poster and play icon share its YouTube destination. The multimedia button and visible play icon share the Wix package destination; the full preview is made clickable as required. Six broadcast cards retain their individual destinations. One unused empty action on the Food Co-Operatives group is ignored in favor of its active URL action. The older AAPI play icon is covered by the newer thumbnail in Figma and is not rendered as a duplicate visible control. Shared home-card hover/focus effects and reduced-motion behavior are reused.

## Live link verification

All eight destinations returned HTTP 200. Three direct public YouTube videos and all three videos embedded in the Scot Scoop pages returned public YouTube metadata with matching titles. The Wix multimedia page exposed a loaded MP4 video with readyState 4 in a normal browser.

The Corporate YouTube watch page reports LOGIN_REQUIRED / Private video, and its metadata endpoint returns 403. The user explicitly requested retaining the exact Figma URL and will change visibility to public/unlisted. Public playback of this one external video is pending the owner's change. No video controls or private-state warnings are added to the portfolio design. `link-validation.json` records the live checks separately from deterministic browser-popup tests.

## Implementation verification

Production build passed. The full Chrome, WebKit and Firefox desktop/phone regression run passed 275 checks, with one existing desktop-only Obayashi geometry check skipped on mobile and no failures or flaky results. All seven Video checks passed in every project. Coverage includes unchanged source asset hashes, independent Figma wording/styles/geometry, image crops and play controls, all prototype links, keyboard/hover/reduced-motion behavior, responsive containment, both native section dividers, direct/reloaded/index/subdirectory routes, and existing pages.

Screenshots were reviewed for all three engines at 1440px and 390px. Desktop content geometry matches the independent source within one pixel. Responsive assertions also cover widths 320, 768, 1024 and 1920px. Native Safari and real mobile hardware were not automated; WebKit provides Safari-engine coverage and phone layouts are emulated or phone-sized. `validation.json` retains the run totals, per-project results and the known external Corporate-video visibility exception.
