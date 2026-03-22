import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Default export - Next.js accepts this as middleware
export default function middleware(_request: NextRequest) {
  return NextResponse.next()
}

// Config with empty matcher - middleware runs on no routes
export const config = {
  matcher: [],
}
