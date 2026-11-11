/* ============================================================
   X2 — the official mark.
   A sharp monogram built from two strokes: the X and the 2.
   ============================================================ */

export const X2_PATHS = {
  x: 'M12 17.5 29.5 46.5M29.5 17.5 12 46.5',
  two: 'M37 25.5c.6-8.4 15.4-9.1 15.4 1.4 0 6.7-9.4 12.6-15.4 19.6h15.4',
}

export default function X2Mark({ className = '', framed = false }) {
  return (
    <svg
      className={`x2-mark ${className}`.trim()}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      {framed && (
        <rect
          x="1.8"
          y="1.8"
          width="60.4"
          height="60.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          opacity="0.42"
        />
      )}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d={X2_PATHS.x} />
        <path d={X2_PATHS.two} />
      </g>
    </svg>
  )
}
