'use client'

import { useEffect, useState } from 'react'

// Custom cursor with expanding effect on hover
// This component is dynamically imported with ssr: false in layout.tsx
export function CustomCursor() {
  const [shouldRender, setShouldRender] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Only determine if we should render after mount (client-only)
  useEffect(() => {
    // Check if NOT a touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouch) {
      setShouldRender(true)
    }
  }, [])

  // Mouse tracking
  useEffect(() => {
    if (!shouldRender) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [shouldRender, isVisible])

  // Track hover states on interactive elements
  useEffect(() => {
    if (!shouldRender) return

    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
      )

      const handleElementEnter = () => setIsHovering(true)
      const handleElementLeave = () => setIsHovering(false)

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleElementEnter)
        el.addEventListener('mouseleave', handleElementLeave)
      })

      return () => {
        interactiveElements.forEach((el) => {
          el.removeEventListener('mouseenter', handleElementEnter)
          el.removeEventListener('mouseleave', handleElementLeave)
        })
      }
    }

    // Run after a short delay to ensure DOM is ready
    const timeout = setTimeout(addHoverListeners, 100)
    return () => clearTimeout(timeout)
  }, [shouldRender])

  // Return null on server AND on initial client render to prevent hydration mismatch
  if (!shouldRender) {
    return null
  }

  return (
    <>
      {/* Hide default cursor via inline style to avoid styled-jsx hydration issues */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (hover: hover) and (pointer: fine) {
            * { cursor: none !important; }
          }
        `
      }} />

      {/* Outer ring - expands on hover */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full border-2 transition-all duration-300 ease-out"
        style={{
          left: position.x,
          top: position.y,
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovering ? 'rgba(255, 107, 74, 0.1)' : 'transparent',
          borderColor: isHovering ? '#ff6b4a' : '#1a1a1a',
        }}
      />

      {/* Inner dot */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full transition-all duration-150 ease-out"
        style={{
          left: position.x,
          top: position.y,
          width: isHovering ? 6 : 4,
          height: isHovering ? 6 : 4,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovering ? '#ff6b4a' : '#1a1a1a',
        }}
      />
    </>
  )
}
