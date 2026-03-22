'use client'

import { createContext, useContext, useMemo } from 'react'
import type { Typography } from '@/lib/types/cms'
import { GoogleFontsLoader } from './google-fonts-loader'

type TypographyMap = {
  h1: Typography | null
  h2: Typography | null
  h3: Typography | null
  body: Typography | null
  small: Typography | null
  label: Typography | null
}

interface TypographyContextValue {
  typography: TypographyMap
  getStyle: (element: keyof TypographyMap) => React.CSSProperties
  getClassName: (element: keyof TypographyMap) => string
}

const TypographyContext = createContext<TypographyContextValue | null>(null)

interface TypographyProviderProps {
  children: React.ReactNode
  typography: Typography[]
}

export function TypographyProvider({ children, typography }: TypographyProviderProps) {
  const typographyMap = useMemo(() => {
    const map: TypographyMap = {
      h1: null,
      h2: null,
      h3: null,
      body: null,
      small: null,
      label: null,
    }
    
    typography.forEach((t) => {
      if (t.element_type in map) {
        map[t.element_type as keyof TypographyMap] = t
      }
    })
    
    return map
  }, [typography])

  const getStyle = (element: keyof TypographyMap): React.CSSProperties => {
    const t = typographyMap[element]
    if (!t) return {}
    
    return {
      fontFamily: `'${t.font_family}', sans-serif`,
      fontSize: t.font_size,
      fontWeight: t.font_weight as React.CSSProperties['fontWeight'],
      lineHeight: t.line_height,
      letterSpacing: t.letter_spacing,
      color: t.color,
    }
  }

  const getClassName = (element: keyof TypographyMap): string => {
    // Return a CSS class name based on element type
    // These can be used alongside the inline styles for additional styling
    return `cms-typography-${element}`
  }

  const value: TypographyContextValue = {
    typography: typographyMap,
    getStyle,
    getClassName,
  }

  return (
    <TypographyContext.Provider value={value}>
      <GoogleFontsLoader typography={typography} />
      {children}
    </TypographyContext.Provider>
  )
}

export function useTypography() {
  const context = useContext(TypographyContext)
  if (!context) {
    throw new Error('useTypography must be used within a TypographyProvider')
  }
  return context
}

// Styled typography components that automatically apply CMS styles
interface TypographyComponentProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function H1({ children, className = '', style = {} }: TypographyComponentProps) {
  const { getStyle } = useTypography()
  return (
    <h1 
      className={`cms-typography-h1 ${className}`} 
      style={{ ...getStyle('h1'), ...style }}
    >
      {children}
    </h1>
  )
}

export function H2({ children, className = '', style = {} }: TypographyComponentProps) {
  const { getStyle } = useTypography()
  return (
    <h2 
      className={`cms-typography-h2 ${className}`} 
      style={{ ...getStyle('h2'), ...style }}
    >
      {children}
    </h2>
  )
}

export function H3({ children, className = '', style = {} }: TypographyComponentProps) {
  const { getStyle } = useTypography()
  return (
    <h3 
      className={`cms-typography-h3 ${className}`} 
      style={{ ...getStyle('h3'), ...style }}
    >
      {children}
    </h3>
  )
}

export function Body({ children, className = '', style = {} }: TypographyComponentProps) {
  const { getStyle } = useTypography()
  return (
    <p 
      className={`cms-typography-body ${className}`} 
      style={{ ...getStyle('body'), ...style }}
    >
      {children}
    </p>
  )
}

export function Small({ children, className = '', style = {} }: TypographyComponentProps) {
  const { getStyle } = useTypography()
  return (
    <span 
      className={`cms-typography-small ${className}`} 
      style={{ ...getStyle('small'), ...style }}
    >
      {children}
    </span>
  )
}

export function Label({ children, className = '', style = {} }: TypographyComponentProps) {
  const { getStyle } = useTypography()
  return (
    <span 
      className={`cms-typography-label uppercase ${className}`} 
      style={{ ...getStyle('label'), ...style }}
    >
      {children}
    </span>
  )
}
