const LEFT_WING =
  'M146 320 C132 302 112 286 88 276 C66 267 42 268 26 282 C12 294 12 310 22 324 C10 328 4 340 10 354 C16 368 32 375 47 373 C44 388 53 400 68 403 C83 406 98 397 106 383 C114 400 131 409 146 401 Z'

const RIGHT_WING =
  'M154 316 L196 286 L244 268 L290 286 L282 320 L256 334 L268 358 L236 362 L242 392 L208 386 L204 418 L180 400 L158 396 Z'

const BODY =
  'M150 270 C135 289 130 320 132 354 C134 394 142 434 150 468 C158 434 166 394 168 354 C170 320 165 289 150 270 Z'

const CHAIN_PATH = 'M150 24 C144 70 156 132 150 180 C146 214 150 234 150 248'

const GLINTS = [
  [84, 300, 0, 0.86],
  [54, 342, 1.3, 0.68],
  [98, 372, 2.2, 0.78],
  [116, 314, 0.7, 0.6],
  [64, 386, 3.1, 0.72],
  [224, 298, 1.8, 0.9],
  [264, 320, 0.4, 0.66],
  [238, 350, 2.8, 0.78],
  [206, 386, 1.6, 0.7],
  [186, 414, 2, 0.6],
  [150, 326, 2.4, 0.82],
  [150, 400, 0.9, 0.7],
  [150, 344, 1.5, 0.82],
]

const STAR =
  'M0 -6.4 L1.15 -1.15 L6.4 0 L1.15 1.15 L0 6.4 L-1.15 1.15 L-6.4 0 L-1.15 -1.15 Z'

const leftRidges = [
  'M146 326 C120 310 92 296 60 287',
  'M145 342 C114 336 80 330 46 328',
  'M145 359 C112 360 78 364 46 370',
  'M145 377 C120 384 94 393 70 399',
  'M142 309 C118 298 96 288 76 280',
]

const leftEdgeArcs = [
  'M26 292 C36 283 50 279 62 281',
  'M17 310 C25 302 36 299 46 302',
  'M12 330 C20 323 32 322 41 327',
  'M18 352 C26 345 38 344 47 350',
  'M35 370 C42 362 52 360 60 365',
  'M55 388 C62 381 72 380 80 386',
  'M82 399 C89 391 98 390 106 396',
]

const rightRibs = [
  'M156 330 L246 300',
  'M157 347 L278 330',
  'M158 365 L252 362',
  'M159 384 L226 406',
  'M158 403 L190 430',
  'M156 322 L232 280',
]

const rightPanels = [
  'M156 330 L246 300 L282 320 L256 334 Z',
  'M157 347 L278 330 L252 362 L236 362 Z',
  'M158 365 L252 362 L242 392 L226 406 Z',
  'M159 384 L226 406 L204 418 L190 430 Z',
]

const bodyBands = [
  'M135 302 Q150 308 165 302',
  'M133.5 322 Q150 328 166.5 322',
  'M133 342 Q150 348 167 342',
  'M133.5 362 Q150 368 166.5 362',
  'M134.5 382 Q150 388 165.5 382',
  'M136 402 Q150 407 164 402',
  'M138 422 Q150 427 162 422',
  'M140.5 442 Q150 446 159.5 442',
]

const leftVeins = [
  'M145 330 C112 318 72 301 34 296',
  'M145 346 C106 344 62 338 22 338',
  'M145 364 C108 368 72 372 34 376',
  'M145 383 C120 390 94 398 70 401',
  'M142 312 C118 300 96 290 74 284',
]

const rightVeins = [
  'M156 328 L246 300',
  'M157 346 L278 330',
  'M157 366 L248 362',
  'M159 388 L224 406',
  'M157 408 L190 434',
  'M155 320 L232 280',
]

export default function Necklace() {
  return (
    <svg
      className="necklace-svg"
      viewBox="0 0 300 500"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="nk-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d626e" />
          <stop offset="0.14" stopColor="#eceff5" />
          <stop offset="0.3" stopColor="#ffffff" />
          <stop offset="0.46" stopColor="#9aa0ad" />
          <stop offset="0.62" stopColor="#f8f9fc" />
          <stop offset="0.8" stopColor="#707684" />
          <stop offset="1" stopColor="#d7dae2" />
        </linearGradient>
        <linearGradient id="nk-silver-dark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#191820" />
          <stop offset="0.5" stopColor="#5f6470" />
          <stop offset="1" stopColor="#14131a" />
        </linearGradient>
        <linearGradient id="nk-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6f5018" />
          <stop offset="0.3" stopColor="#e5c274" />
          <stop offset="0.52" stopColor="#fff2bf" />
          <stop offset="0.72" stopColor="#c9a24a" />
          <stop offset="1" stopColor="#6b4b14" />
        </linearGradient>
        <linearGradient id="nk-ivory" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#d8d0c1" />
          <stop offset="0.38" stopColor="#b3a998" />
          <stop offset="0.72" stopColor="#8a8173" />
          <stop offset="1" stopColor="#595247" />
        </linearGradient>
        <linearGradient id="nk-black" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#52505e" />
          <stop offset="0.3" stopColor="#232129" />
          <stop offset="0.68" stopColor="#08070c" />
          <stop offset="1" stopColor="#2d2a36" />
        </linearGradient>
        <radialGradient id="nk-ruby" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ff7088" />
          <stop offset="0.4" stopColor="#d31432" />
          <stop offset="0.78" stopColor="#780a1c" />
          <stop offset="1" stopColor="#39040c" />
        </radialGradient>
        <radialGradient id="nk-gloss" cx="0.5" cy="0.4" r="0.62">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nk-tube-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="0.24" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.76" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.52" />
        </linearGradient>
        <linearGradient id="nk-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.38" stopColor="#fffdf4" stopOpacity="0.4" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.62" stopColor="#ffeec2" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <pattern
          id="nk-pave-white"
          width="6.6"
          height="6.6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(18)"
        >
          <path d="M0 3.3 H6.6 M3.3 0 V6.6" stroke="#5d5548" strokeWidth="0.42" opacity="0.6" />
          <circle cx="1.55" cy="1.55" r="1.28" fill="#fffefb" />
          <circle cx="4.95" cy="5.1" r="1" fill="#f6efe3" />
          <circle cx="4.5" cy="1.15" r="0.62" fill="#cbc0ad" opacity="0.95" />
          <circle cx="1.85" cy="2.1" r="0.38" fill="#948977" opacity="0.62" />
        </pattern>

        <pattern
          id="nk-pave-black"
          width="6.2"
          height="6.2"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-14)"
        >
          <path d="M0 3.1 H6.2 M3.1 0 V6.2" stroke="#393743" strokeWidth="0.4" opacity="0.55" />
          <circle cx="1.45" cy="1.45" r="1.14" fill="#787583" />
          <circle cx="4.7" cy="4.75" r="0.88" fill="#3d3b47" />
          <circle cx="4.35" cy="1.2" r="0.6" fill="#e0dde9" opacity="0.85" />
          <circle cx="1.65" cy="4.8" r="0.44" fill="#08070d" />
        </pattern>

        <clipPath id="nk-left-clip">
          <path d={LEFT_WING} />
        </clipPath>
        <clipPath id="nk-right-clip">
          <path d={RIGHT_WING} />
        </clipPath>
        <clipPath id="nk-body-clip">
          <path d={BODY} />
        </clipPath>
        <clipPath id="nk-pendant-clip">
          <path d={LEFT_WING} />
          <path d={RIGHT_WING} />
          <path d={BODY} />
          <ellipse cx="150" cy="283" rx="8.5" ry="11" />
        </clipPath>

        <filter id="nk-shadow" x="-60%" y="-30%" width="220%" height="180%">
          <feDropShadow
            dx="0"
            dy="16"
            stdDeviation="14"
            floodColor="#000000"
            floodOpacity="0.62"
          />
        </filter>

        <pattern
          id="nk-rope"
          width="11"
          height="18"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(14)"
        >
          <path d="M0 0 V18" stroke="#ffffff" strokeWidth="2.4" opacity="0.34" />
          <path d="M4 0 V18" stroke="#4a4f5c" strokeWidth="1.5" opacity="0.46" />
          <path d="M7.4 0 V18" stroke="#ffffff" strokeWidth="0.9" opacity="0.24" />
          <path d="M9.4 0 V18" stroke="#20222b" strokeWidth="1.2" opacity="0.32" />
        </pattern>

        <mask id="nk-chain-mask" maskUnits="userSpaceOnUse" x="120" y="10" width="60" height="250">
          <path d={CHAIN_PATH} fill="none" stroke="#ffffff" strokeWidth="22" strokeLinecap="round" />
        </mask>

        <filter id="nk-glint-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>


      <g className="necklace-swing">
        <g className="necklace-chain">
          <path d={CHAIN_PATH} fill="none" stroke="#050408" strokeWidth="27" strokeLinecap="round" opacity="0.6" />
          <path d={CHAIN_PATH} fill="none" stroke="url(#nk-silver-dark)" strokeWidth="23" strokeLinecap="round" />
          <g mask="url(#nk-chain-mask)">
            <rect x="120" y="10" width="60" height="250" fill="url(#nk-silver)" />
            <rect x="120" y="10" width="60" height="250" fill="url(#nk-rope)" opacity="0.9" />
            <rect x="120" y="10" width="60" height="250" fill="url(#nk-tube-shade)" />
          </g>
          <path d={CHAIN_PATH} fill="none" stroke="#ffffff" strokeWidth="1.3" opacity="0.3" transform="translate(-4.5 0)" />
        </g>
        <path
          className="necklace-chain-glint"
          d={CHAIN_PATH}
          fill="none"
          stroke="#fff8e4"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeDasharray="24 260"
          opacity="0.72"
        />

        <g className="necklace-pendant-lag">
          <g filter="url(#nk-shadow)">
            <ellipse
              cx="150"
              cy="258"
              rx="9.6"
              ry="13.4"
              fill="none"
              stroke="url(#nk-silver)"
              strokeWidth="6.4"
            />
            <ellipse
              cx="150"
              cy="258"
              rx="9.6"
              ry="13.4"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1"
              opacity="0.52"
            />
            <ellipse cx="150" cy="258" rx="5.8" ry="8.4" fill="#050408" opacity="0.9" />

            <g className="necklace-antennae">
              <path
                d="M146 277 C132 261 117 254 104 247"
                fill="none"
                stroke="url(#nk-silver)"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
              <path
                d="M154 277 C168 261 183 254 196 247"
                fill="none"
                stroke="url(#nk-silver)"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
              <circle cx="104" cy="247" r="2.8" fill="#fdf8ea" />
              <circle cx="196" cy="247" r="2.8" fill="#fdf8ea" />
            </g>

            <path d={LEFT_WING} fill="url(#nk-ivory)" transform="translate(1.5 2.5)" opacity="0.75" />
            <path d={RIGHT_WING} fill="#050408" transform="translate(1.5 2.5)" opacity="0.7" />

            <path d={LEFT_WING} fill="url(#nk-ivory)" />
            <path d={LEFT_WING} fill="url(#nk-pave-white)" opacity="0.98" />
            <g clipPath="url(#nk-left-clip)">
              <ellipse cx="74" cy="296" rx="96" ry="72" fill="url(#nk-gloss)" />
              <ellipse cx="104" cy="408" rx="88" ry="46" fill="#2f291f" opacity="0.22" />
              <path
                d="M24 288 C48 272 84 272 118 286"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.4"
                opacity="0.5"
              />
            </g>
            <path
              d={LEFT_WING}
              fill="none"
              stroke="url(#nk-silver-dark)"
              strokeWidth="7.4"
              strokeLinejoin="round"
              opacity="0.7"
            />
            <path
              d={LEFT_WING}
              fill="none"
              stroke="url(#nk-silver)"
              strokeWidth="4.4"
              strokeLinejoin="round"
            />
            <path
              d={LEFT_WING}
              fill="none"
              stroke="#fffdf4"
              strokeWidth="1.1"
              strokeLinejoin="round"
              opacity="0.42"
            />

            <path d={RIGHT_WING} fill="url(#nk-black)" />
            <path d={RIGHT_WING} fill="url(#nk-pave-black)" opacity="0.98" />
            <g clipPath="url(#nk-right-clip)">
              <ellipse cx="216" cy="300" rx="96" ry="64" fill="url(#nk-gloss)" opacity="0.72" />
              <ellipse cx="228" cy="400" rx="76" ry="44" fill="#000000" opacity="0.4" />
              <path
                d="M172 288 L244 274"
                fill="none"
                stroke="#d9dae4"
                strokeWidth="2.2"
                opacity="0.42"
              />
              {rightPanels.map((d, i) => (
                <path
                  key={d}
                  d={d}
                  fill={i % 2 === 0 ? '#ffffff' : '#000000'}
                  opacity={i % 2 === 0 ? 0.03 : 0.22}
                />
              ))}
            </g>
            <path
              d={RIGHT_WING}
              fill="none"
              stroke="url(#nk-silver-dark)"
              strokeWidth="7"
              strokeLinejoin="round"
              opacity="0.78"
            />
            <path
              d={RIGHT_WING}
              fill="none"
              stroke="url(#nk-silver)"
              strokeWidth="4.2"
              strokeLinejoin="round"
            />
            <path
              d={RIGHT_WING}
              fill="none"
              stroke="#fffdf4"
              strokeWidth="1"
              strokeLinejoin="round"
              opacity="0.36"
            />

            <g fill="none" strokeLinecap="round">
              {leftRidges.map((d) => (
                <g key={d}>
                  <path d={d} stroke="#4d463a" strokeWidth="3.2" opacity="0.48" transform="translate(0 1.2)" />
                  <path d={d} stroke="#ddd6c7" strokeWidth="2" opacity="0.82" />
                  <path d={d} stroke="#ffffff" strokeWidth="0.6" opacity="0.5" transform="translate(0 -0.8)" />
                </g>
              ))}
              {leftVeins.map((d) => (
                <path key={d} d={d} stroke="#7e7566" strokeWidth="0.85" opacity="0.52" />
              ))}
            </g>
            <g fill="none" stroke="#f0eadd" strokeWidth="1.45" opacity="0.62">
              {leftEdgeArcs.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
            <g fill="none" strokeLinecap="round">
              {rightRibs.map((d) => (
                <g key={d}>
                  <path d={d} stroke="#050408" strokeWidth="4.6" opacity="0.66" />
                  <path d={d} stroke="url(#nk-silver)" strokeWidth="2.15" />
                  <path d={d} stroke="#ffffff" strokeWidth="0.6" opacity="0.42" transform="translate(0 -0.7)" />
                </g>
              ))}
              {rightVeins.map((d) => (
                <path key={d} d={d} stroke="#8f8b9c" strokeWidth="0.9" opacity="0.5" />
              ))}
            </g>

            <path d={BODY} fill="url(#nk-ivory)" transform="translate(1.5 2.5)" opacity="0.7" />
            <path d={BODY} fill="url(#nk-ivory)" />
            <path d={BODY} fill="url(#nk-pave-white)" opacity="0.97" />
            <g clipPath="url(#nk-body-clip)">
              <rect x="136" y="272" width="28" height="194" fill="url(#nk-gloss)" opacity="0.5" />
              <path d="M146 286 C150 380 147 430 150 456" fill="none" stroke="#fffdf4" strokeWidth="1.6" opacity="0.55" />
            </g>
            <path
              d={BODY}
              fill="none"
              stroke="url(#nk-silver-dark)"
              strokeWidth="5"
              strokeLinejoin="round"
              opacity="0.7"
            />
            <path
              d={BODY}
              fill="none"
              stroke="url(#nk-silver)"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <ellipse cx="150" cy="283" rx="8.5" ry="11" fill="url(#nk-ivory)" />
            <ellipse cx="150" cy="283" rx="8.5" ry="11" fill="url(#nk-pave-white)" opacity="0.94" />
            <ellipse
              cx="150"
              cy="283"
              rx="8.5"
              ry="11"
              fill="none"
              stroke="url(#nk-silver)"
              strokeWidth="2.6"
            />
            <ellipse cx="148" cy="280" rx="2.2" ry="2.8" fill="#fffdf4" opacity="0.7" />

            <g fill="none" strokeLinecap="round">
              {bodyBands.map((d) => (
                <g key={d}>
                  <path d={d} stroke="#4f483c" strokeWidth="1.9" opacity="0.52" transform="translate(0 1.4)" />
                  <path d={d} stroke="#e6e0d2" strokeWidth="1.15" opacity="0.78" />
                </g>
              ))}
              <path d="M150 296 V452" stroke="#f7f3e8" strokeWidth="1.4" opacity="0.5" />
            </g>

            <g className="necklace-jewels">
              <path d="M136 296 Q150 304 164 296" fill="none" stroke="url(#nk-gold)" strokeWidth="3" />
              <path d="M143 272 Q150 266 157 272" fill="none" stroke="url(#nk-gold)" strokeWidth="2.2" />
              <circle cx="146.4" cy="282" r="1.35" fill="url(#nk-ruby)" />
              <circle cx="153.6" cy="282" r="1.35" fill="url(#nk-ruby)" />
              <circle cx="146.5" cy="318" r="3.7" fill="url(#nk-gold)" />
              <circle cx="153.5" cy="318" r="3.7" fill="url(#nk-gold)" />
              <circle cx="150" cy="318" r="2.2" fill="#4e1d07" opacity="0.8" />
              <path d="M150 338 L154.6 344 L150 350 L145.4 344 Z" fill="url(#nk-ruby)" />
              <circle cx="150" cy="344" r="7.4" fill="#d31432" opacity="0.3" />
              <circle cx="150" cy="424" r="2.7" fill="url(#nk-gold)" />
              <path d="M150 468 L153.4 459 L150 455 L146.6 459 Z" fill="url(#nk-gold)" />
            </g>

            {GLINTS.map(([x, y, delay, size], i) => (
              <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
                <g
                  className="necklace-glint"
                  style={{ '--d': `${delay}s`, '--s': size }}
                >
                  <path
                    d={STAR}
                    fill={i % 4 === 0 ? '#ffe6a9' : '#fffdf2'}
                    filter="url(#nk-glint-glow)"
                  />
                </g>
              </g>
            ))}

            <g clipPath="url(#nk-pendant-clip)">
              <g transform="rotate(16 150 370)">
                <rect
                  className="necklace-sheen"
                  x="-170"
                  y="240"
                  width="88"
                  height="280"
                  fill="url(#nk-sheen)"
                  opacity="0"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
      <g className="necklace-pin">
        <circle cx="150" cy="13" r="10.4" fill="none" stroke="#c9a24a" strokeWidth="0.75" opacity="0.45" />
        <path d="M139 15 Q150 24 161 15 L158 26 Q150 31 142 26 Z" fill="url(#nk-gold)" opacity="0.9" />
        <circle cx="150" cy="12" r="8.4" fill="url(#nk-gold)" stroke="#f8e9b6" strokeWidth="0.7" />
        <circle cx="150" cy="12" r="5.4" fill="none" stroke="#7a5716" strokeWidth="1.5" opacity="0.5" />
        <circle cx="150" cy="12" r="2.6" fill="#2a1c05" opacity="0.55" />
        <ellipse cx="147" cy="8.4" rx="3.2" ry="1.8" fill="#fff8d8" opacity="0.85" transform="rotate(-24 147 8.4)" />
      </g>
    </svg>
  )
}
