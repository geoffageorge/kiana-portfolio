import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const source = new URL('../Assets/figma files/journalism-v5-2026-11-08/source-assets/', import.meta.url);
const output = new URL('../public/assets/journalism-figma/', import.meta.url);
const files = ['food-culture.png', 'sumo-wrestling.png', 'food-allergies.png', 'monk-thailand.png', 'feature-card-mask.svg', 'short-card-mask.svg', 'food-allergies-image-mask.svg', 'monk-image-mask.svg'];
await mkdir(output, { recursive: true });
const assets = [];
for (const file of files) {
  const bytes = await readFile(new URL(file, source));
  const root = file.endsWith('.svg') ? bytes.toString('utf8').match(/<svg\b[^>]*>/)?.[0] : null;
  const dimension = name => Number(root.match(new RegExp(`\\b${name}="([\\d.]+)"`))?.[1]);
  const width = root ? dimension('width') : bytes.readUInt32BE(16);
  const height = root ? dimension('height') : bytes.readUInt32BE(20);
  if (!width || !height || !bytes.length) throw new Error(`Invalid source asset: ${file}`);
  await copyFile(new URL(file, source), new URL(file, output));
  assets.push({ file, width, height, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
await writeFile(new URL('manifest.json', output), `${JSON.stringify({ fileKey: 'wZSRbIZZXfUlrq902OXE2W', frameId: '607:7', inspectedDate: '2026-11-08', assets }, null, 2)}\n`);
console.log(`Imported ${assets.length} original Journalism assets without modification.`);
