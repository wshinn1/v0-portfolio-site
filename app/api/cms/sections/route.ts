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

// POST - Create/duplicate a section
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { section_type, title, content, sort_order, is_visible } = body

    if (!section_type) {
      return NextResponse.json({ error: 'Section type required' }, { status: 400 })
    }

    // Generate a unique section_type for duplicates
    const uniqueSectionType = `${section_type}_${Date.now()}`

    const { data, error } = await supabase
      .from('sections')
      .insert({
        section_type: uniqueSectionType,
        title: title || section_type,
        content: content || {},
        sort_order: sort_order || 99,
        is_visible: is_visible ?? true,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Section create error:', error)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}

// DELETE - Remove a section
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Section delete error:', error)
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 })
  }
}
