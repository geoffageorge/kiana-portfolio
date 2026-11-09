# UX version 7 design and prototype inspection

Inspected November 8, 2026 with the official Figma MCP design-to-code and Plugin API skills, using a Pro plan and Full seat. Source: [UX frame, 619:58](https://www.figma.com/design/wZSRbIZZXfUlrq902OXE2W/?node-id=619-58). The live frame has an introductory header and two case-study tiles.

## Frame and objects

The frame is 1440 × 1257, white, fixed-size, and clips content. Layout mode is NONE. Its visible 12-column stretched grid has 120px margins and 24px gutters. It has no frame effects, variable bindings, active prototype actions, internal scrolling, overlay background or flow starting point. Export settings specify one 1× PNG. The relevant settings for every object are retained in `design-inspection.json` and `text-inspection.json`; the independent 49-node geometry reference is `geometry.json`.

The introductory label is UX RESEARCH & DESIGN, Inter Regular 15px/26px, x120/y205, width254. The title is Selected Case Studies, Inter Bold 36px/44px, x121/y255, width471. The exact two-line description is Inter Regular 16px/26px at x123/y312, width994. Visible wording, paragraph break, weight and zero letter spacing are preserved.

Two 577 × 577 tiles sit at x120 and x743, y429, with a 46px gap and 16px corners. Titles use Inter Bold 50px/1.05 with -1px tracking. Numbering/captions use Fira Mono Regular 18px, with 22px and 25px line heights respectively. Roles use Inter Regular 15px/23px. Obayashi text is white; Point.ly text is black on #88CFFD. Each role divider is 44px wide with a 1px stroke. Native borders retain the existing Safari divider fix.

The Obayashi staircase is flipped horizontally within its rounded mask; its image rectangle is x-97/y389, 1363 × 744. The Point.ly laptop has a separate outer mask, hardware raster, screen mask and long screen raster. All crop offsets, source proportions and the source screen shadow are retained by the shared project-card component.

## Source assets and reuse

Fourteen original exports were downloaded as instructed by the high-fidelity design context: three PNGs, three artwork masks, six brand-vector references and two role-divider SVGs. Each of the six artwork files is a byte-for-byte match for its existing runtime asset. `asset-reuse.json` records original exports, reused paths, dimensions, byte counts and SHA-256 hashes. No asset was redrawn, edited or substituted. `design-reference.jsx` preserves the generated reference with local asset URLs; it is an inspection reference, not application code.

The same two existing project-card components are used on home and UX, preserving image/mask layers, visible wording, link labels, 3D hover/focus behavior and reduced-motion rules. The existing four-option header, logo/name and footer are retained as requested. The source's stale Social Media label and overlapping duplicate brand layers are not added to the shared website navigation. Blank trailing lines in role text boxes are omitted without altering visible copy.

## Navigation and prototype

There are no active reactions on any of the 49 inspected nodes. Update 7 explicitly specifies the Obayashi and Point.ly destinations, so the cards link to `/projects/obayashi/` and `/projects/pointly/`. The shared UX menu now opens `/ux/`; the logo/name link still opens home. Existing About, Video and Journalism routes and the footer stay in place. Direct, reloaded, index.html and subdirectory URLs are supported by the existing static-entry workflow.

## Supplied home animation

The home hero comes from `Assets/new hero section/animation.html`, rather than this Figma frame. Its companion README recommends a 630px iframe, reduced to 540px on phones. The original file is copied unchanged to `public/assets/hero-v7/animation.html` and embedded eagerly directly below the header. Isolation preserves its original Arial styling, spirograph, four focus words, rings, gradient reveal, final headline/subheading and Replay button without global CSS interference. It starts automatically when at least 25% visible, plays once over about 9.35 seconds, and shows the final state immediately for an initial reduced-motion preference. The old rendered hero artwork/copy is removed. A semantic page heading contains the supplied final headline.

The home section heading is Featured, with CASE STUDIES retained beneath it and the existing native divider and case-study tiles preserved.

## Implementation validation

Production build passed. Final regression coverage verifies 349 passing checks, with one existing desktop-only Obayashi geometry check skipped on mobile. The initial full run passed 348 checks; its only failure was a strict font-size string comparison against WebKit's 49.999992px serialization of 50px container-scaled text. A numeric comparison resolved the assertion, and the affected typography/geometry check passed in all six projects. Runtime code remained unchanged between those runs. Detailed original and final results are retained in `validation.json`.

Home and UX screenshots were reviewed at 1440px and 390px in Chrome, WebKit and Firefox after decoding all image layers. Source positions/crops match within 0.6px. Responsive tests cover 320, 390, 768, 1024, 1440 and 1920px without horizontal overflow or iframe scrollbars. Real-clock animation, all four focus words, final reveal, keyboard Replay, reload, initial reduced-motion state, shared tile effects, both case-study links, native dividers and existing pages were verified. Direct/index/reloaded/subdirectory routes also pass. Native Safari and real mobile hardware were not automated; WebKit and emulated or phone-sized layouts provide engine/layout coverage.
