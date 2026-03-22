'use client'

import { useEffect, useState, useCallback } from 'react'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Check if touch device
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0
      )
    }
    checkTouchDevice()

    // Don't show custom cursor on touch devices
    if (isTouchDevice) return

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
  }, [isVisible, isTouchDevice])

  // Track hover states on interactive elements
  useEffect(() => {
    if (isTouchDevice) return

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
  }, [isTouchDevice])

  // Don't render on touch devices or server
  if (isTouchDevice || typeof window === 'undefined') {
    return null
  }

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Outer ring - expands on hover */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full border-2 border-gray-800 transition-all duration-300 ease-out"
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
        className="fixed pointer-events-none z-[9999] rounded-full bg-gray-800 transition-all duration-150 ease-out"
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
