import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all typography settings
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('typography')
      .select('*')
      .order('element_type')

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Typography fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch typography' }, { status: 500 })
  }
}

// PUT - Update typography setting
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('typography')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Typography update error:', error)
    return NextResponse.json({ error: 'Failed to update typography' }, { status: 500 })
  }
}
