"""Archive a shareable portfolio and extract the Point.ly iframe's image assets.

Usage: python3 scripts/import-pointly.py /path/to/shareable/index.html
The original is preserved byte-for-byte. Image data is decoded without editing it.
"""

import argparse
import base64
import hashlib
from html.parser import HTMLParser
import io
import json
from pathlib import Path
import re
import shutil

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


class PortfolioParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.case_study = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "iframe" and attrs.get("id") == "pointly-frame":
            self.case_study = attrs.get("srcdoc")


class CaseStudyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.text = []
        self.hidden = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("style", "script"):
            self.hidden += 1
        if tag == "img":
            self.images.append(attrs)

    def handle_endtag(self, tag):
        if tag in ("style", "script"):
            self.hidden = max(0, self.hidden - 1)

    def handle_data(self, data):
        if not self.hidden and data.strip():
            self.text.append(data.strip())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    source = parser.parse_args().source
    portfolio = PortfolioParser()
    portfolio.feed(source.read_text())
    if not portfolio.case_study:
        raise ValueError("The source has no Point.ly case-study iframe.")
    case_study = CaseStudyParser()
    case_study.feed(portfolio.case_study)

    archive = ROOT / "pointly project"
    original_assets = archive / "assets"
    website_assets = ROOT / "public" / "assets" / "pointly"
    original_assets.mkdir(parents=True, exist_ok=True)
    website_assets.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, archive / "index.html")
    extracted_html = portfolio.case_study
    unique = {}
    manifest = []

    for index, image in enumerate(case_study.images, 1):
        src = image["src"]
        match = re.fullmatch(r"data:image/(png|jpeg|webp);base64,(.+)", src, re.DOTALL)
        if not match:
            raise ValueError(f"Image {index} is not an embedded supported image.")
        payload = base64.b64decode(match[2], validate=True)
        digest = hashlib.sha256(payload).hexdigest()
        if digest not in unique:
            slug = re.sub(r"[^a-z0-9]+", "-", image.get("alt", "image").lower()).strip("-")[:78]
            extension = "jpg" if match[1] == "jpeg" else match[1]
            filename = f"{index:02d}-{slug}.{extension}"
            (original_assets / filename).write_bytes(payload)
            (website_assets / filename).write_bytes(payload)
            unique[digest] = filename
        filename = unique[digest]
        with Image.open(io.BytesIO(payload)) as opened:
            width, height = opened.size
        extracted_html = extracted_html.replace(src, f"assets/{filename}")
        manifest.append({"index": index, "file": filename, "alt": image.get("alt", ""),
                         "width": width, "height": height, "sha256": digest})

    (archive / "case-study.html").write_text(extracted_html)
    (archive / "asset-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    (archive / "source-content.txt").write_text("\n\n".join(case_study.text) + "\n")
    print(f"Archived source and extracted {len(unique)} images from {len(manifest)} placements.")
    for item in manifest:
        print(f"{item['index']:02d}  {item['file']}  ({item['width']} × {item['height']})")


if __name__ == "__main__":
    main()
