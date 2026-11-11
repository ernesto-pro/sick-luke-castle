import { useRef, useState } from 'react'
import {
  SPOTIFY_ARTIST,
  SPOTIFY_ARTIST_IMAGE,
  TOP_TRACKS,
  spotifyTrackUrl,
} from '../data'
import { useI18n } from '../i18n'
import { useRitual } from '../ritual'
import { Arrow, MagneticLink, Reveal, SectionLabel } from './ui'

function fmt(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '0:00'
  const total = Math.floor(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

function PlayIcon({ playing }) {
  return playing ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="7" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
      <rect x="13.4" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5.2v13.6L19 12Z" fill="currentColor" />
    </svg>
  )
}

export default function Listen() {
  const { t } = useI18n()
  const { grant } = useRitual()
  const l = t.listen
  const audioRef = useRef(null)
  const [active, setActive] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)

  const current = active !== null ? TOP_TRACKS[active] : null

  const start = (index) => {
    const audio = audioRef.current
    if (!audio) return
    setError(false)
    if (index === active) {
      if (audio.paused) {
        audio
          .play()
          .then(() => grant('battito'))
          .catch(() => setError(true))
      } else {
        audio.pause()
      }
      return
    }
    setActive(index)
    setProgress(0)
    setTime(0)
    setDuration(0)
    audio.src = TOP_TRACKS[index].preview
    audio.currentTime = 0
    audio
      .play()
      .then(() => grant('battito'))
      .catch(() => setError(true))
  }

  const seek = (event) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    const pct = Number(event.target.value)
    audio.currentTime = (pct / 100) * audio.duration
    setProgress(pct)
  }

  const close = () => {
    const audio = audioRef.current
    if (audio) audio.pause()
    setActive(null)
    setPlaying(false)
    setProgress(0)
    setTime(0)
  }

  const next = () => {
    const upcoming = (active ?? -1) + 1
    if (upcoming < TOP_TRACKS.length) start(upcoming)
    else close()
  }

  return (
    <section id="ascolto" className="section listen">
      <div className="listen-glow" aria-hidden="true" />
      <div className="shell">
        <SectionLabel num="03">{l.label}</SectionLabel>

        <div className="listen-grid">
          <div className="listen-intro">
            <p className="eyebrow">{l.eyebrow}</p>
            <h2 className="h-display listen-title">
              {l.titleA}
              <br />
              <em>{l.titleB}</em>
            </h2>

            <Reveal delay={100}>
              <p className="listen-copy">{l.copy}</p>
            </Reveal>

            <Reveal className="listen-artist" delay={160}>
              <span className="listen-avatar">
                <img
                  src={SPOTIFY_ARTIST_IMAGE}
                  alt={l.avatarAlt}
                  width="320"
                  height="320"
                  loading="lazy"
                  decoding="async"
                />
                <span className="listen-avatar-ring" aria-hidden="true" />
              </span>
              <span className="listen-artist-copy">
                <strong>Sick Luke</strong>
                <span>{l.monthly}</span>
              </span>
              <MagneticLink
                className="listen-follow"
                href={SPOTIFY_ARTIST}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                data-cursor-label={t.labels.spotify}
              >
                {l.follow} <Arrow />
              </MagneticLink>
            </Reveal>

            <span className="listen-note">
              <i aria-hidden="true" />
              {l.note}
            </span>

            <blockquote className="listen-quote">
              <span aria-hidden="true">“</span>
              {l.quoteA} <em>{l.quoteB}</em>
              <span aria-hidden="true">”</span>
            </blockquote>
          </div>

          <Reveal className="listen-panel" delay={80}>
            <div className="listen-panel-head">
              <span>{l.panel}</span>
              <span>{l.count}</span>
            </div>

            <ol className="top-tracks">
              {TOP_TRACKS.map((track, i) => {
                const isActive = active === i
                return (
                  <li key={track.id} className={`top-track ${isActive ? 'is-active' : ''}`}>
                    <div className="top-track-row">
                      <button
                        type="button"
                        className="top-track-main"
                        onClick={() => start(i)}
                        aria-pressed={isActive && playing}
                        data-cursor="play"
                        data-cursor-label={isActive && playing ? t.labels.pause : t.labels.play}
                      >
                        <span className="sr-only">
                          {isActive && playing ? l.pauseAria : l.playAria} — {l.previewAria}
                        </span>
                        <span className="top-track-index">{String(i + 1).padStart(2, '0')}</span>
                        <span className="top-track-info">
                          <strong>{track.title}</strong>
                          <span>{track.artists}</span>
                        </span>
                        <span className="top-track-time">
                          {isActive && duration > 0 ? fmt(time) : fmt(track.duration)}
                        </span>
                        <span className="top-track-icon">
                          <PlayIcon playing={isActive && playing} />
                        </span>
                      </button>
                      <a
                        className="top-track-out"
                        href={spotifyTrackUrl(track.id)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${l.openAria} ${track.title} ${l.onSpotify}`}
                        data-cursor="link"
                        data-cursor-label={t.labels.open}
                      >
                        <Arrow />
                      </a>
                    </div>

                    {isActive && (
                      <div className="top-track-progress">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.1"
                          value={progress}
                          onChange={seek}
                          aria-label={`${l.seekAria} ${track.title}`}
                          style={{ '--p': `${progress}%` }}
                        />
                        <span>
                          {fmt(time)} / {fmt(duration)}
                        </span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>

            {error && (
              <p className="listen-error" role="status">
                {l.error} <a href={SPOTIFY_ARTIST} target="_blank" rel="noreferrer">{l.openSpotify} <Arrow /></a>
              </p>
            )}

            <div className="listen-panel-foot">
              <span>
                {l.courtesy}
              </span>
              <a href={SPOTIFY_ARTIST} target="_blank" rel="noreferrer" className="link-line">
                {l.all} <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="none"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget
          setTime(audio.currentTime * 1000)
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setProgress((audio.currentTime / audio.duration) * 100)
          }
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration * 1000)}
        onEnded={next}
        onError={() => setError(true)}
      />

      {current && (
        <div className="mini-player" role="status" aria-live="polite">
          <span className={`mini-eq ${playing ? 'is-on' : ''}`} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="mini-copy">
            <em>{l.mini}</em>
            <strong>{current.title}</strong>
          </span>
          <button
            type="button"
            className="mini-btn"
            onClick={() => start(active)}
            aria-label={playing ? l.miniPause : l.miniPlay}
          >
            <PlayIcon playing={playing} />
          </button>
          <button type="button" className="mini-close" onClick={close} aria-label={l.closePlayer}>
            ×
          </button>
        </div>
      )}
    </section>
  )
}
