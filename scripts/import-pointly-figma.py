"""Copy the supplied layer exports unchanged and record their Figma provenance."""
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import shutil
import struct
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Assets/figma files/figma-export'
OUTPUT = ROOT / 'public/assets/pointly-figma'
SNAPSHOT = ROOT / 'Assets/figma files/pointly-frame-90-18.json'


class Images(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []

    def handle_starttag(self, tag, attributes):
        if tag == 'img':
            self.images.append(dict(attributes))


def main():
    snapshot = json.loads(SNAPSHOT.read_text())
    parser = Images()
    parser.feed((SOURCE / 'pointly-case-study-2.html').read_text())
    geometry = {
        node_id: {'x': float(x), 'y': float(y), 'width': float(w), 'height': float(h)}
        for node_id, x, y, w, h in re.findall(
            r'<[\w-]+ id="([^"]+)" name="[^"]*" x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"',
            snapshot['metadata'],
        )
    }
    # This image is local to Frame 243; the other image bounds are frame-relative.
    geometry['145:113'].update(x=514, y=4840)
    vectors = {
        'line-69-49.svg': '143:16', 'line-70-50.svg': '143:18',
        'line-71-51.svg': '163:12', 'line-72-183.svg': '314:38',
        'ellipse-12-52.svg': '128:19', 'ellipse-13-53.svg': '128:20',
        'ellipse-14-54.svg': '128:21', 'line-65-62.svg': '130:33',
        'line-66-63.svg': '130:34', 'rectangle-3-140.svg': '28:54',
        'rectangle-4-141.svg': '28:55', 'rectangle-5-142.svg': '28:56',
        'rectangle-19-143.svg': '135:6',
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    raster_layers = iter(snapshot['imageLayers'])
    assets = {}
    for image in parser.images:
        source = SOURCE / image['src']
        data = source.read_bytes()
        if not data:
            raise ValueError(f'Empty source: {source}')
        if source.suffix == '.png':
            width, height = struct.unpack('>II', data[16:24])
            layer = next(raster_layers)
            node_id = layer['id']
        else:
            svg = ET.fromstring(data)
            width, height = float(svg.attrib['width']), float(svg.attrib['height'])
            node_id = vectors.get(source.name, '187:8')
        shutil.copyfile(source, OUTPUT / source.name)
        assets[source.stem] = {
            'file': source.name, 'width': width, 'height': height,
            'figmaNodeId': node_id, 'slot': geometry.get(node_id),
            'source': str(source.relative_to(ROOT)), 'sha256': sha256(data).hexdigest(),
        }
    manifest = {
        'sourceFrame': {'fileKey': snapshot['fileKey'], 'nodeId': snapshot['nodeId'],
                        'width': snapshot['frame']['width'], 'height': snapshot['frame']['height']},
        'assets': assets,
    }
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Copied {len(assets)} unchanged Figma layer assets.')


if __name__ == '__main__':
    main()
