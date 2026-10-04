import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { projectRoutes } from './src/data/projectRoutes.js';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    rolldownOptions: {
      input: { home: resolve(import.meta.dirname, 'index.html'), ...Object.fromEntries(projectRoutes.map(project => [project.slug, resolve(import.meta.dirname, `projects/${project.slug}/index.html`)])) },
    },
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
