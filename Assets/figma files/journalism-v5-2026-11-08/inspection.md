# Journalism version 5 inspection

Inspected November 8, 2026 using the official Figma MCP design-to-code and Plugin API skills. Source: [Journalism, 607:7](https://www.figma.com/design/wZSRbIZZXfUlrq902OXE2W/?node-id=607-7).

The frame is 1440 × 1807 with a white background, clipped contents, no frame effects or strokes, and a 12-column grid with 120px margins and 24px gutters. Layout mode is NONE, with fixed sizing and minimum constraints. Export settings request a 1× PNG. The frame has no internal scroll direction, overlays, transition animation, or prototype flow starting point. Its four tile interactions are ON_CLICK URL actions, each opening in a new tab. Complete relevant node properties, image fills, masks, constraints, export settings, text ranges, and prototype actions are saved in `design-inspection.json` and `text-inspection.json`; `geometry.json` records absolute bounds relative to the frame.

## Content and typography

- JOURNALISM label: Inter Regular, 15px/26px, x199/y205.
- Selected Features: Inter Bold, 36px/44px, x197/y255.
- Introduction: Inter Regular, 16px/26px, x199/y312, width994, height52.
- Tile titles: Inter Semi Bold, 20px/28px, black.
- Publication labels: Inter Medium, 15px/28px, #7C8B98.
- Navigation/name: Fira Mono Regular, 15px/18px, black, baseline placement from y70.
- Tile caption backgrounds: #F7F7F7; corners follow the original 16px-radius SVG masks.

The four tiles are 498px wide. The upper row is 581px high at x193 and x748, y430. The lower row is 564px high at x197 and x748, y1059. Horizontal spacing is 57px and row spacing is 48px. The original raster layer offsets, fill behavior and nested masks are retained. The lower food-allergy image has a fractional crop, while the Thailand image begins 1px below its card top.

## Assets and prototype

Four PNGs, four SVG masks, and six individual brand-vector reference exports were downloaded from the high-fidelity design context into `source-assets/`. The eight content assets are copied unchanged into `public/assets/journalism-figma/`; its manifest records source dimensions, byte counts and SHA-256 hashes. Reproduce the import with `node scripts/import-journalism-figma.mjs`. SVG root dimensions are unchanged. `design-reference.txt` replaces temporary download URLs with local file references.

| Tile | Prototype node | Publication | Exact destination type |
| --- | --- | --- | --- |
| A recipe for controversy: food, culture, and identity | 609:65 | The Highlander | PDF |
| Sumo wrestling in America — Destined to become huge? | 609:64 | Scots Scoop | Article |
| Just one bite could kill | 609:58 | Scots Scoop | Article |
| Everything I learned from a monk in Thailand | 609:62 | The Stanford Daily | Article |

All four exact URLs returned HTTP 200 when checked independently. The user approved retaining the PDF/article destinations. Browser tests compare click behavior with the independently inspected URL actions, including new-tab and no-opener behavior; they intercept publisher responses to keep the regression suite independent of third-party availability. `link-validation.json` records the separate live HTTP checks.

The user requested keeping the existing logo/name and footer, so the current version 4 logo is reused and the existing footer is appended below the Figma frame's content. Duplicate overlapping brand layers in Figma are represented by the single existing brand component. SOCIAL MEDIA is omitted, the remaining navigation reflows to the right, and the header descriptor is removed. The requested 3D tile effect is reused from the home cards; reduced motion disables it. Content flows into a single column on phones and caption panels grow when text wraps.

`hero-before.json` preserves home-page measurements taken before removing the descriptor. The hero's stable header-relative anchors replace its dependency on the removed text.

## Verification

The production build passes. The complete six-project suite passed 233 checks, with one existing desktop-only Obayashi image geometry check skipped on mobile. There are no failures or flaky results. The seven new Journalism checks run in all six projects, covering shared navigation, source asset bytes and masks, Figma text/geometry, exact prototype actions, keyboard/new-tab behavior, shared 3D/reduced-motion effects, responsive containment, direct routes and subdirectory deployment. Existing About, home animation, both case-study and divider/laptop regressions also pass.

Journalism content, image slots and text bounds match the independent desktop Figma geometry within one pixel. Desktop/phone screenshots of Journalism and the Video placeholder were captured in Chrome, WebKit and Firefox and inspected visually. Browser scope and per-project results are saved in `validation.json`. WebKit checks Safari's engine; native Safari and real mobile devices were not automated.
