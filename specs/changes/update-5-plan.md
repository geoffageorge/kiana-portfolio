# Add Journalism Page update version 5

Source: `specs/changes/update 5.md`. Plan checked against the request and the live Figma design on November 8, 2026, before implementation.

Figma tool access and the design-to-code and Plugin API skills are available. The connected account has a Pro plan with a Full seat. The inspected Journalism frame is `607:7` in file `wZSRbIZZXfUlrq902OXE2W`: 1440 × 1807, four clickable tiles, and the heading “Selected Features.” Design settings and prototype actions are archived in `Assets/figma files/journalism-v5-2026-11-08/`.

| Requirement | Implementation plan | Verification |
| --- | --- | --- |
| Global header | Render UX, VIDEO, JOURNALISM, ABOUT+CONTACT in Figma's Fira Mono styling; retain logo and name; remove the header descriptor and Social Media option | All-page navigation, active state, keyboard and responsive checks |
| UX | Link to the home page; preserve its hero and two case-study tiles | Hero measurements taken before editing, animation and case-study regressions |
| Journalism | Build `/journalism/` with the four Figma images, masks, text and responsive layout | Independent Figma geometry/text fixtures; original asset hashes; desktop/mobile screenshots |
| Video | Build a `/video/` placeholder displaying VIDEO | Navigation, direct loading and reload checks |
| About+Contact | Preserve the existing `/about/` destination and content | Biography, phone/email, resume, LinkedIn and footer regressions |
| Tile interaction | Reuse the existing project-card 3D hover/focus and reduced-motion rules | Pointer and keyboard interaction checks |
| Prototype links | Open the exact four Figma URL actions in new tabs with no opener | URL/action comparison, popup checks, independent external HTTP requests |
| Footer and deployment | Reuse the existing footer; create static HTML entries and subdirectory-aware routes | Source build, direct URLs, index URLs, subdirectory paths and footer checks |
| Regression | Run Chrome, WebKit and Firefox on desktop/phone configurations | Complete six-project Playwright run and visual checks |

The four source destinations are one PDF and three articles. The user explicitly approved retaining those exact destinations instead of replacing them with video URLs. ABOUT+CONTACT follows the spelling shown in Figma and the existing About destination.

The plan check found that hero placement depended on the header descriptor being removed. Baseline measurements were saved before editing; the implementation replaces that text dependency with stable header-relative anchors and retains the previous desktop artwork position within 0.2px. The existing case-study header heights are retained so the case-study content origins stay stable.

The work is prepared in the existing GitHub checkout. Commit/push and Cloudflare deployment are left to the user, using the commands in README.md.

Validation completed November 8, 2026: the production build and 233 checks passed across all six browser projects, with one existing desktop-only check skipped on mobile and no failures or flaky results. Each exact external URL returned HTTP 200. Source geometry, original assets, screenshots, new-tab behavior, all routes, and existing-site regressions are verified. Detailed results are recorded in the archived `validation.json` and `link-validation.json`.
