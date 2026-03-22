import { type NextRequest, NextResponse } from 'next/server'

// Next.js middleware - currently disabled
// Will be re-enabled for admin authentication in Phase 11
export function middleware(_request: NextRequest): NextResponse {
  return NextResponse.next()
}

// Empty matcher = middleware doesn't run on any routes
export const config = {
  matcher: []
}
