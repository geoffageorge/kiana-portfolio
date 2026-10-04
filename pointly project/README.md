# Point.ly source archive

Copied from the supplied `Kiana_George_Portfolio_Shareable 2/index.html`.

- `index.html`: the original shareable portfolio, preserved byte-for-byte, including its embedded case studies and media.
- `case-study.html`: the extracted Point.ly iframe content, with embedded images replaced by local `assets/` references.
- `assets/`: all 21 unique original Point.ly images, decoded without modification.
- `asset-manifest.json`: all 23 source placements, alt text, dimensions, and SHA-256 checksums. Repeated images share a file.
- `source-content.txt`: extracted source text for comparison and editorial reference.

The new website uses the asset copies in `../public/assets/pointly/` and the content record in `../src/data/caseStudies/pointly.js`. The source archive is kept outside `public/` and is not deployed.

| Source content | New page location |
| --- | --- |
| Introduction and startup context | About |
| Deliverable, team, timeline, roles, methods, My Contribution | Overview and Deliverable |
| The Final Product | Completed |
| Challenges and Who We Talked To | User Persona |
| Research methods, questions, What the Research Revealed | Research |
| Strategy and Travel Profile Report | Product strategy within Research |
| Early concepts, sketches, tests, and alternative directions | Design Evolution |
| Design & Prototyping, visual system, onboarding, AI hackathon | Design Evolution |
| The Outcome | Outcomes |
| What I Learned | Reflection |

The source provides product screenshots and process artifacts rather than dedicated company photographs or persona portraits. The new page uses prose and persona cards where those are the appropriate evidence. All unique source images appear in the overview or galleries, where they can be enlarged or opened at full size.

Regenerate this archive and the website image copies with:

```sh
python3 scripts/import-pointly.py /path/to/shareable/index.html
```

Run the command from the portfolio root. Python and Pillow are only needed for re-importing; the website runs and builds with Node.js.
