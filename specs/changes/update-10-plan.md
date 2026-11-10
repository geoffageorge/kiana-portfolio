# JOURNALISM section changes update version 10

Reviewed November 9, 2026 against `specs/changes/update 10.md` and live Figma `JOURNALISM 2` (607:7), file `wZSRbIZZXfUlrq902OXE2W`.

## Access and design review

Official Figma MCP authentication is confirmed with the existing Pro/Full connection. The Figma design-to-code and Plugin API skills are loaded. All 147 nodes were inspected for design/prototype properties, with independent geometry, text/typography and the high-fidelity reference captured under `Assets/figma files/journalism-v10-2026-11-09/`. The single Video 2 reference in the specification is treated as a copied label; Journalism 2 is the target and Video 2 provides shared assets.

The 1440 × 3689 frame introduces SELECTED JOURNALISM WORK, renames the first section to Written Articles, retains the four article destinations, adds the AAPI Multimedia Journalism feature and CTA, and adds six Broadcast Journalism stories in a three-column/two-row desktop grid. Section headings are 32px Inter Bold/44px, body text 16px/26px, card titles 20px Inter Semi Bold/28px, and publications 15px Inter Medium. Two half-pixel horizontal dividers separate the sections. The shared website header and footer take precedence over the duplicated Figma header, SOCIAL MEDIA option and blank footer area.

Prototype links are click actions opening external destinations in new tabs. Broadcast play icons contain copied AAPI actions; apply the user's previously approved matching-preview correction from update 8. The multimedia preview/title should open the same package as its CTA, satisfying the requirement for linked images. One larger play symbol is entirely behind the opaque multimedia image and has no visible role. The user explicitly confirmed that the five overlapping screenshot filename labels should be omitted as editor artifacts.

## Implementation plan

1. Download the relevant original exports supplied by the high-fidelity reference. Compare hashes and image-fill identities against the existing Journalism/Video assets. Reuse exact matches by existing runtime URL; add only changed/new assets. Record all source exports and the reuse map without modifying image/SVG bytes.

   All 19 runtime assets match existing source archives and public files byte-for-byte. `asset-reuse.json` maps fresh exports to those existing originals and runtime URLs; duplicate downloads remain only in the local QA cache. The divider export is retained as reference, with native borders used on the website.
2. Add a reproducible Journalism v10 content importer using the inspected copy, geometry, masks, image slots and prototype actions. Preserve the prior v5 source/runtime assets because the written tiles still reuse them.
3. Update the Journalism page to a semantic page heading plus Written Articles, Multimedia Journalism and Broadcast Journalism sections. Reuse the existing card/motion, Video broadcast-card rendering, native divider styling, local fonts, navigation, footer and URL helpers. Preserve all story destinations and the approved matching play-icon behavior.
4. Match desktop geometry in normal-flow layouts: narrower written/multimedia content within the wider broadcast container, exact image/mask/caption slots, section spacing and original dividers. Reflow to two/one columns and stack the multimedia feature on smaller screens without clipping or changing desktop artwork.
5. Verify all 11 external destinations live, including PDF delivery, YouTube visibility and embedded video content where applicable. Test deterministic new-tab actions separately from live external availability.
6. Update tests for the new headings/sections and source fixtures. Build production; verify independent Figma geometry/assets/text, responsive layouts, direct/reload/subdirectory routes, links, keyboard/hover/press/reduced motion, shared menus/footer, home hero and both existing case studies across Chrome, WebKit and Firefox desktop/phone configurations. Review final screenshots against Figma.
7. Record validation and scoped GitHub/Cloudflare instructions. Do not commit, push or deploy; the user performs those steps after reviewing the completed code.

## Plan check

Each requested addition has a source node, content/asset path and verification step. The existing shared components and global menu/footer remain in use. Native borders preserve the Safari divider fix. Asset reuse is established from exact source comparisons, and URL helpers preserve subdirectory deployments. The desktop reference is translated into responsive grids rather than fixed full-page absolute positioning. No dependencies or hosting configuration changes are required.

## Completed implementation and validation

All seven steps are complete. Journalism now has its updated page label, Written Articles, Multimedia Journalism and Broadcast Journalism with source copy/crops/masks, two native dividers, responsive layout and working links. The existing global menu/footer remain. Preview and broadcast-card rendering are shared with Video, whose geometry and behavior remain covered by regression tests. All 19 runtime assets reuse exact existing source/public files; the new runtime folder contains only generated content and manifest JSON.

Production build and `git diff --check` pass. The complete final suite passed **403 checks**, with one existing desktop-only Obayashi geometry check skipped on mobile. There are no failed or flaky checks. Before that full run, two focused Video checks caught an incorrect CSS extraction boundary; the extraction was repaired, all 20 focused checks passed, then the full suite passed without rechecks or retries.

Chrome, WebKit (Safari engine) and Firefox desktop/phone screenshots of Journalism were reviewed against the high-fidelity Figma reference. Content positions/crops match within subpixel rounding; empty text-box height in Figma is not imposed on normal-flow text. All images/captions fit the responsive layouts without runtime/resource errors. Native Safari and real mobile hardware were not automated.

All 11 distinct external destinations returned HTTP 200, the PDF signature was verified, three directly linked YouTube videos expose public metadata, and all four detected article embeds expose public video metadata. The AAPI page exposes its hosted video. External videos were not watched end-to-end. Deterministic keyboard/click/play-icon tests independently verify matching destinations and safe new-tab behavior.

`Assets/figma files/journalism-v10-2026-11-09/validation.json` records results, source hashes, asset reuse, geometry and limits; `link-validation.json` records live availability checks. README.md includes the scoped GitHub commands and post-Cloudflare checks. No commit, push or production deployment has been performed.
