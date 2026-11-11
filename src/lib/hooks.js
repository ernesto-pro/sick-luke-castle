import { useEffect, useRef, useState } from 'react'

export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const { threshold = 0.18, rootMargin = '0px 0px -8% 0px', once = true } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) obs.unobserve(entry.target)
          } else if (!once) {
            setInView(false)
          }
        })
      },
      { threshold, rootMargin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}

export function useLockBody(active) {
  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [active])
}

export function useEscape(active, onClose) {
  useEffect(() => {
    if (!active) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, onClose])
}

export function useFocusTrap(active, containerRef, initialFocusRef) {
  useEffect(() => {
    if (!active) return undefined
    const container = containerRef.current
    if (!container) return undefined
    const previous = document.activeElement
    const focusables = () =>
      Array.from(
        container.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => node.offsetParent !== null || node === document.activeElement)

    const raf = requestAnimationFrame(() => {
      const target = initialFocusRef?.current || focusables()[0] || container
      target?.focus?.()
    })

    const onKey = (event) => {
      if (event.key !== 'Tab') return
      const nodes = focusables()
      if (!nodes.length) {
        event.preventDefault()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [active, containerRef, initialFocusRef])
}

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observed = new Set()
    let timer
    let tries = 0
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 },
    )

    // sections below the fold arrive in lazy chunks after the first paint:
    // keep looking for them until every anchor is observed.
    const attach = () => {
      let complete = true
      ids.forEach((id) => {
        if (observed.has(id)) return
        const node = document.getElementById(id)
        if (node) {
          obs.observe(node)
          observed.add(id)
        } else {
          complete = false
        }
      })
      if (!complete && tries < 40) {
        tries += 1
        timer = window.setTimeout(attach, 250)
      }
    }

    attach()
    return () => {
      window.clearTimeout(timer)
      obs.disconnect()
    }
  }, [ids])

  return active
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return reduced
}

export function useMagnetic(strength = 0.22) {
  const ref = useRef(null)

  const onMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'translate3d(0,0,0)'
  }

  return { ref, onMouseMove, onMouseLeave }
}

/**
 * useTiltDeck — un solo listener per tutte le superfici [data-tilt].
 * Scrive --rx/--ry/--mx/--my sull'elemento attivo: la CSS fa il resto.
 * Niente listener per card, niente ricalcoli quando il puntatore è fermo.
 */
export function useTiltDeck() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    if (!window.matchMedia('(pointer: fine)').matches) return undefined

    let active = null
    let frame = 0
    let px = 0.5
    let py = 0.5

    const reset = (el) => {
      if (!el) return
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
      el.classList.remove('is-tilting')
    }

    const paint = () => {
      frame = 0
      if (!active) return
      const max = Number(active.dataset.tilt) || 6
      active.style.setProperty('--rx', `${((0.5 - py) * max).toFixed(3)}deg`)
      active.style.setProperty('--ry', `${((px - 0.5) * max).toFixed(3)}deg`)
      active.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`)
      active.style.setProperty('--my', `${(py * 100).toFixed(2)}%`)
    }

    const onMove = (e) => {
      const el = e.target instanceof Element ? e.target.closest('[data-tilt]') : null
      if (el !== active) {
        reset(active)
        active = el
        if (active) active.classList.add('is-tilting')
        if (frame) {
          cancelAnimationFrame(frame)
          frame = 0
        }
      }
      if (!active) return
      const rect = active.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
      if (!frame) frame = requestAnimationFrame(paint)
    }

    const clear = () => {
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
      reset(active)
      active = null
    }

    const onOut = (e) => {
      if (!e.relatedTarget) clear()
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    window.addEventListener('blur', clear)

    return () => {
      clear()
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
      window.removeEventListener('blur', clear)
    }
  }, [])
}

export function useTilt(max = 7) {
  const ref = useRef(null)

  const onMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--rx', `${(0.5 - py) * max}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * max}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return { ref, onMouseMove, onMouseLeave }
}
