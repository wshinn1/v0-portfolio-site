'use client'

import dynamic from 'next/dynamic'

// Dynamic import with ssr: false must be in a client component
const CustomCursor = dynamic(
  () => import('./custom-cursor').then(mod => mod.CustomCursor),
  { ssr: false }
)

export function CursorWrapper() {
  return <CustomCursor />
}
