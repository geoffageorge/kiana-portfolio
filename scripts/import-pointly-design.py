"""Extract the visual exhibits from the supplied Figma export without redrawing them.

Run with Python 3 and Pillow. Text outside these exhibits is implemented as HTML.
Coordinates refer to the original 1440 x 10808 PNG, which remains unchanged.
"""
from pathlib import Path
import hashlib
import json
import shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Assets/pointly_2/Pointly Case Study 2.png'
OUTPUT = ROOT / 'public/assets/pointly-2'
EXHIBITS = {
    'hero-showcase': (120, 558, 1320, 1213),
    'rewards-flow': (120, 1267, 1320, 1633),
    'isa': (476, 2890, 664, 3035),
    'jasmine': (780, 2890, 955, 3035),
    'afsaneh': (1080, 2890, 1275, 3035),
    'daniel': (480, 3205, 837, 3455),
    'strategic-optimizer': (426, 3918, 489, 3985),
    'aspirational-expert': (739, 3918, 802, 3985),
    'casual-redeemer': (1040, 3918, 1103, 3985),
    'seats-aero': (511, 4424, 625, 4463),
    'roame': (511, 4484, 625, 4523),
    'pointsyeah': (511, 4544, 625, 4583),
    'awardtool': (511, 4604, 625, 4643),
    'maxmypoint': (511, 4654, 625, 4703),
    'awardwallet': (511, 4724, 625, 4763),
    'the-points-guy': (511, 4774, 628, 4823),
    'point-me': (511, 4844, 625, 4883),
    'opportunity-map': (426, 5037, 1320, 5418),
    'low-fi-wallet': (428, 6478, 742, 6867),
    'low-fi-exploration': (761, 6478, 1317, 6867),
    'mid-fi-dashboard': (422, 7100, 895, 7453),
    'mid-fi-comparison': (917, 7100, 1320, 7465),
    'visual-system': (422, 7667, 1320, 8102),
}
PROTOTYPE_SCREENS = {
    'connected-wallet': '02-connected-wallet 1.png',
    'recommended-stays': '06-recommended-stays 1.png',
    'stay-details': '07-stay-details 1.png',
}

def main():
    image = Image.open(SOURCE).convert('RGB')
    if image.size != (1440, 10808):
        raise ValueError('The reference dimensions changed; review the extraction coordinates.')
    OUTPUT.mkdir(parents=True, exist_ok=True)
    assets = {}
    for name, box in EXHIBITS.items():
        crop = image.crop(box)
        filename = f'{name}.webp'
        crop.save(OUTPUT / filename, 'WEBP', lossless=True, method=6)
        assets[name] = {'file': filename, 'width': crop.width, 'height': crop.height, 'sourceRect': box}
    for name, source_filename in PROTOTYPE_SCREENS.items():
        source = SOURCE.parent / source_filename
        screen = Image.open(source)
        filename = f'{name}.png'
        shutil.copyfile(source, OUTPUT / filename)
        assets[name] = {
            'file': filename, 'width': screen.width, 'height': screen.height,
            'sourceFile': str(source.relative_to(ROOT)),
            'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        }
    manifest = {'source': str(SOURCE.relative_to(ROOT)), 'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(), 'assets': assets}
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Imported {len(assets)} lossless exhibits into {OUTPUT.relative_to(ROOT)}.')

if __name__ == '__main__':
    main()
