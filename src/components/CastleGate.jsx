const GATE =
  'M690 884 V806 C690 768 733 737 800 719 C867 737 910 768 910 806 V884 Z'

const GATE_INNER =
  'M704 884 V810 C704 779 740 753 800 736 C860 753 896 779 896 810 V884 Z'

const WIN = 'M0 24 V8 A8 8 0 0 1 16 8 V24 Z'

const WINDOWS = [
  // central keep, lower
  [664, 560, 1.1, 'gold'],
  [752, 548, 1.35, 'blood'],
  [832, 548, 1.35, 'gold'],
  [912, 560, 1.1, 'blood'],
  [700, 620, 1.05, 'blood'],
  [790, 610, 1.15, 'gold'],
  [880, 620, 1.05, 'blood'],
  // keep upper
  [766, 468, 1.15, 'gold'],
  [818, 468, 1.15, 'blood'],
  [792, 512, 0.95, 'gold'],
  // left tower
  [452, 470, 1.2, 'blood'],
  [452, 532, 1, 'gold'],
  [452, 586, 1, 'blood'],
  [498, 470, 1.2, 'gold'],
  [498, 532, 1, 'blood'],
  [498, 586, 1, 'gold'],
  // right tower
  [1086, 470, 1.2, 'gold'],
  [1086, 532, 1, 'blood'],
  [1086, 586, 1, 'gold'],
  [1132, 470, 1.2, 'blood'],
  [1132, 532, 1, 'gold'],
  [1132, 586, 1, 'blood'],
  // outer towers
  [246, 560, 1, 'blood'],
  [246, 616, 0.9, 'gold'],
  [288, 560, 1, 'gold'],
  [288, 616, 0.9, 'blood'],
  [1312, 560, 1, 'blood'],
  [1312, 616, 0.9, 'gold'],
  [1354, 560, 1, 'gold'],
  [1354, 616, 0.9, 'blood'],
  // gate turrets
  [598, 610, 1, 'blood'],
  [986, 610, 1, 'gold'],
  // distant spires
  [366, 430, 0.8, 'gold'],
  [1234, 430, 0.8, 'blood'],
]

const BATS = [
  [340, 190, 1.1, 0],
  [1180, 152, 0.8, 3.2],
  [960, 250, 0.55, 6.4],
  [500, 300, 0.45, 1.8],
]

const BAT =
  'M0 0C-2.6-3.7-6.8-5.9-11.4-5.2C-9.4-3.2-8.8 0-9.2 2.7C-7 1.4-4.7 1.7-3.3 3.5C-2.1 1.8-1 1.2 0 1.2C1 1.2 2.1 1.8 3.3 3.5C4.7 1.7 7 1.4 9.2 2.7C8.8 0 9.4-3.2 11.4-5.2C6.8-5.9 2.6-3.7 0 0Z'

export default function CastleGate() {
  return (
    <svg
      className="castle-gate"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="cg-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#171121" />
          <stop offset="0.48" stopColor="#0d0914" />
          <stop offset="1" stopColor="#06040a" />
        </linearGradient>
        <linearGradient id="cg-stone-2" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#050409" />
          <stop offset="0.5" stopColor="#151020" />
          <stop offset="1" stopColor="#050409" />
        </linearGradient>
        <linearGradient id="cg-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241a2e" />
          <stop offset="0.55" stopColor="#100b18" />
          <stop offset="1" stopColor="#050409" />
        </linearGradient>
        <linearGradient id="cg-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6a6" />
          <stop offset="0.4" stopColor="#e3b559" />
          <stop offset="0.78" stopColor="#b45a1d" />
          <stop offset="1" stopColor="#3d1108" />
        </linearGradient>
        <radialGradient id="cg-gate-glow" cx="50%" cy="58%" r="58%">
          <stop offset="0" stopColor="#ffdf9a" stopOpacity="0.9" />
          <stop offset="0.34" stopColor="#e09b3c" stopOpacity="0.44" />
          <stop offset="0.68" stopColor="#8f2a12" stopOpacity="0.16" />
          <stop offset="1" stopColor="#8f2a12" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cg-window-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd889" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#e06a2a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#a01a24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cg-torch" cx="50%" cy="46%" r="50%">
          <stop offset="0" stopColor="#fff0c0" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#ffb347" stopOpacity="0.5" />
          <stop offset="1" stopColor="#c2381c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cg-moonwash" cx="0.82" cy="0.1" r="0.85">
          <stop offset="0" stopColor="#d6dcee" stopOpacity="0.12" />
          <stop offset="0.4" stopColor="#bab3cc" stopOpacity="0.05" />
          <stop offset="1" stopColor="#bab3cc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cg-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9b0c9" stopOpacity="0" />
          <stop offset="0.55" stopColor="#b9b0c9" stopOpacity="0.2" />
          <stop offset="1" stopColor="#d8d2e2" stopOpacity="0.46" />
        </linearGradient>
        <pattern id="cg-shingles" width="22" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 A11 6 0 0 0 22 6" fill="none" stroke="#ece5d8" strokeWidth="0.7" opacity="0.13" />
          <path d="M-11 0 A11 6 0 0 0 11 0 M11 0 A11 6 0 0 0 33 0" fill="none" stroke="#ece5d8" strokeWidth="0.55" opacity="0.09" />
        </pattern>
        <linearGradient id="cg-hall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c0d0a" />
          <stop offset="0.5" stopColor="#4a2111" />
          <stop offset="1" stopColor="#0d0506" />
        </linearGradient>
        <radialGradient id="cg-hall-light" cx="50%" cy="62%" r="52%">
          <stop offset="0" stopColor="#ffe8b0" stopOpacity="0.95" />
          <stop offset="0.42" stopColor="#e7a34a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#5a1c0c" stopOpacity="0" />
        </radialGradient>
        <pattern id="cg-bricks" width="64" height="34" patternUnits="userSpaceOnUse">
          <path d="M0 11 H64 M0 23 H64" stroke="#e9e2d6" strokeWidth="0.7" opacity="0.045" />
          <path d="M16 0 V11 M48 11 V23 M16 23 V34" stroke="#e9e2d6" strokeWidth="0.7" opacity="0.04" />
        </pattern>
        <filter id="cg-glow-soft" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cg-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <clipPath id="cg-gate-clip">
          <path d={GATE} />
        </clipPath>
      </defs>

      <rect x="0" y="0" width="1600" height="1000" fill="url(#cg-moonwash)" />
      <ellipse cx="800" cy="892" rx="340" ry="120" fill="url(#cg-gate-glow)" opacity="0.5" />

      {/* distant ridge / far towers */}
      <g className="cg-far" fill="#08060e" opacity="0.85">
        <path d="M0 900V760h52v140Zm-6-138 30-96 30 96Z" opacity="0.7" />
        <path d="M60 900V800h44v100Z" opacity="0.6" />
        <path d="M154 900V690h60v210Zm-6-208 36-118 36 118Z" opacity="0.8" />
        <path d="M228 900V786h40v114Z" opacity="0.55" />
        <path d="M1380 900V690h60v210Zm-6-208 36-118 36 118Z" opacity="0.8" />
        <path d="M1332 900V786h40v114Z" opacity="0.55" />
        <path d="M1452 900V800h44v100Z" opacity="0.6" />
        <path d="M1500 900V760h52v140Zm-6-138 30-96 30 96Z" opacity="0.7" />
        <path d="M330 900V812h54v88Z" opacity="0.5" />
        <path d="M1216 900V812h54v88Z" opacity="0.5" />
      </g>

      {/* back spires */}
      <g className="cg-back">
        <g fill="url(#cg-roof)" stroke="rgba(201,162,74,0.08)">
          <path d="M340 560 380 392l40 168Z" />
          <path d="M376 396h8v-26h-8Z" />
          <path d="M1220 560 1260 392l40 168Z" />
          <path d="M1256 396h8v-26h-8Z" />
          <path d="M500 560 536 436l36 124Z" />
          <path d="M1064 560 1100 436l36 124Z" />
        </g>
        <g fill="url(#cg-stone)" stroke="rgba(201,162,74,0.09)">
          <path d="M356 640V556h48v84Z" />
          <path d="M1196 640V556h48v84Z" />
          <path d="M516 640V574h40v66Z" />
          <path d="M1044 640V574h40v66Z" />
        </g>
      </g>

      {/* outer towers */}
      <g className="cg-outer">
        <g fill="url(#cg-stone-2)" stroke="rgba(201,162,74,0.16)" strokeWidth="1.2">
          <path d="M206 900V462h124v438Z" />
          <path d="M198 464 268 258l70 206Z" fill="url(#cg-roof)" />
          <path d="M264 262h8v-42h-8Z" />
          <path d="M1270 900V462h124v438Z" />
          <path d="M1262 464 1332 258l70 206Z" fill="url(#cg-roof)" />
          <path d="M1328 262h8v-42h-8Z" />
        </g>
        {/* battlements */}
        <g fill="url(#cg-stone-2)">
          <path d="M206 478h124v18H206Z" />
          <path d="M1270 478h124v18h-124Z" />
        </g>
      </g>

      {/* flanking towers */}
      <g className="cg-towers">
        <g fill="url(#cg-stone)" stroke="rgba(201,162,74,0.2)" strokeWidth="1.2">
          <path d="M400 912V438h176v474Z" />
          <path d="M392 440 488 186l96 254Z" fill="url(#cg-roof)" />
          <path d="M484 192h8v-48h-8Z" />
          <path d="M1024 912V438h176v474Z" />
          <path d="M1008 440 1104 186l96 254Z" fill="url(#cg-roof)" />
          <path d="M1100 192h8v-48h-8Z" />
        </g>
        <g fill="url(#cg-stone)" stroke="rgba(201,162,74,0.18)" strokeWidth="1.1">
          <path d="M552 912V520h48v392Z" />
          <path d="M546 522 576 428l30 94Z" fill="url(#cg-roof)" />
          <path d="M1000 912V520h48v392Z" />
          <path d="M994 522 1024 428l54 94Z" fill="url(#cg-roof)" />
        </g>
        {/* battlement caps */}
        <g fill="url(#cg-stone)">
          <path d="M400 452h176v20H400Z" />
          <path d="M1024 452h176v20h-176Z" />
        </g>
        <g fill="#050409">
          <path d="M408 438h18v16h-18Zm28 0h18v16h-18Zm28 0h18v16h-18Zm28 0h18v16h-18Zm28 0h18v16h-18Zm28 0h18v16h-18Z" opacity="0.65" />
          <path d="M1032 438h18v16h-18Zm28 0h18v16h-18Zm28 0h18v16h-18Zm28 0h18v16h-18Zm28 0h18v16h-18Zm28 0h18v16h-18Z" opacity="0.65" />
        </g>
      </g>

      {/* side walls */}
      <g className="cg-walls" fill="url(#cg-stone)" stroke="rgba(201,162,74,0.13)" strokeWidth="1.1">
        <path d="M330 912V700h294v212Z" />
        <path d="M976 912V700h294v212Z" />
        <path d="M318 702h314v20H318Z" fill="url(#cg-stone-2)" />
        <path d="M968 702h314v20H968Z" fill="url(#cg-stone-2)" />
        <g fill="#050409" opacity="0.6">
          <path d="M330 690h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Z" />
        </g>
        <g fill="#050409" opacity="0.6">
          <path d="M976 690h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Zm34 0h20v14h-20Z" />
        </g>
      </g>

      {/* keep */}
      <g className="cg-keep">
        <path d="M612 912V520h376v392Z" fill="url(#cg-stone)" stroke="rgba(201,162,74,0.2)" strokeWidth="1.3" />
        <path d="M604 520h392v22H604Z" fill="url(#cg-stone-2)" />
        <g fill="#050409" opacity="0.62">
          <path d="M612 506h20v16h-20Zm34 0h20v16h-20Zm34 0h20v16h-20Zm34 0h20v16h-20Zm34 0h20v16h-20Zm34 0h20v16h-20Zm34 0h20v16h-20Zm34 0h20v16h-20Zm34 0h20v16h-20Zm34 0h20v16h-20Zm34 0h20v16h-20Z" />
        </g>
        {/* central spire */}
        <path d="M736 522 800 286l64 236Z" fill="url(#cg-roof)" stroke="rgba(201,162,74,0.22)" strokeWidth="1.2" />
        <path d="M796 290h8v-56h-8Z" />
        <path d="M792 232h16l-8-20Z" fill="#c9a24a" opacity="0.6" />
        {/* corner turrets */}
        <path d="M576 912V592h70v320Z" fill="url(#cg-stone-2)" stroke="rgba(201,162,74,0.16)" />
        <path d="M570 594 611 486l41 108Z" fill="url(#cg-roof)" />
        <path d="M954 912V592h70v320Z" fill="url(#cg-stone-2)" stroke="rgba(201,162,74,0.16)" />
        <path d="M948 594 989 486l41 108Z" fill="url(#cg-roof)" />
        {/* door arch frame */}
        <path d={GATE} fill="#0a0508" stroke="rgba(201,162,74,0.34)" strokeWidth="7" />
        <path d={GATE_INNER} fill="#070408" />
        <g className="cg-gate-back">
          <path d={GATE_INNER} fill="url(#cg-hall)" />
          <g className="cg-hall">
            <path d="M714 884V820c0-32 35-58 86-72 51 14 86 40 86 72v64Z" fill="#2c140d" opacity="0.96" />
            <path d="M738 884V828c0-27 26-49 62-60 36 11 62 33 62 60v56Z" fill="#180c08" opacity="0.97" />
            <path d="M762 884V838c0-19 16-34 38-42 22 8 38 23 38 42v46Z" fill="#0c0707" />
            <path d="M782 884V850c0-11 8-20 18-25 10 5 18 14 18 25v34Z" fill="#ffe3a3" opacity="0.16" />
            <ellipse cx="800" cy="866" rx="52" ry="22" fill="url(#cg-hall-light)" opacity="0.85" />
            <ellipse cx="800" cy="868" rx="22" ry="10" fill="#ffe3a3" opacity="0.85" />
            <ellipse cx="800" cy="858" rx="9" ry="13" fill="#fff6d6" opacity="0.9" />
            <g fill="none" stroke="#ffd98e" opacity="0.5">
              <path d="M714 884V820c0-32 35-58 86-72 51 14 86 40 86 72v64" strokeWidth="2.4" />
              <path d="M738 884V828c0-27 26-49 62-60 36 11 62 33 62 60v56" strokeWidth="1.7" opacity="0.7" />
              <path d="M762 884V838c0-19 16-34 38-42 22 8 38 23 38 42v46" strokeWidth="1.1" opacity="0.55" />
            </g>
            <g stroke="#ffca74" strokeWidth="0.8" opacity="0.28">
              <path d="M704 884 800 862M896 884 800 862M800 884V862" />
              <path d="M714 878 744 866M886 878 856 866" />
            </g>
            <g fill="#ffdf9a" opacity="0.5">
              <circle cx="748" cy="824" r="2.2" />
              <circle cx="858" cy="818" r="1.8" />
              <circle cx="812" cy="842" r="1.4" />
              <circle cx="778" cy="856" r="1.6" />
            </g>
            <ellipse cx="736" cy="836" rx="24" ry="44" fill="#ff9a45" opacity="0.1" />
            <ellipse cx="864" cy="836" rx="24" ry="44" fill="#ff9a45" opacity="0.1" />
          </g>
        </g>
        <g clipPath="url(#cg-gate-clip)">
          <g className="cg-door cg-door--l">
            <rect x="690" y="712" width="110" height="180" fill="#120a0c" />
            <rect x="690" y="712" width="110" height="180" fill="url(#cg-bricks)" opacity="0.5" />
            <g stroke="#2a1618" strokeWidth="2" opacity="0.9">
              <path d="M700 712V892M712 712V892M724 712V892M736 712V892M748 712V892M760 712V892M772 712V892M784 712V892M796 712V892" />
            </g>
            <g stroke="#3a3540" strokeWidth="5" opacity="0.8">
              <path d="M690 780h110M690 846h110" />
            </g>
            <g fill="#4c4654">
              {[700, 722, 744, 766, 788].map((x) => (
                <circle key={x} cx={x} cy="780" r="2.1" />
              ))}
              {[700, 722, 744, 766, 788].map((x) => (
                <circle key={`b${x}`} cx={x} cy="846" r="2.1" />
              ))}
            </g>
            <path d="M780 812h14" stroke="#c9a24a" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="779" cy="812" r="7" fill="none" stroke="#c9a24a" strokeWidth="2.4" />
          </g>
          <g className="cg-door cg-door--r">
            <rect x="800" y="712" width="110" height="180" fill="#120a0c" />
            <rect x="800" y="712" width="110" height="180" fill="url(#cg-bricks)" opacity="0.5" />
            <g stroke="#2a1618" strokeWidth="2" opacity="0.9">
              <path d="M810 712V892M822 712V892M834 712V892M846 712V892M858 712V892M870 712V892M882 712V892M894 712V892M906 712V892" />
            </g>
            <g stroke="#3a3540" strokeWidth="5" opacity="0.8">
              <path d="M800 780h110M800 846h110" />
            </g>
            <g fill="#4c4654">
              {[810, 832, 854, 876, 898].map((x) => (
                <circle key={x} cx={x} cy="780" r="2.1" />
              ))}
              {[810, 832, 854, 876, 898].map((x) => (
                <circle key={`b${x}`} cx={x} cy="846" r="2.1" />
              ))}
            </g>
            <path d="M806 812h14" stroke="#c9a24a" strokeWidth="3.2" strokeLinecap="round" />
          </g>
        </g>
        {/* arch stones */}
        <g fill="none" stroke="#2b2233" strokeWidth="3" opacity="0.75">
          <path d="M690 884V806C690 768 733 737 800 719C867 737 910 768 910 806V884" />
        </g>
        <g>
          <path d={GATE} fill="none" stroke="#241c2c" strokeWidth="24" opacity="0.9" />
          <path d={GATE} fill="none" stroke="#3a2c42" strokeWidth="16" opacity="0.65" />
          <path d={GATE} fill="none" stroke="rgba(201,162,74,0.42)" strokeWidth="4" />
          <path d={GATE} fill="none" stroke="rgba(255,231,172,0.2)" strokeWidth="1.2" />
          <g stroke="rgba(8,6,12,0.6)" strokeWidth="2">
            <path d="M690 884 704 872M690 852 714 848M690 820 716 824M696 790 728 800M712 766 748 782M736 748 772 768M764 736 790 760M800 719v30M836 736 810 760M864 748 828 768M888 766 852 782M904 790 872 800M910 820 884 824M910 852 886 848M910 884 896 872" />
          </g>
          <path d="M788 714h24l-4-26h-16Z" fill="#2c2236" stroke="rgba(201,162,74,0.4)" />
        </g>
      </g>

      {/* stone texture + rim light pass */}
      <g className="cg-texture" fill="url(#cg-bricks)" opacity="0.55">
        <path d="M206 900V462h124v438Z" />
        <path d="M1270 900V462h124v438Z" />
        <path d="M400 912V438h176v474Z" />
        <path d="M1024 912V438h176v474Z" />
        <path d="M330 912V700h294v212Z" />
        <path d="M976 912V700h294v212Z" />
        <path d="M612 912V520h376v392Z" />
        <path d="M576 912V592h70v320Z" />
        <path d="M954 912V592h70v320Z" />
      </g>
      <g fill="url(#cg-shingles)" opacity="0.85">
        <path d="M198 464 268 258l70 206Z" />
        <path d="M1262 464 1332 258l70 206Z" />
        <path d="M392 440 488 186l96 254Z" />
        <path d="M1008 440 1104 186l96 254Z" />
        <path d="M736 522 800 286l64 236Z" />
        <path d="M570 594 611 486l41 108Z" />
        <path d="M948 594 989 486l41 108Z" />
        <path d="M546 522 576 428l30 94Z" />
        <path d="M994 522 1024 428l54 94Z" />
        <path d="M340 560 380 392l40 168Z" />
        <path d="M1220 560 1260 392l40 168Z" />
      </g>
      <g fill="none" stroke="rgba(236,229,216,0.16)" strokeWidth="1.1">
        <path d="M268 258 198 464" />
        <path d="M488 186 392 440" />
        <path d="M800 286 736 522" />
        <path d="M611 486 570 594" />
        <path d="M380 392 340 560" />
        <path d="M1260 392 1220 560" />
      </g>

      {/* windows */}
      <g className="cg-windows">
        {WINDOWS.map(([x, y, s, tone], i) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
            <ellipse cx="8" cy="12" rx="18" ry="22" fill="url(#cg-window-glow)" opacity={tone === 'gold' ? 0.55 : 0.4} />
            <path d={WIN} fill={tone === 'gold' ? '#f0c56b' : '#b32b3c'} className="cg-window" style={{ animationDelay: `${(i % 9) * 0.7}s` }} />
          </g>
        ))}
      </g>

      {/* banners */}
      <g className="cg-banners">
        <path d="M470 476h34v96l-17-16-17 16Z" fill="#7c0f20" stroke="rgba(201,162,74,0.45)" strokeWidth="1" />
        <path d="M487 498l9 12-9 12-9-12Z" fill="#c9a24a" opacity="0.7" />
        <path d="M1096 476h34v96l-17-16-17 16Z" fill="#7c0f20" stroke="rgba(201,162,74,0.45)" strokeWidth="1" />
        <path d="M1113 498l9 12-9 12-9-12Z" fill="#c9a24a" opacity="0.7" />
      </g>

      {/* torches */}
      <g className="cg-torches">
        {[648, 952].map((x) => (
          <g key={x} transform={`translate(${x} 806)`}>
            <ellipse cx="0" cy="0" rx="36" ry="42" fill="url(#cg-torch)" opacity="0.8" />
            <path d="M-4 8h8v24h-8Z" fill="#1c1318" />
            <path className="cg-flame" d="M0 14C-9 4-7-5 0-14c7 9 9 18 0 28Z" fill="url(#cg-glow)" />
            <path className="cg-flame cg-flame--inner" d="M0 10C-4 5-3 0 0-6c3 6 4 11 0 16Z" fill="#fff2c4" />
          </g>
        ))}
      </g>

      {/* bats */}
      <g className="cg-bats">
        {BATS.map(([x, y, s, delay]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
            <path
              className="cg-bat"
              d={BAT}
              fill="#0a0810"
              style={{ animationDelay: `${delay}s` }}
            />
          </g>
        ))}
      </g>

      {/* bridge and stairs */}
      <g className="cg-bridge">
        <path d="M638 884h324v32H638Z" fill="#0b0910" stroke="rgba(201,162,74,0.16)" />
        <g stroke="rgba(201,162,74,0.12)">
          <path d="M648 892v24M672 892v24M696 892v24M720 892v24M744 892v24M768 892v24M792 892v24M816 892v24M840 892v24M864 892v24M888 892v24M912 892v24M936 892v24M952 892v24" />
        </g>
        <path d="M600 948h400l64 52H536Z" fill="#0a0810" stroke="rgba(201,162,74,0.14)" />
        <path d="M556 1000h488l86 34H470Z" fill="#08060d" />
        <g stroke="rgba(201,162,74,0.1)">
          <path d="M600 948 536 1000M660 948 610 1000M720 948 690 1000M780 948 770 1000M820 948 830 1000M880 948 910 1000M940 948 990 1000M1000 948 1064 1000" />
        </g>
        {/* bridge statues */}
        {[576, 1024].map((x) => (
          <g key={x} transform={`translate(${x} 902)`} fill="#0a0810" stroke="rgba(201,162,74,0.16)">
            <path d="M-12 42V6h24v36Z" />
            <path d="M-16 8 -8-22h16l8 30Z" />
            <path d="M0-22v-10" strokeWidth="3" />
            <path d="M-12 12h24" />
          </g>
        ))}
      </g>

      {/* rock */}
      <path
        d="M0 1000V932c84-18 152-6 244-22 92-16 148-30 244-20 96 10 142 32 236 26 94-6 150-34 246-28 96 6 150 30 244 22 92-8 148-22 226-12 54 7 108 18 160 22v80Z"
        fill="#050409"
      />
      <path
        d="M0 1000V964c98-12 160 4 258-8 98-12 156-24 254-14 98 10 146 28 244 22 98-6 150-28 248-22 98 6 152 24 250 18 96-6 164-18 246-10v50Z"
        fill="#030207"
      />

      {/* cloud bank */}
      <g opacity="0.45">
        <path d="M-40 962c120-26 196-6 304-22 108-16 170-28 280-12 110 16 168 30 272 22 104-8 164-26 268-22 104 4 164 16 262 8 78-6 156-16 214-10v74H-40Z" fill="#bdb6c9" opacity="0.35" />
        <path d="M-40 986c140-18 220 6 344-8 124-14 190-20 300-6 110 14 174 24 284 16 110-8 172-18 280-12 108 6 172 12 272 6 76-4 140-10 200-6v44H-40Z" fill="#d8d2e2" opacity="0.3" />
      </g>

      {/* gate mist */}
      <ellipse cx="800" cy="900" rx="300" ry="60" fill="url(#cg-mist)" opacity="0.5" />
    </svg>
  )
}
