"""Generate original prototype artwork. Run with Python, Pillow, and NumPy."""

from pathlib import Path
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"
SIZE = (660, 560)
SCALE = 2


def orbit(draw, center, radii, rotation, color, phase=0):
    points = []
    for step in range(181):
        angle = step * math.tau / 180
        x, y = radii[0] * math.cos(angle), radii[1] * math.sin(angle)
        points.append(((center[0] + x * math.cos(rotation) - y * math.sin(rotation)) * SCALE,
                       (center[1] + x * math.sin(rotation) + y * math.cos(rotation)) * SCALE))
    draw.line(points, fill=color, width=1)
    x, y = points[int((phase % math.tau) / math.tau * 180)]
    draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=color)


def ring(angle):
    diameter = 204 * SCALE
    yy, xx = np.mgrid[0:diameter, 0:diameter]
    mix = np.clip(0.5 + ((xx / diameter - 0.5) * math.cos(angle)
                        + (yy / diameter - 0.5) * math.sin(angle)) * 1.3, 0, 1)
    stops = [(0, (31, 57, 135)), (0.48, (77, 178, 204)), (1, (111, 219, 190))]
    pixels = np.zeros((diameter, diameter, 3), dtype=np.uint8)
    for channel in range(3):
        pixels[:, :, channel] = np.interp(mix, [s[0] for s in stops], [s[1][channel] for s in stops])
    result = Image.fromarray(pixels)
    mask = Image.new("L", (diameter, diameter))
    draw = ImageDraw.Draw(mask)
    draw.ellipse((1, 1, diameter - 2, diameter - 2), fill=255)
    inner = 44 * SCALE
    draw.ellipse((inner, inner, diameter - inner, diameter - inner), fill=0)
    return result, mask


def generate_hero():
    destination = ASSETS / "hero"
    destination.mkdir(parents=True, exist_ok=True)
    font = ImageFont.truetype("/System/Library/Fonts/Monaco.ttf", 10 * SCALE) if Path("/System/Library/Fonts/Monaco.ttf").exists() else ImageFont.load_default()
    frames = []
    for frame in range(48):
        phase = frame * math.tau / 48
        canvas = Image.new("RGB", (SIZE[0] * SCALE, SIZE[1] * SCALE), "white")
        draw = ImageDraw.Draw(canvas)
        for index in range(14):
            orbit(draw, (389, 259), (227 + (index % 4) * 12, 77 + index * 6),
                  index * 0.31 + 0.03 * math.sin(phase),
                  (194, 224, 234) if index % 2 else (204, 227, 242), phase + index)
        for index, (x, y) in enumerate([(105, 259), (142, 402), (228, 73), (371, 50), (341, 505),
                                       (548, 309), (575, 427), (225, 454), (485, 125), (116, 359),
                                       (285, 461), (509, 483), (392, 119), (429, 328), (175, 311)]):
            draw.text(((x + 24) * SCALE, (y - 22) * SCALE), str(index % 2), font=font, fill=(167, 206, 221))
        for index, (x, y, angle) in enumerate([(278, 164, -0.7), (468, 219, 0.9), (251, 338, -2.5), (439, 392, 2.2)]):
            image, mask = ring(angle + 0.18 * math.sin(phase + index))
            dx = 3 * math.sin(phase + index * 0.8)
            dy = 4 * math.cos(phase + index * 0.8)
            canvas.paste(image, (round((x - 78 + dx) * SCALE), round((y - 124 + dy) * SCALE)), mask)
        frames.append(canvas.resize(SIZE, Image.Resampling.LANCZOS))
    frames[0].save(destination / "clarifying-chaos-poster.png", optimize=True)
    palette = frames[0].quantize(colors=128)
    indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
    indexed[0].save(destination / "clarifying-chaos.gif", save_all=True, append_images=indexed[1:],
                    duration=80, loop=0, optimize=True, disposal=2)


def generate_projects():
    destination = ASSETS / "projects"
    destination.mkdir(parents=True, exist_ok=True)
    themes = [("#EDF0E9", "#C6D4C6", "#92AAA0"), ("#E5EEF4", "#BACEDC", "#82A5BF"),
              ("#EFEAF1", "#D3C7DC", "#AAA0BC"), ("#F1EDE5", "#D9CBB7", "#B2A28A")]
    for index, (paper, muted, accent) in enumerate(themes, 1):
        if index % 2:
            artwork = f'''
            <g transform="translate(155 123) rotate(-8 78 175)" filter="url(#shadow)">
              <rect width="158" height="332" rx="27" fill="#FCFCFA" stroke="#D7DBD6"/>
              <rect x="51" y="12" width="56" height="5" rx="2.5" fill="{muted}"/>
              <circle cx="32" cy="51" r="13" fill="{muted}"/>
              <rect x="53" y="44" width="71" height="7" rx="3" fill="{muted}"/>
              <rect x="53" y="57" width="47" height="5" rx="2.5" fill="#E4E8E2"/>
              <rect x="17" y="89" width="124" height="111" rx="12" fill="{muted}"/>
              <circle cx="79" cy="141" r="31" fill="none" stroke="#FCFCFA" stroke-width="10"/>
              <rect x="18" y="223" width="78" height="7" rx="3" fill="{accent}"/>
              <rect x="18" y="240" width="115" height="5" rx="2" fill="#E4E8E2"/>
              <rect x="18" y="252" width="91" height="5" rx="2" fill="#E4E8E2"/>
              <rect x="18" y="281" width="122" height="28" rx="14" fill="{accent}"/>
            </g>
            <g transform="translate(328 163) rotate(9 78 165)" filter="url(#shadow)">
              <rect width="158" height="332" rx="27" fill="#FCFCFA" stroke="#D7DBD6"/>
              <rect x="51" y="12" width="56" height="5" rx="2.5" fill="{muted}"/>
              <rect x="19" y="46" width="77" height="9" rx="4" fill="{accent}"/>
              <rect x="19" y="67" width="109" height="5" rx="2" fill="#E4E8E2"/>
              <rect x="19" y="94" width="120" height="76" rx="12" fill="{muted}"/>
              <rect x="19" y="185" width="120" height="47" rx="10" fill="{paper}"/>
              <rect x="19" y="245" width="120" height="47" rx="10" fill="{paper}"/>
              <circle cx="42" cy="208" r="10" fill="{accent}"/>
              <circle cx="42" cy="268" r="10" fill="{muted}"/>
              <path d="M63 204h55m-55 10h38m-38 50h55m-55 10h38" stroke="{muted}" stroke-width="5" stroke-linecap="round"/>
            </g>'''
        else:
            artwork = f'''
            <g transform="translate(86 158) rotate(-5 235 155)" filter="url(#shadow)">
              <rect width="468" height="312" rx="14" fill="#FCFCFA" stroke="#D6DCE0"/>
              <path d="M0 35h468" stroke="#E4E8E8"/>
              <circle cx="18" cy="18" r="4" fill="{accent}"/>
              <circle cx="32" cy="18" r="4" fill="{muted}"/>
              <circle cx="46" cy="18" r="4" fill="{paper}"/>
              <rect x="0" y="36" width="92" height="276" fill="{paper}"/>
              <rect x="17" y="62" width="54" height="8" rx="4" fill="{accent}"/>
              <path d="M20 101h50m-50 25h36m-36 25h44m-44 25h34" stroke="{muted}" stroke-width="6" stroke-linecap="round"/>
              <rect x="115" y="58" width="112" height="12" rx="5" fill="{accent}"/>
              <rect x="115" y="82" width="175" height="6" rx="3" fill="#E4E8E8"/>
              <rect x="115" y="109" width="327" height="114" rx="10" fill="{muted}"/>
              <path d="M140 196l43-37 48 20 53-40 52 19 78-31" stroke="#FCFCFA" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="115" y="241" width="98" height="47" rx="7" fill="{paper}"/>
              <rect x="229" y="241" width="98" height="47" rx="7" fill="{paper}"/>
              <rect x="343" y="241" width="98" height="47" rx="7" fill="{paper}"/>
            </g>'''
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
          <defs>
            <linearGradient id="background" x2="1" y2="1"><stop stop-color="{paper}"/><stop offset="1" stop-color="{muted}"/></linearGradient>
            <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="{accent}" flood-opacity=".18"/></filter>
          </defs>
          <rect width="640" height="640" fill="url(#background)"/>
          <circle cx="535" cy="125" r="180" fill="white" opacity=".18"/>
          <circle cx="85" cy="510" r="170" fill="white" opacity=".12"/>
          <path d="M32 50h35M50 32v35M573 590h35M590 573v35" stroke="{accent}" stroke-opacity=".45"/>
          {artwork}
          <text x="32" y="606" font-family="monospace" font-size="11" letter-spacing="1.4" fill="#4C5960">PROJECT PLACEHOLDER / 0{index}</text>
        </svg>'''
        (destination / f"project-0{index}.svg").write_text(svg)


if __name__ == "__main__":
    generate_hero()
    generate_projects()
    print("Generated animated hero, reduced-motion poster, and four project placeholders.")
