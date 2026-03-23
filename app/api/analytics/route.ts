import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get total page views
    const { count: totalViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', startDate.toISOString())

    // Get page views by country
    const { data: byCountry } = await supabase
      .from('page_views')
      .select('country')
      .gte('timestamp', startDate.toISOString())
      .not('country', 'is', null)

    // Get page views by city
    const { data: byCity } = await supabase
      .from('page_views')
      .select('city, country')
      .gte('timestamp', startDate.toISOString())
      .not('city', 'is', null)

    // Get page views by path
    const { data: byPath } = await supabase
      .from('page_views')
      .select('path')
      .gte('timestamp', startDate.toISOString())

    // Get daily views for chart
    const { data: dailyViews } = await supabase
      .from('page_views')
      .select('timestamp')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true })

    // Aggregate country data
    const countryMap = new Map<string, number>()
    byCountry?.forEach((row) => {
      const country = row.country || 'Unknown'
      countryMap.set(country, (countryMap.get(country) || 0) + 1)
    })
    const countries = Array.from(countryMap.entries())
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Aggregate city data
    const cityMap = new Map<string, { views: number; country: string }>()
    byCity?.forEach((row) => {
      const city = row.city || 'Unknown'
      const existing = cityMap.get(city)
      if (existing) {
        existing.views++
      } else {
        cityMap.set(city, { views: 1, country: row.country || '' })
      }
    })
    const cities = Array.from(cityMap.entries())
      .map(([name, data]) => ({ name, views: data.views, country: data.country }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Aggregate path data
    const pathMap = new Map<string, number>()
    byPath?.forEach((row) => {
      const path = row.path || '/'
      pathMap.set(path, (pathMap.get(path) || 0) + 1)
    })
    const pages = Array.from(pathMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Aggregate daily data for chart
    const dailyMap = new Map<string, number>()
    dailyViews?.forEach((row) => {
      const date = new Date(row.timestamp).toISOString().split('T')[0]
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
    })
    const daily = Array.from(dailyMap.entries())
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      totalViews: totalViews || 0,
      countries,
      cities,
      pages,
      daily,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
