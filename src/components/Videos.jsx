import { useEffect, useMemo, useRef, useState } from 'react'
import {
  VIDEO_FILTERS,
  YOUTUBE_CHANNEL,
  formatViews,
  videoTitle,
  youtubeUrl,
} from '../data'
import { VIDEOS, VIDEO_YEARS, VLOGS, VLOG_YEARS } from '../videos'
import { useI18n } from '../i18n'
import { useEscape, useLockBody } from '../lib/hooks'
import { Arrow, Reveal, Rich, SectionLabel } from './ui'
import { withBase } from '../lib/base'

const PAGE = 9

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5.5v13l11-6.5Z" fill="currentColor" />
    </svg>
  )
}

function formatDuration(seconds) {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function VideoModal({ video, onClose }) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const { t } = useI18n()
  const v = t.videos
  const curated = v.copy[video.id]
  const title = curated?.title || videoTitle(video.title)
  const blurb = curated?.blurb || v.blurbs[video.kind]
  useLockBody(true)
  useEscape(true, onClose)

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    const panel = panelRef.current
    const onKey = (e) => {
      if (e.key !== 'Tab' || !panel) return
      const nodes = panel.querySelectorAll('a[href], button:not([disabled]), iframe')
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
      previous?.focus?.()
    }
  }, [])

  return (
    <div className="video-modal" role="dialog" aria-modal="true" aria-label={`${title} — ${v.modalAria}`}>
      <button type="button" className="video-backdrop" onClick={onClose} aria-label={v.close} tabIndex={-1} />
      <div className="video-frame" ref={panelRef}>
        <button type="button" className="video-close" onClick={onClose} ref={closeRef} aria-label={v.close}>
          {v.close} <span aria-hidden="true">×</span>
        </button>
        <div className="video-embed">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} — Sick Luke`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="video-caption">
          <span>
            {title} <em>{v.kinds[video.kind]}</em>
          </span>
          <span>
            {video.date} · {formatViews(video.views)} {v.views} ·{' '}
            <a href={youtubeUrl(video.id)} target="_blank" rel="noreferrer">
              YouTube <Arrow />
            </a>
          </span>
        </div>
        <p className="video-caption-note">{blurb}</p>
      </div>
    </div>
  )
}

function VlogChapter({ onOpen }) {
  const { t } = useI18n()
  const v = t.videos
  const cfg = v.vlog
  const [latest, ...rest] = VLOGS
  const latestCopy = v.copy[latest.id]
  const latestTitle = latestCopy?.title || videoTitle(latest.title)

  return (
    <div className="vlog" id="vlog">
      <header className="vlog-head">
        <div className="vlog-head-copy">
          <span className="vlog-kicker">
            {cfg.kicker}
          </span>
          <h3 className="h-display vlog-title">
            {cfg.titleA}
            <br />
            <Rich text={cfg.titleB} />
          </h3>
          <p className="vlog-side">{cfg.side}</p>
        </div>
        <div className="vlog-counter" aria-hidden="true">
          <span className="vlog-counter-num">{String(VLOGS.length).padStart(2, '0')}</span>
          <span className="vlog-counter-label">{cfg.count}</span>
        </div>
      </header>

      <Reveal className="vlog-featured-wrap">
        <button
          type="button"
          className="vlog-featured"
          onClick={() => onOpen(latest)}
          data-cursor="play"
          data-cursor-label={t.labels.play}
        >
          <img
            src={withBase(`/img/yt/${latest.id}.webp`)}
            srcSet={`${withBase(`/img/yt/${latest.id}-480.webp`)} 480w, ${withBase(`/img/yt/${latest.id}.webp`)} 960w`}
            sizes="(max-width: 760px) 94vw, 92vw"
            alt={`${latestTitle} — Sick Luke`}
            width="960"
            height="540"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.src = `https://i.ytimg.com/vi/${latest.id}/hqdefault.jpg`
            }}
          />
          <span className="vlog-featured-shade" aria-hidden="true" />
          <span className="vlog-badge">{cfg.latest}</span>
          <span className="vlog-featured-play" aria-hidden="true">
            <PlayIcon />
          </span>
          <span className="vlog-featured-body">
            <span className="sr-only">{v.watchAria}</span>
            <span className="vlog-featured-meta">
              {latest.date} · {formatDuration(latest.seconds)} · {formatViews(latest.views)} {v.views}
            </span>
            <strong>{latestTitle}</strong>
            <span className="vlog-featured-note">{latestCopy?.blurb || cfg.latestNote}</span>
            <span className="vlog-featured-cta">
              {cfg.watchLatest} <PlayIcon />
            </span>
          </span>
        </button>
      </Reveal>

      <div className="vlog-years">
        {VLOG_YEARS.map((year) => {
          const items = rest.filter((video) => video.year === year)
          if (!items.length) return null
          return (
            <section className="vlog-year" key={year} role="group" aria-label={String(year)}>
              <header className="vlog-year-head">
                <h4 id={`vlog-year-${year}`}>{year}</h4>
                <span>
                  {String(items.length).padStart(2, '0')} {cfg.episodes}
                </span>
                <span className="vlog-year-line" aria-hidden="true" />
              </header>
              <div className="vlog-grid">
                {items.map((video, i) => {
                  const curated = v.copy[video.id]
                  const title = curated?.title || videoTitle(video.title)
                  return (
                    <Reveal key={video.id} delay={(i % 3) * 55} className="vlog-card-wrap">
                      <button
                        type="button"
                        className="vlog-card"
                        onClick={() => onOpen(video)}
                        data-cursor="play"
                        data-cursor-label={t.labels.play}
                      >
                        <span className="vlog-card-media">
                          <img
                            src={withBase(`/img/yt/${video.id}.webp`)}
                            srcSet={`${withBase(`/img/yt/${video.id}-480.webp`)} 480w, ${withBase(`/img/yt/${video.id}.webp`)} 960w`}
                            sizes="(max-width: 760px) 94vw, (max-width: 1100px) 46vw, 30vw"
                            alt={`${title} — Sick Luke`}
                            width="960"
                            height="540"
                            loading="lazy"
                            decoding="async"
                            onError={(event) => {
                              event.currentTarget.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
                            }}
                          />
                          <span className="vlog-card-shade" aria-hidden="true" />
                          <span className="vlog-card-play" aria-hidden="true">
                            <PlayIcon />
                          </span>
                          <span className="vlog-card-duration">{formatDuration(video.seconds)}</span>
                        </span>
                        <span className="vlog-card-body">
                          <span className="sr-only">{v.watchAria}</span>
                          <span className="vlog-card-date">{video.date}</span>
                          <strong className="vlog-card-title" title={title}>
                            {title}
                          </strong>
                          <span className="vlog-card-views">
                            {formatViews(video.views)} {v.views}
                          </span>
                        </span>
                      </button>
                    </Reveal>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <div className="vlog-foot">
        <p>
          <span aria-hidden="true">✦</span> {cfg.hint}
        </p>
        <a
          className="btn btn--ghost"
          href="#video-archive"
          data-cursor="link"
          data-cursor-label={cfg.jump}
        >
          <span>{cfg.openArchive}</span>
          <Arrow />
        </a>
      </div>
    </div>
  )
}

export default function Videos() {
  const [filter, setFilter] = useState('all')
  const [year, setYear] = useState('all')
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE)
  const [active, setActive] = useState(null)
  const { t } = useI18n()
  const v = t.videos

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return VIDEOS.filter((video) => {
      if (filter !== 'all' && video.kind !== filter) return false
      if (year !== 'all' && video.year !== year) return false
      if (!needle) return true
      return `${video.title} ${videoTitle(video.title)} ${video.year}`.toLowerCase().includes(needle)
    })
  }, [filter, year, query])

  const shown = results.slice(0, visible)
  const countFor = (kind) => (kind === 'all' ? VIDEOS.length : VIDEOS.filter((video) => video.kind === kind).length)

  useEffect(() => {
    setVisible(PAGE)
  }, [filter, year, query])

  const openVideo = (video) => {
    setActive(video)
  }

  const changeFilter = (kind) => {
    setFilter(kind)
    setVisible(PAGE)
  }

  useEffect(() => {
    const onOpenVideo = (event) => {
      const video = VIDEOS.find((item) => item.id === event.detail?.id)
      if (!video) return
      setActive(video)
    }
    window.addEventListener('sl:open-video', onOpenVideo)
    return () => window.removeEventListener('sl:open-video', onOpenVideo)
  }, [])

  return (
    <section id="visioni" className="section videos">
      <div className="shell">
        <SectionLabel num="06">{v.label}</SectionLabel>

        <div className="section-head">
          <h2 className="h-display section-title">
            {v.titleA}
            <br />
            <Rich text={v.titleB} />
          </h2>
          <div className="section-head-side">
            <p>{v.side}</p>
            <a
              className="link-line"
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={t.labels.youtube}
            >
              {v.subscribe} <Arrow />
            </a>
          </div>
        </div>

        <VlogChapter onOpen={openVideo} />

        <div className="video-archive-head" id="video-archive">
          <span className="video-archive-kicker">{v.archiveKicker}</span>
          <h3 className="h-display video-archive-title">
            <Rich text={v.archiveTitle} />
          </h3>
          <p className="video-archive-note">{v.archiveNote}</p>
        </div>

        <div className="video-toolbar">
          <div className="video-filters" role="group" aria-label={v.filterAria}>
            {VIDEO_FILTERS.map((kind) => (
              <button
                key={kind}
                type="button"
                className={`filter-chip ${filter === kind ? 'is-active' : ''}`}
                onClick={() => changeFilter(kind)}
                aria-pressed={filter === kind}
              >
                {v.kinds[kind]}
                <span>{String(countFor(kind)).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <div className="video-controls">
            <div className="video-search">
              <label className="sr-only" htmlFor="video-search">
                {v.searchAria}
              </label>
              <input
                id="video-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={v.searchPlaceholder}
                autoComplete="off"
                spellCheck="false"
              />
              {query ? (
                <button type="button" onClick={() => setQuery('')} aria-label={v.close}>
                  ×
                </button>
              ) : (
                <span aria-hidden="true">✦</span>
              )}
            </div>

            <label className="video-year">
              <span className="sr-only">{v.yearAria}</span>
              <select value={year} onChange={(event) => setYear(event.target.value)} aria-label={v.yearAria}>
                <option value="all">{v.allYears}</option>
                {VIDEO_YEARS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="video-meta-row">
          <span className="video-count">
            {String(shown.length).padStart(2, '0')} / {String(results.length).padStart(2, '0')} {v.count}
          </span>
          <span className="video-results">
            {query.trim() || year !== 'all' || filter !== 'all'
              ? `${results.length} ${v.resultsLabel}`
              : `${VIDEO_YEARS[VIDEO_YEARS.length - 1]} — ${VIDEO_YEARS[0]}`}
          </span>
        </div>

        {shown.length ? (
          <div className="video-mosaic">
            {shown.map((video, i) => {
              const curated = v.copy[video.id]
              const title = curated?.title || videoTitle(video.title)
              return (
                <Reveal key={video.id} delay={(i % 3) * 60} className={`video-tile-wrap ${i === 0 ? 'is-featured' : ''}`}>
                  <button
                    type="button"
                    className={`video-card video-tile ${i === 0 ? 'is-featured' : ''}`}
                    onClick={() => openVideo(video)}
                    data-cursor="play"
                    data-cursor-label={t.labels.play}
                  >
                    <img
                      src={withBase(`/img/yt/${video.id}.webp`)}
                      srcSet={`${withBase(`/img/yt/${video.id}-480.webp`)} 480w, ${withBase(`/img/yt/${video.id}.webp`)} 960w`}
                      sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw"
                      alt={`${title} — Sick Luke`}
                      width="960"
                      height="540"
                      loading={i < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
                      }}
                    />
                    <span className="video-shade" aria-hidden="true" />
                    <span className="video-tile-index" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="video-play">
                      <PlayIcon />
                    </span>
                    <span className="video-info">
                      <span className="sr-only">{v.watchAria}</span>
                      <span className="video-kind">
                        {v.kinds[video.kind]} · {video.date}
                      </span>
                      <strong>{title}</strong>
                      <span className="video-feat">
                        {video.year} · {formatDuration(video.seconds)}
                      </span>
                    </span>
                    <span className="video-corner">{formatViews(video.views)}</span>
                  </button>
                </Reveal>
              )
            })}
          </div>
        ) : (
          <div className="video-empty">
            <span aria-hidden="true">✦</span>
            <p>{v.empty}</p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setFilter('all')
                setYear('all')
                setQuery('')
              }}
            >
              <span>{v.kinds.all}</span>
              <span className="video-more-count">{String(VIDEOS.length).padStart(2, '0')}</span>
            </button>
          </div>
        )}

        <div className="video-actions">
          {visible < results.length ? (
            <button
              type="button"
              className="btn btn--ghost video-more"
              onClick={() => setVisible((value) => value + PAGE)}
            >
              <span>{v.loadMore}</span>
              <span className="video-more-count">+{Math.min(PAGE, results.length - visible)}</span>
            </button>
          ) : (
            <a
              className="btn btn--ghost"
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={t.labels.youtube}
            >
              <span>{v.all}</span>
              <Arrow />
            </a>
          )}
          <p>
            <span aria-hidden="true">✦</span> {v.noteA} {v.noteB}
          </p>
        </div>

        <div className="video-foot">
          <span>{v.footA}</span>
          <span>YouTube · Sick Luke</span>
        </div>
      </div>

      {active && <VideoModal video={active} onClose={() => setActive(null)} />}
    </section>
  )
}
