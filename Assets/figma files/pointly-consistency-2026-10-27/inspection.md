# Point.ly rounded screen shadows and third Goals circle placement

Inspected October 27, 2026 using the official Figma MCP `get_design_context` tool, with screenshots, before changing the website.

File: `wZSRbIZZXfUlrq902OXE2W`; case study: `90:18`, Pointly Case Study 2.

## Three screen images

Source: [Group 81, 320:56](https://www.figma.com/design/wZSRbIZZXfUlrq902OXE2W/?node-id=320-56).

| Image | Node | Desktop size |
| --- | --- | --- |
| Personalized stay | 308:17 | 340 × 236 |
| Transfer options | 307:12 | 342 × 237 |
| Redemption tips | 308:20 | 342 × 237 |

The original PNGs have transparent, rounded corners. Figma's screenshot shows shadows following those edges. The website previously cast a rectangular CSS box shadow from each image button. It now casts a drop shadow from each image's alpha shape, with 4px x/y offset and blur and 15% black. The button's existing brightness hover effect remains on its parent. Source images, aspect ratios, captions, and responsive positions are unchanged.

## Third Goals circle

Source: [third Goals circle, 128:21](https://www.figma.com/design/wZSRbIZZXfUlrq902OXE2W/?node-id=128-21), heading `130:31`, and description `130:30`. The previous Goals Section group (`413:71`) no longer exists; the current nodes were located through frame `90:18` metadata, then inspected individually with high-fidelity design context. The full frame screenshot was cropped for visual verification of the text inside the circle. The screenshot is a QA reference only.

The third circle is 195 × 195 at desktop reference x1047, y2244. Its heading uses centered Fira Mono Medium, 18px, with 21.6px line height, in #40B3FC. Body text uses centered Inter Regular, 15px/22px, in black. `third-goal-inspection.json` retains the independent node geometry and typography.

- Heading `130:31`: x1091, y2291, width108, height44. Its two 21.6px lines are vertically centered in that 44px box, placing the first line box 47.4px below the circle top and the heading center 69px below it.
- Description `130:30`: x1060, y2347, width170, height44. Its first line starts 103px below the circle top; the two source lines remain “Certainty of” and “best value.”

The current implementation changes only the third circle's heading and description top offsets to match those source positions. The first two circles keep their previously committed positions. No shared heading or description alignment is imposed between circles. The placement remains relative to the third circle when circles scale or stack at narrower widths.

All three PNGs and the circle/connector SVG exports were downloaded again to temporary storage and matched against the recorded SHA-256 hashes in `public/assets/website-v4-figma/manifest.json`. All five match the existing local files; no public assets were replaced or edited.

The subsequent individual third-circle SVG export differs from the previously shared circle SVG only in its internal path ID (“Ellipse 14” versus “Ellipse 12”). After accounting for that label, the files are identical. The existing circle asset is retained; its geometry and styling match the current Figma circle exactly.

## Verification

The final combined revision passes the production build. The responsive regression check compares the third heading's center and description's top with the independent Figma geometry and verifies that the first two circles retain their previous positions. Desktop/phone screenshots are compared with the current Figma frame crop and checked for rounded screen-shadow contours. Phone checks use emulated or phone-sized viewports, rather than real mobile hardware.

All 76 affected Playwright checks pass with no failures, skips, or flaky results across Chrome, WebKit (Safari’s engine), and Firefox desktop/phone projects. At 1440px and 390px, the third heading center is 68.984px in Chrome/WebKit and 69px in Firefox (Figma: 69px); the description starts at 103px in every engine (Figma: 103px). Responsive assertions also verify 320px, 768px, and 1024px, including the scaled circle layout, while retaining the first two circles' original text offsets. The rounded-shadow implementation remains part of the same bundle.
