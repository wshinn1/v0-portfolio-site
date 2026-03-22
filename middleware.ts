import { NextResponse, type NextRequest } from 'next/server'

// Next.js middleware - runs on matched routes
export const middleware = (request: NextRequest) => {
  return NextResponse.next()
}

// Required config export
export const config = {
  matcher: [],
}
