# Video 2 / version 8 inspection

Inspected November 9, 2026 with official Figma MCP design-to-code and Plugin API skills and confirmed Pro plan/Full seat access. Source: [Video 2, frame 657:7](https://www.figma.com/design/wZSRbIZZXfUlrq902OXE2W/?node-id=657-7).

## Complete source inspection

The white 1440 × 2583 fixed-size frame clips content, uses layout mode NONE, has no layout grid, frame effects, variable bindings, internal scrolling, overlay background or flow starting point, and exports as a 1× PNG. Its 117 nodes comprise 87 non-text objects and 30 text objects. All relevant fills, strokes, corners, effects, constraints, layout properties, visibility, transforms, export settings and prototype actions are retained in `design-inspection.json`. Exact wording, font names, sizes, line heights, tracking, alignment and styled ranges are in `text-inspection.json`. `geometry.json` independently records frame-relative bounds.

The page retains Corporate Video, Multimedia Journalism and Broadcast Journalism, two featured previews, six broadcast cards, and two section dividers. The three section headings use Inter Bold 32px/44px at x119 and y329, y810, y1435. The label is Inter Regular 15px/26px at x121/y217. Descriptions are Inter Regular 16px/26px; image/card titles Inter Semi Bold 20px/28px; publication labels Inter Medium 15px/28px in #7C8B98; buttons Fira Mono Regular 14px/16.8px in white on #25261E, with 4px corners.

Featured images remain at x732/y284 (588 × 331) and x732/y866 (589 × 335), with 16px corners. Captions begin at x734/y629 and x734/y1216. The new 28.184px play overlays sit at x753/y567 and x753/y1153. One older 46px play object at x758/y1059 is behind the new AAPI thumbnail and fully covered; it is retained as a source reference and omitted as a second visible control.

The six 382 × 356 cards retain source positions: x120/531/939 at y1606 and x120/530/936 at y1994. Source raster offsets/crops and individual caption positions are preserved. The first image window is 204px high, the next two 205px, and the lower three 214px. Play icons are x138/544/954 at y1770 and x138/544/954 at y2169. The Colette card uses its own original mask. Wasabi's caption background is its original 388 × 151 SVG, clipped by the outer card mask.

Native 0.5px black borders preserve the source rules at x127, width1193, y732 and y1351, retaining the previous Safari/WebKit divider fix. The existing four-option header, logo/name and footer are reused as explicitly requested; stale Social Media text and duplicate brand layers in the source are not added to the website.

## Assets and import

Twenty original exports were downloaded as directed by the high-fidelity design context: eight clean PNG thumbnails, the broadcast mask, Colette mask, Wasabi caption SVG, new play SVG, covered older play SVG, six brand-vector references, and divider SVG. Twelve unchanged runtime assets are copied to `public/assets/video-v8-figma/`. Its manifest records source dimensions, byte counts and SHA-256 hashes. SVG roots and artwork bytes are unchanged. Regenerate the content and assets with `node scripts/import-video-v8-figma.mjs`.

`design-reference.txt` retains the design context with local URLs. `content.json` derives exact visible wording, active preview URLs, crop geometry, masks, caption offsets and play positions from the independent inspection. Empty trailing lines are omitted while visible wording and intended line breaks remain. Desktop source layout is preserved; phone/tablet reflow allows captions to grow instead of clipping.

## Prototype actions and confirmed corrections

All active actions are ON_CLICK, external URL, opening in a new tab. Food Co-Operatives contains an empty legacy action followed by the active YouTube action; the active action is used.

The eight small play icons all contain a copied AAPI URL in Figma. The user explicitly confirmed correcting each icon to its matching preview destination. A single accessible anchor encloses each preview/play control, preventing nested links or contradictory destinations. The Corporate and multimedia buttons retain their corresponding URLs. Buttons, previews and all eight play-icon click targets are validated separately.

The top two preview images alone receive hover/focus/press motion; captions remain stationary, as explicitly confirmed by the user. Linked cards elsewhere retain their whole-card interaction boundary. The previous large perspective/tilt is replaced globally with scale3d(1.01,1.01,1.01), a 300ms cubic-bezier(0,0,.5,1) transition, and a 2px 4px 16px 16%-black hover shadow, observed in Apple's official shop stylesheet. Idle surfaces retain Figma styling. Keyboard/press feedback uses the same restrained effect; reduced motion disables transforms. Source provenance and extracted motion parameters are in `apple-motion-reference.json`. No Apple imagery or content is imported.

## Live links and archive

All eight distinct destinations returned HTTP 200 and exposed video content. Corporate now returns public YouTube metadata successfully. Three direct public YouTube videos and three article-embedded YouTube videos return matching metadata; AAPI exposes a video element with media hosted by video.wixstatic.com. `link-validation.json` records the independent live checks, separately from deterministic popup/navigation tests.

The previous Video page, CSS, importer, tests, runtime assets/data and shared motion CSS reference are preserved outside the public build under `Assets/archived pages/video-v6-before-v8-2026-11-09/`. Its manifest verifies all 17 original files. The original version 6 Figma inspection remains available. `/video/` now serves only the Video 2 implementation through the existing VIDEO navigation option.

The separate explicit font overrides set Selected Features on Journalism and Selected Case Studies on UX to 32px, retaining their existing 44px desktop line boxes and 40px phone line boxes. The old implementation used 36px desktop, despite the specification's reference to 38px.

## Final validation

The additional text-setting audit (`text-additional-settings.json`) retains text/style references, hyperlink/export settings, paragraph/list properties, text case/decoration and truncation settings. No missing fonts or frame flow starting point were found.

Production build passed. Final coverage verifies 367 passing regression checks, with one existing desktop-only Obayashi geometry check skipped on mobile. The full run passed 364 checks; three mobile interaction assertions were corrected to distinguish focus scrolling from title movement and to target visible links after scrolling settles. A final geometry audit also repaired the caption SVG's inherited max-width cap. After rebuilding, all 18 affected geometry/interaction rechecks passed in all six projects, with no failed or flaky checks left unresolved. `validation.json` preserves the original run and final results.

Independent desktop comparisons cover exact copy/styles, all thumbnails, eight play icons, buttons, crop layers and the original caption SVG within one pixel. The twelve runtime asset files retain original hashes; source masks and caption artwork are used at their proper callsites. `caption-svg-geometry.json` records final original/rendered bounds in Chrome, WebKit and Firefox. Both half-pixel dividers remain visible. All eight live video destinations are available; deterministic navigation tests cover buttons, previews and all eight play-icon targets.

Screenshots of all three changed pages were reviewed at 1440px and 390px in all three engines; Video captures were refreshed after the final sizing repair. Responsive checks also cover 320, 768, 1024 and 1920px. Source assets/crops, stationary titles, 32px headings, 1% hover/focus/press, reduced motion, keyboard links, direct/reloaded/index/subdirectory routes, archive integrity and existing pages pass. Native Safari and real mobile hardware were not automated; tests use WebKit and emulated or phone-sized layouts.
