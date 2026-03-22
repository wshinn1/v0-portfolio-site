import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all sections
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('sort_order')

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Sections fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

// PUT - Update a section
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
      .from('sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Section update error:', error)
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 })
  }
}
