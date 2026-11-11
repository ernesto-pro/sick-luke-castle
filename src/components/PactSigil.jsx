import { TOTAL_SEALS, TOTAL_TRIALS } from '../ritual/state'

import { X2_PATHS } from './X2Mark'
import { SEALS } from '../ritual/state'

const PALETTES = {
  equilibrio: {
    blood: '#d31432',
    bloodSoft: 'rgba(211,20,50,0.55)',
    gold: '#c9a24a',
    goldSoft: 'rgba(201,162,74,0.5)',
    bone: '#ece5d8',
    dim: '#8b8377',
    bg: '#07060a',
  },
  notte: {
    blood: '#ff3355',
    bloodSoft: 'rgba(255,51,85,0.55)',
    gold: '#c9a24a',
    goldSoft: 'rgba(201,162,74,0.42)',
    bone: '#ece5d8',
    dim: '#8b8377',
    bg: '#07060a',
  },
  luce: {
    blood: '#c9a24a',
    bloodSoft: 'rgba(201,162,74,0.55)',
    gold: '#efd58c',
    goldSoft: 'rgba(239,213,140,0.55)',
    bone: '#f2ead9',
    dim: '#a89b7d',
    bg: '#08070b',
  },
}

const escapeXml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

function sealMarks(sealIds, palette) {
  const lit = new Set(sealIds)
  const cx = 180
  const cy = 185
  const radius = 116

  return SEALS.map((seal, index) => {
    const angle = (index / SEALS.length) * Math.PI * 2 - Math.PI / 2
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    const on = lit.has(seal.id)
    return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)})">
      <rect x="-4.6" y="-4.6" width="9.2" height="9.2" transform="rotate(45)" fill="${
        on ? palette.gold : 'none'
      }" stroke="${on ? palette.gold : palette.dim}" stroke-width="${on ? 0 : 0.7}" opacity="${
        on ? 1 : 0.45
      }"/>
      <text x="0" y="19" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="5.2" letter-spacing="1.2" fill="${
        on ? palette.gold : palette.dim
      }" opacity="${on ? 0.9 : 0.4}">${seal.index}</text>
    </g>`
  }).join('')
}

export function buildPactSigilSvg({
  alignment = 'equilibrio',
  rankName = '',
  rankNote = '',
  sealIds = [],
  sealCount = 0,
  trialCount = 0,
  date = '',
  labels = {},
}) {
  const palette = PALETTES[alignment] || PALETTES.equilibrio
  const title = escapeXml(labels.title || 'IL PATTO')
  const brand = escapeXml(labels.brand || 'SICK LUKE')
  const degree = escapeXml(labels.degree || 'SETTE SIGILLI · UNDICI PROVE')
  const rank = escapeXml(rankName)
  const note = escapeXml(rankNote)
  const forged = escapeXml(`${labels.forged || 'FORGIATO'} ${date}`)
  const motto = escapeXml(labels.motto || '')
  const alignmentName = escapeXml(labels.alignValues?.[alignment] || alignment)
  const alignmentLabel = escapeXml(labels.alignment || 'ALLEANZA')
  const sealsLabel = escapeXml(labels.seals || 'SIGILLI')
  const trialsLabel = escapeXml(labels.trials || 'PROVE')
  const ariaLabel = escapeXml(`${brand} — ${title} — ${rankName}`)

  const marks = sealMarks(sealIds, palette)
  const markTransform = 'translate(180 185) scale(2.3) translate(-32 -32)'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 480" width="360" height="480" role="img" aria-label="${ariaLabel}">
  <defs>
    <radialGradient id="sigilAura" cx="50%" cy="38%" r="58%">
      <stop offset="0" stop-color="${palette.blood}" stop-opacity="0.16"/>
      <stop offset="0.55" stop-color="${palette.gold}" stop-opacity="0.05"/>
      <stop offset="1" stop-color="${palette.bg}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sigilHairline" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.gold}" stop-opacity="0.05"/>
      <stop offset="0.5" stop-color="${palette.gold}" stop-opacity="0.75"/>
      <stop offset="1" stop-color="${palette.blood}" stop-opacity="0.35"/>
    </linearGradient>
    <filter id="sigilGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="3.2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="360" height="480" fill="${palette.bg}"/>
  <rect width="360" height="480" fill="url(#sigilAura)"/>
  <rect x="14.5" y="14.5" width="331" height="451" fill="none" stroke="url(#sigilHairline)" stroke-width="1"/>
  <rect x="20.5" y="20.5" width="319" height="439" fill="none" stroke="${palette.gold}" stroke-opacity="0.16" stroke-width="0.6"/>

  <g fill="${palette.gold}" opacity="0.85">
    <path d="M14.5 36V14.5H36L25 25Z"/>
    <path d="M345.5 36V14.5H324L335 25Z"/>
    <path d="M14.5 444V465.5H36L25 455Z"/>
    <path d="M345.5 444V465.5H324L335 455Z"/>
  </g>

  <text x="180" y="52" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="6.4" letter-spacing="4.6" fill="${palette.dim}">${brand}</text>
  <text x="180" y="83" text-anchor="middle" font-family="'Bodoni Moda', Georgia, serif" font-size="27" letter-spacing="1.6" fill="${palette.bone}">${title}</text>
  <text x="180" y="98" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="5.4" letter-spacing="2.4" fill="${palette.gold}">${degree}</text>
  <path d="M78 110H282" stroke="${palette.gold}" stroke-opacity="0.32" stroke-width="0.7"/>

  <circle cx="180" cy="185" r="132" fill="none" stroke="${palette.gold}" stroke-opacity="0.14" stroke-width="0.7" stroke-dasharray="1 5"/>
  <circle cx="180" cy="185" r="104" fill="none" stroke="${palette.blood}" stroke-opacity="0.34" stroke-width="0.9"/>
  <circle cx="180" cy="185" r="98" fill="none" stroke="${palette.gold}" stroke-opacity="0.16" stroke-width="0.7"/>
  ${marks}

  <g transform="${markTransform}" fill="none" stroke-linecap="square" stroke-linejoin="miter" filter="url(#sigilGlow)">
    <rect x="1.8" y="1.8" width="60.4" height="60.4" stroke="${palette.gold}" stroke-opacity="0.32" stroke-width="0.7"/>
    <path d="${X2_PATHS.x}" stroke="${palette.blood}" stroke-width="4.4"/>
    <path d="${X2_PATHS.two}" stroke="${palette.gold}" stroke-width="4.4"/>
  </g>

  <text x="180" y="327" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="5.6" letter-spacing="3" fill="${palette.dim}">${escapeXml(labels.rank || 'RANGO')}</text>
  <text x="180" y="357" text-anchor="middle" font-family="'Bodoni Moda', Georgia, serif" font-size="31" letter-spacing="0.6" fill="${palette.bone}">${rank}</text>
  <text x="180" y="374" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="6" letter-spacing="1.4" fill="${palette.dim}">${note}</text>
  <path d="M104 387H256" stroke="${palette.gold}" stroke-opacity="0.2" stroke-width="0.7"/>

  <text x="180" y="405" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="6.6" letter-spacing="1.6" fill="${palette.gold}">${String(sealCount).padStart(2, '0')}/${String(TOTAL_SEALS).padStart(2, '0')} ${sealsLabel} · ${String(trialCount).padStart(2, '0')}/${String(TOTAL_TRIALS).padStart(2, '0')} ${trialsLabel}</text>
  <text x="180" y="421" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="5.8" letter-spacing="2" fill="${palette.dim}">${alignmentLabel} · ${alignmentName}</text>
  <text x="180" y="437" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="5.4" letter-spacing="1.2" fill="${palette.dim}">${forged}</text>
  <text x="180" y="459" text-anchor="middle" font-family="'Bodoni Moda', Georgia, serif" font-style="italic" font-size="10.5" fill="${palette.bone}" opacity="0.78">${motto}</text>
</svg>`
}

export function PactSigil({ className = '', ...props }) {
  return (
    <span
      className={`pact-sigil ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: buildPactSigilSvg(props) }}
    />
  )
}

export function downloadPactSigil(props) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n${buildPactSigilSvg(props)}`
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = props.filename || 'sick-luke-il-patto.svg'
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1800)
}
