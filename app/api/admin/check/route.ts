import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role to check auth.users table
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Check if any users exist in auth.users
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    })

    if (error) {
      console.error('Error checking users:', error)
      return NextResponse.json({ error: 'Failed to check users' }, { status: 500 })
    }

    const adminExists = data.users && data.users.length > 0

    return NextResponse.json({ adminExists })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json({ error: 'Failed to check admin status' }, { status: 500 })
  }
}
