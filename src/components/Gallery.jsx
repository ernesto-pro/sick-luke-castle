import { useCallback, useEffect, useRef, useState } from 'react'
import { GALLERY, INSTAGRAM, CASTLE_INSTAGRAM, youtubeUrl } from '../data'
import { useI18n } from '../i18n'
import { useRitual } from '../ritual'
import { useEscape, useLockBody } from '../lib/hooks'
import { Arrow, MagneticLink, Reveal, SectionLabel } from './ui'
import Necklace from './Necklace'
import BatSwarm from './BatSwarm'
import IGFeed from './IGFeed'
import { withBase } from '../lib/base'

function GalleryModal({ index, onClose, onPrev, onNext }) {
  const closeRef = useRef(null)
  const { t } = useI18n()
  const g = t.gallery
  const item = GALLERY[index]
  const copy = g.items[index]
  useLockBody(true)
  useEscape(true, onClose)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onPrev, onNext])

  return (
    <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={`${copy.title} — ${g.modalAria}`}>
      <button type="button" className="gallery-backdrop" onClick={onClose} aria-label={g.close} tabIndex={-1} />
      <div className="gallery-stage">
        <button type="button" className="gallery-close" onClick={onClose} ref={closeRef} aria-label={g.close}>
          {t.discography.close} <span aria-hidden="true">×</span>
        </button>

        <button type="button" className="gallery-nav gallery-nav--prev" onClick={onPrev} aria-label={g.prev}>
          <span aria-hidden="true">←</span>
        </button>

        <figure className="gallery-figure">
          <img src={item.src} alt="" width="960" height="540" decoding="async" />
          <figcaption>
            <span className="gallery-fig-index">
              {String(index + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}
            </span>
            <span className="gallery-fig-copy">
              <strong>{copy.title}</strong>
              <em>{copy.meta}</em>
            </span>
            <a href={youtubeUrl(item.video)} target="_blank" rel="noreferrer" className="link-line">
              {g.watch} <Arrow />
            </a>
          </figcaption>
        </figure>

        <button type="button" className="gallery-nav gallery-nav--next" onClick={onNext} aria-label={g.next}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

export default function Gallery() {
  const [selected, setSelected] = useState(null)
  const { t } = useI18n()
  const { grant } = useRitual()
  const g = t.gallery

  const openGallery = (index) => {
    grant('ali')
    setSelected(index)
  }

  const prev = useCallback(() => setSelected((i) => (i - 1 + GALLERY.length) % GALLERY.length), [])
  const next = useCallback(() => setSelected((i) => (i + 1) % GALLERY.length), [])
  const close = useCallback(() => setSelected(null), [])

  const necklaceRef = useRef(null)
  const leanFrame = useRef(0)

  const onWallMove = (e) => {
    if (leanFrame.current) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    const target = e.currentTarget
    const px = e.clientX
    leanFrame.current = requestAnimationFrame(() => {
      leanFrame.current = 0
      const el = necklaceRef.current
      if (!el) return
      const rect = target.getBoundingClientRect()
      const lean = Math.max(-1, Math.min(1, ((px - rect.left) / rect.width - 0.5) * 2))
      el.style.setProperty('--lean', lean.toFixed(3))
    })
  }

  const onWallLeave = () => {
    const el = necklaceRef.current
    if (el) el.style.setProperty('--lean', '0')
  }

  return (
    <section id="farfastrelli" className="section gallery">
      <div className="gallery-aura" aria-hidden="true" />
      <BatSwarm variant="section" />

      <div className="shell">
        <SectionLabel num="05">{g.label}</SectionLabel>

        <div className="gallery-head">
          <div>
            <p className="eyebrow">{g.eyebrow}</p>
            <h2 className="h-display gallery-title">
              {g.titleA}
              <br />
              <em>{g.titleB}</em>
            </h2>
          </div>

          <div className="gallery-side">
            <p>{g.side}</p>

            <a
              className="gallery-ig"
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={t.labels.instagram}
            >
              <span className="story-ring">
                <img src={withBase('/img/sickluke-press.webp')} alt="" width="900" height="647" loading="lazy" decoding="async" />
              </span>
              <span className="gallery-ig-copy">
                <strong>@sicklukex2</strong>
                <em>{g.follow}</em>
              </span>
            </a>

            <a
              className="gallery-ig gallery-ig--castle"
              href={CASTLE_INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={t.labels.instagram}
            >
              <span className="story-ring story-ring--castle">
                <img src={withBase('/img/ig/castle-glow.webp')} alt="" width="518" height="372" loading="lazy" decoding="async" />
              </span>
              <span className="gallery-ig-copy">
                <strong>@castellogrigioscuro</strong>
                <em>{g.followCastle}</em>
              </span>
              <span className="sr-only">{g.castleAria}</span>
            </a>
          </div>
        </div>

        <div className="gallery-tape" aria-hidden="true">
          <span className="gallery-tape-tag">{g.lookbook}</span>
          <span>{g.frames}</span>
          <span className="gallery-tape-line" />
          <span className="gallery-tape-serial">{g.serial}</span>
          <span className="gallery-tape-barcode" />
        </div>

        <div className="gallery-wall-wrap" onMouseMove={onWallMove} onMouseLeave={onWallLeave}>
          <div className="gallery-necklace" ref={necklaceRef} aria-hidden="true">
            <Necklace />
            <i className="necklace-mote necklace-mote--a" />
            <i className="necklace-mote necklace-mote--b" />
            <i className="necklace-mote necklace-mote--c" />
          </div>

          <div className="gallery-wall">
            {GALLERY.map((item, i) => {
              const copy = g.items[i]
              return (
                <Reveal key={item.src} delay={(i % 4) * 60} className={`gallery-item-wrap gallery-item-wrap--${item.ratio}`}>
                  <button
                    type="button"
                    className="gallery-item"
                    data-tilt="4.5"
                    onClick={() => openGallery(i)}
                    data-cursor="view"
                    data-cursor-label={t.labels.open}
                  >
                    <img
                      src={item.src}
                      srcSet={`${item.src.replace('.webp', '-480.webp')} 480w, ${item.src} 960w`}
                      sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
                      alt=""
                      width="960"
                      height="540"
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: item.pos }}
                    />
                    <span className="gallery-look" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')} <em>/ LOOK</em>
                    </span>
                    <span className="gallery-item-shade" aria-hidden="true" />
                    <span className="gallery-item-info">
                      <span className="sr-only">{g.openAria}</span>
                      <strong>{copy.title}</strong>
                      <em>{copy.meta}</em>
                    </span>
                    <span className="gallery-item-view" aria-hidden="true">
                      <Arrow />
                    </span>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>

        <IGFeed />

        <div className="gallery-foot">
          <p>
            {g.footA} <em>{g.footB}</em>
          </p>
          <MagneticLink
            className="btn btn--ghost"
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            data-cursor-label={t.labels.open}
          >
            <span>{g.cta}</span>
            <Arrow />
          </MagneticLink>
        </div>
      </div>

      {selected !== null && (
        <GalleryModal index={selected} onClose={close} onPrev={prev} onNext={next} />
      )}
    </section>
  )
}
