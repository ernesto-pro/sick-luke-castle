import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { Arrow } from './ui'
import CastleGate from './CastleGate'
import X2Mark from './X2Mark'

export default function Preloader({ onReveal, onDone }) {
  const { t } = useI18n()
  const [count, setCount] = useState(0)
  const [opening, setOpening] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const callbacks = useRef({ onReveal, onDone })
  const timers = useRef([])
  const entered = useRef(false)
  const introRef = useRef(null)
  const frame = useRef(0)
  callbacks.current = { onReveal, onDone }

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  const onPointerMove = (e) => {
    if (frame.current) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = introRef.current
    if (!el) return
    const mx = (e.clientX / window.innerWidth - 0.5) * 2
    const my = (e.clientY / window.innerHeight - 0.5) * 2
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--gx', `${(mx * 14).toFixed(2)}px`)
      el.style.setProperty('--gy', `${(my * 8).toFixed(2)}px`)
      frame.current = 0
    })
  }

  const enter = (skip) => {
    if (entered.current) return
    entered.current = true
    clearTimers()
    setCount(100)
    setOpening(true)
    // warm the hero while the camera pushes in: content and LCP are ready
    // before the gate starts fading, so nothing moves after the reveal.
    callbacks.current.onReveal?.()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // a skip is a quick cut, not a shorter film: Esc / click lands in <0.4s
    const openTime = reduced ? 200 : skip ? 190 : 1200
    const fadeTime = reduced ? 180 : skip ? 190 : 460
    timers.current.push(
      window.setTimeout(() => {
        setLeaving(true)
        timers.current.push(window.setTimeout(() => callbacks.current.onDone?.(), fadeTime))
      }, openTime),
    )
  }

  useEffect(() => {
    let raf = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduced ? 320 : 620
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * 100))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        timers.current.push(window.setTimeout(() => enter(false), reduced ? 80 : 80))
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(frame.current)
      clearTimers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // the gate is a doorway, not a wall: Esc or a click anywhere on the scene
  // lets visitors through immediately.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        enter(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={introRef}
      onPointerMove={onPointerMove}
      onClick={() => enter(true)}
      className={`gate-intro ${opening ? 'is-opening' : ''} ${leaving ? 'is-leaving' : ''}`}
      aria-hidden={leaving}
    >
      <div className="gate-stage" aria-hidden="true">
        <div className="gate-sky">
          <div className="gate-stars" />
          <div className="gate-moon">
            <span className="gate-moon-crater" />
            <span className="gate-moon-crater gate-moon-crater--b" />
          </div>
          <div className="gate-rays" />
          <div className="gate-clouds gate-clouds--high" />
          <div className="gate-clouds gate-clouds--far" />
          <div className="gate-clouds gate-clouds--near" />
        </div>

        <div className="gate-scene">
          <CastleGate />
        </div>

        <div className="gate-mist gate-mist--low" />
        <div className="gate-mist gate-mist--high" />

        <div className="gate-embers">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              style={{
                '--x': `${(i * 37) % 100}%`,
                '--d': `${(i % 13) * 0.85}s`,
                '--s': `${0.5 + ((i * 7) % 10) / 12}`,
                '--t': `${7 + (i % 5) * 2.4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="gate-flash" aria-hidden="true" />

      <div className="gate-ui">
        <div className="gate-head">
          <span className="gate-brand">SICK LUKE</span>
          <span className="gate-meta">MMXXVI · ROMA / LONDRA</span>
        </div>

        <div className="gate-title">
          <span className="gate-crest" aria-hidden="true">
            <X2Mark framed />
          </span>
          <p className="gate-pretitle">{t.hero.pretitle}</p>
          <div className="gate-name" aria-label="Sick Luke" aria-hidden="true">
            <span>SICK</span>
            <span className="gate-name--outline"> LUKE</span>
          </div>
          <p className="gate-tag">{t.preloader.tag}</p>
        </div>

        <div className="gate-foot">
          <p className="gate-pact">
            {t.preloader.pact}
          </p>

          <button type="button" className="gate-enter" onClick={() => enter(true)}>
            <span>{t.preloader.enter}</span>
            <Arrow />
          </button>

          <div className="gate-progress">
            <div className="gate-bar">
              <span style={{ transform: `scaleX(${count / 100})` }} />
            </div>
            <div className="gate-count">
              {String(count).padStart(3, '0')}
              <small>%</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
