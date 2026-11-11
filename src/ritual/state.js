/* ============================================================
   IL PATTO — state model
   Seven seals. Eleven trials. One mark.
   ============================================================ */

export const STORAGE_KEY = 'sl-pact-v1'
export const TOTAL_SEALS = 7
export const TOTAL_TRIALS = 11

export const SEALS = [
  { id: 'conte', index: '01', side: 'night' },
  { id: 'opere', index: '02', side: 'night' },
  { id: 'ascolto', index: '03', side: 'light' },
  { id: 'corte', index: '04', side: 'night' },
  { id: 'farfastrelli', index: '05', side: 'light' },
  { id: 'visioni', index: '06', side: 'light' },
  { id: 'invito', index: '07', side: 'light' },
]

export const NIGHT_SEALS = SEALS.filter((seal) => seal.side === 'night')
export const LIGHT_SEALS = SEALS.filter((seal) => seal.side === 'light')
export const SEAL_MAP = Object.fromEntries(SEALS.map((seal) => [seal.id, seal]))

export const ACHIEVEMENTS = [
  { id: 'ospite', tone: 'gold' },
  { id: 'battito', tone: 'gold' },
  { id: 'occhio', tone: 'gold' },
  { id: 'ali', tone: 'gold' },
  { id: 'grimorio', tone: 'gold' },
  { id: 'eco', tone: 'gold' },
  { id: 'lingua', tone: 'gold' },
  { id: 'notte', tone: 'night' },
  { id: 'luce', tone: 'light' },
  { id: 'patto', tone: 'duo' },
  { id: 'cripta', tone: 'gold' },
]

export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENTS.map((achievement) => [achievement.id, achievement]),
)

export const RANKS = [
  { id: 'ospite', min: 0 },
  { id: 'pellegrino', min: 1 },
  { id: 'iniziato', min: 3 },
  { id: 'cavaliere', min: 5 },
  { id: 'custode', min: 6 },
  { id: 'erede', min: 7 },
]

export const ALIGNMENTS = ['equilibrio', 'notte', 'luce']

export function emptyState() {
  return {
    v: 1,
    entered: false,
    seals: [],
    achievements: [],
    alignment: 'equilibrio',
    crypt: false,
  }
}

export function getRank(count = 0) {
  let rank = RANKS[0]
  RANKS.forEach((item) => {
    if (count >= item.min) rank = item
  })
  return rank
}

export function getNextRank(count = 0) {
  return RANKS.find((item) => item.min > count) || null
}

export function deriveAchievements(state) {
  const set = new Set(state.achievements)
  const seals = new Set(state.seals)

  if (state.entered) set.add('ospite')
  if (NIGHT_SEALS.every((seal) => seals.has(seal.id))) set.add('notte')
  if (LIGHT_SEALS.every((seal) => seals.has(seal.id))) set.add('luce')
  if (SEALS.every((seal) => seals.has(seal.id))) set.add('patto')
  if (state.crypt) set.add('cripta')

  return ACHIEVEMENTS.filter((achievement) => set.has(achievement.id)).map(
    (achievement) => achievement.id,
  )
}

export function normalizeState(raw) {
  if (!raw || typeof raw !== 'object') return emptyState()

  const seals = Array.isArray(raw.seals)
    ? [...new Set(raw.seals.filter((id) => SEAL_MAP[id]))]
    : []
  const achievements = Array.isArray(raw.achievements)
    ? [...new Set(raw.achievements.filter((id) => ACHIEVEMENT_MAP[id]))]
    : []

  return {
    v: 1,
    entered: Boolean(raw.entered),
    seals,
    achievements,
    alignment: ALIGNMENTS.includes(raw.alignment) ? raw.alignment : 'equilibrio',
    crypt: Boolean(raw.crypt),
  }
}

export function loadState() {
  if (typeof window === 'undefined') return emptyState()
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return emptyState()
    return normalizeState(JSON.parse(stored))
  } catch {
    return emptyState()
  }
}

export function saveState(state) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage can be unavailable: the pact still lives for this session */
  }
}

export function clearState() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* noop */
  }
}
