import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ACHIEVEMENT_MAP,
  ALIGNMENTS,
  LIGHT_SEALS,
  NIGHT_SEALS,
  SEALS,
  SEAL_MAP,
  TOTAL_SEALS,
  clearState,
  deriveAchievements,
  emptyState,
  getNextRank,
  getRank,
  loadState,
  normalizeState,
  saveState,
} from './state'

const RitualContext = createContext(null)

function sameList(a, b) {
  if (a.length !== b.length) return false
  return a.every((item, i) => item === b[i])
}

export function RitualProvider({ children }) {
  const [state, setState] = useState(() => {
    const loaded = normalizeState(loadState())
    const achievements = deriveAchievements(loaded)
    if (!sameList(achievements, loaded.achievements)) {
      const next = { ...loaded, achievements }
      saveState(next)
      return next
    }
    return loaded
  })
  const stateRef = useRef(state)
  const [open, setOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const sequence = useRef(0)
  const removeTimers = useRef(new Map())
  const exitTimers = useRef(new Map())

  const clearToastTimers = useCallback(() => {
    removeTimers.current.forEach((timer) => window.clearTimeout(timer))
    exitTimers.current.forEach((timer) => window.clearTimeout(timer))
    removeTimers.current.clear()
    exitTimers.current.clear()
  }, [])

  useEffect(() => clearToastTimers, [clearToastTimers])

  const queueToast = useCallback((toast) => {
    sequence.current += 1
    const id = `${Date.now()}-${sequence.current}`
    setToasts((previous) => {
      const next = [...previous, { ...toast, id }]
      return next.length > 3 ? next.slice(next.length - 3) : next
    })

    const timer = window.setTimeout(() => {
      setToasts((previous) =>
        previous.map((item) => (item.id === id ? { ...item, leaving: true } : item)),
      )
      const exit = window.setTimeout(() => {
        setToasts((previous) => previous.filter((item) => item.id !== id))
        removeTimers.current.delete(id)
        exitTimers.current.delete(id)
      }, 320)
      exitTimers.current.set(id, exit)
    }, 5400)
    removeTimers.current.set(id, timer)
  }, [])

  const apply = useCallback(
    (mutate, options = {}) => {
      const previous = stateRef.current
      const draft = {
        ...previous,
        seals: [...previous.seals],
        achievements: [...previous.achievements],
      }
      mutate(draft)
      draft.achievements = deriveAchievements(draft)

      const unchanged =
        draft.entered === previous.entered &&
        draft.crypt === previous.crypt &&
        draft.alignment === previous.alignment &&
        sameList(draft.seals, previous.seals) &&
        sameList(draft.achievements, previous.achievements)

      if (unchanged) return null

      stateRef.current = draft
      setState(draft)
      saveState(draft)

      if (options.silent) return draft

      const newSeals = draft.seals.filter((id) => !previous.seals.includes(id))
      const newAchievements = draft.achievements.filter(
        (id) => !previous.achievements.includes(id),
      )
      const previousRank = getRank(previous.seals.length)
      const nextRank = getRank(draft.seals.length)
      const silentAchievements = new Set(options.silentAchievements || [])

      newSeals.forEach((id) => {
        queueToast({ key: 'seal', seal: id, tone: SEAL_MAP[id]?.side || 'gold' })
      })

      if (nextRank.min > previousRank.min) {
        queueToast({
          key: 'rank',
          rank: nextRank.id,
          tone: nextRank.id === 'erede' ? 'duo' : 'gold',
        })
      }

      newAchievements.forEach((id) => {
        if (id === 'patto') return
        if (silentAchievements.has(id)) return
        queueToast({
          key: 'achievement',
          achievement: id,
          tone: ACHIEVEMENT_MAP[id]?.tone || 'gold',
        })
      })

      if (newSeals.length && draft.seals.length === TOTAL_SEALS) {
        queueToast({ key: 'crypt', tone: 'duo' })
      }

      return draft
    },
    [queueToast],
  )

  const registerSeal = useCallback(
    (id) => {
      if (!SEAL_MAP[id]) return
      if (stateRef.current.seals.includes(id)) return
      apply((draft) => {
        if (!draft.seals.includes(id)) draft.seals.push(id)
      })
    },
    [apply],
  )

  const grant = useCallback(
    (id) => {
      if (!ACHIEVEMENT_MAP[id]) return
      if (stateRef.current.achievements.includes(id)) return
      apply((draft) => {
        if (!draft.achievements.includes(id)) draft.achievements.push(id)
      })
    },
    [apply],
  )

  const setAlignment = useCallback(
    (alignment) => {
      if (!ALIGNMENTS.includes(alignment)) return
      if (stateRef.current.alignment === alignment) return
      apply((draft) => {
        draft.alignment = alignment
      })
    },
    [apply],
  )

  const welcome = useCallback(() => {
    if (stateRef.current.entered) return
    apply(
      (draft) => {
        draft.entered = true
      },
      { silentAchievements: ['ospite'] },
    )
    queueToast({ key: 'welcome', tone: 'duo' })
  }, [apply, queueToast])

  const reset = useCallback(() => {
    clearState()
    clearToastTimers()
    const fresh = {
      ...emptyState(),
      entered: true,
      achievements: ['ospite'],
    }
    stateRef.current = fresh
    setState(fresh)
    saveState(fresh)
    setToasts([])
    queueToast({ key: 'reset', tone: 'night' })
  }, [clearToastTimers, queueToast])

  const notify = useCallback(
    (toast) => {
      queueToast(toast)
    },
    [queueToast],
  )

  /* ---- seal observer: every room lights its own mark ---- */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) registerSeal(entry.target.id)
        })
      },
      { threshold: 0.22, rootMargin: '0px 0px -6% 0px' },
    )

    SEALS.forEach((seal) => {
      const node = document.getElementById(seal.id)
      if (node) observer.observe(node)
    })

    return () => observer.disconnect()
  }, [registerSeal])

  /* ---- the crypt opens when the whole castle has been crossed ---- */
  useEffect(() => {
    if (!open) return
    if (stateRef.current.seals.length < TOTAL_SEALS) return
    if (stateRef.current.crypt) return
    apply((draft) => {
      draft.crypt = true
    })
  }, [open, apply, state.seals.length])

  /* ---- alignment is a property of the castle, not of a component ---- */
  useEffect(() => {
    document.documentElement.dataset.pact = state.alignment
  }, [state.alignment])

  useEffect(() => {
    document.documentElement.dataset.pactSeals = String(state.seals.length)
  }, [state.seals.length])

  useEffect(() => {
    document.documentElement.dataset.pactPanel = open ? 'open' : 'closed'
  }, [open])

  /* ---- external doors: footer, future components, keyboard-free entry ---- */
  useEffect(() => {
    const openPact = () => setOpen(true)
    const closePact = () => setOpen(false)
    window.addEventListener('sl:open-pact', openPact)
    window.addEventListener('sl:close-pact', closePact)
    return () => {
      window.removeEventListener('sl:open-pact', openPact)
      window.removeEventListener('sl:close-pact', closePact)
    }
  }, [])

  const sealSet = useMemo(() => new Set(state.seals), [state.seals])
  const achievedSet = useMemo(() => new Set(state.achievements), [state.achievements])
  const rank = useMemo(() => getRank(state.seals.length), [state.seals.length])
  const nextRank = useMemo(() => getNextRank(state.seals.length), [state.seals.length])
  const cryptUnlocked = state.seals.length === TOTAL_SEALS

  const value = useMemo(
    () => ({
      state,
      seals: state.seals,
      sealSet,
      achievements: state.achievements,
      achievedSet,
      alignment: state.alignment,
      rank,
      nextRank,
      open,
      setOpen,
      toasts,
      cryptUnlocked,
      nightTotal: NIGHT_SEALS.length,
      lightTotal: LIGHT_SEALS.length,
      registerSeal,
      grant,
      setAlignment,
      welcome,
      reset,
      notify,
    }),
    [
      state,
      sealSet,
      achievedSet,
      rank,
      nextRank,
      open,
      toasts,
      cryptUnlocked,
      registerSeal,
      grant,
      setAlignment,
      welcome,
      reset,
      notify,
    ],
  )

  return <RitualContext.Provider value={value}>{children}</RitualContext.Provider>
}

export function useRitual() {
  const context = useContext(RitualContext)
  if (!context) throw new Error('useRitual must be used inside RitualProvider')
  return context
}
