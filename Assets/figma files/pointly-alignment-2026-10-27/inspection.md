# Point.ly opening screen bottom alignment

Inspected October 27, 2026 with the official Figma MCP `get_design_context` tool and its screenshot, before changing the website alignment.

Source: [Screen Images, node 462:25](https://www.figma.com/design/wZSRbIZZXfUlrq902OXE2W/?node-id=462-25), within Pointly Case Study 2 (`90:18`). All coordinates below are relative to the 1440px case-study frame.

- Blue background `274:4`: x120, y603, width1200, height655; bottom y1258; fill #88CFFD; corner radius16.
- Opening screen `320:52`, “Frame 3 (2) 1”: source layer x170, y766, width695, height1136.
- Opening screen mask: x145, y727, width772, height531; bottom y1258, exactly matching the blue background.
- The Figma screenshot has a straight white bottom edge, no blue strip below that screen, and no painted shadow below the blue background. Its side shadow is visible. The generated context specifies a 4px/4px/4px shadow at 25% black.

Implementation: anchor the existing masked screen at `bottom: 0` and clip painted overflow at the blue panel boundary. This removes the previous 16px bottom gap and the bottom shadow while preserving the source image, mask, dimensions, and side shadow.

Both top-screen raster files and both SVG masks were downloaded again to temporary storage and verified against their recorded SHA-256 hashes in `public/assets/website-v4-figma/manifest.json`. All four match the existing public assets exactly; no asset replacements or image edits are needed. The original SVG dimensions remain unchanged.

Verification: production build passed; all 76 affected Playwright checks passed across Chrome, WebKit (Safari’s engine), and Firefox desktop/phone projects, with no failures, skips, or flaky results. Both bottom edges coincide exactly at 1440px and 390px; responsive assertions also verify 320px, 768px, and 1024px widths. Screenshots at 1440px and 390px in each engine were inspected visually and sampled below the container: the region 2–16px beneath the panel is plain white, with no bottom shadow. Phone checks use emulated or phone-sized viewports rather than real mobile hardware.
