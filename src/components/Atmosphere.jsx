import { useEffect, useRef } from 'react'

function rand(min, max) {
  return min + Math.random() * (max - min)
}

/**
 * Atmosphere — canvas ambience (bats and embers).
 *
 * Performance contract:
 * - starts only when the hero is live (after the castle intro);
 * - pauses when off-screen;
 * - DPR capped at 1.5, no shadowBlur, no per-frame gradients;
 * - particle counts scale with viewport but stay deliberately low.
 */
export default function Atmosphere({ className = '', live = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!live) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let raf = 0
    let visible = true
    let last = performance.now()
    let bats = []
    let embers = []

    const makeBat = () => ({
      x: rand(0, width),
      y: rand(height * 0.08, height * 0.7),
      s: rand(8, 18),
      vx: rand(-0.4, 0.26),
      vy: rand(-0.1, 0.1),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.0015, 0.003),
      alpha: rand(0.3, 0.62),
    })

    const makeEmber = () => ({
      x: rand(0, width),
      y: rand(0, height),
      r: rand(0.6, 1.7),
      vy: rand(-0.32, -0.08),
      drift: rand(0, Math.PI * 2),
      alpha: rand(0.18, 0.55),
      warm: Math.random() > 0.55,
    })

    const seed = () => {
      const batCount = Math.min(4, Math.max(2, Math.round(width / 430)))
      bats = Array.from({ length: batCount }, makeBat)
      embers = Array.from(
        { length: Math.min(22, Math.max(10, Math.round(width / 120))) },
        makeEmber,
      )
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const drawBat = (bat) => {
      const flap = 0.3 + Math.abs(Math.sin(bat.phase)) * 0.9
      const s = bat.s
      const w = s * 2.5
      const tipY = -s * 0.15 - s * flap * 0.55

      ctx.save()
      ctx.translate(bat.x, bat.y)
      ctx.globalAlpha = bat.alpha
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(-w * 0.3, -s * flap, -w, tipY)
      ctx.quadraticCurveTo(-w * 0.58, s * 0.4, -s * 0.34, s * 0.26)
      ctx.quadraticCurveTo(-s * 0.18, s * 0.95, 0, s * 0.5)
      ctx.quadraticCurveTo(s * 0.18, s * 0.95, s * 0.34, s * 0.26)
      ctx.quadraticCurveTo(w * 0.58, s * 0.4, w, tipY)
      ctx.quadraticCurveTo(w * 0.3, -s * flap, 0, 0)
      ctx.closePath()
      ctx.fillStyle = 'rgba(7,5,9,0.82)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(211,20,50,0.4)'
      ctx.lineWidth = 0.75
      ctx.stroke()
      ctx.restore()
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height)

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (const ember of embers) {
        const a = ember.alpha * (0.55 + 0.45 * Math.sin(t * 0.0012 + ember.drift))
        ctx.fillStyle = ember.warm
          ? `rgba(201,162,74,${Math.max(0, a * 0.55)})`
          : `rgba(211,20,50,${Math.max(0, a * 0.5)})`
        ctx.beginPath()
        ctx.arc(ember.x, ember.y, ember.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      for (const bat of bats) drawBat(bat)
    }

    const step = (now) => {
      raf = 0
      if (!visible) return
      const dt = Math.min(32, now - last)
      last = now

      for (const bat of bats) {
        bat.x += bat.vx * dt * 0.06
        bat.y += bat.vy * dt * 0.06
        bat.phase += bat.speed * dt
        if (bat.x < -bat.s * 3) {
          bat.x = width + bat.s * 3
          bat.y = rand(height * 0.08, height * 0.7)
        }
        if (bat.x > width + bat.s * 3) bat.x = -bat.s * 3
        if (bat.y < height * 0.03) bat.vy = Math.abs(bat.vy)
        if (bat.y > height * 0.78) bat.vy = -Math.abs(bat.vy)
      }

      for (const ember of embers) {
        ember.y += ember.vy * dt * 0.06
        ember.x += Math.sin(now * 0.0004 + ember.drift) * 0.12
        if (ember.y < -10) {
          ember.y = height + 10
          ember.x = rand(0, width)
        }
      }

      draw(now)
      raf = requestAnimationFrame(step)
    }

    const start = () => {
      if (raf || reduced || !visible) return
      last = performance.now()
      raf = requestAnimationFrame(step)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduced) {
      draw(performance.now())
      return () => window.removeEventListener('resize', resize)
    }

    if (typeof IntersectionObserver !== 'undefined') {
      const obs = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting
          if (visible) start()
          else {
            cancelAnimationFrame(raf)
            raf = 0
          }
        },
        { rootMargin: '80px' },
      )
      obs.observe(canvas)
      return () => {
        obs.disconnect()
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
      }
    }

    start()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [live])

  return <canvas ref={canvasRef} className={`atmosphere ${className}`.trim()} aria-hidden="true" />
}
