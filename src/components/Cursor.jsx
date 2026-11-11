import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const auraRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    document.documentElement.classList.add('has-cursor')
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    const aura = auraRef.current
    if (!dot || !ring) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let ax = x
    let ay = y
    let raf = 0
    let visible = false

    const render = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      ax += (x - ax) * 0.055
      ay += (y - ay) * 0.055
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      if (aura) aura.style.transform = `translate3d(${ax}px, ${ay}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(render)
    }

    const show = () => {
      if (visible) return
      visible = true
      dot.classList.add('is-visible')
      ring.classList.add('is-visible')
      aura?.classList.add('is-visible')
    }

    const hide = () => {
      visible = false
      dot.classList.remove('is-visible')
      ring.classList.remove('is-visible')
      aura?.classList.remove('is-visible')
    }

    const move = (e) => {
      x = e.clientX
      y = e.clientY
      show()
    }

    const over = (e) => {
      const target = e.target.closest?.('[data-cursor]')
      if (!target) {
        ring.dataset.mode = 'default'
        if (label) label.textContent = ''
        return
      }
      ring.dataset.mode = target.dataset.cursor || 'link'
      if (label) label.textContent = target.dataset.cursorLabel || ''
    }

    const down = () => ring.classList.add('is-down')
    const up = () => ring.classList.remove('is-down')

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', hide)
    document.addEventListener('mouseenter', show)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', hide)
      document.removeEventListener('mouseenter', show)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor-aura" ref={auraRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span className="cursor-label" ref={labelRef} />
      </div>
    </>
  )
}
