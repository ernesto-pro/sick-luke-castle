/* ============================================================
   BASE PATH — the site can live at the domain root or in a
   sub-folder (GitHub Pages project sites). Every public asset
   and every language route goes through here.
   ============================================================ */

export const BASE_URL = import.meta.env.BASE_URL || '/'

export function withBase(path) {
  const clean = String(path).replace(/^\/+/, '')
  return `${BASE_URL.replace(/\/+$/, '')}/${clean}`
}
