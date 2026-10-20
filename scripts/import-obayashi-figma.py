"""Copy inspected Figma exports unchanged and retain their layer provenance."""
from pathlib import Path
from hashlib import sha256
import json
import shutil
import struct
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / 'Assets/figma files/obayashi-inspection-2026-10-19'
SOURCE = ROOT / 'Assets/figma files/obayashi-update-2026-10-19'
OUTPUT = ROOT / 'public/assets/obayashi-figma'
NAMES = [
    'competitive-analysis-1', 'competitive-analysis-2', 'storyboard', 'interviews',
    'family', 'trust', 'mentorship', 'growth', 'mind-map', 'existing-contact',
    'existing-projects', 'existing-project-detail', 'existing-careers', 'home',
    'markets', 'home-wireframe', 'laptop', 'rail', 'golden-gate', 'technology',
    'sketches', 'technology-wireframe', 'markets-wireframe', 'rail-wireframe',
    'details-divider', 'section-divider', 'competitive-mask', 'storyboard-mask',
    'interviews-mask', 'interviews-inner-mask', 'brand-mask', 'mind-map-mask',
    'contact-mask', 'projects-mask', 'project-detail-mask', 'careers-mask', 'hero-markets-mask',
]
# Image layer, mask layer, exported mask, optional second mask.
CROPS = {
    'competitive-analysis-1': ('351:55', '499:9', 'competitive-outer-mask', ('420:330', 'competitive-mask')),
    'storyboard': ('351:72', '429:85', 'storyboard-mask', None),
    'interviews': ('223:410', '424:44', 'interviews-mask', ('424:20', 'interviews-inner-mask')),
    'family': ('351:73', '429:59', 'brand-mask', None),
    'trust': ('351:79', '429:60', 'brand-mask', None),
    'mentorship': ('351:76', '429:62', 'brand-mask', None),
    'growth': ('351:78', '429:61', 'brand-mask', None),
    'mind-map': ('424:13', '429:87', 'mind-map-mask', None),
    'existing-contact': ('266:47', '429:53', 'contact-mask', None),
    'existing-projects': ('266:52', '424:46', 'projects-mask', None),
    'existing-project-detail': ('420:400', '429:54', 'project-detail-mask', None),
    'existing-careers': ('266:46', '429:51', 'careers-mask', None),
    'hero-markets': ('351:98', '444:13', 'hero-markets-mask', None),
}


def main():
    inspection = json.loads((SOURCE / 'inspection.json').read_text())
    nodes = {n['id']: n for n in inspection['nodes']}
    reference = nodes['420:76']
    originals = json.loads((BASELINE / 'asset-manifest.json').read_text())['assets']
    related = {a['name']: a for a in json.loads((BASELINE / 'related-assets.json').read_text())['assets']}
    updates = {a['name']: a for a in json.loads((SOURCE / 'asset-manifest.json').read_text())['assets']}
    OUTPUT.mkdir(parents=True, exist_ok=True)
    assets = {}

    def copy(name, source, node_ids):
        data = source.read_bytes()
        if source.suffix == '.png':
            width, height = struct.unpack('>II', data[16:24])
        else:
            svg = ET.fromstring(data)
            width, height = float(svg.attrib['width']), float(svg.attrib['height'])
        filename = name + source.suffix
        shutil.copyfile(source, OUTPUT / filename)
        assets[name] = {'file': filename, 'width': width, 'height': height,
                        'figmaNodeIds': node_ids, 'source': str(source.relative_to(ROOT)),
                        'sha256': sha256(data).hexdigest()}
        if node_ids and node_ids[0] in nodes:
            n = nodes[node_ids[0]]
            b = n['absoluteBoundingBox']
            assets[name]['slot'] = {'x': b['x'] - reference['x'], 'y': b['y'] - reference['y'],
                                    'width': n['width'], 'height': n['height']}
            paint = next((fill for fill in n.get('fills', []) if fill['type'] == 'IMAGE'), None)
            if paint:
                assets[name]['imagePaint'] = paint

    if len(NAMES) != len(originals):
        raise ValueError('The baseline asset list and named slots must match.')
    for name, asset in zip(NAMES, originals):
        revision = updates.get(name)
        copy(name, (SOURCE if revision else BASELINE) / 'assets' / (revision or asset)['filename'],
             (revision or asset).get('nodeIds', []))
    for name, source_name in [('careers', 'careers'), ('logo', 'header'), ('x-circle', 'x-circle-svg')]:
        a = updates.get(name) or related[source_name]
        copy(name, (SOURCE if name in updates else BASELINE) / 'assets' / a['filename'],
             a.get('nodeIds', [a.get('nodeId')]))
    outer = updates['competitive-outer-mask']
    copy('competitive-outer-mask', SOURCE / 'assets' / outer['filename'], outer['nodeIds'])

    def relative(layer_id, origin_id):
        n, origin = nodes[layer_id], nodes[origin_id]
        b, o = n['absoluteBoundingBox'], origin['absoluteBoundingBox']
        return {'x': b['x'] - o['x'], 'y': b['y'] - o['y'], 'width': n['width'], 'height': n['height']}

    crops = {}
    for name, (image_id, mask_id, mask_name, inner) in CROPS.items():
        mask = nodes[mask_id]
        crops[name] = {'nodeId': mask_id, 'width': mask['width'], 'height': mask['height'],
                       'mask': mask_name, 'image': relative(image_id, mask_id)}
        if inner:
            crops[name]['inner'] = {**relative(inner[0], mask_id), 'mask': inner[1]}
            crops[name]['image'] = relative(image_id, inner[0])

    texts = {n['id']: n for n in inspection['textData']['texts']}
    # Approved editorial correction; the source's forced line split is inside this word.
    texts['478:32']['text'] = texts['478:32']['text'].replace('r\u2028elevant', 'relevant')
    line_ids = ['420:269', '420:305', '420:335', '429:74', '424:16', '429:96', '478:25']
    manifest = {'sourceFrame': {'fileKey': inspection['fileKey'], 'nodeId': '420:76',
                                'width': 1440, 'height': 12278,
                                'inspection': str((SOURCE / 'inspection.json').relative_to(ROOT))},
                'assets': assets, 'crops': crops, 'texts': texts,
                'slots': {node_id: relative(node_id, '420:76') for node_id in nodes},
                'dividers': {node_id: {'asset': 'details-divider' if index == 0 else 'section-divider',
                                       'name': nodes[node_id]['name'], 'strokeWeight': nodes[node_id]['strokeWeight'],
                                       'offset': 0 if index == 0 else relative(node_id, '420:76')['x'] - 426}
                             for index, node_id in enumerate(line_ids)},
                'textStyles': inspection['textData']['styles'],
                'approvedChanges': ['Project number 01', 'One Methodology label',
                                    'Correct relevant wrapping', 'Careers 1 scrolls inside original laptop screen']}
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Copied {len(assets)} unchanged Figma assets with text, crop and layer provenance.')


if __name__ == '__main__':
    main()
