import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ALBUMS,
  BOOKING_EMAIL,
  NAV,
  SOCIALS,
  SPOTIFY_ARTIST,
  TRACK_INDEX,
  videoTitle,
} from '../data'
import { VIDEOS } from '../videos'
import { useI18n } from '../i18n'
import { useFocusTrap, useLockBody, usePrefersReducedMotion } from '../lib/hooks'
import { SearchGlyph } from './ui'
import { withBase } from '../lib/base'

const GROUP_ORDER = ['sections', 'albums', 'tracks', 'videos', 'actions']
const EMPTY_GROUPS = ['sections', 'actions', 'albums']
const LIMITS = { sections: 6, albums: 5, tracks: 7, videos: 7, actions: 6 }

const SOCIAL = Object.fromEntries(SOCIALS.map((social) => [social.key, social]))
const IG_URL = SOCIAL.instagram?.url || 'https://www.instagram.com/sicklukex2'

const normalize = (value) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/* direct hit > prefix > word start > loose substring > subsequence */
function scoreMatch(haystack, needle, primary = '') {
  if (!needle) return 1
  const hay = normalize(haystack)
  if (!hay) return 0
  if (hay.startsWith(needle)) return 160
  const at = hay.indexOf(needle)
  if (at > -1) return 130 - Math.min(40, at)
  const words = needle.split(' ').filter(Boolean)
  if (words.length > 1 && words.every((word) => hay.includes(word))) return 92

  // loose typing is only forgiven on the title, never across the whole record
  const fuzzy = normalize(primary)
  if (!fuzzy || fuzzy.length > 90) return 0
  let cursor = 0
  let gaps = 0
  let previous = -1
  for (let i = 0; i < needle.length; i += 1) {
    const next = fuzzy.indexOf(needle[i], cursor)
    if (next === -1) return 0
    if (previous !== -1) gaps += next - previous - 1
    previous = next
    cursor = next + 1
  }
  return Math.max(24, 74 - gaps)
}

const splitFeature = (title) => {
  const match = title.match(/\(feat\.\s*([^)]+)\)/i)
  return {
    title: title.replace(/\s*\(feat\.[^)]*\)\s*$/i, '').trim(),
    feature: match ? match[1] : '',
  }
}

function GroupGlyph({ group }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.4',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    focusable: 'false',
  }
  if (group === 'albums') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.4" />
        <circle cx="12" cy="12" r="2.1" />
        <path d="M12 3.6v3.1" />
      </svg>
    )
  }
  if (group === 'tracks') {
    return (
      <svg {...common}>
        <path d="M9 17.4V6.2l9-1.8v11.2" />
        <circle cx="6.4" cy="18" r="2.6" />
        <circle cx="15.4" cy="16.2" r="2.6" />
      </svg>
    )
  }
  if (group === 'videos') {
    return (
      <svg {...common}>
        <rect x="3.2" y="5.4" width="17.6" height="13.2" rx="2.4" />
        <path d="m10.2 9.4 5.3 2.6-5.3 2.6Z" />
      </svg>
    )
  }
  if (group === 'actions') {
    return (
      <svg {...common}>
        <path d="M12 3.4v4.2M12 16.4v4.2M3.4 12h4.2M16.4 12h4.2" />
        <path d="m6.6 6.6 2.4 2.4M15 15l2.4 2.4M17.4 6.6 15 9M9 15l-2.4 2.4" />
        <circle cx="12" cy="12" r="2.2" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M12 3.2 21 12l-9 8.8L3 12Z" />
      <path d="M12 7.6 16.4 12 12 16.4 7.6 12Z" opacity=".55" />
    </svg>
  )
}

function EnterGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M20 5v7.2a3.8 3.8 0 0 1-3.8 3.8H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="m8.4 12.4-3.6 3.6 3.6 3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CommandPalette({ enabled = true }) {
  const { t, otherLang, hrefFor } = useI18n()
  const reduce = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [note, setNote] = useState('')
  const panelRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const openRef = useRef(open)
  openRef.current = open

  useLockBody(open)
  useFocusTrap(open, panelRef, inputRef)

  const close = useCallback(() => setOpen(false), [])

  // ⌘K toggles; opening from a trigger closes whatever dialog is in front
  const requestOpen = useCallback((force = false) => {
    if (!force && openRef.current) {
      setOpen(false)
      return
    }
    const dialog = [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')].find(
      (node) => {
        if (node.closest('.cmdk')) return false
        const style = window.getComputedStyle(node)
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          node.getClientRects().length > 0
        )
      },
    )
    if (dialog) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    }
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    const onKey = (event) => {
      const target = event.target
      const typing =
        target instanceof Element &&
        (target.matches('input, textarea, select') || target.isContentEditable)
      const key = event.key.toLowerCase()

      if ((event.metaKey || event.ctrlKey) && !event.altKey && key === 'k') {
        event.preventDefault()
        requestOpen(false)
        return
      }
      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        requestOpen(true)
      }
    }
    const onOpen = () => requestOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('sl:open-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('sl:open-palette', onOpen)
    }
  }, [enabled, requestOpen])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setNote('')
    setActiveIndex(0)
  }, [open])

  // Escape closes the palette wherever focus happens to sit inside it.
  useEffect(() => {
    if (!open) return undefined
    const onEsc = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open])

  const pool = useMemo(() => {
    const items = []
    let order = 0
    const push = (item) => {
      items.push({ ...item, order })
      order += 1
    }

    NAV.forEach((section) => {
      const label = t.nav[section.id]
      push({
        id: `section-${section.id}`,
        group: 'sections',
        type: 'section',
        payload: section.id,
        title: label,
        meta: `${section.index} · ${t.palette.sectionHint}`,
        search: `${label} ${section.index} ${section.id} ${t.palette.sectionHint}`,
        primary: label,
      })
    })

    push({
      id: 'section-vlog',
      group: 'sections',
      type: 'section',
      payload: 'vlog',
      title: t.videos.vlog.palette,
      meta: `06 · ${t.palette.sectionHint}`,
      search: `${t.videos.vlog.palette} vlog day in the life diario diary episodi episodes 06`,
      primary: t.videos.vlog.palette,
    })

    push({
      id: 'section-tour',
      group: 'sections',
      type: 'section',
      payload: 'tour',
      title: t.tour.palette,
      meta: `07 · ${t.palette.sectionHint}`,
      search: `${t.tour.palette} tour live date dates concerti concerts booking serate club festival 07`,
      primary: t.tour.palette,
    })

    ALBUMS.forEach((album) => {
      const type = t.discography.types[album.type] || album.type
      push({
        id: `album-${album.id}`,
        group: 'albums',
        type: 'album',
        payload: album.id,
        title: album.title,
        meta: `${album.artist} · ${album.year} · ${type}`,
        search: `${album.title} ${album.artist} ${album.year} ${type} ${album.tags.join(' ')}`,
        primary: album.title,
        thumb: album.cover,
      })
    })

    TRACK_INDEX.forEach((track, index) => {
      const split = splitFeature(track.title)
      const album = track.album
      push({
        id: `track-${index}-${album.albumId}`,
        group: 'tracks',
        type: 'track',
        payload: album.albumId,
        title: split.title,
        meta: `${album.albumTitle} · ${album.year}${split.feature ? ` · feat. ${split.feature}` : ''}`,
        search: `${track.title} ${album.albumTitle} ${track.years.join(' ')} ${split.feature}`,
        primary: split.title,
      })
    })

    VIDEOS.forEach((video, index) => {
      const title = t.videos.copy[video.id]?.title || videoTitle(video.title)
      const baseTitle = title.replace(/\s*\(feat\.[^)]*\)\s*$/i, '').trim()
      const kind = t.videos.kinds[video.kind] || ''
      push({
        id: `video-${index}-${video.id}`,
        group: 'videos',
        type: 'video',
        payload: video.id,
        title,
        meta: `${video.year} · ${kind}`,
        search: `${video.title} ${title} ${video.year} ${kind} ${video.date}`,
        primary: baseTitle,
        thumb: withBase(`/img/yt/${video.id}-480.webp`),
      })
    })

    const action = (key, title, meta, search = '') =>
      push({
        id: `action-${key}`,
        group: 'actions',
        type: 'action',
        payload: key,
        title,
        meta,
        search: `${title} ${meta} ${search} ${key}`,
        primary: title,
      })

    const a = t.palette.actions
    action('sound', a.sound, a.soundHint, 'audio drone atmosfera ambience sound')
    action('lang', a.lang, a.langHint, `${otherLang} english italiano language lingua`)
    action('copy', a.copy, a.copyHint, 'link share condividi copia url')
    action('top', a.top, a.topHint, 'top inizio home up scroll')
    action('instagram', a.instagram, SOCIAL.instagram?.handle || '@sicklukex2', 'ig social reel feed')
    action('spotify', a.spotify, 'Sick Luke', 'music musica stream artist')
    action(
      'booking',
      a.booking,
      BOOKING_EMAIL,
      'booking email contatto contact serata night club festival data live',
    )

    return items
  }, [t, otherLang])

  const grouped = useMemo(() => {
    const needle = normalize(query)
    const scored = pool
      .map((item) => ({ item, score: scoreMatch(item.search, needle, item.primary) }))
      .filter(({ item, score }) => (needle ? score > 0 : EMPTY_GROUPS.includes(item.group)))
      .sort((a, b) => b.score - a.score || a.item.order - b.item.order)

    const buckets = new Map()
    scored.forEach(({ item }) => {
      if (!buckets.has(item.group)) buckets.set(item.group, [])
      buckets.get(item.group).push(item)
    })

    const order = needle ? GROUP_ORDER : ['sections', 'albums', 'actions']
    return order
      .filter((group) => buckets.has(group))
      .map((group) => {
        const all = buckets.get(group)
        const limit = needle ? LIMITS[group] : all.length
        return { group, total: all.length, items: all.slice(0, limit) }
      })
  }, [pool, query])

  const flat = useMemo(() => grouped.flatMap((group) => group.items), [grouped])
  const cursor = flat.length ? Math.min(activeIndex, flat.length - 1) : -1

  useEffect(() => {
    if (activeIndex > flat.length - 1) {
      setActiveIndex(Math.max(0, flat.length - 1))
    }
  }, [flat.length, activeIndex])

  useEffect(() => {
    if (!open || cursor < 0) return
    const body = listRef.current
    const node = document.getElementById(`cmdk-option-${cursor}`)
    if (!body || !node) return
    if (cursor === 0) {
      body.scrollTop = 0
      return
    }
    // manual scroll: never inherits the page's smooth-scroll behaviour
    const top = node.offsetTop
    const bottom = top + node.offsetHeight
    if (top < body.scrollTop) body.scrollTop = Math.max(0, top - 10)
    else if (bottom > body.scrollTop + body.clientHeight) {
      body.scrollTop = bottom - body.clientHeight + 10
    }
  }, [cursor, open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const defer = (fn) => window.setTimeout(fn, 50)

  const waitFor = (id, run, tries = 18) => {
    if (document.getElementById(id)) {
      run()
      return
    }
    if (tries <= 0) return
    window.setTimeout(() => waitFor(id, run, tries - 1), 90)
  }

  const remember = (hash) => {
    try {
      window.history.replaceState(null, '', hash)
    } catch {
      /* noop */
    }
  }

  const jumpTo = (id) => {
    defer(() => {
      let attempts = 0
      let cancelled = false
      const cleanup = () => {
        window.removeEventListener('wheel', cancel)
        window.removeEventListener('touchstart', cancel)
        window.removeEventListener('keydown', cancel)
      }
      const cancel = () => {
        cancelled = true
        cleanup()
      }
      const settle = () => {
        if (cancelled) return
        const node = document.getElementById(id)
        if (!node) return
        node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
        attempts += 1
        // lazy grids above the target can expand while scrolling: correct the landing
        if (attempts < 10) window.setTimeout(settle, 180)
        else cleanup()
      }
      window.addEventListener('wheel', cancel, { passive: true })
      window.addEventListener('touchstart', cancel, { passive: true })
      window.addEventListener('keydown', cancel)
      if (document.getElementById(id)) settle()
      else waitFor(id, settle)
      remember(`#${id}`)
    })
  }

  const openAlbum = (id) => {
    defer(() => {
      waitFor('opere', () => {
        document.getElementById('opere')?.scrollIntoView({ behavior: 'auto', block: 'start' })
        remember('#opere')
        window.dispatchEvent(new CustomEvent('sl:open-album', { detail: { id } }))
      })
    })
  }

  const openVideo = (id) => {
    defer(() => {
      waitFor('visioni', () => {
        document.getElementById('visioni')?.scrollIntoView({ behavior: 'auto', block: 'start' })
        remember('#visioni')
        window.dispatchEvent(new CustomEvent('sl:open-video', { detail: { id } }))
      })
    })
  }

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash}`
    let copied = false
    try {
      await navigator.clipboard.writeText(url)
      copied = true
    } catch {
      try {
        const field = document.createElement('textarea')
        field.value = url
        field.setAttribute('readonly', '')
        field.style.position = 'fixed'
        field.style.opacity = '0'
        document.body.appendChild(field)
        field.select()
        copied = document.execCommand('copy')
        field.remove()
      } catch {
        copied = false
      }
    }
    setNote(copied ? t.palette.copied : t.palette.copyFail)
    window.setTimeout(close, copied ? 1400 : 2200)
  }

  const runAction = (key) => {
    if (key === 'copy') {
      copyLink()
      return
    }
    if (key === 'instagram' || key === 'spotify') {
      window.open(key === 'instagram' ? IG_URL : SPOTIFY_ARTIST, '_blank', 'noopener')
      close()
      return
    }
    if (key === 'booking') {
      window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(
        t.booking.subject,
      )}&body=${encodeURIComponent(t.booking.mailBody)}`
      close()
      return
    }
    close()
    if (key === 'sound') {
      window.dispatchEvent(new CustomEvent('sl:toggle-sound'))
    } else if (key === 'lang') {
      window.location.assign(hrefFor(otherLang))
    } else if (key === 'top') {
      defer(() => {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
        remember(`${window.location.pathname}${window.location.search}`)
      })
    }
  }

  const runItem = (item) => {
    if (!item) return
    if (item.type === 'section') {
      close()
      jumpTo(item.payload)
    } else if (item.type === 'album' || item.type === 'track') {
      close()
      openAlbum(item.payload)
    } else if (item.type === 'video') {
      close()
      openVideo(item.payload)
    } else {
      runAction(item.payload)
    }
  }

  const onInputKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (flat.length) setActiveIndex((index) => (index + 1) % flat.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (flat.length) setActiveIndex((index) => (index - 1 + flat.length) % flat.length)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(Math.max(0, flat.length - 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      runItem(flat[cursor])
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  if (!open) return null

  const activeOption = flat[cursor]

  return (
    <div className="cmdk" role="presentation">
      <div className="cmdk-backdrop" onClick={close} aria-hidden="true" />
      <div
        className="cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cmdk-title"
        ref={panelRef}
      >
        <span className="cmdk-grain" aria-hidden="true" />
        <span className="cmdk-frame" aria-hidden="true" />
        <h2 id="cmdk-title" className="sr-only">
          {t.palette.title}
        </h2>

        <div className="cmdk-head">
          <span className="cmdk-search-icon" aria-hidden="true">
            <SearchGlyph />
          </span>
          <input
            ref={inputRef}
            id="cmdk-input"
            className="cmdk-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-autocomplete="list"
            aria-activedescendant={cursor >= 0 ? `cmdk-option-${cursor}` : undefined}
            aria-label={t.palette.placeholder}
            aria-keyshortcuts="Meta+K Control+K"
            placeholder={t.palette.placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
              setNote('')
              if (listRef.current) listRef.current.scrollTop = 0
            }}
            onKeyDown={onInputKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            enterKeyHint="go"
          />
          {query ? (
            <button
              type="button"
              className="cmdk-clear"
              onClick={() => {
                setQuery('')
                setActiveIndex(0)
                inputRef.current?.focus()
              }}
              aria-label={t.palette.clear}
            >
              ×
            </button>
          ) : null}
          <kbd className="cmdk-esc">ESC</kbd>
          <button type="button" className="cmdk-close" onClick={close} aria-label={t.palette.close}>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div
          className="cmdk-body"
          id="cmdk-list"
          role="listbox"
          aria-label={t.palette.listAria}
          ref={listRef}
        >
          {grouped.map((group) => (
            <div
              className="cmdk-group"
              role="group"
              aria-label={t.palette.groups[group.group]}
              key={group.group}
            >
              <div className="cmdk-group-head" aria-hidden="true">
                <GroupGlyph group={group.group} />
                <span>{t.palette.groups[group.group]}</span>
                <em>{String(group.total).padStart(2, '0')}</em>
                <i />
              </div>
              {group.items.map((item) => {
                const index = flat.indexOf(item)
                const selected = index === cursor
                return (
                  <button
                    key={item.id}
                    id={`cmdk-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    className={`cmdk-option ${selected ? 'is-active' : ''}`}
                    onMouseMove={() => {
                      if (activeIndex !== index) setActiveIndex(index)
                    }}
                    onClick={() => runItem(item)}
                  >
                    <span
                      className={`cmdk-option-icon ${item.thumb ? 'has-thumb' : ''}`}
                      aria-hidden="true"
                    >
                      {item.thumb ? (
                        <img src={item.thumb} alt="" width="40" height="40" loading="lazy" decoding="async" />
                      ) : (
                        <GroupGlyph group={group.group} />
                      )}
                    </span>
                    <span className="cmdk-option-copy">
                      <strong>{item.title}</strong>
                      <em>{item.meta}</em>
                    </span>
                    <span className="cmdk-option-enter" aria-hidden="true">
                      <EnterGlyph />
                    </span>
                  </button>
                )
              })}
            </div>
          ))}

          {!flat.length ? (
            <div className="cmdk-empty">
              <span className="cmdk-empty-mark" aria-hidden="true">
                ✦
              </span>
              <strong>{t.palette.emptyTitle}</strong>
              <p>{t.palette.emptyHint}</p>
            </div>
          ) : null}
        </div>

        <div className="cmdk-foot">
          <div className="cmdk-hints" aria-hidden="true">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              {t.palette.hints.navigate}
            </span>
            <span>
              <kbd>↵</kbd>
              {t.palette.hints.select}
            </span>
          </div>
          <p className="cmdk-status" role="status" aria-live="polite">
            {note ||
              (activeOption
                ? `${String(cursor + 1).padStart(2, '0')} / ${String(flat.length).padStart(2, '0')}`
                : `${String(flat.length).padStart(2, '0')} ${t.palette.results}`)}
          </p>
          <span className="cmdk-brand" aria-hidden="true">
            Castello Grigio Scuro · MMXXVI
          </span>
        </div>
      </div>
    </div>
  )
}
