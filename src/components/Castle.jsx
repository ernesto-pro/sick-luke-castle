const BAT =
  'M0 0C-2.4-3.4-6.2-5.4-10.4-4.8C-8.6-2.9-8 0-8.4 2.5C-6.4 1.3-4.3 1.6-3 3.2C-1.9 1.7-0.9 1.1 0 1.1C0.9 1.1 1.9 1.7 3 3.2C4.3 1.6 6.4 1.3 8.4 2.5C8 0 8.6-2.9 10.4-4.8C6.2-5.4 2.4-3.4 0 0Z'

const BATS = [
  { x: 258, y: 138, s: 1.1, side: 'night', delay: 0 },
  { x: 506, y: 96, s: 0.8, side: 'light', delay: 3.4 },
  { x: 744, y: 72, s: 0.62, side: 'night', delay: 6.1 },
  { x: 1044, y: 104, s: 0.9, side: 'light', delay: 1.8 },
  { x: 1318, y: 152, s: 0.72, side: 'night', delay: 4.7 },
  { x: 912, y: 146, s: 0.52, side: 'light', delay: 8.2 },
]

const WINDOWS = [
  [800, 300, 1],
  [770, 348, 2],
  [830, 348, 3],
  [800, 390, 4],
  [700, 330, 5],
  [900, 330, 6],
  [576, 330, 7],
  [616, 330, 8],
  [576, 382, 9],
  [616, 382, 10],
  [984, 330, 11],
  [1024, 330, 12],
  [984, 382, 13],
  [1024, 382, 14],
  [212, 336, 15],
  [246, 336, 16],
  [212, 386, 17],
  [1354, 336, 18],
  [1388, 336, 19],
  [1388, 386, 20],
  [473, 300, 21],
  [1127, 300, 22],
]

export default function Castle({ className = '' }) {
  return (
    <svg
      className={`castle ${className}`.trim()}
      viewBox="0 0 1600 560"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="castleBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b0810" />
          <stop offset="0.55" stopColor="#07050b" />
          <stop offset="1" stopColor="#040308" />
        </linearGradient>
        <radialGradient id="gateGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#d31432" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#7a0a1b" stopOpacity="0.2" />
          <stop offset="1" stopColor="#7a0a1b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="roofFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#151019" />
          <stop offset="1" stopColor="#08060c" />
        </linearGradient>
      </defs>

      <ellipse cx="800" cy="470" rx="620" ry="150" fill="url(#gateGlow)" opacity="0.55" />

      {/* night wings over the castle */}
      <g className="castle-bats" aria-hidden="true">
        {BATS.map((bat, i) => (
          <g key={i} transform={`translate(${bat.x} ${bat.y}) scale(${bat.s})`}>
            <g
              className={`castle-bat castle-bat--${bat.side}`}
              style={{ animationDelay: `${bat.delay}s` }}
            >
              <path d={BAT} fill="currentColor" />
            </g>
          </g>
        ))}
      </g>

      {/* distant spires */}
      <g fill="#0a0710" opacity="0.55">
        <path d="M92 482V372h64v110Z" />
        <path d="M88 374 124 292l36 82Z" fill="url(#roofFade)" />
        <path d="M1444 482V372h64v110Z" />
        <path d="M1440 374 1476 292l36 82Z" fill="url(#roofFade)" />
        <path d="M470 482V352h56v130Z" />
        <path d="M466 354 498 286l32 68Z" fill="url(#roofFade)" />
        <path d="M1074 482V352h56v130Z" />
        <path d="M1070 354 1102 286l32 68Z" fill="url(#roofFade)" />
      </g>

      {/* hill */}
      <path
        d="M0 560V492c92-18 172-6 268-18 96-12 154-28 250-18 96 10 150 30 246 24 96-6 160-32 258-26 98 6 158 28 252 20 94-8 166-26 236-18 30 3 60 8 90 12v92Z"
        fill="#050409"
      />

      <g fill="url(#castleBody)" stroke="rgba(201,162,74,0.14)" strokeWidth="1.1">
        {/* outer towers */}
        <path d="M190 482V307h86v175Z" />
        <path d="M185 309 233 198l48 111Z" fill="url(#roofFade)" />
        <path d="M1324 482V307h86v175Z" />
        <path d="M1319 309 1367 198l48 111Z" fill="url(#roofFade)" />

        {/* inner towers */}
        <path d="M540 482V302h100v180Z" />
        <path d="M534 304 590 158l56 146Z" fill="url(#roofFade)" />
        <path d="M960 482V302h100v180Z" />
        <path d="M954 304 1010 158l56 146Z" fill="url(#roofFade)" />

        {/* side walls */}
        <path d="M276 482V380h264v102Z" />
        <path d="M1060 482V380h264v102Z" />
        <path d="M1006 482V380h54v102Z" />
        <path d="M540 482V380h54v102Z" />

        {/* keep body */}
        <path d="M650 482V270h300v212Z" />
        {/* corner turrets */}
        <path d="M618 482V316h56v166Z" />
        <path d="M926 482V316h56v166Z" />
        <path d="M614 318 646 254l32 64Z" fill="url(#roofFade)" />
        <path d="M922 318 954 254l32 64Z" fill="url(#roofFade)" />

        {/* keep roof */}
        <path d="M640 274 800 118l160 156Z" fill="url(#roofFade)" />
        <path d="M792 120h16v-58h-16Z" />
        <path d="M788 66h24l-12-22Z" fill="#c9a24a" opacity="0.55" />
      </g>

      {/* stone courses */}
      <g stroke="rgba(236,229,216,0.07)" strokeWidth="1">
        <path d="M190 350h86M190 410h86M1324 350h86M1324 410h86" />
        <path d="M276 430h264M1060 430h264" />
        <path d="M650 330h300M650 390h300M650 440h300" />
        <path d="M540 350h100M960 350h100" />
      </g>

      {/* buttresses */}
      <g fill="#050409" stroke="rgba(201,162,74,0.1)" strokeWidth="1">
        <path d="M420 482V410l18-22 18 22v72Z" />
        <path d="M1180 482V410l18-22 18 22v72Z" />
        <path d="M650 482l34-60v60Z" />
        <path d="M950 482l-34-60v60Z" />
      </g>

      {/* gate + steps */}
      <path d="M735 482v-66c0-37 28-61 65-61s65 24 65 61v66Z" fill="#0a0509" stroke="rgba(211,20,50,0.5)" />
      <path d="M754 482v-62c0-25 20-44 46-44s46 19 46 44v62Z" fill="url(#gateGlow)" />
      <g stroke="rgba(0,0,0,0.55)" strokeWidth="2.5">
        <path d="M776 378v104M800 374v108M824 378v104M752 412h96M748 440h104" />
      </g>
      <path d="M710 482l24-18h132l24 18Z" fill="#050409" stroke="rgba(201,162,74,0.16)" />
      <path d="M680 510l54-28h132l54 28Z" fill="#040308" stroke="rgba(201,162,74,0.1)" />
      <path d="M640 545l74-35h172l74 35Z" fill="#030207" stroke="rgba(201,162,74,0.07)" />

      {/* windows */}
      <g className="castle-windows">
        {WINDOWS.map(([x, y, delay], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="7"
            height="15"
            rx="3.5"
            fill={i % 7 === 0 ? '#c9a24a' : '#d31432'}
            style={{ animationDelay: `${(delay % 8) * 0.55}s` }}
          />
        ))}
      </g>

      {/* pennants */}
      <g fill="#8f1024">
        <path d="M590 162l38 8-38 9Z" />
        <path d="M1010 162l-38 8 38 9Z" />
        <path d="M800 44l42 9-42 10Z" fill="#c9a24a" opacity="0.75" />
      </g>

      {/* ground */}
      <path d="M0 560V536c120-14 214 4 328-6 114-10 198-20 314-12 116 8 190 26 306 18 116-8 210-24 330-16 104 7 214 18 322 14v26Z" fill="#030207" />
    </svg>
  )
}
