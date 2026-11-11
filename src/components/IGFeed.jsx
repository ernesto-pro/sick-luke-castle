import { useRef } from 'react'
import { IG_PROFILE, IG_POSTS, IG_REELS, IG_CASTLE, IG_CASTLE_URL } from '../data'
import { useI18n } from '../i18n'
import { Arrow } from './ui'

const compact = (n, lang) => {
  const dec = lang === 'it' ? ',' : '.'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace('.0', '').replace('.', dec)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '').replace('.', dec)}K`
  return `${n}`
}

const Heart = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 20.7 10.6 19.4C5 14.9 2 12.2 2 8.6 2 5.6 4.3 3.4 7.2 3.4c1.7 0 3.4.8 4.8 2.3 1.4-1.5 3.1-2.3 4.8-2.3 2.9 0 5.2 2.2 5.2 5.2 0 3.6-3 6.3-8.6 10.8z" />
  </svg>
)

const Play = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M8 5.2v13.6L20 12 8 5.2z" />
  </svg>
)

const Verified = () => (
  <svg className="ig-verified" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 1.5 14.6 4l3.5-.3.9 3.4 3 1.9-1.4 3.2 1.4 3.2-3 1.9-.9 3.4-3.5-.3L12 22.5 9.4 20l-3.5.3-.9-3.4-3-1.9L3.4 12 2 8.8l3-1.9.9-3.4 3.5.3L12 1.5Z" />
    <path d="m10.8 15.4 5.6-5.6-1.5-1.5-4.1 4.1-2-2-1.5 1.5 3.5 3.5Z" className="ig-verified-cut" />
  </svg>
)

const postSrcSet = (src) => `${src.replace('.webp', '-400.webp')} 400w, ${src} 720w`
const castleSrcSet = (src) => `${src.replace('.webp', '-360.webp')} 360w, ${src} 720w`

export default function IGFeed() {
  const { t, lang } = useI18n()
  const ig = t.ig
  const railRef = useRef(null)

  const date = (iso) =>
    new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(`${iso}T12:00:00`))

  const fmt = (n) => compact(n, lang)

  const scrollRail = (dir) => {
    const el = railRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({
      left: dir * Math.min(el.clientWidth * 0.8, 660),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="ig-module">
      <p className="ig-kicker">
        <span className="ig-live" aria-hidden="true" />
        <strong>{ig.label}</strong>
        <i aria-hidden="true">·</i>
        {ig.eyebrow}
      </p>

      <div className="ig-head">
        <div className="ig-head-copy">
          <h3 className="h-display ig-title">
            {ig.titleA}
            <br />
            <em>{ig.titleB}</em>
          </h3>
          <p className="ig-side">{ig.side}</p>
        </div>

        <a
          className="ig-profile"
          data-tilt="3"
          href={IG_PROFILE.url}
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
          data-cursor-label={ig.open}
        >
          <span className="ig-avatar">
            <img src={IG_PROFILE.avatar} alt="" width="150" height="150" loading="lazy" decoding="async" />
          </span>
          <span className="ig-profile-copy">
            <span className="ig-profile-head">
              <strong>{IG_PROFILE.handle}</strong>
              <Verified />
              <span className="sr-only">{ig.verified}</span>
            </span>
            <em className="ig-bio">{IG_PROFILE.bio}</em>
            <span className="ig-stats">
              <span className="ig-stat">
                <strong>{fmt(IG_PROFILE.followers)}</strong>
                <em>{ig.followers}</em>
              </span>
              <span className="ig-stat">
                <strong>{fmt(IG_PROFILE.posts)}</strong>
                <em>{ig.posts}</em>
              </span>
              <span className="ig-stat">
                <strong>{fmt(IG_PROFILE.following)}</strong>
                <em>{ig.following}</em>
              </span>
            </span>
          </span>
          <span className="ig-profile-cta">
            <em>{ig.follow}</em>
            <i>
              <Arrow />
            </i>
          </span>
        </a>
      </div>

      <div className="ig-feed-head">
        <span className="ig-block-label">
          <i aria-hidden="true" />
          {ig.postLabel}
          <em>12 / 300</em>
        </span>
        <span className="ig-block-note">{ig.postNote}</span>
      </div>

      <div className="ig-grid">
        {IG_POSTS.map((post, i) => (
          <a
            key={post.href}
            className="ig-tile"
            data-tilt="5"
            href={post.href}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            data-cursor-label={ig.open}
          >
            <img
              src={post.src}
              srcSet={postSrcSet(post.src)}
              sizes={i === 0 ? '(max-width: 620px) 92vw, (max-width: 900px) 62vw, 62vw' : '(max-width: 620px) 46vw, (max-width: 900px) 30vw, 30vw'}
              alt=""
              width="720"
              height="720"
              loading="lazy"
              decoding="async"
            />
            <span className="ig-tile-shade" aria-hidden="true" />
            <span className="ig-tile-top">
              <span className={`ig-kind ${post.kind === 'reel' ? 'is-reel' : ''}`}>
                {post.kind === 'reel' ? <Play /> : null}
                {post.kind === 'reel' ? ig.reel : ig.post}
              </span>
              <span className="ig-date">{date(post.date)}</span>
            </span>
            <span className="ig-tile-body">
              <span className="sr-only">{ig.open}</span>
              <span className="ig-metrics">
                <Heart />
                {fmt(post.likes)} {ig.likes}
                {post.plays ? (
                  <>
                    <i aria-hidden="true">·</i>
                    <Play />
                    {fmt(post.plays)}
                  </>
                ) : null}
              </span>
              {post.caption ? <strong>{post.caption}</strong> : null}
              <em className="ig-open">
                {ig.open} <Arrow />
              </em>
            </span>
          </a>
        ))}
      </div>

      <div className="ig-reels">
        <div className="ig-reels-head">
          <span className="ig-block-label">
            <i aria-hidden="true" />
            {ig.reelsLabel}
            <em>12</em>
          </span>
          <span className="ig-block-note">{ig.reelsNote}</span>
          <span className="ig-reels-tools">
            <a className="ig-reels-all" href={`${IG_PROFILE.url}/reels/`} target="_blank" rel="noreferrer">
              {ig.allReels} <Arrow />
            </a>
            <span className="ig-reels-nav">
              <button type="button" onClick={() => scrollRail(-1)} aria-label={ig.prev}>
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" onClick={() => scrollRail(1)} aria-label={ig.next}>
                <span aria-hidden="true">→</span>
              </button>
            </span>
          </span>
        </div>

        <div className="ig-rail" ref={railRef} role="region" tabIndex={0} aria-label={ig.reelsLabel}>
          {IG_REELS.map((reel, i) => (
            <a
              key={reel.href}
              className="ig-reel"
              data-tilt="3.5"
              href={reel.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={ig.open}
            >
              <img
                src={reel.src}
                alt=""
                width="460"
                height="460"
                loading="lazy"
                decoding="async"
              />
              <span className="ig-reel-shade" aria-hidden="true" />
              <span className="ig-reel-play" aria-hidden="true">
                <Play />
              </span>
              <span className="ig-reel-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="ig-reel-meta">
                <span className="sr-only">{ig.open}</span>
                <em>{date(reel.date)}</em>
                {reel.caption ? <strong>{reel.caption}</strong> : null}
                <span>
                  <Play /> {fmt(reel.plays)} {ig.plays}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="ig-castle">
        <div className="ig-castle-head">
          <div>
            <p className="eyebrow">{ig.castleLabel}</p>
            <h4 className="ig-castle-handle">
              @castellogrigioscuro <Verified />
            </h4>
            <p className="ig-castle-side">{ig.castleSide}</p>
          </div>
          <a className="btn btn--ghost" href={IG_CASTLE_URL} target="_blank" rel="noreferrer">
            <span>{ig.castleCta}</span>
            <Arrow />
          </a>
        </div>

        <div className="ig-castle-grid">
          {IG_CASTLE.map((post) => (
            <a
              key={post.href}
              className="ig-castle-tile"
              data-tilt="5"
              href={post.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={ig.open}
            >
              <img
                src={post.src}
                srcSet={castleSrcSet(post.src)}
                sizes="(max-width: 620px) 44vw, 24vw"
                alt=""
                width="720"
                height="720"
                loading="lazy"
                decoding="async"
              />
              <span className="ig-tile-shade" aria-hidden="true" />
              <span className="ig-castle-meta">
                <span>
                  <Heart /> {fmt(post.likes)}
                </span>
                <em>{date(post.date)}</em>
              </span>
              <span className="ig-castle-caption">
                <span className="sr-only">{ig.open}</span>
                {post.caption}
              </span>
            </a>
          ))}
        </div>
      </div>

      <p className="ig-note">{ig.note}</p>
    </div>
  )
}
