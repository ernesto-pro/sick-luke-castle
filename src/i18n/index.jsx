import { createContext, useContext, useMemo } from 'react'
import it from './locales/it'
import en from './locales/en'
import { BASE_URL } from '../lib/base'

const DICTS = { it, en }

export const LANG_CODES = ['it', 'en']

export const LANG_PATHS = {
  it: BASE_URL,
  en: `${BASE_URL}en/`,
}

const BASE_PREFIX = BASE_URL.replace(/\/+$/, '')

export function detectLang(pathname = typeof window === 'undefined' ? '/' : window.location.pathname) {
  const local = BASE_PREFIX && pathname.startsWith(BASE_PREFIX) ? pathname.slice(BASE_PREFIX.length) : pathname
  return /^\/en(?:\/|$)/.test(local || '/') ? 'en' : 'it'
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const lang = detectLang()

  const value = useMemo(() => {
    const t = DICTS[lang]

    const hrefFor = (code) => {
      const base = LANG_PATHS[code] || LANG_PATHS.it
      const hash = typeof window === 'undefined' ? '' : window.location.hash
      return `${base}${hash}`
    }

    return {
      lang,
      t,
      otherLang: lang === 'it' ? 'en' : 'it',
      hrefFor,
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside I18nProvider')
  return context
}
