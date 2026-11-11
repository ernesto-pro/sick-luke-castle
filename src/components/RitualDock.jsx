import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { useEscape, useFocusTrap, useLockBody, usePrefersReducedMotion } from '../lib/hooks'
import { useRitual } from '../ritual'
import { ACHIEVEMENTS, SEALS, TOTAL_SEALS, TOTAL_TRIALS } from '../ritual/state'
import { PactSigil, downloadPactSigil } from './PactSigil'
import X2Mark from './X2Mark'

const GLYPHS = {
  ospite: (
    <>
      <path d="M5 20V10l7-6 7 6v10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  battito: <path d="M2 12h3.5l1.8-6 3.4 12 2-6H22" />,
  occhio: (
    <>
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  ali: (
    <>
      <path d="M12 12C9 7 4 5 1 7c2 2 3 5 2 8 2-1 4 0 5 2 2-2 3-2 4 0" />
      <path d="M12 12c3-5 8-7 11-5-2 2-3 5-2 8-2-1-4 0-5 2-2-2-3-2-4 0" />
    </>
  ),
  grimorio: (
    <>
      <path d="M4 4h9a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3Z" />
      <path d="M4 17h12M8 8h5M8 11h5" />
    </>
  ),
  sigillo: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 8 8 8M16 8l-8 8" />
    </>
  ),
  eco: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9Z" />
      <path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" />
    </>
  ),
  lingua: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9Z" />
    </>
  ),
  notte: <path d="M20 15A9 9 0 0 1 9 4a8 8 0 1 0 11 11Z" />,
  luce: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </>
  ),
  patto: (
    <>
      <path d="M12 11C9 7 5 5 2 6c2 2 2 4 1 7 2-1 3 0 4 2 1-1 3-1 5 0" />
      <path d="M12 11c3-4 7-6 10-5-2 2-2 4-1 7-2-1-3 0-4 2-1-1-3-1-5 0" />
      <path d="M12 8l3 3-3 3-3-3Z" />
    </>
  ),
  cripta: (
    <>
      <path d="M5 21V9l7-6 7 6v12" />
      <rect x="10" y="13" width="4" height="6" />
      <path d="M12 13v2" />
    </>
  ),
  check: <path d="m4 12 5 5 11-11" />,
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="1" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
}

export function PactGlyph({ id, className = '' }) {
  return (
    <svg
      className={`pact-glyph ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[id] || GLYPHS.ospite}
    </svg>
  )
}

function RitualThread({ sealSet, closePanel }) {
  const { t } = useI18n()
  const r = t.ritual
  const fillRef = useRef(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${ratio})`
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <nav className="ritual-thread" aria-label={r.threadAria}>
      <span className="ritual-thread-rail" aria-hidden="true" />
      <span className="ritual-thread-fill" ref={fillRef} aria-hidden="true" />
      {SEALS.map((seal) => {
        const lit = sealSet.has(seal.id)
        return (
          <a
            key={seal.id}
            href={`#${seal.id}`}
            className={`ritual-thread-node ritual-thread-node--${seal.side} ${
              lit ? 'is-lit' : ''
            }`}
            aria-label={`${r.seals[seal.id].name} — ${lit ? r.sealVisited : r.sealUnvisited}`}
            onClick={closePanel}
          >
            <i aria-hidden="true" />
            <span>{r.seals[seal.id].name}</span>
          </a>
        )
      })}
    </nav>
  )
}

function SealNode({ seal, lit, onGo }) {
  const { t } = useI18n()
  const r = t.ritual
  const copy = r.seals[seal.id]

  return (
    <a
      href={`#${seal.id}`}
      className={`ritual-seal ritual-seal--${seal.side} ${lit ? 'is-lit' : ''}`}
      aria-label={`${copy.name} — ${lit ? r.sealVisited : r.sealUnvisited}`}
      onClick={(event) => {
        event.preventDefault()
        onGo(seal.id)
      }}
    >
      <span className="ritual-seal-orb" aria-hidden="true">
        {seal.index}
      </span>
      <span className="ritual-seal-copy">
        <strong>{copy.name}</strong>
        <span>{copy.note}</span>
      </span>
      <PactGlyph id={lit ? 'check' : 'lock'} className="ritual-seal-glyph" />
    </a>
  )
}

function RitualPanel() {
  const { t, lang } = useI18n()
  const r = t.ritual
  const {
    open,
    setOpen,
    seals,
    sealSet,
    rank,
    nextRank,
    achievements,
    achievedSet,
    alignment,
    setAlignment,
    cryptUnlocked,
    reset,
    notify,
  } = useRitual()

  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const scrollRef = useRef(null)
  const alignRef = useRef(null)
  const [resetStage, setResetStage] = useState(0)
  const reduced = usePrefersReducedMotion()

  useLockBody(open)
  useEscape(open, () => setOpen(false))
  useFocusTrap(open, panelRef, closeRef)

  useEffect(() => {
    if (!open) {
      setResetStage(0)
      return
    }
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [open])

  const goToSeal = (id) => {
    setOpen(false)
    window.setTimeout(
      () => {
        document.getElementById(id)?.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start',
        })
        try {
          window.history.replaceState(null, '', `#${id}`)
        } catch {
          /* noop */
        }
      },
      reduced ? 0 : 380,
    )
  }

  const date = new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const sigilLabels = {
    brand: 'SICK LUKE',
    title: r.sigilTitle,
    degree: r.sigilDegree,
    rank: r.rankLabel,
    alignment: r.alignmentLabelShort,
    seals: r.sigilSeals,
    trials: r.sigilTrials,
    forged: r.sigilForged,
    motto: r.sigilMotto,
    alignValues: {
      equilibrio: r.alignEquilibrio,
      notte: r.alignNotte,
      luce: r.alignLuce,
    },
  }

  const download = () => {
    downloadPactSigil({
      alignment,
      rankName: r.ranks[rank.id].name,
      rankNote: r.ranks[rank.id].note,
      sealIds: seals,
      sealCount: seals.length,
      trialCount: achievements.length,
      date,
      labels: sigilLabels,
      filename: lang === 'it' ? 'sick-luke-il-patto.svg' : 'sick-luke-the-pact.svg',
    })
    notify({ key: 'download', tone: 'gold' })
  }

  const trialsDone = achievements.length
  const missing = TOTAL_SEALS - seals.length
  const alignmentOptions = [
    { id: 'notte', label: r.alignNotte, glyph: 'notte' },
    { id: 'equilibrio', label: r.alignEquilibrio, glyph: 'patto' },
    { id: 'luce', label: r.alignLuce, glyph: 'luce' },
  ]

  const onAlignKeyDown = (event) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const order = alignmentOptions.map((option) => option.id)
    const currentIndex = order.indexOf(alignment)
    let next = currentIndex
    if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = order.length - 1
    } else {
      const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
      next = (currentIndex + step + order.length) % order.length
    }
    setAlignment(order[next])
    alignRef.current?.querySelector(`[data-align="${order[next]}"]`)?.focus()
  }

  return (
    <div className={`ritual-layer ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="ritual-backdrop"
        onClick={() => setOpen(false)}
        aria-label={r.close}
        tabIndex={-1}
      />

      <aside
        id="ritual-panel"
        className="ritual-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ritual-title"
        aria-hidden={open ? undefined : 'true'}
        ref={panelRef}
      >
        <div className="ritual-panel-grain" aria-hidden="true" />

        <header className="ritual-panel-head">
          <span className="ritual-panel-kicker">
            {r.panelKicker}
          </span>
          <button
            type="button"
            className="ritual-panel-close"
            onClick={() => setOpen(false)}
            ref={closeRef}
            aria-label={r.close}
          >
            <span>{r.close}</span>
            <i aria-hidden="true">×</i>
          </button>
        </header>

        <div className="ritual-panel-scroll" ref={scrollRef}>
          <div className="ritual-hero">
            <div className="ritual-embroider" aria-hidden="true">
              <X2Mark className="ritual-hero-mark" framed />
            </div>
            <p className="ritual-eyebrow">{r.panelTitle}</p>
            <h2 className="ritual-rank" id="ritual-title">
              {r.ranks[rank.id].name}
            </h2>
            <p className="ritual-rank-note">{r.ranks[rank.id].note}</p>

            <div className="ritual-progress" aria-hidden="true">
              <span>
                <i style={{ width: `${(seals.length / TOTAL_SEALS) * 100}%` }} />
              </span>
              <strong>
                {String(seals.length).padStart(2, '0')}
                <small> / {String(TOTAL_SEALS).padStart(2, '0')}</small>
              </strong>
            </div>
            <p className="ritual-next">
              {nextRank
                ? `${r.nextRank} · ${r.ranks[nextRank.id].name} · ${r.nextAt.replace(
                    '{n}',
                    String(nextRank.min),
                  )}`
                : r.maxRank}
            </p>
          </div>

          <p className="ritual-intro">{r.intro}</p>

          <section className="ritual-section" aria-labelledby="ritual-seals-title">
            <div className="ritual-section-head">
              <h3 id="ritual-seals-title">{r.sealsLabel}</h3>
              <span>{r.sealsNote}</span>
            </div>

            <div className="ritual-seal-map">
              <div className="ritual-seal-col ritual-seal-col--night">
                <span className="ritual-col-head">
                  <PactGlyph id="notte" />
                  {r.night}
                  <em>{r.nightNote}</em>
                </span>
                {SEALS.filter((seal) => seal.side === 'night').map((seal) => (
                  <SealNode
                    key={seal.id}
                    seal={seal}
                    lit={sealSet.has(seal.id)}
                    onGo={goToSeal}
                  />
                ))}
              </div>

              <div className="ritual-seal-col ritual-seal-col--light">
                <span className="ritual-col-head">
                  <PactGlyph id="luce" />
                  {r.light}
                  <em>{r.lightNote}</em>
                </span>
                {SEALS.filter((seal) => seal.side === 'light').map((seal) => (
                  <SealNode
                    key={seal.id}
                    seal={seal}
                    lit={sealSet.has(seal.id)}
                    onGo={goToSeal}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="ritual-section" aria-labelledby="ritual-align-title">
            <div className="ritual-section-head">
              <h3 id="ritual-align-title">{r.alignmentLabel}</h3>
              <span>{r.alignmentNote}</span>
            </div>

            <div
              className="ritual-align"
              role="radiogroup"
              aria-label={r.alignAria}
              ref={alignRef}
              onKeyDown={onAlignKeyDown}
            >
              {alignmentOptions.map((option) => {
                const active = alignment === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    tabIndex={active ? 0 : -1}
                    data-align={option.id}
                    className={`ritual-align-btn ${active ? 'is-active' : ''}`}
                    onClick={() => setAlignment(option.id)}
                  >
                    <PactGlyph id={option.glyph} />
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="ritual-section" aria-labelledby="ritual-trials-title">
            <div className="ritual-section-head">
              <h3 id="ritual-trials-title">{r.achievementsLabel}</h3>
              <span>
                {String(trialsDone).padStart(2, '0')} / {String(TOTAL_TRIALS).padStart(2, '0')} {r.trials}
              </span>
            </div>

            <ul className="ritual-trials">
              {ACHIEVEMENTS.map((achievement) => {
                const done = achievedSet.has(achievement.id)
                const copy = r.achievements[achievement.id]
                return (
                  <li
                    key={achievement.id}
                    className={`ritual-trial ${done ? 'is-done' : 'is-locked'}`}
                    data-tone={achievement.tone}
                  >
                    <span className="ritual-trial-icon" aria-hidden="true">
                      <PactGlyph id={achievement.id} />
                    </span>
                    <span className="ritual-trial-copy">
                      <strong>{copy.title}</strong>
                      <span>{copy.text}</span>
                    </span>
                    <span className="ritual-trial-state">
                      <PactGlyph id={done ? 'check' : 'lock'} />
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className={`ritual-crypt ${cryptUnlocked ? 'is-open' : ''}`}>
            <div className="ritual-crypt-head">
              <span>{r.cryptLabel}</span>
            </div>

            {cryptUnlocked ? (
              <div className="ritual-crypt-body">
                <PactSigil
                  className="ritual-sigil-preview"
                  alignment={alignment}
                  rankName={r.ranks[rank.id].name}
                  rankNote={r.ranks[rank.id].note}
                  sealIds={seals}
                  sealCount={seals.length}
                  trialCount={achievements.length}
                  date={date}
                  labels={sigilLabels}
                />
                <div className="ritual-crypt-copy">
                  <h3>{r.cryptReadyTitle}</h3>
                  <p>{r.cryptReadyText}</p>
                  <button type="button" className="btn btn--blood" onClick={download}>
                    <span>{r.cryptDownload}</span>
                    <PactGlyph id="sigillo" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="ritual-crypt-locked">
                <h3>{r.cryptLockedTitle}</h3>
                <p>{r.cryptLockedText.replace('{n}', String(missing))}</p>
                <div className="ritual-crypt-bar" aria-hidden="true">
                  <i style={{ width: `${(seals.length / TOTAL_SEALS) * 100}%` }} />
                </div>
              </div>
            )}

            <div className="ritual-crypt-foot">
              <span>{r.cryptNote}</span>
              {seals.length > 0 &&
                (resetStage === 0 ? (
                  <button
                    type="button"
                    className="ritual-reset"
                    onClick={() => setResetStage(1)}
                  >
                    {r.reset}
                  </button>
                ) : (
                  <span className="ritual-reset-confirm">
                    <em>{r.resetConfirm}</em>
                    <button
                      type="button"
                      onClick={() => {
                        reset()
                        setResetStage(0)
                      }}
                    >
                      {r.resetYes}
                    </button>
                    <button type="button" onClick={() => setResetStage(0)}>
                      {r.resetNo}
                    </button>
                  </span>
                ))}
            </div>
          </section>

          <p className="ritual-saved">
            <i aria-hidden="true" />
            {r.saved}
          </p>
        </div>
      </aside>
    </div>
  )
}

function RitualToasts() {
  const { t } = useI18n()
  const r = t.ritual
  const { toasts } = useRitual()

  const resolve = (toast) => {
    if (toast.key === 'welcome') {
      return { kicker: r.toastWelcome, title: r.welcomeTitle, text: r.welcomeText }
    }
    if (toast.key === 'seal') {
      const seal = r.seals[toast.seal]
      return { kicker: r.toastSeal, title: seal?.name, text: seal?.note }
    }
    if (toast.key === 'achievement') {
      const achievement = r.achievements[toast.achievement]
      return {
        kicker: r.toastAchievement,
        title: achievement?.title,
        text: achievement?.text,
      }
    }
    if (toast.key === 'rank') {
      const rank = r.ranks[toast.rank]
      return { kicker: r.toastRank, title: rank?.name, text: rank?.note }
    }
    if (toast.key === 'crypt') {
      return { kicker: r.toastCrypt, title: r.cryptReadyTitle, text: r.cryptToastText }
    }
    if (toast.key === 'download') {
      return { kicker: r.toastDownload, title: r.cryptDownloaded, text: r.downloadToastText }
    }
    if (toast.key === 'reset') {
      return { kicker: r.toastReset, title: r.resetDone, text: r.resetToastText }
    }
    return { kicker: '', title: '', text: '' }
  }

  const glyph = (toast) => {
    if (toast.key === 'seal')
      return <PactGlyph id={toast.tone === 'light' ? 'luce' : 'notte'} />
    if (toast.key === 'achievement') return <PactGlyph id={toast.achievement} />
    if (toast.key === 'download') return <PactGlyph id="sigillo" />
    if (toast.key === 'reset') return <PactGlyph id="notte" />
    return <X2Mark />
  }

  return (
    <div className="ritual-toasts" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const content = resolve(toast)
        return (
          <div
            key={toast.id}
            className={`ritual-toast ${toast.leaving ? 'is-leaving' : ''}`}
            data-tone={toast.tone}
          >
            <span className="ritual-toast-icon" aria-hidden="true">
              {glyph(toast)}
            </span>
            <span className="ritual-toast-copy">
              <em>{content.kicker}</em>
              <strong>{content.title}</strong>
              {content.text && <span>{content.text}</span>}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function RitualDock() {
  const { t } = useI18n()
  const r = t.ritual
  const { seals, sealSet, rank, open, setOpen } = useRitual()
  const [tucked, setTucked] = useState(true)

  /* keep the floating medallion out of the hero's calls to action */
  useEffect(() => {
    const target = document.querySelector('.hero-cta')
    if (!target || typeof IntersectionObserver === 'undefined') {
      setTucked(false)
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => setTucked(entry.isIntersecting),
      { threshold: 0.05, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <RitualThread sealSet={sealSet} closePanel={() => setOpen(false)} />

      <div className={`ritual-dock ${tucked ? 'is-tucked' : ''}`.trim()}>
        <button
          type="button"
          className="ritual-dock-btn"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="ritual-panel"
          aria-label={`${r.dockAria} — ${r.ranks[rank.id].name}, ${seals.length} ${r.ofEight}`}
          data-complete={seals.length === TOTAL_SEALS ? 'true' : undefined}
          data-cursor="link"
          data-cursor-label={r.dockKicker}
        >
          <span className="ritual-dock-copy" aria-hidden="true">
            <em>{r.dockKicker}</em>
            <strong>{r.ranks[rank.id].name}</strong>
            <span>
              {String(seals.length).padStart(2, '0')} / {String(TOTAL_SEALS).padStart(2, '0')}
            </span>
          </span>
          <span className="ritual-dock-seal" aria-hidden="true">
            <svg className="ritual-dock-ring" viewBox="0 0 80 80" focusable="false">
              <circle cx="40" cy="40" r="36" />
              {SEALS.map((seal, index) => (
                <line
                  key={seal.id}
                  className={`ritual-tick ritual-tick--${seal.side} ${
                    sealSet.has(seal.id) ? 'is-lit' : ''
                  }`}
                  x1="40"
                  y1="4.5"
                  x2="40"
                  y2="11"
                  transform={`rotate(${index * 45} 40 40)`}
                />
              ))}
            </svg>
            <X2Mark className="ritual-dock-mark" />
            <span className="ritual-dock-badge">{seals.length}</span>
          </span>
        </button>
      </div>

      <RitualPanel />
      <RitualToasts />
    </>
  )
}
