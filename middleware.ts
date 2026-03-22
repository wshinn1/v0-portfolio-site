import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only process /admin routes (except login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check env vars before importing Supabase middleware
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // No Supabase config - redirect to login with message
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.searchParams.set('error', 'config')
      return NextResponse.redirect(loginUrl)
    }

    // Dynamically import to avoid issues when env vars are missing
    const { updateSession } = await import('@/lib/supabase/middleware')
    return await updateSession(request)
  }

  // All other routes pass through
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
