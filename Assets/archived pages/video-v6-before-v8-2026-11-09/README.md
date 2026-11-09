# Archived Video page before version 8

Archived November 9, 2026 from commit `c81000f` before replacing the live `/video/` page with Figma Video 2. This directory is outside `public/` and is not a live page or production asset directory.

The archive contains the previous VideoPage.jsx, VideoPage.css, importer, browser tests, all runtime images/masks/data, and the previous shared ProjectCard.css as a visual reference. `archive-manifest.json` records every original file's byte count and SHA-256 hash. The original Figma inspection remains under `Assets/figma files/video-v6-2026-11-08/`.

For a deliberate rollback, restore VideoPage.jsx and VideoPage.css to `src/pages/`, the importer to `scripts/import-video-figma.mjs`, the tests to `tests/video.spec.js`, and the contents of `runtime-assets/` to `public/assets/video-figma/`. The archived shared ProjectCard.css is a reference; restoring it would also revert motion for other pages. Rebuild and rerun regression checks before deploying a rollback.
