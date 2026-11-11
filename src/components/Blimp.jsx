/**
 * The blimp — black airship with an LED banner.
 * Moodboard reference: "THE WORLD IS YOURS".
 */
export default function Blimp({ label }) {
  return (
    <div className="hero-blimp" aria-hidden="true">
      <svg className="hero-blimp-body" viewBox="0 0 340 150" fill="none">
        <defs>
          <linearGradient id="blimpHull" x1="40" y1="24" x2="290" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3a3742" />
            <stop offset="0.34" stopColor="#16141b" />
            <stop offset="0.62" stopColor="#0b0a10" />
            <stop offset="1" stopColor="#26232e" />
          </linearGradient>
          <linearGradient id="blimpSheen" x1="70" y1="26" x2="200" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#efe8dc" stopOpacity="0.36" />
            <stop offset="1" stopColor="#efe8dc" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="blimpFin" x1="250" y1="20" x2="330" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff3355" />
            <stop offset="0.55" stopColor="#a80d26" />
            <stop offset="1" stopColor="#4c0512" />
          </linearGradient>
          <linearGradient id="blimpGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0d492" />
            <stop offset="1" stopColor="#9b7526" />
          </linearGradient>
          <radialGradient id="blimpGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ff6a48" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ff6a48" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="170" cy="80" rx="160" ry="46" fill="url(#blimpGlow)" opacity="0.55" />

        {/* tail fins */}
        <path d="M246 44c22-14 54-20 74-14l-6 20c-16-4-36 0-52 9z" fill="url(#blimpFin)" opacity="0.9" />
        <path d="M246 76c22 14 54 19 74 13l-6-20c-16 4-36 0-52-9z" fill="url(#blimpFin)" opacity="0.72" />
        <path d="M268 60c18-2 40 4 54 12-16 6-38 8-54 4z" fill="#120a11" stroke="#4a1220" strokeWidth="1" />

        {/* hull */}
        <ellipse cx="164" cy="60" rx="128" ry="42" fill="url(#blimpHull)" stroke="#4a4552" strokeWidth="0.8" />
        <ellipse cx="152" cy="46" rx="104" ry="24" fill="url(#blimpSheen)" />
        <path d="M40 60c0-18 30-33 70-38" stroke="#efe8dc" strokeOpacity="0.2" strokeWidth="1" />
        <path d="M60 92c26 12 62 14 96 8" stroke="#000" strokeOpacity="0.5" strokeWidth="1.4" />
        <path d="M96 22c16 26 18 54 8 78" stroke="#efe8dc" strokeOpacity="0.07" strokeWidth="1" />
        <path d="M150 18c12 28 13 56 4 82" stroke="#efe8dc" strokeOpacity="0.06" strokeWidth="1" />
        <path d="M204 20c8 26 7 52-2 76" stroke="#efe8dc" strokeOpacity="0.06" strokeWidth="1" />

        {/* gondola */}
        <path d="M128 96c0-4 4-7 9-7h44c5 0 9 3 9 7l-3 10c-1 4-4 6-8 6h-40c-4 0-7-2-8-6z" fill="#0b0a10" stroke="#56505e" strokeWidth="0.9" />
        <g fill="#ffcf8a" opacity="0.85">
          <rect x="134" y="97" width="5" height="4" rx="1" />
          <rect x="144" y="97" width="5" height="4" rx="1" />
          <rect x="154" y="97" width="5" height="4" rx="1" />
          <rect x="164" y="97" width="5" height="4" rx="1" />
          <rect x="174" y="97" width="5" height="4" rx="1" />
        </g>
        <path d="M120 68c3 12 6 20 12 26M208 68c-3 12-6 20-12 26" stroke="#3d3846" strokeWidth="1.2" />

        {/* engines */}
        <circle cx="272" cy="82" r="6" fill="#0a0910" stroke="#4a4552" strokeWidth="1" />
        <path d="M278 82h8" stroke="url(#blimpGold)" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <span className="hero-blimp-led">{label}</span>
    </div>
  )
}
