import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = fileURLToPath(new URL('./', import.meta.url))
const siteUrl = (process.env.VITE_SITE_URL || 'https://www.sickluke.com').replace(/\/+$/, '')
const isPreview = /\.github\.io$/i.test(new URL(siteUrl).hostname)

const seoFiles = () => ({
  name: 'seo-files',
  closeBundle() {
    const urls = [
      { loc: `${siteUrl}/`, priority: '1.0' },
      { loc: `${siteUrl}/en/`, priority: '0.9' },
    ]
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    ({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="it" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />
  </url>`,
  )
  .join('\n')}
</urlset>
`
    writeFileSync(resolve(root, 'dist/sitemap.xml'), sitemap)
    writeFileSync(
      resolve(root, 'dist/robots.txt'),
      isPreview
        ? 'User-agent: *\nDisallow: /\n'
        : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
    )
  },
})

export default defineConfig({
  // GitHub Pages project sites are served from /<repo>/, the official
  // domain from the root: BASE_PATH flips it at build time.
  base: process.env.BASE_PATH || '/',
  plugins: [react(), seoFiles()],
  build: {
    rollupOptions: {
      input: {
        it: resolve(root, 'index.html'),
        en: resolve(root, 'en/index.html'),
      },
    },
  },
})
