import { useEffect, useRef, useState } from 'react'

const EMBED_SRC =
  'https://open.spotify.com/embed/artist/0hk4xVujcyOr6USD95wcWb?utm_source=generator&theme=0'

/**
 * Official Spotify artist player. The iframe only mounts when the card is
 * close to the viewport: the Listen chunk stays light and first paint never
 * pays for a third-party frame.
 */
export default function SpotifyEmbed({ title, note }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShow(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShow(true)
        io.disconnect()
      },
      { rootMargin: '320px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="spotify-card" ref={ref}>
      <div className="spotify-card-head">
        <span className="spotify-card-label">Spotify</span>
        <span className="spotify-card-title">{note}</span>
      </div>
      {show ? (
        <iframe
          className="spotify-frame"
          src={EMBED_SRC}
          title={title}
          width="100%"
          height="152"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="spotify-placeholder" aria-hidden="true">
          <span />
        </div>
      )}
    </div>
  )
}
