import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only run auth middleware for /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return await updateSession(request)
  }
  
  // For all other routes, just continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match admin routes and API routes that need auth
     */
    '/admin/:path*',
    '/api/cms/:path*',
    '/api/upload/:path*',
  ],
}
