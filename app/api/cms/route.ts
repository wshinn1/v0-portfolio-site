import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CMSData } from '@/lib/types/cms'

// GET - Fetch all CMS data for frontend
export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all data in parallel
    const [typographyRes, settingsRes, sectionsRes] = await Promise.all([
      supabase.from('typography').select('*').order('element_type'),
      supabase.from('site_settings').select('*').single(),
      supabase.from('sections').select('*').order('sort_order'),
    ])

    if (typographyRes.error) throw typographyRes.error
    if (sectionsRes.error) throw sectionsRes.error

    const data: CMSData = {
      typography: typographyRes.data || [],
      siteSettings: settingsRes.data || null,
      sections: sectionsRes.data || [],
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('CMS fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch CMS data' }, { status: 500 })
  }
}
