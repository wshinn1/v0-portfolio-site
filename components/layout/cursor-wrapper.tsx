'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

// Dynamic import with ssr: false must be in a client component
const CustomCursor = dynamic(
  () => import('./custom-cursor').then(mod => mod.CustomCursor),
  { ssr: false }
)

export function CursorWrapper() {
  const pathname = usePathname()
  
  // Don't show custom cursor on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  return <CustomCursor />
}
