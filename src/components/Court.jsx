import { ALBUMS, COURT, CREDITS } from '../data'
import { useI18n } from '../i18n'
import { Reveal, SectionLabel, Marquee, Arrow } from './ui'

const albumLinks = Object.fromEntries(ALBUMS.map((album) => [album.id, album.spotify]))

export default function Court() {
  const { t } = useI18n()
  const c = t.court

  return (
    <section id="corte" className="section court">
      <div className="shell">
        <SectionLabel num="04">{c.label}</SectionLabel>

        <div className="court-head">
          <h2 className="h-display court-title">
            {c.titleA}
            <br />
            <em>{c.titleB}</em>
          </h2>
          <div className="court-copy">
            <Reveal>
              <p>{c.p1}</p>
            </Reveal>
            <Reveal delay={100}>
              <p>{c.p2}</p>
            </Reveal>
          </div>
        </div>

        <div className="credits">
          <div className="credits-head" aria-hidden="true">
            <span>{c.headTrack}</span>
            <span>{c.headArtists}</span>
            <span>{c.headProject}</span>
            <span>{c.headYear}</span>
            <span />
          </div>

          {CREDITS.map((credit, i) => (
            <Reveal key={credit.track} delay={i * 60}>
              <a
                className="credit-row"
                href={albumLinks[credit.album]}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                data-cursor-label={t.labels.play}
              >
                <span className="credit-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="credit-track">{credit.track}</span>
                <span className="credit-artists">{credit.artists}</span>
                <span className="credit-project">{credit.project}</span>
                <span className="credit-year">{credit.year}</span>
                <span className="credit-arrow">
                  <Arrow />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="court-bands" aria-label={c.bandsAria}>
          <Marquee items={COURT.slice(0, 22)} speed={58} separator={false} className="court-band court-band--solid" />
          <Marquee
            items={COURT.slice(22)}
            speed={72}
            reverse
            separator={false}
            className="court-band court-band--outline"
          />
        </div>

        <p className="court-note">
          <span aria-hidden="true">✦</span> {c.noteA} {c.noteB}
        </p>
      </div>
    </section>
  )
}
