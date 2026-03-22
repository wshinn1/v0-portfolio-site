import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Required named export for Next.js middleware
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

// Empty matcher - middleware won't run on any routes
export const config = {
  matcher: [],
}
