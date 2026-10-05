import { readFile, writeFile, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import { validateHeroSettings } from '../src/lib/heroArtworkSettings.js';

// This middleware exists only in the local Vite dev server. Production remains static.
export function heroSettingsPlugin(root) {
  const file = resolve(root, 'src/data/heroArtwork.json');
  return {
    name: 'portfolio-hero-settings',
    configureServer(server) {
      server.middlewares.use('/__portfolio/hero-settings', async (request, response) => {
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Cache-Control', 'no-store');
        const reply = (status, body) => {
          response.statusCode = status;
          response.end(JSON.stringify(body));
        };
        if (request.method === 'GET') {
          try { reply(200, JSON.parse(await readFile(file, 'utf8'))); }
          catch { reply(500, { error: 'Could not read the saved settings.' }); }
          return;
        }
        if (request.method !== 'POST') {
          response.setHeader('Allow', 'GET, POST');
          reply(405, { error: 'Method not allowed.' });
          return;
        }
        const host = request.headers.host;
        if (!/^(localhost|127\.0\.0\.1):\d+$/.test(host ?? '') || request.headers.origin !== `http://${host}`) {
          reply(403, { error: 'Save settings from the local preview.' });
          return;
        }
        if (request.headers['content-type']?.split(';')[0] !== 'application/json') {
          reply(415, { error: 'Settings must be JSON.' });
          return;
        }
        try {
          const chunks = [];
          let size = 0;
          for await (const chunk of request) {
            size += chunk.length;
            if (size > 4096) { reply(413, { error: 'Settings are too large.' }); return; }
            chunks.push(chunk);
          }
          const settings = validateHeroSettings(JSON.parse(Buffer.concat(chunks).toString('utf8')));
          const temporaryFile = `${file}.${Date.now()}.tmp`;
          await writeFile(temporaryFile, `${JSON.stringify(settings, null, 2)}\n`);
          await rename(temporaryFile, file);
          reply(200, { saved: true });
        } catch (error) {
          reply(400, { error: error instanceof SyntaxError ? 'Settings must be valid JSON.' : error.message });
        }
      });
    },
  };
}
