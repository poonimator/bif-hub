'use client'
import { useEffect, useRef } from 'react'

/**
 * CursorBlend — a single circle that follows the pointer, using
 * mix-blend-mode: difference so it inverts whatever is beneath it. It tracks
 * the pointer 1:1 (so it sits where the hidden native cursor would be).
 * No-op on touch devices.
 */
export default function CursorBlend() {
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    const onMove = (e: MouseEvent) => {
      const el = ringRef.current
      if (!el) return
      if (el.style.opacity !== '1') el.style.opacity = '1'
      // rAF-throttle the transform write
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      })
    }
    const onLeave = () => {
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#ffffff',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        transform: 'translate(-100px, -100px)',
        transition: 'opacity 0.25s',
        willChange: 'transform',
      }}
    />
  )
}
