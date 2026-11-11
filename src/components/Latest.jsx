import { ALBUMS } from '../data'
import { useI18n } from '../i18n'
import { Arrow, MagneticLink, Reveal, SectionLabel } from './ui'

const album = ALBUMS[0]

export default function Latest() {
  const { t } = useI18n()
  const copy = t.latest

  return (
    <section className="latest" aria-labelledby="latest-title">
      <div className="latest-bg" aria-hidden="true">
        <span className="latest-word">SHAYTAN</span>
        <span className="latest-aura" />
      </div>

      <span className="latest-vertical" aria-hidden="true">
        {copy.vertical}
      </span>

      <div className="shell latest-inner">
        <div className="latest-copy">
          <SectionLabel num={copy.num}>{copy.label}</SectionLabel>

          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="latest-title" className="latest-title">
            <span>SHAY</span>
            <span className="outline">TAN</span>
          </h2>
          <p className="latest-artist">Melons &amp; Sick Luke</p>

          <p className="latest-text">{copy.text}</p>

          <div className="latest-meta">
            <span>{album.date}</span>
            <span>{copy.tracks}</span>
            <span>{copy.type}</span>
          </div>

          <div className="latest-actions">
            <MagneticLink
              className="btn btn--blood"
              href={album.spotify}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              data-cursor-label={t.labels.play}
            >
              <span>{copy.listen}</span>
              <Arrow />
            </MagneticLink>
            <a className="link-line" href="#opere" data-cursor="link" data-cursor-label={t.labels.open}>
              {copy.allWorks} <Arrow />
            </a>
          </div>

          <Reveal className="latest-tracklist" delay={120}>
            <div className="tracklist-head">
              <span>Tracklist</span>
              <span>07</span>
            </div>
            <ol>
              {album.tracks.map((track, i) => (
                <li key={track}>
                  <span className="track-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="track-name">{track}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal className="latest-art" delay={80}>
          <div className="vinyl" aria-hidden="true">
            <div className="vinyl-disc">
              <span className="vinyl-label">SL</span>
            </div>
          </div>

          <figure className="latest-cover" data-cursor="view" data-cursor-label={t.labels.play}>
            <img
              src={album.cover}
              srcSet={`${album.cover.replace(/\.webp$/, '-720.webp')} 720w, ${album.cover} 900w`}
              sizes="(max-width: 700px) 82vw, 437px"
              alt={copy.coverAlt}
              width="900"
              height="900"
              loading="lazy"
              decoding="async"
            />
            <span className="cover-gloss" aria-hidden="true" />
            <span className="cover-badge">{t.discography.new}</span>
          </figure>

          <div className="latest-seal" aria-hidden="true">
            <span>MMXXVI</span>
            <strong>07</strong>
            <span>{copy.tracksShort}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
