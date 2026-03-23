import { NextRequest, NextResponse } from 'next/server'

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '341992'

export async function GET(request: NextRequest) {
  if (!POSTHOG_API_KEY) {
    console.error('[v0] PostHog API key not configured')
    return NextResponse.json({ 
      error: 'PostHog API key not configured',
      totalViews: 0,
      uniqueCountries: 0,
      uniqueCities: 0,
      countries: [],
      cities: [],
      pages: [],
      daily: []
    })
  }

  const searchParams = request.nextUrl.searchParams
  const days = parseInt(searchParams.get('days') || '30')

  try {
    // PostHog Query API uses the main host (not the ingestion host)
    const apiHost = POSTHOG_HOST.replace('us.i.posthog.com', 'us.posthog.com')
    const apiUrl = `${apiHost}/api/projects/${PROJECT_ID}/query/`
    
    // Use HogQL to query pageview events
    const hogqlQuery = `
      SELECT 
        properties.$current_url as url,
        properties.$pathname as pathname,
        properties.$geoip_country_name as country,
        properties.$geoip_city_name as city,
        properties.$browser as browser,
        properties.$device_type as device,
        timestamp
      FROM events 
      WHERE event = '$pageview' 
        AND timestamp >= now() - INTERVAL ${days} DAY
      ORDER BY timestamp DESC
      LIMIT 1000
    `
    
    console.log('[v0] Fetching PostHog events using Query API')
    
    const eventsResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POSTHOG_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          kind: 'HogQLQuery',
          query: hogqlQuery
        }
      }),
      cache: 'no-store'
    })

    if (!eventsResponse.ok) {
      const errorText = await eventsResponse.text()
      console.error('[v0] PostHog API error:', eventsResponse.status, errorText)
      return NextResponse.json({
        totalViews: 0,
        uniqueCountries: 0,
        uniqueCities: 0,
        countries: [],
        cities: [],
        pages: [],
        daily: [],
        error: `PostHog API error: ${eventsResponse.status}`
      })
    }

    const data = await eventsResponse.json()
    const results = data.results || []
    const columns = data.columns || ['url', 'pathname', 'country', 'city', 'browser', 'device', 'timestamp']
    
    console.log('[v0] PostHog returned events count:', results.length)
    
    // Convert results array to objects
    const events = results.map((row: any[]) => {
      const obj: Record<string, any> = {}
      columns.forEach((col: string, i: number) => {
        obj[col] = row[i]
      })
      return obj
    })
    
    // Filter for this domain
    let domainEvents = events.filter((event: any) => {
      const url = event.url || ''
      return url.includes('fullstack.wesshinn.com') || url.includes('wesshinn.com') || url.includes('localhost')
    })
    
    // If no domain-filtered events, show all
    if (domainEvents.length === 0 && events.length > 0) {
      console.log('[v0] No domain-filtered events, showing all')
      domainEvents = events
    }

    // Aggregate data
    const countryMap = new Map<string, number>()
    const cityMap = new Map<string, { count: number; country: string }>()
    const pageMap = new Map<string, number>()
    const dailyMap = new Map<string, number>()
    const browserMap = new Map<string, number>()
    const deviceMap = new Map<string, number>()

    for (const event of domainEvents) {
      // Country
      const country = event.country || 'Unknown'
      countryMap.set(country, (countryMap.get(country) || 0) + 1)
      
      // City
      const city = event.city
      if (city && city !== 'Unknown' && city !== null) {
        const cityKey = `${city}|${country}`
        const existing = cityMap.get(cityKey) || { count: 0, country }
        cityMap.set(cityKey, { count: existing.count + 1, country })
      }
      
      // Pages
      const path = event.pathname || '/'
      pageMap.set(path, (pageMap.get(path) || 0) + 1)
      
      // Daily views
      const date = new Date(event.timestamp).toISOString().split('T')[0]
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
      
      // Browser
      const browser = event.browser || 'Unknown'
      browserMap.set(browser, (browserMap.get(browser) || 0) + 1)
      
      // Device
      const device = event.device || 'Desktop'
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1)
    }

    // Convert to sorted arrays
    const countries = Array.from(countryMap.entries())
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    const cities = Array.from(cityMap.entries())
      .map(([key, data]) => {
        const [name] = key.split('|')
        return { name, country: data.country, views: data.count }
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    const pages = Array.from(pageMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    const daily = Array.from(dailyMap.entries())
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Get recent visitors (last 10 events)
    const recentVisitors = domainEvents
      .slice(0, 10)
      .map((event: any) => ({
        country: event.country || 'Unknown',
        city: event.city || 'Unknown',
        page: event.pathname || '/',
        time: event.timestamp,
        browser: event.browser || 'Unknown'
      }))

    return NextResponse.json({
      totalViews: domainEvents.length,
      uniqueCountries: countryMap.size,
      uniqueCities: cityMap.size,
      countries,
      cities,
      pages,
      daily,
      recentVisitors,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('[v0] PostHog API error:', error)
    // Return empty data instead of error for graceful degradation
    return NextResponse.json({
      totalViews: 0,
      uniqueCountries: 0,
      uniqueCities: 0,
      countries: [],
      cities: [],
      pages: [],
      daily: [],
      error: 'Failed to fetch analytics'
    })
  }
}
