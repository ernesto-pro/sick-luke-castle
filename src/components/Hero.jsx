import { useRef } from 'react'
import { SPOTIFY_ARTIST } from '../data'
import { useI18n } from '../i18n'
import Atmosphere from './Atmosphere'
import BatSwarm from './BatSwarm'
import Blimp from './Blimp'
import Castle from './Castle'
import CastleWall from './CastleWall'
import { Arrow, MagneticLink, SplitWord } from './ui'
import X2Mark from './X2Mark'
import { withBase } from '../lib/base'

export default function Hero({ live, active = true }) {
  const { t } = useI18n()
  const heroRef = useRef(null)
  const frame = useRef(0)

  const onMouseMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (frame.current) return
    const el = heroRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', mx.toFixed(3))
      el.style.setProperty('--my', my.toFixed(3))
      frame.current = 0
    })
  }

  const onMouseLeave = () => {
    const el = heroRef.current
    if (!el) return
    el.style.setProperty('--mx', '0')
    el.style.setProperty('--my', '0')
  }

  return (
    <section id="top" className={`hero ${live ? 'is-live' : ''} ${active ? 'is-active' : ''}`} ref={heroRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-stars" />
        <div className="hero-godrays" />
        <span className="hero-beam" />
        <div className="hero-moon">
          <span className="moon-crater moon-crater--a" />
          <span className="moon-crater moon-crater--b" />
          <span className="moon-crater moon-crater--c" />
        </div>
        <div className="hero-moon-orbit">
          <i />
          <i />
        </div>
        <img
          className="hero-floating-castle"
          src={withBase('/img/ig/castle-glow.webp')}
          alt=""
          width="518"
          height="372"
          aria-hidden="true"
          decoding="async"
        />
        <Blimp label={t.hero.blimp} />
        <span className="hero-burn" />
        <div className="hero-halo" />
      </div>

      <div className="hero-castle-wrap" aria-hidden="true">
        <Castle />
      </div>

      <div className="hero-cloudsea" aria-hidden="true" />

      <div className="fog fog--one" aria-hidden="true" />
      <Atmosphere className="hero-atmosphere" live={active} />

      <div className="hero-wall-wrap" aria-hidden="true">
        <CastleWall />
      </div>

      <BatSwarm variant="near" />

      <span className="hero-rail hero-rail--left" aria-hidden="true">
        {t.hero.railLeft}
      </span>
      <span className="hero-rail hero-rail--right" aria-hidden="true">
        {t.hero.railRight}
      </span>

      <div className="hero-inner">
        <div className="hero-top">
          <span className="hero-eyebrow hero-eyebrow--right">
            {t.hero.coordsA} <span>/</span> {t.hero.coordsB}
          </span>
        </div>

        <div className="hero-main">
          <div className="hero-title-wrap">
            <p className="hero-pretitle">{t.hero.pretitle}</p>
            <h1 className="hero-title" aria-label="Sick Luke">
              <span aria-hidden="true" className="hero-title-inner">
                <span className="hero-line">
                  <span className="hero-word">
                    <SplitWord text="SICK" />
                  </span>
                </span>
                <span className="hero-line hero-line--outline">
                  <span className="hero-word">
                    <SplitWord text="LUKE" offset={4} />
                  </span>
                </span>
              </span>
            </h1>
            <span className="hero-ornament" aria-hidden="true">
              <X2Mark framed />
            </span>
            <span className="hero-title-rule" aria-hidden="true">
              <i />
            </span>
            <div className="hero-couture" aria-hidden="true">
              <span className="hero-couture-item">TRAP COUTURE</span>
              <i />
              <span className="hero-couture-item">EST. 2013</span>
              <i />
              <span className="hero-couture-item">BSNM</span>
              <span className="hero-serial">SL—001 · MMXXVI</span>
            </div>
          </div>

          <figure className="hero-arch" data-cursor="view" data-cursor-label={t.labels.portrait}>
            <div className="arch-frame">
              <img
                src={withBase('/img/sickluke-portrait.webp')}
                alt={t.hero.portraitAlt}
                width="532"
                height="640"
                fetchPriority="high"
                decoding="async"
              />
              <span className="arch-tint" aria-hidden="true" />
              <span className="arch-grain" aria-hidden="true" />
            </div>
            <figcaption>
              <span>Luca Antonio Barker</span>
              <span>MMXXVI</span>
            </figcaption>
            <div className="hero-stamp" aria-hidden="true">
              <svg viewBox="0 0 120 120">
                <defs>
                  <path id="stampCircle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                </defs>
                <text>
                  <textPath href="#stampCircle">{t.hero.stamp}</textPath>
                </text>
              </svg>
              <X2Mark />
            </div>
            <span className="hero-plate" aria-hidden="true">
              <em>{t.hero.plateA}</em>
              <strong>{t.hero.plateB}</strong>
            </span>
            <span className="hero-hangtag" aria-hidden="true">
              <span className="hero-hangtag-hole" />
              <strong>NEW DROP</strong>
              <em>CASTELLO / MMXXVI</em>
              <span className="hero-hangtag-bars" />
            </span>
          </figure>
        </div>

        <div className="hero-foot">
          <div className="hero-foot-copy">
            <p className="hero-kicker">{t.hero.kicker}</p>
            <p className="hero-lede">{t.hero.lede}</p>
          </div>

          <div className="hero-cta">
            <MagneticLink className="btn btn--blood" href="#conte" data-cursor="link" data-cursor-label={t.labels.enter}>
              <span>{t.hero.enter}</span>
              <Arrow />
            </MagneticLink>
            <MagneticLink
              className="btn btn--ghost"
              href={SPOTIFY_ARTIST}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={t.labels.play}
            >
              <span>{t.hero.listen}</span>
              <Arrow />
            </MagneticLink>
          </div>

          <a className="hero-scroll" href="#conte" aria-label={t.hero.scrollAria}>
            <span>{t.hero.scroll}</span>
            <i />
          </a>
        </div>
      </div>
    </section>
  )
}
