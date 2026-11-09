import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const archive = new URL('../Assets/figma files/video-v6-2026-11-08/', import.meta.url);
const output = new URL('../public/assets/video-figma/', import.meta.url);
const json = async file => JSON.parse(await readFile(new URL(file, archive), 'utf8'));
const design = await json('design-inspection.json');
const typography = await json('text-inspection.json');
const geometry = await json('geometry.json');
const files = ['obayashi-culture.png', 'aapi-multimedia.png', 'cultured-pickle-shop.png', 'food-cooperatives.png', 'claire-mack.png', 'colette-crutcher.png', 'castro-street.png', 'wasabi.png', 'broadcast-card-mask.svg', 'play-button.svg'];
await mkdir(output, { recursive: true });
const assets = [];
for (const file of files) {
  const source = new URL(`source-assets/${file}`, archive);
  const bytes = await readFile(source);
  const root = file.endsWith('.svg') ? bytes.toString('utf8').match(/<svg\b[^>]*>/)?.[0] : null;
  const dimension = name => Number(root.match(new RegExp(`\\b${name}="([\\d.]+)"`))?.[1]);
  const width = root ? dimension('width') : bytes.readUInt32BE(16);
  const height = root ? dimension('height') : bytes.readUInt32BE(20);
  if (!width || !height || !bytes.length) throw new Error(`Invalid source asset: ${file}`);
  await copyFile(source, new URL(file, output));
  assets.push({ file, width, height, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}

const g = id => {
  const node = geometry.nodes.find(n => n.id === id);
  if (!node) throw new Error(`Missing geometry: ${id}`);
  return node;
};
const text = id => {
  const node = typography.nodes.find(n => n.id === id);
  if (!node) throw new Error(`Missing text: ${id}`);
  return { id, text: node.characters.replace(/\u2028/g, '\n').trim() };
};
const href = id => {
  const node = design.nodes.find(n => n.id === id);
  const action = node?.reactions?.flatMap(r => r.actions ?? []).find(a => a.type === 'URL');
  if (!action?.url || !action.openInNewTab) throw new Error(`Missing new-tab URL action: ${id}`);
  return action.url;
};
const feature = ({ key, headingId, bodyId, ctaId, labelId, imageId, titleId, playId, file }) => {
  const image = g(imageId), title = g(titleId), play = g(playId), button = g(ctaId), label = g(labelId);
  return {
    key, heading: text(headingId), body: { ...text(bodyId), width: g(bodyId).width },
    href: href(ctaId), prototypeId: ctaId,
    button: { id: ctaId, label: text(labelId), width: button.width, height: button.height, labelWidth: label.width, gap: button.y - g(bodyId).y - g(bodyId).height },
    image: { id: imageId, file, width: image.width, height: image.height },
    title: { ...text(titleId), width: title.width, minHeight: title.height, left: title.x - image.x, gap: title.y - image.y - image.height },
    play: { id: playId, x: play.x - image.x, y: play.y - image.y, width: play.width, height: play.height },
  };
};
const features = [
  feature({ key: 'corporate', headingId: '610:34', bodyId: '610:33', ctaId: '612:124', labelId: '612:122', imageId: '612:50', titleId: '619:38', playId: '612:128', file: 'obayashi-culture.png' }),
  feature({ key: 'multimedia', headingId: '610:26', bodyId: '610:25', ctaId: '612:123', labelId: '610:28', imageId: '619:15', titleId: '619:36', playId: '619:16', file: 'aapi-multimedia.png' }),
];
const storySpecs = [
  ['pickle', '612:107', '609:174', '609:190', '609:191', '609:192', 'cultured-pickle-shop.png'],
  ['cooperatives', '612:103', '609:173', '609:193', '609:194', '609:195', 'food-cooperatives.png'],
  ['claire', '612:102', '610:19', '612:58', '612:59', '612:60', 'claire-mack.png'],
  ['colette', '612:108', '610:22', '612:85', '612:86', '612:87', 'colette-crutcher.png'],
  ['castro', '612:109', '610:20', '612:81', '612:82', '612:83', 'castro-street.png'],
  ['wasabi', '612:110', '610:24', '612:77', '612:78', '612:79', 'wasabi.png'],
];
const stories = storySpecs.map(([key, id, imageId, backgroundId, titleId, publicationId, file], index) => {
  const card = g(id), image = g(imageId), background = g(backgroundId), title = g(titleId), publication = g(publicationId);
  const imageHeight = background.y - card.y;
  return {
    key, id, href: href(id), shift: card.x - [120, 530, 940][index % 3],
    image: { id: imageId, file, x: image.x - card.x, y: image.y - card.y, width: image.width, height: image.height, visibleHeight: imageHeight, background: key === 'claire' ? '#000' : 'transparent' },
    title: { ...text(titleId), width: title.width }, publication: { ...text(publicationId), width: publication.width, height: publication.height },
    background: { id: backgroundId, x: background.x - card.x, width: background.width, height: background.height },
    caption: { minHeight: card.height - imageHeight, left: title.x - card.x, top: publication.y - background.y, publicationShift: publication.x - title.x, titleGap: title.y - publication.y - publication.height },
  };
});
const rules = ['619:140', '619:141'].map(id => {
  const node = design.nodes.find(n => n.id === id);
  return { id, width: g(id).width, offset: g(id).x - 120, strokeWeight: node.strokeWeight };
});
const content = { fileKey: 'wZSRbIZZXfUlrq902OXE2W', frameId: '609:115', frameHeight: geometry.height, label: text('609:118'), features, broadcast: { heading: text('609:117'), description: text('609:116'), stories }, rules };
await writeFile(new URL('manifest.json', output), `${JSON.stringify({ fileKey: content.fileKey, frameId: content.frameId, inspectedDate: '2026-11-08', assets }, null, 2)}\n`);
await writeFile(new URL('content.json', output), `${JSON.stringify(content, null, 2)}\n`);
console.log(`Imported ${assets.length} unchanged Video assets, two featured previews, and ${stories.length} broadcast stories.`);
