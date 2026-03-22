import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware disabled - no auth checks needed for now
// Re-enable when admin auth is required
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
