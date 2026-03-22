import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware if Supabase env vars are not set (allows public pages to load)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }
  
  // Only run auth middleware for /admin routes (not login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    return await updateSession(request)
  }
  
  // For all other routes, just continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Only match admin routes - API routes use their own auth checks
     */
    '/admin/:path*',
  ],
}
