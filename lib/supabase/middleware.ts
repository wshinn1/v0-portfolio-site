import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Updates the Supabase session by refreshing auth tokens.
 * Only call this for protected routes that require authentication.
 */
export async function updateSession(request: NextRequest) {
  // Default response - continue without modification
  let supabaseResponse = NextResponse.next({ request })

  // IMPORTANT: Check env vars FIRST before creating client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, skip Supabase and just continue
  if (!url || !key) {
    console.warn('[v0] Supabase env vars not found, skipping auth check')
    return supabaseResponse
  }

  // Create Supabase client with verified env vars
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Get current user - required to refresh session tokens
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if accessing /admin without auth
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}
