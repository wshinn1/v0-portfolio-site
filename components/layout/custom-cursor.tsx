'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

// Custom cursor with expanding effect on hover
// Uses refs and requestAnimationFrame for smooth 60fps performance
export function CustomCursor() {
  const [shouldRender, setShouldRender] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const isVisibleRef = useRef(false)

  // Only determine if we should render after mount (client-only)
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouch) {
      setShouldRender(true)
    }
  }, [])

  // Update cursor position directly via DOM (no React re-renders)
  const updateCursorPosition = useCallback(() => {
    if (outerRef.current && innerRef.current) {
      const { x, y } = positionRef.current
      outerRef.current.style.left = `${x}px`
      outerRef.current.style.top = `${y}px`
      innerRef.current.style.left = `${x}px`
      innerRef.current.style.top = `${y}px`
      
      if (isVisibleRef.current) {
        outerRef.current.style.opacity = '1'
        innerRef.current.style.opacity = '1'
      }
    }
    rafRef.current = null
  }, [])

  // Mouse tracking with requestAnimationFrame
  useEffect(() => {
    if (!shouldRender) return

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      isVisibleRef.current = true
      
      // Only schedule one RAF at a time
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateCursorPosition)
      }
    }

    const handleMouseLeave = () => {
      isVisibleRef.current = false
      if (outerRef.current && innerRef.current) {
        outerRef.current.style.opacity = '0'
        innerRef.current.style.opacity = '0'
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [shouldRender, updateCursorPosition])

  // Track hover states on interactive elements
  useEffect(() => {
    if (!shouldRender) return

    const handleElementEnter = () => setIsHovering(true)
    const handleElementLeave = () => setIsHovering(false)

    const observer = new MutationObserver(() => {
      // Re-attach listeners when DOM changes
      document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach((el) => {
        el.removeEventListener('mouseenter', handleElementEnter)
        el.removeEventListener('mouseleave', handleElementLeave)
        el.addEventListener('mouseenter', handleElementEnter, { passive: true })
        el.addEventListener('mouseleave', handleElementLeave, { passive: true })
      })
    })

    // Initial attachment
    document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach((el) => {
      el.addEventListener('mouseenter', handleElementEnter, { passive: true })
      el.addEventListener('mouseleave', handleElementLeave, { passive: true })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach((el) => {
        el.removeEventListener('mouseenter', handleElementEnter)
        el.removeEventListener('mouseleave', handleElementLeave)
      })
    }
  }, [shouldRender])

  if (!shouldRender) {
    return null
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (hover: hover) and (pointer: fine) {
            * { cursor: none !important; }
          }
        `
      }} />

      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed pointer-events-none z-[9999] rounded-full border-2"
        style={{
          left: 0,
          top: 0,
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          backgroundColor: isHovering ? 'rgba(255, 107, 74, 0.1)' : 'transparent',
          borderColor: isHovering ? '#ff6b4a' : '#1a1a1a',
          transition: 'width 0.2s, height 0.2s, background-color 0.2s, border-color 0.2s',
          willChange: 'left, top',
        }}
      />

      {/* Inner dot */}
      <div
        ref={innerRef}
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          left: 0,
          top: 0,
          width: isHovering ? 6 : 4,
          height: isHovering ? 6 : 4,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          backgroundColor: isHovering ? '#ff6b4a' : '#1a1a1a',
          transition: 'width 0.15s, height 0.15s, background-color 0.15s',
          willChange: 'left, top',
        }}
      />
    </>
  )
}
