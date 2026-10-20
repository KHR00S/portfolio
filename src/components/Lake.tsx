import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTheme } from '../theme'

/*
  A lake in cross-section. Each line is an isotherm; they bunch up around the
  thermocline in the middle. Moving the pointer pulls deep lines toward the
  surface (upwelling) and tints them amber. With reduced motion we draw one
  still frame with a settled bulge and stop.
*/

const LINES = 22
const STEP = 10 // px between sampled points
const SIGMA_MAX = 150 // width of the upwelling bulge, px; narrower on small screens

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim()
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function Lake({ pointerTarget }: { pointerTarget: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const css = getComputedStyle(document.documentElement)
    const iso = hexToRgb(css.getPropertyValue('--iso') || '#3b8a86')
    const lamp = hexToRgb(css.getPropertyValue('--lamp') || '#f4b740')

    let w = 0
    let h = 0
    let cols = 0
    let sigma = SIGMA_MAX
    let lift = new Float32Array(0) // current lift per column, 0..1
    let raf = 0
    let visible = true
    const pointer = { x: -1, strength: 0 }
    const start = performance.now()

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / STEP) + 1
      sigma = Math.min(SIGMA_MAX, w * 0.12)
      const next = new Float32Array(cols)
      next.set(lift.subarray(0, Math.min(cols, lift.length)))
      lift = next
    }

    /* line i sits at this fraction of the height; denser near the middle */
    const baseY = (i: number) => {
      const s = (i / (LINES - 1)) * 2 - 1
      const shaped = Math.sign(s) * Math.pow(Math.abs(s), 1.55)
      return h * (0.08 + 0.9 * (0.5 + 0.5 * shaped))
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < LINES; i++) {
        const depth = i / (LINES - 1) // 0 surface, 1 bottom
        const y0 = baseY(i)
        const amp = 2 + depth * 5
        const rise = h * 0.32 * depth * depth
        const grad = ctx.createLinearGradient(0, 0, w, 0)
        const stops = 12
        for (let s = 0; s <= stops; s++) {
          const c = Math.min(cols - 1, Math.round(((s / stops) * w) / STEP))
          const k = Math.min(1, lift[c] * (0.35 + depth))
          const r = Math.round(iso[0] + (lamp[0] - iso[0]) * k)
          const g = Math.round(iso[1] + (lamp[1] - iso[1]) * k)
          const b = Math.round(iso[2] + (lamp[2] - iso[2]) * k)
          const a = 0.35 + 0.45 * (1 - depth * 0.4) + 0.2 * k
          grad.addColorStop(s / stops, `rgba(${r},${g},${b},${Math.min(1, a)})`)
        }
        ctx.beginPath()
        for (let c = 0; c < cols; c++) {
          const x = c * STEP
          const wave =
            Math.sin(x * 0.0042 + t * 0.00035 + i * 0.55) * amp +
            Math.sin(x * 0.011 - t * 0.0006 + i * 1.3) * amp * 0.35
          const y = y0 + wave - lift[c] * rise
          if (c === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = grad
        ctx.lineWidth = i % 5 === 0 ? 1.4 : 0.9
        ctx.stroke()
      }
    }

    const settledBulge = () => {
      for (let c = 0; c < cols; c++) {
        const x = c * STEP
        lift[c] = 0.45 * Math.exp(-((x - w * 0.68) ** 2) / (2 * (sigma * 1.4) ** 2))
      }
    }

    resize()

    if (reduce) {
      settledBulge()
      draw(0)
      const ro = new ResizeObserver(() => {
        resize()
        settledBulge()
        draw(0)
      })
      ro.observe(canvas)
      return () => ro.disconnect()
    }

    /* each column eases toward the stronger of: the pointer bulge, or a slow wandering one */
    const step = (now: number) => {
      const t = now - start
      const ambientX = w * (0.62 + 0.25 * Math.sin(t * 0.00011))
      pointer.strength *= 0.985
      for (let c = 0; c < cols; c++) {
        const x = c * STEP
        const a = 0.5 * Math.exp(-((x - ambientX) ** 2) / (2 * (sigma * 1.6) ** 2))
        const p = pointer.x < 0 ? 0 : pointer.strength * Math.exp(-((x - pointer.x) ** 2) / (2 * sigma ** 2))
        lift[c] += (Math.max(a, p) - lift[c]) * 0.06
      }
      draw(t)
      raf = visible ? requestAnimationFrame(step) : 0
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden
      if (visible && !raf) raf = requestAnimationFrame(step)
    })
    io.observe(canvas)

    const onVisibility = () => {
      visible = !document.hidden
      if (visible && !raf) raf = requestAnimationFrame(step)
    }
    document.addEventListener('visibilitychange', onVisibility)

    const target = pointerTarget.current ?? canvas
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      /* lower in the hero means a stronger push */
      const depth = Math.min(1, Math.max(0, (e.clientY - r.top + r.height * 0.3) / (r.height * 1.3)))
      pointer.strength = Math.min(1, Math.max(pointer.strength, 0.55 + 0.45 * depth))
    }
    const onLeave = () => {
      pointer.x = -1
    }
    target.addEventListener('pointermove', onMove, { passive: true })
    target.addEventListener('pointerdown', onMove, { passive: true })
    target.addEventListener('pointerleave', onLeave, { passive: true })

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerdown', onMove)
      target.removeEventListener('pointerleave', onLeave)
    }
  }, [theme, reduce, pointerTarget])

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden="true" />
}
