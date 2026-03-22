import { createClient } from '@/lib/supabase/server'
import type { CMSData, Section, SectionType, Typography, SiteSettings } from '@/lib/types/cms'

// Fetch all CMS data for server components
export async function getCMSData(): Promise<CMSData> {
  const supabase = await createClient()

  const [typographyRes, settingsRes, sectionsRes] = await Promise.all([
    supabase.from('typography').select('*').order('element_type'),
    supabase.from('site_settings').select('*').single(),
    supabase.from('sections').select('*').eq('is_visible', true).order('sort_order'),
  ])

  return {
    typography: typographyRes.data || [],
    siteSettings: settingsRes.data || null,
    sections: sectionsRes.data || [],
  }
}

// Fetch a specific section by type
export async function getSection<T>(sectionType: SectionType): Promise<Section | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('section_type', sectionType)
    .single()

  if (error) {
    console.error(`Error fetching ${sectionType} section:`, error)
    return null
  }

  return data
}

// Fetch typography settings
export async function getTypography(): Promise<Typography[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('typography')
    .select('*')
    .order('element_type')

  if (error) {
    console.error('Error fetching typography:', error)
    return []
  }

  return data || []
}

// Fetch site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching site settings:', error)
    return null
  }

  return data
}

// Helper to get typography as a map for easy access
export async function getTypographyMap(): Promise<Record<string, Typography>> {
  const typography = await getTypography()
  return typography.reduce((acc, t) => {
    acc[t.element_type] = t
    return acc
  }, {} as Record<string, Typography>)
}
