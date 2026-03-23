import { NextRequest, NextResponse } from 'next/server'

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY
const PROJECT_ID = '341992'

interface PostHogEvent {
  properties: {
    $geoip_country_name?: string
    $geoip_city_name?: string
    $geoip_country_code?: string
    $current_url?: string
    $pathname?: string
    $browser?: string
    $device_type?: string
    $referrer?: string
  }
  timestamp: string
}

export async function GET(request: NextRequest) {
  if (!POSTHOG_API_KEY) {
    return NextResponse.json({ error: 'PostHog API key not configured' }, { status: 500 })
  }

  const searchParams = request.nextUrl.searchParams
  const days = parseInt(searchParams.get('days') || '30')
  
  // Calculate date range
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  try {
    // Fetch pageview events from PostHog
    const eventsResponse = await fetch(
      `${POSTHOG_HOST}/api/projects/${PROJECT_ID}/events?event=$pageview&after=${startDate.toISOString()}&before=${endDate.toISOString()}&limit=1000`,
      {
        headers: {
          'Authorization': `Bearer ${POSTHOG_API_KEY}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    )

    if (!eventsResponse.ok) {
      const errorText = await eventsResponse.text()
      console.error('PostHog API error:', errorText)
      return NextResponse.json({ error: 'Failed to fetch from PostHog' }, { status: 500 })
    }

    const eventsData = await eventsResponse.json()
    const events: PostHogEvent[] = eventsData.results || []

    // Filter events for this domain only
    const domainEvents = events.filter(event => {
      const url = event.properties?.$current_url || ''
      return url.includes('fullstack.wesshinn.com') || url.includes('localhost')
    })

    // Aggregate data
    const countryMap = new Map<string, number>()
    const cityMap = new Map<string, { count: number; country: string }>()
    const pageMap = new Map<string, number>()
    const dailyMap = new Map<string, number>()
    const browserMap = new Map<string, number>()
    const deviceMap = new Map<string, number>()

    for (const event of domainEvents) {
      const props = event.properties || {}
      
      // Country
      const country = props.$geoip_country_name || 'Unknown'
      countryMap.set(country, (countryMap.get(country) || 0) + 1)
      
      // City
      const city = props.$geoip_city_name
      if (city && city !== 'Unknown') {
        const cityKey = `${city}|${country}`
        const existing = cityMap.get(cityKey) || { count: 0, country }
        cityMap.set(cityKey, { count: existing.count + 1, country })
      }
      
      // Pages
      const path = props.$pathname || '/'
      pageMap.set(path, (pageMap.get(path) || 0) + 1)
      
      // Daily views
      const date = new Date(event.timestamp).toISOString().split('T')[0]
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
      
      // Browser
      const browser = props.$browser || 'Unknown'
      browserMap.set(browser, (browserMap.get(browser) || 0) + 1)
      
      // Device
      const device = props.$device_type || 'Desktop'
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

    return NextResponse.json({
      totalViews: domainEvents.length,
      uniqueCountries: countryMap.size,
      uniqueCities: cityMap.size,
      countries,
      cities,
      pages,
      daily,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('PostHog API error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
