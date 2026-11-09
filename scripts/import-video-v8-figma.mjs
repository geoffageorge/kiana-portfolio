import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const archive = new URL('../Assets/figma files/video-v8-2026-11-09/', import.meta.url);
const output = new URL('../public/assets/video-v8-figma/', import.meta.url);
const json = async file => JSON.parse(await readFile(new URL(file, archive), 'utf8'));
const design = await json('design-inspection.json');
const typography = await json('text-inspection.json');
const geometry = await json('geometry.json');
const files = ['obayashi-culture.png', 'aapi-multimedia.png', 'cultured-pickle-shop.png', 'food-cooperatives.png', 'claire-mack.png', 'colette-crutcher.png', 'castro-street.png', 'wasabi.png', 'broadcast-card-mask.svg', 'colette-card-mask.svg', 'wasabi-caption.svg', 'play-button.svg'];
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
  feature({ key: 'corporate', headingId: '657:10', bodyId: '657:8', ctaId: '657:16', labelId: '657:18', imageId: '657:39', titleId: '657:87', playId: '666:15', file: 'obayashi-culture.png' }),
  feature({ key: 'multimedia', headingId: '657:11', bodyId: '657:9', ctaId: '657:13', labelId: '657:15', imageId: '657:82', titleId: '657:86', playId: '666:12', file: 'aapi-multimedia.png' }),
];
const storySpecs = [
  ['pickle', '657:21', '657:26', '657:27', '657:28', '657:29', 'cultured-pickle-shop.png', '666:26'],
  ['cooperatives', '657:30', '657:35', '657:36', '657:37', '657:38', 'food-cooperatives.png', '666:29'],
  ['claire', '657:40', '657:45', '657:47', '657:48', '657:49', 'claire-mack.png', '666:9'],
  ['colette', '657:67', '657:71', '657:73', '657:74', '657:75', 'colette-crutcher.png', '663:23'],
  ['castro', '657:58', '657:62', '657:64', '657:65', '657:66', 'castro-street.png', '663:17'],
  ['wasabi', '657:50', '657:53', '657:55', '657:56', '657:57', 'wasabi.png', '663:20'],
];
const stories = storySpecs.map(([key, id, imageId, backgroundId, titleId, publicationId, file, playId], index) => {
  const card = g(id), image = g(imageId), background = g(backgroundId), title = g(titleId), publication = g(publicationId), play = g(playId);
  const imageHeight = background.y - card.y;
  return {
    key, id, href: href(id), mask: key === 'colette' ? 'colette-card-mask.svg' : 'broadcast-card-mask.svg', play: { id: playId, x: play.x - card.x, y: play.y - card.y, width: play.width, height: play.height }, shift: card.x - [120, 530, 940][index % 3],
    image: { id: imageId, file, x: image.x - card.x, y: image.y - card.y, width: image.width, height: image.height, visibleHeight: imageHeight, background: 'transparent' },
    title: { ...text(titleId), width: title.width }, publication: { ...text(publicationId), width: publication.width, height: publication.height },
    background: { id: backgroundId, file: key === 'wasabi' ? 'wasabi-caption.svg' : null, x: background.x - card.x, width: background.width, height: background.height },
    caption: { minHeight: card.height - imageHeight, left: title.x - card.x, top: publication.y - background.y, publicationShift: publication.x - title.x, titleGap: title.y - publication.y - publication.height },
  };
});
const rules = ['657:107', '657:108'].map(id => {
  const node = design.nodes.find(n => n.id === id);
  return { id, width: g(id).width, offset: g(id).x - 120, strokeWeight: node.strokeWeight };
});
const content = { fileKey: 'wZSRbIZZXfUlrq902OXE2W', frameId: '657:7', frameHeight: geometry.height, label: text('657:12'), features, broadcast: { heading: text('657:20'), description: text('657:19'), stories }, rules };
await writeFile(new URL('manifest.json', output), `${JSON.stringify({ fileKey: content.fileKey, frameId: content.frameId, inspectedDate: '2026-11-09', assets }, null, 2)}\n`);
await writeFile(new URL('content.json', output), `${JSON.stringify(content, null, 2)}\n`);
console.log(`Imported ${assets.length} unchanged Video assets, two featured previews, and ${stories.length} broadcast stories.`);
