import { NextResponse } from 'next/server'

// Next.js Middleware - must export a function named "middleware"
export function middleware() {
  return NextResponse.next()
}

// Empty matcher means this middleware runs on no routes
export const config = {
  matcher: [],
}
