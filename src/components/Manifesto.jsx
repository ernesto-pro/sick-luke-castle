import { useI18n } from '../i18n'
import { MaskText, Reveal, Rich, SectionLabel } from './ui'
import { withBase } from '../lib/base'

export default function Manifesto() {
  const { t } = useI18n()
  const m = t.manifesto

  return (
    <section id="conte" className="section manifesto">
      <div className="shell">
        <SectionLabel num="01">{m.label}</SectionLabel>

        <div className="manifesto-grid">
          <div className="manifesto-copy">
            <p className="eyebrow">{m.eyebrow}</p>
            <h2 className="h-display manifesto-title">
              <MaskText lines={m.title.map((line) => <Rich text={line} />)} />
            </h2>

            <Reveal className="manifesto-lead" delay={120}>
              <p>{m.lead}</p>
            </Reveal>

            <div className="manifesto-body">
              <Reveal delay={160}>
                <p>
                  <Rich text={m.p1} />
                </p>
              </Reveal>
              <Reveal delay={220}>
                <p>
                  <Rich text={m.p2} />
                </p>
              </Reveal>
              <Reveal delay={280}>
                <p className="manifesto-sign">
                  {m.sign}
                  <span>{m.signSub}</span>
                </p>
              </Reveal>
            </div>

            <Reveal className="manifesto-signature" delay={320}>
              <span className="sig-name">Sick Luke</span>
              <span className="sig-meta">{m.sigMeta}</span>
            </Reveal>
          </div>

          <Reveal className="manifesto-visual" delay={120}>
            <figure className="portrait-frame" data-cursor="view" data-cursor-label={t.labels.archive}>
              <div className="portrait-img">
                <img
                  src={withBase('/img/sickluke-portrait.webp')}
                  alt={m.portraitAlt}
                  width="532"
                  height="640"
                  loading="lazy"
                  decoding="async"
                />
                <span className="portrait-tint" aria-hidden="true" />
              </div>
              <span className="corner corner--tl" aria-hidden="true" />
              <span className="corner corner--tr" aria-hidden="true" />
              <span className="corner corner--bl" aria-hidden="true" />
              <span className="corner corner--br" aria-hidden="true" />
              <figcaption>
                <span>{m.figNum}</span>
                <span>{m.figPlace}</span>
              </figcaption>
            </figure>

            <figure className="archive-card" data-cursor="view" data-cursor-label="2018">
              <img
                src={withBase('/img/sickluke-press.webp')}
                srcSet={`${withBase('/img/sickluke-press-480.webp')} 480w, ${withBase('/img/sickluke-press.webp')} 900w`}
                sizes="(max-width: 700px) 44vw, 220px"
                alt={m.archiveAlt}
                width="900"
                height="647"
                loading="lazy"
                decoding="async"
              />
              <figcaption>{m.archiveCap}</figcaption>
            </figure>

            <div className="visual-stamp" aria-hidden="true">
              <span>EST.</span>
              <strong>1994</strong>
              <span>{m.est}</span>
            </div>
          </Reveal>
        </div>

        <div className="stats">
          {t.stats.map((stat, i) => (
            <Reveal className="stat" key={stat.value} delay={i * 90}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </Reveal>
          ))}
        </div>

        <div className="timeline-wrap">
          <div className="timeline-head">
            <p className="eyebrow">{m.timelineEyebrow}</p>
            <span>1994 — 2026</span>
          </div>
          <ol className="timeline">
            {t.timeline.map((item, i) => (
              <Reveal as="li" className="timeline-item" key={item.year} delay={i * 70}>
                <span className="timeline-dot" aria-hidden="true" />
                <strong>{item.year}</strong>
                <span className="timeline-place">{item.place}</span>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
