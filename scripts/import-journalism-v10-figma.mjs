import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { journalism } from '../src/data/journalism.js';

const archive = new URL('../Assets/figma files/journalism-v10-2026-11-09/', import.meta.url);
const output = new URL('../public/assets/journalism-v10-figma/', import.meta.url);
const json = async name => JSON.parse(await readFile(new URL(name, archive), 'utf8'));
const design = await json('design-inspection.json');
const typography = await json('text-inspection.json');
const geometry = await json('geometry.json');
const reuse = await json('asset-reuse.json');
const g = id => { const n = geometry.nodes.find(n => n.id === id); if (!n) throw Error(`Missing geometry ${id}`); return n; };
const text = id => { const n = typography.nodes.find(n => n.id === id); if (!n) throw Error(`Missing text ${id}`); return { id, text: n.characters.replace(/\u2028/g, '\n').trim() }; };
const href = id => {
  const action = design.nodes.find(n => n.id === id)?.reactions?.flatMap(r => r.actions ?? []).find(a => a.type === 'URL');
  if (!action?.url || !action.openInNewTab) throw Error(`Missing external new-tab action ${id}`);
  return action.url;
};
await mkdir(output, { recursive: true });
const assets = [];
for (const item of reuse.assets.filter(a => a.runtimePath)) {
  const source = new URL(`../${item.sourcePath}`, import.meta.url);
  const bytes = await readFile(source);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== item.sha256) throw Error(`Changed export ${item.file}`);
  if (item.exactReuse) {
    const existing = await readFile(new URL(`../public/${item.runtimePath}`, import.meta.url));
    if (createHash('sha256').update(existing).digest('hex') !== sha256) throw Error(`Changed reused asset ${item.file}`);
  } else await copyFile(source, new URL(item.file, output));
  const root = item.file.endsWith('.svg') ? bytes.toString('utf8').match(/<svg\b[^>]*>/)?.[0] : null;
  const dimension = key => Number(root.match(new RegExp(`\\b${key}="([\\d.]+)"`))?.[1]);
  assets.push({ file: item.file, path: item.runtimePath, sourcePath: item.sourcePath, bytes: bytes.length, sha256,
    width: root ? dimension('width') : bytes.readUInt32BE(16), height: root ? dimension('height') : bytes.readUInt32BE(20), reused: item.exactReuse });
}
// The four existing written-card configurations are unchanged relative to their masks.
for (const feature of journalism.features) {
  if (text(feature.titleNodeId).text !== feature.title || text(feature.publicationNodeId).text !== feature.publication || href(feature.nodeId) !== feature.href) throw Error(`Review changed written card ${feature.id}`);
}
const multimedia = {
  key: 'journalism-multimedia', heading: text('689:8'), body: { ...text('689:7'), width: g('689:7').width },
  href: href('689:9'), prototypeId: '689:9', button: { id: '689:9', label: text('689:11'), width: g('689:9').width, height: g('689:9').height, labelWidth: g('689:11').width, gap: g('689:9').y - g('689:7').y - g('689:7').height },
  image: { id: '689:68', file: 'aapi-multimedia.png', width: g('689:68').width, height: g('689:68').height },
  title: { ...text('689:90'), width: g('689:90').width, minHeight: g('689:90').height, left: 0, gap: g('689:90').y - g('689:68').y - g('689:68').height },
  play: { id: '689:87', x: g('689:87').x - g('689:68').x, y: g('689:87').y - g('689:68').y, width: g('689:87').width, height: g('689:87').height },
};
const specs = [
  ['pickle','689:14','689:18','689:19','689:20','689:21','cultured-pickle-shop.png','689:84'],
  ['cooperatives','689:22','689:27','689:28','689:29','689:30','food-cooperatives.png','689:81'],
  ['claire','689:31','689:35','689:37','689:38','689:39','claire-mack.png','689:78'],
  ['colette','689:56','689:60','689:62','689:63','689:64','colette-crutcher.png','689:72'],
  ['castro','689:47','689:51','689:53','689:54','689:55','castro-street.png','689:69'],
  ['wasabi','689:40','689:43','689:44','689:45','689:46','wasabi.png','689:75'],
];
const stories = specs.map(([key,id,imageId,backgroundId,titleId,publicationId,file,playId],index) => {
  const card=g(id),image=g(imageId),background=g(backgroundId),title=g(titleId),publication=g(publicationId),play=g(playId);
  const visibleHeight=background.y-card.y;
  return { key,id,href:href(id),mask:key==='colette'?'colette-card-mask.svg':'broadcast-card-mask.svg',shift:card.x-[120,530,940][index%3],
    image:{id:imageId,file,x:image.x-card.x,y:image.y-card.y,width:image.width,height:image.height,visibleHeight,background:'transparent'},
    title:{...text(titleId),width:title.width},publication:{...text(publicationId),width:publication.width,height:publication.height},
    play:{id:playId,x:play.x-card.x,y:play.y-card.y,width:play.width,height:play.height},
    background:{id:backgroundId,file:key==='wasabi'?'wasabi-caption.svg':null,x:background.x-card.x,width:background.width,height:background.height},
    caption:{minHeight:card.height-visibleHeight,left:title.x-card.x,top:publication.y-background.y,publicationShift:publication.x-title.x,titleGap:title.y-publication.y-publication.height},
  };
});
const rules=['689:97','689:91'].map(id=>({id,offset:g(id).x-120,width:g(id).width,strokeWeight:design.nodes.find(n=>n.id===id).strokeWeight}));
const content={frameId:'607:7',frameHeight:geometry.height,label:text('689:117'),written:{heading:text('607:16'),description:text('607:14')},multimedia,broadcast:{heading:text('689:13'),description:text('689:12'),stories},rules};
await writeFile(new URL('content.json',output),JSON.stringify(content,null,2)+'\n');
await writeFile(new URL('manifest.json',output),JSON.stringify({frameId:'607:7',inspectedDate:'2026-11-09',assets},null,2)+'\n');
console.log(`Prepared Journalism 2: four written articles, one multimedia feature, six broadcast stories; ${assets.filter(a=>a.reused).length} exact asset reuses.`);
