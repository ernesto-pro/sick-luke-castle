import { LANG_CODES, useI18n } from '../i18n'
import { useRitual } from '../ritual'

export default function LangSwitch({ className = '' }) {
  const { lang, t, hrefFor } = useI18n()
  const { grant } = useRitual()

  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label={t.header.langSwitch}>
      {LANG_CODES.map((code) => {
        const current = lang === code
        return (
          <a
            key={code}
            href={hrefFor(code)}
            hrefLang={code}
            lang={code}
            className={current ? 'is-active' : ''}
            aria-current={current ? 'true' : undefined}
            onClick={(event) => {
              if (current) {
                event.preventDefault()
                return
              }
              grant('lingua')
            }}
          >
            <span aria-hidden="true">{code.toUpperCase()}</span>
            <span className="sr-only">{t.header.langNames[code]}</span>
          </a>
        )
      })}
    </div>
  )
}
