# Archived home hero before version 9

Archived November 9, 2026 from commit `7569868` before replacing the home animation with `Assets/new hero 2/`.

This folder contains the prior runtime HTML, HeroSection JSX/CSS and three hero test snapshots. The original source files remain in the user's renamed `Assets/new hero section 1/` folder, which is byte-for-byte identical to the former tracked `Assets/new hero section/`. `archive-manifest.json` records hashes for all six archived files and all three renamed source files.

This archive is outside `public/` and the production build. For a deliberate rollback, copy HeroSection.jsx/CSS back to their original component folder, restore runtime-animation.html as `public/assets/hero-v7/animation.html`, and restore the hero tests. Their source references should use the retained renamed source folder. Rebuild and validate before deploying a rollback.
