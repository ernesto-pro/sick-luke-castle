import { useEffect, useRef, useState } from 'react'
import { NAV, SOCIALS, SPOTIFY_ARTIST } from '../data'
import { useI18n } from '../i18n'
import { useActiveSection, useEscape, useLockBody } from '../lib/hooks'
import { Arrow, InstagramGlyph, SearchGlyph } from './ui'
import X2Mark from './X2Mark'
import LangSwitch from './LangSwitch'

const SECTION_IDS = NAV.map((item) => item.id)
const IS_MAC =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || '')

const openPalette = () => {
  window.dispatchEvent(new CustomEvent('sl:open-palette'))
}

export default function Header() {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const progressRef = useRef(null)
  const menuRef = useRef(null)
  const closeRef = useRef(null)
  const active = useActiveSection(SECTION_IDS)

  useLockBody(open)
  useEscape(open, () => setOpen(false))

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()
    const panel = menuRef.current
    const onKey = (e) => {
      if (e.key !== 'Tab' || !panel) return
      const nodes = panel.querySelectorAll('a[href], button:not([disabled])')
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [open])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const max = document.documentElement.scrollHeight - window.innerHeight
        const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`
        setScrolled(window.scrollY > 24)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <header className={`site-head ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="scroll-progress" ref={progressRef} />
        <div className="head-inner">
          <a href="#top" className="logo" data-cursor="link" data-cursor-label={t.labels.up}>
            <span className="logo-mark">
              <X2Mark />
            </span>
            <span className="logo-word">
              <strong>Sick Luke</strong>
              <em aria-hidden="true">{t.header.role}</em>
            </span>
            <span className="sr-only">{t.header.home}</span>
          </a>

          <nav className="main-nav" aria-label={t.header.mainNav}>
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? 'is-active' : ''}
                aria-current={active === item.id ? 'location' : undefined}
              >
                <span className="nav-index">{item.index}</span>
                {t.nav[item.id]}
              </a>
            ))}
          </nav>

          <div className="head-actions">
            <button
              type="button"
              className="head-search"
              onClick={openPalette}
              aria-keyshortcuts="Meta+K Control+K"
              data-cursor="link"
              data-cursor-label={t.palette.short}
            >
              <SearchGlyph />
              <span className="head-search-label" aria-hidden="true">{t.palette.short}</span>
              <kbd aria-hidden="true">{IS_MAC ? '⌘K' : 'Ctrl K'}</kbd>
              <span className="sr-only">{t.palette.open}</span>
            </button>
            <a
              className="head-ig"
              href="#farfastrelli"
              data-cursor="link"
              data-cursor-label={t.header.ig}
            >
              <InstagramGlyph />
              <span className="head-ig-copy">
                <strong>@sicklukex2</strong>
                <em aria-hidden="true">{t.header.igMeta}</em>
              </span>
              <span className="sr-only">{t.header.ig}</span>
            </a>
            <a
              href={SPOTIFY_ARTIST}
              target="_blank"
              rel="noreferrer"
              className="head-listen"
              aria-label={`${t.header.listen} — ${t.labels.play}`}
              data-cursor="link"
              data-cursor-label={t.labels.play}
            >
              <span className="listen-dot" />
              <span>{t.header.listen}</span>
              <Arrow />
            </a>
            <LangSwitch />
            <button
              type="button"
              className={`burger ${open ? 'is-open' : ''}`}
              aria-label={open ? t.header.closeMenu : t.header.openMenu}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        className={`menu ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={t.header.menu}
        aria-hidden={!open}
        ref={menuRef}
      >
        <div className="menu-grain" />
        <div className="menu-inner">
          <div className="menu-head">
            <span className="menu-eyebrow">{t.header.menuIndex}</span>
            <LangSwitch className="lang-switch--menu" />
            <button type="button" className="menu-close" onClick={() => setOpen(false)} aria-label={t.header.closeMenu} ref={closeRef}>
              {t.header.close} <span aria-hidden="true">×</span>
            </button>
          </div>

          <button
            type="button"
            className="menu-search"
            onClick={() => {
              setOpen(false)
              openPalette()
            }}
          >
            <SearchGlyph />
            <span>{t.palette.open}</span>
            <kbd>{IS_MAC ? '⌘K' : 'Ctrl K'}</kbd>
          </button>

          <nav className="menu-nav" aria-label={t.header.mainMenu}>
            {NAV.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                style={{ '--i': i }}
                aria-current={active === item.id ? 'location' : undefined}
              >
                <span className="menu-num">{item.index}</span>
                <span className="menu-link">{t.nav[item.id]}</span>
                <Arrow />
              </a>
            ))}
          </nav>

          <div className="menu-foot">
            <div className="menu-socials">
              {SOCIALS.slice(0, 4).map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
                  {social.label} <Arrow />
                </a>
              ))}
            </div>
            <div className="menu-stamp">
              <X2Mark />
              <span>{t.header.stampCity}<br />MMXXVI</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
