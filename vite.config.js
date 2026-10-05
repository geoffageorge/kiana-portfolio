import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { projectRoutes } from './src/data/projectRoutes.js';
import { heroSettingsPlugin } from './scripts/hero-settings-plugin.mjs';

export default defineConfig({
  plugins: [react(), tailwindcss(), heroSettingsPlugin(import.meta.dirname)],
  base: './',
  build: {
    rolldownOptions: {
      input: { home: resolve(import.meta.dirname, 'index.html'), ...Object.fromEntries(projectRoutes.map(project => [project.slug, resolve(import.meta.dirname, `projects/${project.slug}/index.html`)])) },
    },
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
