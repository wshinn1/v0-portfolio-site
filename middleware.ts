// Next.js Middleware - Updated 2026-03-22
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Simple passthrough - no auth checks
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
