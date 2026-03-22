import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware is currently disabled - just pass through
  return NextResponse.next()
}

export const config = {
  // Empty matcher means middleware runs on no routes
  matcher: [],
}
