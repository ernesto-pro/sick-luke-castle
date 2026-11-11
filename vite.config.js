import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = fileURLToPath(new URL('./', import.meta.url))

export default defineConfig({
  // GitHub Pages project sites are served from /<repo>/, the official
  // domain from the root: BASE_PATH flips it at build time.
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        it: resolve(root, 'index.html'),
        en: resolve(root, 'en/index.html'),
      },
    },
  },
})
