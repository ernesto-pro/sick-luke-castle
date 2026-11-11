import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  BOOKING_EMAIL,
  INSTAGRAM,
  SOCIALS,
  SPOTIFY_ARTIST,
  TOURS,
  TOUR_YEARS,
} from '../data'
import { useI18n } from '../i18n'
import { useEscape, useInView, useLockBody, usePrefersReducedMotion } from '../lib/hooks'
import {
  Arrow,
  MagneticLink,
  Marquee,
  Reveal,
  Rich,
  SearchGlyph,
  SectionLabel,
} from './ui'

const TOUR_TYPES = ['all', 'club', 'festival', 'show', 'special']
const pad2 = (value) => String(value).padStart(2, '0')

const bookingMail = (b) =>
  `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(
    b.subject,
  )}&body=${encodeURIComponent(b.mailBody)}`

const fill = (template, values) =>
  String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '')

const mapsHref = (tour) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${tour.venue}, ${tour.city}${tour.area ? `, ${tour.area}` : ''}`,
  )}`

function TourStat({ value, label, ghost = false }) {
  const [ref, inView] = useInView({ threshold: 0.35 })
  const reduced = usePrefersReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return undefined
    if (reduced) {
      setDisplay(value)
      return undefined
    }

    let frame = 0
    const start = performance.now()
    const duration = 1100
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, value])

  return (
    <div
      ref={ref}
      className={`tour-stat ${ghost ? 'tour-stat--ghost' : ''}`.trim()}
      aria-hidden="true"
    >
      <span className="tour-stat-num">{pad2(display)}</span>
      <span className="tour-stat-label">{label}</span>
    </div>
  )
}

function CopyEmail({ label, copied, failed, className = '' }) {
  const [state, setState] = useState('idle')
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(BOOKING_EMAIL)
      } else {
        const field = document.createElement('textarea')
        field.value = BOOKING_EMAIL
        field.setAttribute('readonly', '')
        field.style.position = 'fixed'
        field.style.opacity = '0'
        document.body.appendChild(field)
        field.select()
        const ok = document.execCommand('copy')
        field.remove()
        if (!ok) throw new Error('copy-failed')
      }
      setState('copied')
    } catch {
      setState('failed')
    }

    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 2400)
  }

  const text = state === 'copied' ? copied : state === 'failed' ? failed : label

  return (
    <button
      type="button"
      className={`tour-copy ${className}`.trim()}
      onClick={copy}
      data-state={state}
      data-cursor="link"
      data-cursor-label={label}
    >
      <span className="tour-copy-text" aria-live="polite">
        {text}
      </span>
      <span className="tour-copy-glyph" aria-hidden="true">
        {state === 'copied' ? '✓' : state === 'failed' ? '!' : '⧉'}
      </span>
    </button>
  )
}

function TourNightModal({ tour, list, onClose, onNavigate }) {
  const { t, lang } = useI18n()
  const tr = t.tour
  const panelRef = useRef(null)
  const bodyRef = useRef(null)
  const closeRef = useRef(null)
  const entries = list.length ? list : [tour]
  const found = entries.findIndex(
    (item) => item.date === tour.date && item.city === tour.city,
  )
  const index = found < 0 ? 0 : found
  const hasSiblings = entries.length > 1
  const newer = index > 0 ? entries[index - 1] : null
  const older = index < entries.length - 1 ? entries[index + 1] : null

  const fmt = useMemo(() => {
    const locale = lang === 'en' ? 'en-GB' : 'it-IT'
    return {
      day: new Intl.DateTimeFormat(locale, { day: '2-digit' }),
      month: new Intl.DateTimeFormat(locale, { month: 'short' }),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
      full: new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    }
  }, [lang])

  const date = new Date(`${tour.date}T20:00:00`)
  const year = tour.date.slice(0, 4)
  const city = tr.cities[tour.city] || tour.city
  const fullDate = fmt.full.format(date)
  const requestHref = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(
    fill(tr.nightAskSubject, { city, date: fullDate, venue: tour.venue }),
  )}&body=${encodeURIComponent(
    fill(tr.nightAskBody, {
      city,
      date: fullDate,
      venue: tour.venue,
      event: tour.event,
    }),
  )}`

  useLockBody(true)
  useEscape(true, onClose)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()
    const panel = panelRef.current

    const onKey = (event) => {
      if (event.key !== 'Tab' || !panel) return
      const nodes = panel.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [tour.date])

  useEffect(() => {
    if (!hasSiblings) return undefined
    const onKey = (event) => {
      if (event.key === 'ArrowLeft' && older) {
        event.preventDefault()
        onNavigate(older)
      }
      if (event.key === 'ArrowRight' && newer) {
        event.preventDefault()
        onNavigate(newer)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [hasSiblings, onNavigate, older, newer])

  return (
    <div
      className="night-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-night-title"
    >
      <button
        type="button"
        className="night-backdrop"
        onClick={onClose}
        aria-label={tr.nightClose}
        tabIndex={-1}
      />

      <div className="night-panel" ref={panelRef}>
        <button
          type="button"
          className="night-close"
          onClick={onClose}
          ref={closeRef}
          aria-label={tr.nightClose}
        >
          {t.discography.close} <span aria-hidden="true">×</span>
        </button>

        <div className="night-poster">
          <span className="night-poster-ring" aria-hidden="true" />
          <span className="night-poster-kicker">
            {tr.nightKicker} · {year}
          </span>
          <span className="night-poster-day">{fmt.day.format(date)}</span>
          <span className="night-poster-month">
            {fmt.month.format(date)} <em>{year}</em>
          </span>
          <h3 className="night-poster-city" id="tour-night-title">
            {city}
          </h3>
          <span className="night-poster-weekday">{fmt.weekday.format(date)}</span>
          <span className={`tour-type tour-type--${tour.type} night-type`}>
            {tr.types[tour.type] || tour.type}
          </span>
          <span className="night-poster-index" aria-hidden="true">
            {pad2(index + 1)}
            <em>/{pad2(entries.length)}</em>
          </span>
        </div>

        <div className="night-body" ref={bodyRef}>
          <p className="night-index">
            {tr.nightIndex} <strong>{pad2(index + 1)}</strong>
            <span>/ {pad2(entries.length)}</span>
          </p>

          <p className="night-full-date">{fullDate}</p>

          <dl className="night-facts">
            <div>
              <dt>{tr.nightVenue}</dt>
              <dd>
                {tour.venue}
                {tour.area ? <span>{tour.area}</span> : null}
              </dd>
            </div>
            <div>
              <dt>{tr.nightEvent}</dt>
              <dd>{tour.event}</dd>
            </div>
            <div>
              <dt>{tr.nightEra}</dt>
              <dd>{tr.eras[year] || '—'}</dd>
            </div>
          </dl>

          <div className="night-actions">
            <a
              className="btn btn--blood"
              href={requestHref}
              data-cursor="link"
              data-cursor-label={t.labels.write}
            >
              <span>{tr.nightAsk}</span>
              <Arrow />
            </a>
            <a
              className="btn btn--ghost"
              href={mapsHref(tour)}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={t.labels.open}
            >
              <span>{tr.nightMaps}</span>
              <Arrow />
            </a>
          </div>

          {hasSiblings && (
            <nav className="night-nav" aria-label={tr.nightIndex}>
              {older && (
                <button type="button" onClick={() => onNavigate(older)}>
                  <span className="night-nav-dir">
                    <span aria-hidden="true">←</span> {tr.prevNight}
                  </span>
                  <span className="night-nav-title">
                    {tr.cities[older.city] || older.city}{' '}
                    <em>{older.date.slice(0, 4)}</em>
                  </span>
                </button>
              )}
              {newer && (
                <button type="button" onClick={() => onNavigate(newer)}>
                  <span className="night-nav-dir">
                    {tr.nextNight} <span aria-hidden="true">→</span>
                  </span>
                  <span className="night-nav-title">
                    {tr.cities[newer.city] || newer.city}{' '}
                    <em>{newer.date.slice(0, 4)}</em>
                  </span>
                </button>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}

function TourChapter() {
  const { t, lang } = useI18n()
  const tr = t.tour
  const b = t.booking
  const locale = lang === 'en' ? 'en-GB' : 'it-IT'

  const [typeFilter, setTypeFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const dayFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }),
    [locale],
  )
  const weekdayFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    [locale],
  )
  const fullFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
    [locale],
  )

  const query = search.trim().toLowerCase()
  const cityLabel = (tour) => tr.cities[tour.city] || tour.city
  const haystack = (tour) =>
    `${tour.city} ${cityLabel(tour)} ${tour.venue} ${tour.event} ${tour.area || ''} ${
      tr.types[tour.type] || ''
    }`.toLowerCase()

  const matches = (tour, skip = '') => {
    if (skip !== 'type' && typeFilter !== 'all' && tour.type !== typeFilter) return false
    if (skip !== 'year' && yearFilter !== 'all' && !tour.date.startsWith(`${yearFilter}-`)) {
      return false
    }
    if (skip !== 'query' && query && !haystack(tour).includes(query)) return false
    return true
  }

  const filtered = useMemo(
    () => TOURS.filter((tour) => matches(tour)),
    [typeFilter, yearFilter, query, tr],
  )

  const typeCounts = useMemo(() => {
    const counts = { all: 0 }
    TOURS.forEach((tour) => {
      if (!matches(tour, 'type')) return
      counts.all += 1
      counts[tour.type] = (counts[tour.type] || 0) + 1
    })
    return counts
  }, [typeFilter, yearFilter, query, tr])

  const yearCounts = useMemo(() => {
    const counts = { all: 0 }
    TOURS.forEach((tour) => {
      if (!matches(tour, 'year')) return
      counts.all += 1
      const group = tour.date.slice(0, 4)
      counts[group] = (counts[group] || 0) + 1
    })
    return counts
  }, [typeFilter, yearFilter, query, tr])

  const cityGroups = useMemo(() => {
    const map = new Map()
    TOURS.forEach((tour) => {
      if (!matches(tour, 'query')) return
      const entry = map.get(tour.city) || { city: tour.city, count: 0 }
      entry.count += 1
      map.set(tour.city, entry)
    })
    return [...map.values()].sort((a, b) => b.count - a.count)
  }, [typeFilter, yearFilter, query, tr])

  const groups = useMemo(
    () =>
      TOUR_YEARS.map((year) => ({
        year,
        dates: filtered.filter((tour) => tour.date.startsWith(`${year}-`)),
      })).filter((group) => group.dates.length),
    [filtered],
  )

  const cityTotal = useMemo(() => new Set(TOURS.map((tour) => tour.city)).size, [])
  const isFiltered = typeFilter !== 'all' || yearFilter !== 'all' || query.length > 0
  const resultLabel = filtered.length === 1 ? tr.resultOne : tr.resultMany
  const bookingHref = bookingMail(b)

  const resetFilters = () => {
    setTypeFilter('all')
    setYearFilter('all')
    setSearch('')
  }

  const pickCity = (city) => {
    setTypeFilter('all')
    setYearFilter('all')
    setSearch((current) => (current === city ? '' : city))
  }

  return (
    <div className="tour" id="tour">
      <header className="tour-head">
        <div className="tour-head-copy">
          <span className="tour-kicker">
            <span className="tour-kicker-dot" aria-hidden="true" />
            {tr.kicker}
          </span>
          <h3 className="h-display tour-title">
            {tr.titleA}
            <br />
            <Rich text={tr.titleB} />
          </h3>
          <p className="tour-side">{tr.side}</p>
        </div>

        <div className="tour-stats">
          <p className="sr-only">
            {TOURS.length} {tr.count}, {TOUR_YEARS.length} {tr.seasons}, {cityTotal}{' '}
            {tr.citiesStat}
          </p>
          <TourStat value={TOURS.length} label={tr.count} />
          <TourStat value={TOUR_YEARS.length} label={tr.seasons} ghost />
          <TourStat value={cityTotal} label={tr.citiesStat} />
        </div>
      </header>

      <div className="tour-archive-head">
        <span className="tour-archive-kicker">{tr.yearsLabel}</span>
        <span className="tour-archive-line" aria-hidden="true" />
        <span className="tour-archive-total">
          {TOUR_YEARS[TOUR_YEARS.length - 1]} — {TOUR_YEARS[0]}
        </span>
      </div>

      <div className="tour-console">
        <div className="tour-console-row">
          <div className="tour-filters" role="group" aria-label={tr.filtersAria}>
            {TOUR_TYPES.map((kind) => (
              <button
                key={kind}
                type="button"
                className={`tour-chip ${typeFilter === kind ? 'is-active' : ''}`.trim()}
                onClick={() => setTypeFilter(kind)}
                aria-pressed={typeFilter === kind}
              >
                {tr.filters[kind]}
                <span>{pad2(typeCounts[kind] || 0)}</span>
              </button>
            ))}
          </div>

          <div className="tour-search">
            <span className="tour-search-glyph" aria-hidden="true">
              <SearchGlyph />
            </span>
            <label className="sr-only" htmlFor="tour-search">
              {tr.searchAria}
            </label>
            <input
              id="tour-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSearch('')
              }}
              placeholder={tr.searchPlaceholder}
              autoComplete="off"
              spellCheck="false"
            />
            {search ? (
              <button
                type="button"
                className="tour-search-clear"
                onClick={() => setSearch('')}
                aria-label={tr.searchClear}
              >
                ×
              </button>
            ) : null}
          </div>
        </div>

        <div className="tour-console-row tour-console-row--years">
          <div className="tour-year-chips" role="group" aria-label={tr.yearsAria}>
            <button
              type="button"
              className={`tour-year-chip ${yearFilter === 'all' ? 'is-active' : ''}`.trim()}
              onClick={() => setYearFilter('all')}
              aria-pressed={yearFilter === 'all'}
            >
              {tr.allYears}
              <span>{pad2(yearCounts.all || 0)}</span>
            </button>
            {TOUR_YEARS.map((year) => (
              <button
                key={year}
                type="button"
                className={`tour-year-chip ${yearFilter === year ? 'is-active' : ''}`.trim()}
                onClick={() => setYearFilter(year)}
                aria-pressed={yearFilter === year}
              >
                {year}
                <span>{pad2(yearCounts[year] || 0)}</span>
              </button>
            ))}
          </div>

          <div className="tour-results">
            <span className="tour-results-count" role="status" aria-live="polite">
              <strong>{pad2(filtered.length)}</strong> {resultLabel}
            </span>
            {isFiltered ? (
              <button type="button" className="tour-reset" onClick={resetFilters}>
                {tr.reset}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="tour-cities" role="group" aria-label={tr.citiesAria}>
        <span className="tour-cities-label">{tr.citiesAria}</span>
        <div className="tour-cities-track">
          <button
            type="button"
            className={`tour-city ${!search ? 'is-active' : ''}`.trim()}
            onClick={() => setSearch('')}
            aria-pressed={!search}
          >
            {tr.allCities}
          </button>
          {cityGroups.map(({ city, count }) => {
            const active = search === city
            return (
              <button
                key={city}
                type="button"
                className={`tour-city ${active ? 'is-active' : ''}`.trim()}
                onClick={() => pickCity(city)}
                aria-pressed={active}
              >
                {cityLabel({ city })}
                <em>{pad2(count)}</em>
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length ? (
        <div className="tour-years">
          {groups.map((group, groupIndex) => (
            <section
              className="tour-year"
              key={group.year}
              aria-labelledby={`tour-year-${group.year}`}
              style={{ '--i': groupIndex }}
            >
              <header className="tour-year-head">
                <h4 id={`tour-year-${group.year}`}>{group.year}</h4>
                <span className="tour-year-era">{tr.eras[group.year] || ''}</span>
                {groupIndex === 0 && yearFilter === 'all' && typeFilter === 'all' && !query ? (
                  <span className="tour-year-flag">{tr.latest}</span>
                ) : null}
                <span className="tour-year-line" aria-hidden="true" />
                <span className="tour-year-count">
                  {pad2(group.dates.length)}{' '}
                  {group.dates.length === 1 ? tr.resultOne : tr.resultMany}
                </span>
              </header>

              <ol className="tour-list">
                {group.dates.map((tour) => {
                  const date = new Date(`${tour.date}T20:00:00`)
                  const city = cityLabel(tour)
                  return (
                    <li key={`${tour.date}-${tour.city}`}>
                      <button
                        type="button"
                        className="tour-row"
                        onClick={() => setSelected(tour)}
                        aria-haspopup="dialog"
                        data-cursor="view"
                        data-cursor-label={tr.openNight}
                      >
                        <span className="tour-row-date">
                          <time dateTime={tour.date} aria-label={fullFmt.format(date)}>
                            {dayFmt.format(date)}
                          </time>
                          <span className="tour-row-weekday">
                            {weekdayFmt.format(date)}
                          </span>
                        </span>
                        <span className="tour-row-place">
                          <strong>{city}</strong>
                          <span>
                            {tour.venue}
                            {tour.area ? ` · ${tour.area}` : ''}
                          </span>
                        </span>
                        <span className="tour-row-event">{tour.event}</span>
                        <span className={`tour-type tour-type--${tour.type}`}>
                          {tr.types[tour.type] || tour.type}
                        </span>
                        <span className="tour-row-arrow" aria-hidden="true">
                          <Arrow />
                        </span>
                        <span className="sr-only">{tr.openNight}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <div className="tour-empty" role="status">
          <span className="tour-empty-glyph" aria-hidden="true">
            ✦
          </span>
          <p>{tr.empty}</p>
          <button type="button" className="btn btn--ghost" onClick={resetFilters}>
            {tr.reset}
          </button>
        </div>
      )}

      <p className="tour-note">{tr.note}</p>

      <Reveal className="tour-manifesto" delay={40}>
        <span className="tour-manifesto-word" aria-hidden="true">
          SL
        </span>
        <div className="tour-manifesto-copy">
          <span className="tour-manifesto-kicker">
            <span className="tour-kicker-dot" aria-hidden="true" />
            {tr.manifestoKicker}
          </span>
          <p className="tour-manifesto-line">
            {tr.manifestoA}
            <br />
            <Rich text={tr.manifestoB} />
          </p>
          <p className="tour-manifesto-note">{tr.manifestoNote}</p>
        </div>
        <div className="tour-manifesto-actions">
          <MagneticLink
            className="btn btn--blood"
            href={bookingHref}
            data-cursor="link"
            data-cursor-label={t.labels.write}
            strength={0.08}
          >
            <span>{tr.manifestoCta}</span>
            <Arrow />
          </MagneticLink>
          <CopyEmail
            label={tr.copyEmail}
            copied={tr.emailCopied}
            failed={tr.emailCopyFail}
            className="tour-copy--large"
          />
        </div>
      </Reveal>

      {selected
        ? createPortal(
            <TourNightModal
              tour={selected}
              list={filtered}
              onClose={() => setSelected(null)}
              onNavigate={setSelected}
            />,
            document.body,
          )
        : null}
    </div>
  )
}

export default function Booking() {
  const { t } = useI18n()
  const b = t.booking
  const tr = t.tour

  const bookingHref = bookingMail(b)

  return (
    <section id="invito" className="section booking">
      <div className="booking-bg" aria-hidden="true">
        <Marquee
          items={b.bands}
          speed={70}
          separator={false}
          className="booking-band"
        />
        <Marquee
          items={b.bands}
          speed={92}
          reverse
          separator={false}
          className="booking-band booking-band--two"
        />
      </div>

      <div className="shell">
        <SectionLabel num="07">{b.label}</SectionLabel>

        <div className="booking-hero">
          <div className="booking-lead">
            <p className="eyebrow">{b.eyebrow}</p>
            <h2 className="h-display booking-title">
              <Rich text={b.titleA} />
              <br />
              {b.titleB}
            </h2>
            <Reveal>
              <p className="booking-text">{b.text}</p>
            </Reveal>
          </div>

          <Reveal className="booking-pass" delay={90}>
            <span className="booking-pass-ring" aria-hidden="true" />
            <div className="booking-pass-head">
              <span className="booking-pass-kicker">
                <span className="booking-pass-seal" aria-hidden="true" />
                {tr.bookingKicker}
              </span>
              <span className="booking-pass-tag">{b.exclusive}</span>
            </div>

            <div className="booking-pass-meta">
              <p className="booking-pass-label">{tr.bookingEyebrow}</p>
              <span className="booking-pass-serial" aria-hidden="true">
                {tr.passSerial}
              </span>
            </div>

            <MagneticLink
              className="booking-pass-cta"
              href={bookingHref}
              data-cursor="link"
              data-cursor-label={t.labels.write}
              strength={0.08}
            >
              <span className="booking-pass-cta-copy">
                <strong>{b.emailCta}</strong>
                <span>{BOOKING_EMAIL}</span>
              </span>
              <span className="booking-pass-arrow">
                <Arrow />
              </span>
            </MagneticLink>

            <div className="booking-pass-foot">
              <span className="booking-pass-alt">{b.dmAlt}</span>
              <div className="booking-pass-links">
                <a
                  className="link-line"
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  data-cursor-label={t.labels.open}
                >
                  {b.dm} <Arrow />
                </a>
                <CopyEmail
                  label={tr.copyEmail}
                  copied={tr.emailCopied}
                  failed={tr.emailCopyFail}
                />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="booking-services">
          {b.services.map((service, i) => (
            <Reveal className="service" key={service.title} delay={i * 90}>
              <span className="service-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </Reveal>
          ))}
        </div>

        <TourChapter />

        <Reveal delay={60}>
          <a
            className="link-line booking-listen"
            href={SPOTIFY_ARTIST}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            data-cursor-label={t.labels.play}
          >
            {b.orListen} <Arrow />
          </a>
        </Reveal>

        <div className="social-strip">
          {SOCIALS.map((social, i) => (
            <Reveal key={social.label} delay={i * 50}>
              <a
                className="social-card"
                href={social.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                data-cursor-label={t.labels.open}
              >
                <span className="social-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="social-label">{social.label}</span>
                <span className="social-handle">{social.handle}</span>
                <span className="social-note">{t.socialNotes[social.key]}</span>
                <Arrow />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
