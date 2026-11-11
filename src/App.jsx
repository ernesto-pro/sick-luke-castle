import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useI18n } from './i18n'
import { useLockBody, useTiltDeck } from './lib/hooks'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Header from './components/Header'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Latest from './components/Latest'
import SoundToggle from './components/SoundToggle'
import BatSwarm from './components/BatSwarm'

// Below-the-fold sections ship as separate chunks: the first paint only
// parses the hero, the gate and the opening chapters. Body scroll is locked
// by the intro, so the rest mounts invisibly before anyone can scroll.
const Discography = lazy(() => import('./components/Discography'))
const Listen = lazy(() => import('./components/Listen'))
const Court = lazy(() => import('./components/Court'))
const Gallery = lazy(() => import('./components/Gallery'))
const Videos = lazy(() => import('./components/Videos'))
const Booking = lazy(() => import('./components/Booking'))
const Footer = lazy(() => import('./components/Footer'))
// search is a shortcut, not first paint: the palette and the 34 kB video
// archive it indexes load once the gate starts opening.
const CommandPalette = lazy(() => import('./components/CommandPalette'))
import { Marquee } from './components/ui'

const hasEntered = () => {
  try {
    return window.sessionStorage.getItem('sl-entered') === '1'
  } catch {
    return false
  }
}

export default function App() {
  const { t } = useI18n()
  const [intro, setIntro] = useState(() => (hasEntered() ? 'done' : 'loading'))
  const deepLinkHandled = useRef(false)
  useLockBody(intro !== 'done')
  useTiltDeck()

  useEffect(() => {
    if (intro !== 'done') return
    try {
      window.sessionStorage.setItem('sl-entered', '1')
    } catch {
      /* noop */
    }
  }, [intro])

  const gateLoading = intro === 'loading'

  useEffect(() => {
    // start while the gate is still fading, so the page is already on the
    // right chapter when the castle is revealed
    if (gateLoading || deepLinkHandled.current) return undefined
    const hash = window.location.hash
    if (!hash || hash.length < 2) return undefined
    deepLinkHandled.current = true
    const id = decodeURIComponent(hash.slice(1))
    const root = document.documentElement
    let findTries = 0
    let settleTries = 0
    let stableTries = 0
    let timer
    let cancelled = false
    // skipped grids are materialised before the first jump: the hash lands on
    // the final layout instead of a placeholder height.
    root.dataset.jump = '1'
    // deep links can target lazy sections: keep correcting the position until
    // the layout above the target has settled, then stop as soon as it is stable
    const scrollToTarget = () => {
      if (cancelled) return
      const node = document.getElementById(id)
      if (!node) {
        if (findTries < 24) {
          findTries += 1
          timer = window.setTimeout(scrollToTarget, 100)
        }
        return
      }
      const margin = parseFloat(window.getComputedStyle(node).scrollMarginTop) || 0
      const drift = node.getBoundingClientRect().top - margin
      if (Math.abs(drift) > 1) {
        stableTries = 0
        node.scrollIntoView({ block: 'start' })
      } else {
        stableTries += 1
      }
      settleTries += 1
      if ((stableTries >= 2 && settleTries >= 4) || settleTries >= 12) {
        delete root.dataset.jump
        return
      }
      timer = window.setTimeout(scrollToTarget, settleTries < 4 ? 90 : 170)
    }

    const cancel = () => {
      cancelled = true
      window.clearTimeout(timer)
      delete root.dataset.jump
    }
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('keydown', cancel)
    window.addEventListener('click', cancel)
    timer = window.setTimeout(scrollToTarget, 80)
    return () => {
      cancel()
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('keydown', cancel)
      window.removeEventListener('click', cancel)
    }
  }, [gateLoading])

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>

      {intro !== 'done' && (
        <Preloader onReveal={() => setIntro('leaving')} onDone={() => setIntro('done')} />
      )}

      <div className="grain" aria-hidden="true" />
      <div className="scene-vignette" aria-hidden="true" />
      <div className="scene-frame" aria-hidden="true">
        <span className="scene-corner scene-corner--tl" />
        <span className="scene-corner scene-corner--tr" />
        <span className="scene-corner scene-corner--bl" />
        <span className="scene-corner scene-corner--br" />
        <span className="scene-rule scene-rule--top" />
        <span className="scene-rule scene-rule--bottom" />
      </div>
      <Cursor />
      <BatSwarm variant="site" />
      <Header />
      {intro !== 'loading' && (
        <Suspense fallback={null}>
          <CommandPalette enabled={intro === 'done'} />
        </Suspense>
      )}

      <main id="main">
        <Hero live={intro !== 'loading'} active={intro === 'done'} />

        <div className="ticker" aria-label={t.tickerLabel}>
          <Marquee items={t.ticker} speed={38} />
        </div>

        <Manifesto />
        <Latest />
        <Suspense fallback={null}>
          <Discography />
          <Listen />
          <Court />
          <Gallery />
          <Videos />
          <Booking />
        </Suspense>
      </main>

      <div className="ticker ticker--finale" role="region" aria-label={t.finaleLabel}>
        <Marquee items={t.finale} speed={34} reverse />
      </div>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <SoundToggle />
    </>
  )
}
