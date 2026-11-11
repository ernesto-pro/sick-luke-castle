/**
 * BatSwarm — pipistrelli veri su piani 3D.
 * Ogni esemplare ha profondità (translateZ), scala, velocità e deriva proprie;
 * le ali battono con rotateY/rotateZ, così la silhouette prende volume.
 * CSS puro, zero canvas, zero dipendenze. Reduced motion: stormo fermo.
 */
import { useEffect, useRef } from 'react'

const WING_L =
  'M0 0C-2.6-3.6-6.6-5.6-11-4.9C-9.1-3-8.4 0-8.8 2.7C-6.7 1.4-4.5 1.7-3.1 3.4C-2 1.9-1 1.1 0 1.1Z'

const WING_R =
  'M0 0C2.6-3.6 6.6-5.6 11-4.9C9.1-3 8.4 0 8.8 2.7C6.7 1.4 4.5 1.7 3.1 3.4C2 1.9 1 1.1 0 1.1Z'

const EAR =
  'M-1.7-.2-2-2.9-.6-1.1ZM1.7-.2 2-2.9.6-1.1Z'

/* lo stormo: valori fissi, niente casualità tra un render e l'altro */
const FAR = [
  { y: 12, w: 30, z: -180, dur: 42, delay: -7, drift: 26, op: 0.34, tone: 'blood', rot: -4 },
  { y: 23, w: 22, z: -220, dur: 48, delay: -21, drift: 34, op: 0.26, tone: 'gold', rot: 3 },
  { y: 34, w: 26, z: -160, dur: 39, delay: -13, drift: -22, op: 0.36, tone: 'blood', rot: -2 },
  { y: 45, w: 19, z: -240, dur: 52, delay: -33, drift: 18, op: 0.22, tone: 'gold', rot: 5 },
  { y: 18, w: 24, z: -200, dur: 44, delay: -28, drift: -28, op: 0.3, tone: 'blood', rot: 2 },
  { y: 30, w: 32, z: -140, dur: 36, delay: -4, drift: 24, op: 0.4, tone: 'gold', rot: -3 },
  { y: 54, w: 21, z: -260, dur: 55, delay: -40, drift: -16, op: 0.2, tone: 'blood', rot: 4 },
  { y: 38, w: 28, z: -175, dur: 41, delay: -17, drift: 32, op: 0.33, tone: 'blood', rot: -5 },
]

const NEAR = [
  { y: 16, w: 46, z: 40, dur: 26, delay: -9, drift: -34, op: 0.72, tone: 'blood', rot: -5 },
  { y: 40, w: 38, z: 20, dur: 31, delay: -24, drift: 30, op: 0.6, tone: 'gold', rot: 4 },
  { y: 58, w: 54, z: 70, dur: 23, delay: -3, drift: 26, op: 0.8, tone: 'blood', rot: -2 },
  { y: 27, w: 34, z: 0, dur: 34, delay: -18, drift: -24, op: 0.55, tone: 'gold', rot: 6 },
]

const SECTION = [
  { y: 8, w: 26, z: -120, dur: 48, delay: -11, drift: 24, op: 0.26, tone: 'blood', rot: -3 },
  { y: 20, w: 20, z: -180, dur: 56, delay: -30, drift: -20, op: 0.2, tone: 'gold', rot: 4 },
  { y: 32, w: 30, z: -90, dur: 44, delay: -6, drift: 28, op: 0.3, tone: 'blood', rot: -5 },
  { y: 15, w: 18, z: -220, dur: 62, delay: -44, drift: 16, op: 0.16, tone: 'gold', rot: 2 },
  { y: 46, w: 24, z: -150, dur: 50, delay: -22, drift: -26, op: 0.24, tone: 'blood', rot: 3 },
]

function Bat({ bat, index }) {
  return (
    <span
      className={`bat-plane bat-plane--${bat.tone}`}
      style={{
        '--x0': `${(index * 13 + bat.y) % 84}vw`,
        '--y': `${bat.y}%`,
        '--w': `${bat.w}px`,
        '--z': `${bat.z}px`,
        '--dur': `${bat.dur}s`,
        '--delay': `${bat.delay}s`,
        '--drift': `${bat.drift}px`,
        '--op': bat.op,
        '--rot': `${bat.rot}deg`,
        '--flap': `${0.24 + (bat.w % 7) * 0.012}s`,
      }}
    >
      <span className="bat-bank">
        <svg className="bat" viewBox="-13 -7.5 26 13.5" aria-hidden="true" focusable="false">
          <path className="bat-wing bat-wing--l" d={WING_L} />
          <path className="bat-wing bat-wing--r" d={WING_R} />
          <path className="bat-ears" d={EAR} />
          <ellipse className="bat-body" cx="0" cy="1.9" rx="0.95" ry="2.5" />
        </svg>
      </span>
    </span>
  )
}

export default function BatSwarm({ variant = 'far', className = '' }) {
  const ref = useRef(null)
  const bats = variant === 'near' ? NEAR : variant === 'section' ? SECTION : FAR

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      el?.classList.add('is-on')
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-on', entry.isIntersecting),
      { rootMargin: '120px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`bat-swarm bat-swarm--${variant} ${className}`.trim()} aria-hidden="true">
      {bats.map((bat, i) => (
        <Bat key={i} bat={bat} index={i} />
      ))}
    </div>
  )
}
