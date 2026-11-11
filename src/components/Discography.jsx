import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ALBUMS,
  ALBUM_FILTERS,
  CATALOGUE_TOTAL,
  TRACK_INDEX,
  spotifySearchUrl,
  trackBase,
  trackFeatures,
} from '../data'
import { useI18n } from '../i18n'
import { useRitual } from '../ritual'
import { useEscape, useLockBody, useTilt } from '../lib/hooks'
import { Arrow, Reveal, Rich, SectionLabel } from './ui'

function AlbumCard({ album, index, onOpen }) {
  const tilt = useTilt(6)
  const { t } = useI18n()
  const d = t.discography

  return (
    <Reveal className="album-card-wrap" delay={index * 70}>
      <article
        className="album-card"
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
      >
        <div className="album-card-top">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{d.types[album.type]}</span>
          <span>{album.year}</span>
        </div>

        <div className="album-cover">
          <img src={album.cover} alt={`${d.coverAlt} ${album.title}`} width="900" height="900" loading="lazy" decoding="async" />
          {album.isNew && <span className="album-new">{d.new}</span>}
          <span className="album-veil" aria-hidden="true" />
          <span className="album-view" aria-hidden="true">
            <Arrow />
          </span>
        </div>

        <div className="album-info">
          <h3>{album.title}</h3>
          <p className="album-artist">{album.artist}</p>
          <p className="album-note">{t.albums[album.id]?.note}</p>
          <div className="album-tags" aria-hidden="true">
            {album.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
            {album.cert && <span className="album-cert">{album.cert}</span>}
          </div>
          <div className="album-foot">
            <span>
              {album.tracks.length} {d.tracks}
            </span>
            <span className="album-open-label">{d.openArchive}</span>
          </div>
        </div>

        <button
          type="button"
          className="album-hit"
          onClick={() => onOpen(album)}
          aria-label={`${d.openAria} ${album.title} — ${d.tracklistAndLinks}`}
          data-cursor="view"
          data-cursor-label={t.labels.open}
        />
      </article>
    </Reveal>
  )
}

function AlbumModal({ album, onClose, onNavigate }) {
  const panelRef = useRef(null)
  const bodyRef = useRef(null)
  const closeRef = useRef(null)
  const { t } = useI18n()
  const d = t.discography
  const albumIndex = ALBUMS.findIndex((item) => item.id === album.id)
  const newer = ALBUMS[(albumIndex - 1 + ALBUMS.length) % ALBUMS.length]
  const older = ALBUMS[(albumIndex + 1) % ALBUMS.length]
  const spotifyAlbumId = album.spotify?.match(/\/album\/([A-Za-z0-9]+)/)?.[1]

  useLockBody(true)
  useEscape(true, onClose)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [album.id])

  useEffect(() => {
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()
    const panel = panelRef.current
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
  }, [])

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="album-modal-title">
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label={d.close} tabIndex={-1} />
      <div className="modal-panel" ref={panelRef}>
        <button type="button" className="modal-close" onClick={onClose} ref={closeRef} aria-label={d.modalClose}>
          {d.close} <span aria-hidden="true">×</span>
        </button>

        <div className="modal-art">
          <div className="modal-vinyl" aria-hidden="true">
            <span>SL</span>
          </div>
          <figure>
            <img src={album.cover} alt={`${d.coverAlt} ${album.title}`} width="900" height="900" decoding="async" />
          </figure>
          <span className="modal-year" aria-hidden="true">
            {album.year}
          </span>
        </div>

        <div className="modal-body" ref={bodyRef}>
          <div className="modal-meta">
            <p className="eyebrow">
              {d.types[album.type]} · {album.date}
            </p>
            {album.cert && (
              <span className="modal-cert">
                {d.cert} · {album.cert}
              </span>
            )}
          </div>
          <h3 id="album-modal-title" className="modal-title">
            {album.title}
          </h3>
          <p className="modal-artist">{album.artist}</p>
          <div className="album-tags">
            {album.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
            {album.bonus && <span className="album-cert">{d.deluxe}</span>}
          </div>
          <p className="modal-note">{t.albums[album.id]?.note}</p>

          <div className="modal-tracks-head">
            <span>
              {d.tracklist}
              {album.bonus ? ` · ${album.bonus} ${d.bonusPlural}` : ''}
            </span>
            <span>{String(album.tracks.length).padStart(2, '0')}</span>
          </div>
          <ol className="modal-tracks">
            {album.tracks.map((track, i) => {
              const base = trackBase(track)
              const feat = trackFeatures(track)
              return (
                <li key={`${track}-${i}`}>
                  <a
                    className="modal-track-link"
                    href={spotifySearchUrl(`${album.artist} ${base}`)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${d.trackSearch}: ${base}`}
                  >
                    <span className="track-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="track-title">
                      {base}
                      {feat && <em>{feat}</em>}
                    </span>
                    {album.bonus && i < album.bonus && <span className="track-bonus">{d.bonus}</span>}
                    <span className="track-go" aria-hidden="true">
                      <Arrow />
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>

          <nav className="modal-nav" aria-label={d.label}>
            <button type="button" onClick={() => onNavigate(newer)}>
              <span className="modal-nav-dir">{d.prev}</span>
              <span className="modal-nav-title">{newer.title}</span>
            </button>
            <button type="button" onClick={() => onNavigate(older)}>
              <span className="modal-nav-dir">{d.next}</span>
              <span className="modal-nav-title">{older.title}</span>
            </button>
          </nav>

          <div className="modal-actions">
            <a
              className="btn btn--blood"
              href={album.spotify}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={t.labels.play}
            >
              <span>{d.listenSpotify}</span>
              <Arrow />
            </a>
            <a
              className="btn btn--ghost"
              href={album.apple}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={t.labels.open}
            >
              <span>Apple Music</span>
              <Arrow />
            </a>
          </div>

          {spotifyAlbumId && (
            <div className="modal-spotify">
              <div className="modal-spotify-head">
                <span>{d.player}</span>
                <span>{d.preview}</span>
              </div>
              <iframe
                title={`${album.title} ${d.onSpotify}`}
                src={`https://open.spotify.com/embed/album/${spotifyAlbumId}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TrackIndex({ onOpenAlbum, indexOpen, setIndexOpen }) {
  const { t } = useI18n()
  const d = t.discography
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(16)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return TRACK_INDEX
    return TRACK_INDEX.filter((track) => {
      const haystack = `${track.title} ${track.appearances.map((item) => `${item.albumTitle} ${item.year}`).join(' ')}`.toLowerCase()
      return haystack.includes(needle)
    })
  }, [query])

  useEffect(() => {
    if (!indexOpen) return
    const timer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120)
    return () => window.clearTimeout(timer)
  }, [indexOpen])

  const shown = query.trim() ? results : results.slice(0, limit)
  const albumById = useMemo(() => new Map(ALBUMS.map((album) => [album.id, album])), [])

  return (
    <div id="track-index" className={`track-index ${indexOpen ? 'is-open' : ''}`.trim()}>
      <div className="track-index-top">
        <div>
          <span className="track-index-kicker">{d.indexCount}</span>
          <h3>{d.indexTitle}</h3>
          <p>{d.indexHint}</p>
        </div>
        <span className="track-index-total">
          {String(TRACK_INDEX.length).padStart(2, '0')} <em>{d.indexCount}</em>
        </span>
      </div>

      <div className="track-index-search">
        <span className="track-index-glyph" aria-hidden="true">
          ✦
        </span>
        <label className="sr-only" htmlFor="track-search">
          {d.indexPlaceholder}
        </label>
        <input
          id="track-search"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={d.indexPlaceholder}
          autoComplete="off"
          spellCheck="false"
        />
        {query ? (
          <button type="button" className="track-index-clear" onClick={() => setQuery('')} aria-label={d.close}>
            ×
          </button>
        ) : null}
        <span className="track-index-results">
          {query.trim() ? `${results.length} ${d.indexResults}` : `${TRACK_INDEX.length} ${d.indexCount}`}
        </span>
      </div>

      {shown.length ? (
        <ol className="track-index-list">
          {shown.map((track) => {
            const album = albumById.get(track.album.albumId)
            const feat = trackFeatures(track.title)
            return (
              <li key={`${track.title}-${track.album.albumId}`} className="track-index-row">
                <button type="button" className="track-index-main" onClick={() => onOpenAlbum(album)}>
                  <span className="track-index-year">{track.album.year}</span>
                  <span className="track-index-title">
                    <strong>{trackBase(track.title)}</strong>
                    {feat && <em>{feat}</em>}
                  </span>
                  <span className="track-index-album">
                    {track.album.albumTitle}
                    {track.appearances.length > 1 && (
                      <i>
                        {d.versions} {track.appearances.map((item) => item.albumTitle).join(' / ')}
                      </i>
                    )}
                  </span>
                  <span className="track-index-arrow" aria-hidden="true">
                    <Arrow />
                  </span>
                </button>
                <a
                  className="track-index-play"
                  href={spotifySearchUrl(`${album.artist} ${trackBase(track.title)}`)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${d.trackSearch}: ${trackBase(track.title)}`}
                >
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="track-index-empty">{d.indexEmpty}</p>
      )}

      {!query.trim() && limit < results.length && (
        <div className="track-index-more">
          <button type="button" className="btn btn--ghost" onClick={() => setLimit((value) => value + 16)}>
            <span>{d.indexShowMore}</span>
            <span className="track-index-more-count">+{Math.min(16, results.length - limit)}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default function Discography() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [indexOpen, setIndexOpen] = useState(false)
  const { t } = useI18n()
  const { grant } = useRitual()
  const d = t.discography

  const filtered = filter === 'all' ? ALBUMS : ALBUMS.filter((album) => album.type === filter)
  const countFor = (kind) => (kind === 'all' ? ALBUMS.length : ALBUMS.filter((album) => album.type === kind).length)

  const openAlbum = (album) => {
    grant('grimorio')
    setSelected(album)
  }

  useEffect(() => {
    const onOpenAlbum = (event) => {
      const album = ALBUMS.find((item) => item.id === event.detail?.id)
      if (album) {
        grant('grimorio')
        setSelected(album)
      }
    }
    window.addEventListener('sl:open-album', onOpenAlbum)
    return () => window.removeEventListener('sl:open-album', onOpenAlbum)
  }, [grant])

  return (
    <section id="opere" className="section discography">
      <div className="shell">
        <SectionLabel num="02">{d.label}</SectionLabel>

        <div className="section-head">
          <h2 className="h-display section-title">
            {d.titleA}
            <span className="italic">{d.titleB}</span>
          </h2>
          <div className="section-head-side">
            <p>{d.side}</p>
            <span className="count">{d.count}</span>
          </div>
        </div>

        <div className="disco-toolbar">
          <div className="disco-filters" role="group" aria-label={d.filterAria}>
            {ALBUM_FILTERS.map((kind) => (
              <button
                key={kind}
                type="button"
                className={`filter-chip ${filter === kind ? 'is-active' : ''}`}
                onClick={() => setFilter(kind)}
                aria-pressed={filter === kind}
              >
                {d.filters[kind]}
                <span>{String(countFor(kind)).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <div className="disco-stats" aria-hidden="true">
            <span>{CATALOGUE_TOTAL} {d.tracksTotal}</span>
            <span>{TRACK_INDEX.length} {d.indexCount}</span>
          </div>

          <button
            type="button"
            className={`disco-index-toggle ${indexOpen ? 'is-open' : ''}`.trim()}
            onClick={() => setIndexOpen((value) => !value)}
            aria-expanded={indexOpen}
            aria-controls="track-index"
          >
            <span>{indexOpen ? d.indexClose : d.indexOpen}</span>
            <span className="disco-index-count">{String(TRACK_INDEX.length).padStart(2, '0')}</span>
            <i aria-hidden="true">{indexOpen ? '−' : '+'}</i>
          </button>
        </div>

        {indexOpen && (
          <TrackIndex onOpenAlbum={openAlbum} indexOpen={indexOpen} setIndexOpen={setIndexOpen} />
        )}

        <div className="albums">
          {filtered.map((album, index) => (
            <AlbumCard key={album.id} album={album} index={index} onOpen={openAlbum} />
          ))}
        </div>

        <div className="discography-foot">
          <p>
            <Rich text={d.foot} />
          </p>
          <span>{d.complete}</span>
        </div>
      </div>

      {selected && (
        <AlbumModal album={selected} onClose={() => setSelected(null)} onNavigate={setSelected} />
      )}
    </section>
  )
}
