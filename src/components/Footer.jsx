import { NAV, SOCIALS } from '../data'
import { useI18n } from '../i18n'
import { Arrow } from './ui'
import X2Mark from './X2Mark'
import LangSwitch from './LangSwitch'

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useI18n()
  const f = t.footer

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="logo-mark logo-mark--footer">
              <X2Mark />
            </span>
            <p>
              {f.openA}
              <br />
              <em>{f.openB}</em>
            </p>
          </div>

          <nav className="footer-nav" aria-label={f.navAria}>
            <span className="footer-label">{f.index}</span>
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                <span>{item.index}</span>
                {t.nav[item.id]}
              </a>
            ))}
          </nav>

          <div className="footer-socials">
            <span className="footer-label">{f.follow}</span>
            {SOCIALS.slice(0, 4).map((social) => (
              <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
                {social.label}
                <Arrow />
              </a>
            ))}
          </div>

          <div className="footer-contact">
            <span className="footer-label">{f.contact}</span>
            <a href="https://www.instagram.com/sicklukex2" target="_blank" rel="noreferrer">
              DM · @sicklukex2
              <Arrow />
            </a>
            <p>{f.contactNote}</p>
          </div>
        </div>

        <div className="footer-wordmark" aria-hidden="true">
          <span>SICK</span>
          <span className="outline">LUKE</span>
          <X2Mark />
        </div>

        <div className="footer-bottom">
          <span>© MMXXVI SICK LUKE — {year}</span>
          <span className="footer-mid">{f.city}</span>
          <span>{f.dedication}</span>
          <LangSwitch className="lang-switch--footer" />
          <a href="#top" className="to-top" data-cursor="link" data-cursor-label={t.labels.up}>
            {f.top} <Arrow />
          </a>
        </div>

        <div className="footer-credit">
          <span className="footer-credit-line" aria-hidden="true" />
          <a
            className="footer-credit-link"
            href="https://btrworks.it"
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            data-cursor-label={f.creditCursor}
          >
            <span className="footer-credit-label">{f.creditLabel}</span>
            <span className="footer-credit-brand">
              BTRWORKS<span>.IT</span>
            </span>
            <span className="footer-credit-arrow" aria-hidden="true">
              <Arrow />
            </span>
          </a>
          <span className="footer-credit-line" aria-hidden="true" />
        </div>
      </div>
    </footer>
  )
}
