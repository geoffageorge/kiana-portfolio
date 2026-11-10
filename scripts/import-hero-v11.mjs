import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const source = new URL('../Assets/Hero 3/', import.meta.url);
const output = new URL('../public/assets/hero-v11/', import.meta.url);
const names = ['README.txt', 'animation.html', 'embed.html', 'component.html', 'animation.css', 'animation.js'];
const sha = data => createHash('sha256').update(data).digest('hex');
const originals = Object.fromEntries(await Promise.all(names.map(async name => [name, await readFile(new URL(name, source))])));
const html = originals['animation.html'].toString('utf8');
const css = originals['animation.css'].toString('utf8').trim();
const js = originals['animation.js'].toString('utf8').trim();
const component = originals['component.html'].toString('utf8').trim();
for (const name of ['animation.html', 'embed.html']) {
  const complete = originals[name].toString('utf8');
  if (!complete.includes(css) || !complete.includes(js) || !complete.includes(component)) throw new Error(`Review inconsistent source variants: ${name}`);
}
const button = /<button\b[^>]*class="replay"[^>]*>[\s\S]*?<\/button>/g;
const binding = "root.querySelector('button').addEventListener('click',play);";
if ([...html.matchAll(button)].length !== 1 || html.split(binding).length !== 2) throw new Error('Review the changed source before removing its Replay control.');
const resizeAnchor = "if(matchMedia('(prefers-reduced-motion: reduce)').matches)";
if (html.split(resizeAnchor).length !== 2) throw new Error('Review the changed source before adapting its resize handling.');
// The fluid fallback uses the same 62px cap and width/14.3 sizing as draw().
const responsiveStyle = '<style data-integration="hero-v11">#kg-expanding-circles h1{font-size:min(62px,6.993006993vw)}</style>';
const resizeBinding = "window.addEventListener('resize',()=>{cancelAnimationFrame(raf);draw(performance.now())});\n";
const runtime = html.replace(button, '').replace(binding, '')
  .replace('</head>', `${responsiveStyle}</head>`)
  .replace(resizeAnchor, `${resizeBinding}${resizeAnchor}`);
if (/<button\b/i.test(runtime)) throw new Error('The hero must have no playback controls.');
await mkdir(output, { recursive: true });
await writeFile(new URL('animation.html', output), runtime);
await writeFile(new URL('manifest.json', output), `${JSON.stringify({
  importedDate: '2026-11-10', sourceFolder: 'Assets/Hero 3', componentId: 'kg-expanding-circles',
  sourceFiles: names.map(name => ({ file: name, bytes: originals[name].length, sha256: sha(originals[name]) })),
  runtime: { file: 'animation.html', bytes: Buffer.byteLength(runtime), sha256: sha(runtime) },
  adaptations: [
    'Remove the Replay button and its event binding to meet the no-controls requirement.',
    'Use the source draw() font-sizing formula for the no-JavaScript fallback.',
    'Redraw the current state on resize without restarting the sequence or duplicating animation frames.',
  ],
  sceneHeight: { desktop: 560, phone: 460, phoneMaxWidth: 480 },
}, null, 2)}\n`);
console.log('Imported Hero 3 with its original animation and no playback controls.');
