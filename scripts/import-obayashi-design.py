"""Extract the photographic and annotated exhibits from the Obayashi PNG.

Run with Python 3 and Pillow. Main headings and narrative are native HTML;
the research evidence preserves the source's screenshots and annotations.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Assets/obayashi/Obayashi.png'
OUTPUT = ROOT / 'public/assets/obayashi'
EXHIBITS = {
    'stakeholder-interviews': (407, 2285, 1377, 2767),
    'audience-priorities': (650, 3120, 1405, 3535),
    'portfolio-evidence': (650, 3610, 1438, 4045),
    'credibility-signals': (700, 4185, 1405, 4475),
    'employer-experience': (670, 4580, 1365, 4975),
    'content-hierarchy': (625, 5125, 1375, 5405),
}


def main():
    image = Image.open(SOURCE).convert('RGB')
    if image.size != (1440, 12433):
        raise ValueError('Reference dimensions changed; review the crop coordinates.')
    OUTPUT.mkdir(parents=True, exist_ok=True)
    assets = {}
    for name, box in EXHIBITS.items():
        crop = image.crop(box)
        filename = f'{name}.webp'
        crop.save(OUTPUT / filename, 'WEBP', lossless=True, method=6)
        assets[name] = {'file': filename, 'width': crop.width, 'height': crop.height, 'sourceRect': box}
    manifest = {
        'source': str(SOURCE.relative_to(ROOT)),
        'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        'assets': assets,
    }
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Imported {len(assets)} lossless exhibits into {OUTPUT.relative_to(ROOT)}.')


if __name__ == '__main__':
    main()
