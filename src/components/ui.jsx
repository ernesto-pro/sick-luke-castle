import { Fragment } from 'react'
import { useInView, useMagnetic } from '../lib/hooks'

export function Rich({ text }) {
  const parts = String(text).split('*')
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <em key={i}>{part}</em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

export function Arrow({ className = '' }) {
  return (
    <svg className={`arrow ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 18 18 6M8 6h10v10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SearchGlyph({ className = '' }) {
  return (
    <svg className={`search-glyph ${className}`.trim()} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="10.6" cy="10.6" r="6.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="m15.4 15.4 4.4 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function InstagramGlyph({ className = '' }) {
  return (
    <svg className={`ig-glyph ${className}`.trim()} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
    </svg>
  )
}

export function SectionLabel({ num, children }) {
  return (
    <div className="label">
      <span className="label-ghost" aria-hidden="true">
        {num}
      </span>
      <span className="label-num">{num}</span>
      <span className="label-text">{children}</span>
      <span className="label-barcode" aria-hidden="true" />
      <span className="label-rule" />
      <span className="label-serial" aria-hidden="true">
        SL—{/^\d+$/.test(String(num)) ? num : '00'}
      </span>
    </div>
  )
}

export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={{ '--d': `${delay}ms`, ...(rest.style || {}) }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function MaskText({ lines, as: Tag = 'span', className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.25 })
  return (
    <Tag ref={ref} className={`mask-text ${inView ? 'is-in' : ''} ${className}`.trim()}>
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <span className="mask-inner" style={{ '--i': i }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}

export function SplitWord({ text, offset = 0 }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span className="split-char" style={{ '--i': i + offset }} key={`${char}-${i}`}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  )
}

export function Marquee({
  items,
  speed = 44,
  reverse = false,
  className = '',
  separator = true,
  label,
}) {
  const group = (hidden) => (
    <div className="marquee-group" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span className="marquee-item" key={i}>
          <span>{item}</span>
          {separator && <span className="marquee-glyph" aria-hidden="true" />}
        </span>
      ))}
    </div>
  )

  return (
    <div
      className={`marquee ${reverse ? 'is-reverse' : ''} ${className}`.trim()}
      style={{ '--dur': `${speed}s` }}
      aria-label={label}
    >
      <div className="marquee-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}

export function MagneticLink({ className = '', children, strength = 0.2, ...props }) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(strength)
  return (
    <a
      ref={ref}
      className={`magnetic ${className}`.trim()}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </a>
  )
}
