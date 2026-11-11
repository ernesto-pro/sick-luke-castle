const M_TOP = 34
const M_W = 30

const merlons = (x, w) => {
  const out = []
  const count = Math.max(1, Math.round(w / (M_W * 2)))
  const step = w / count
  for (let i = 0; i < count; i += 1) {
    out.push(`M${x + i * step} ${M_TOP} h${step * 0.62} v-18 h-${step * 0.62} Z`)
  }
  return out
}

function Tower({ x, flip = false }) {
  return (
    <g transform={flip ? `translate(${x} 0) scale(-1 1)` : `translate(${x} 0)`}>
      {/* body */}
      <path d="M0 140V18h128v122Z" fill="#040308" />
      <path d="M0 20h128v14H0Z" fill="#06040a" />
      {/* crenellations */}
      <g fill="#040308">
        <path d="M0 22V4h18v18ZM26 22V4h18v18ZM52 22V4h18v18ZM78 22V4h18v18ZM104 22V4h18v18Z" />
      </g>
      {/* buttress */}
      <path d="M6 140V58l16-18v100Z" fill="#050409" />
      {/* arrow slits */}
      <g fill="#c9a24a" opacity="0.5">
        <path d="M48 62h6v22h-6Z" />
        <path d="M76 70h5v16h-5Z" opacity="0.5" />
      </g>
      {/* stone lines */}
      <g stroke="rgba(236,229,216,0.06)" strokeWidth="1">
        <path d="M0 52h128M0 92h128M0 118h128" />
        <path d="M26 34v18M52 34v18M78 34v18M104 34v18" />
      </g>
      {/* torch */}
      <g transform="translate(104 74)">
        <ellipse cx="0" cy="0" rx="22" ry="26" fill="url(#frameTorch)" opacity="0.7" />
        <path d="M-3 4h6v16h-6Z" fill="#050409" />
        <path className="frame-flame" d="M0 10C-6 3-5-4 0-10c5 6 6 13 0 20Z" fill="#e8b45c" />
      </g>
    </g>
  )
}

export default function CastleWall({ className = '' }) {
  return (
    <svg
      className={`castle-wall ${className}`.trim()}
      viewBox="0 0 1600 140"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="frameTorch" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffdf9a" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#e8873a" stopOpacity="0.4" />
          <stop offset="1" stopColor="#8f2a12" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* low wall spans */}
      <g fill="#040308">
        <path d="M0 140V76h330v64Z" />
        <path d="M1270 140V76h330v64Z" />
        {merlons(0, 330).map((d) => (
          <path key={d} d={d} />
        ))}
        {merlons(1270, 330).map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <g stroke="rgba(236,229,216,0.055)" strokeWidth="1">
        <path d="M0 96h330M0 118h330M1270 96h330M1270 118h330" />
      </g>

      <Tower x={56} />
      <Tower x={1544} flip />

      {/* rim light from the moon */}
      <g fill="none" stroke="rgba(201,162,74,0.16)" strokeWidth="1">
        <path d="M56 22h128M184 36v104M1416 22h-128M1288 36v104" />
      </g>
    </svg>
  )
}
