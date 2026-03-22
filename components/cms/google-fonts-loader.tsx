'use client'

import { useEffect } from 'react'
import type { Typography } from '@/lib/types/cms'

// Popular Google Fonts list for the admin selector
export const GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Oswald',
  'Raleway',
  'Nunito',
  'Merriweather',
  'Source Sans Pro',
  'PT Sans',
  'Ubuntu',
  'Noto Sans',
  'Rubik',
  'Work Sans',
  'DM Sans',
  'Outfit',
  'Space Grotesk',
  'Sora',
  'Manrope',
  'Plus Jakarta Sans',
  'Archivo',
  'Barlow',
  'Lexend',
  'Figtree',
  'Geist',
] as const

export type GoogleFont = (typeof GOOGLE_FONTS)[number]

interface GoogleFontsLoaderProps {
  typography: Typography[]
}

export function GoogleFontsLoader({ typography }: GoogleFontsLoaderProps) {
  useEffect(() => {
    // Get unique font families from typography settings
    const fontFamilies = [...new Set(typography.map((t) => t.font_family))]
    
    // Filter to only include Google Fonts (not system fonts)
    const googleFonts = fontFamilies.filter((font) => 
      GOOGLE_FONTS.includes(font as GoogleFont)
    )
    
    if (googleFonts.length === 0) return

    // Build Google Fonts URL with all weights
    const weights = '300;400;500;600;700;800'
    const fontsParam = googleFonts
      .map((font) => `family=${font.replace(/\s+/g, '+')}:wght@${weights}`)
      .join('&')
    
    const href = `https://fonts.googleapis.com/css2?${fontsParam}&display=swap`
    
    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${href}"]`)
    if (existingLink) return

    // Create and inject the link
    const link = document.createElement('link')
    link.href = href
    link.rel = 'stylesheet'
    link.setAttribute('data-google-fonts', 'true')
    document.head.appendChild(link)

    return () => {
      // Cleanup old links when fonts change
      const oldLinks = document.querySelectorAll('link[data-google-fonts="true"]')
      oldLinks.forEach((oldLink) => {
        if (oldLink.getAttribute('href') !== href) {
          oldLink.remove()
        }
      })
    }
  }, [typography])

  return null
}
