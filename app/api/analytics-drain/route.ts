import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// This endpoint receives analytics events from Vercel Web Analytics Drain
export async function POST(request: NextRequest) {
  try {
    const rawEvents = await request.json()
    
    // Store raw payload for debugging (can be removed later)
    await supabase.from('analytics_raw').insert({ payload: rawEvents })
    
    // Vercel sends: [{payload: [{event1}, {event2}]}, {payload: [{event3}]}]
    // Flatten all events from all payload arrays
    const allEvents: any[] = []
    const eventWrappers = Array.isArray(rawEvents) ? rawEvents : [rawEvents]
    
    for (const wrapper of eventWrappers) {
      if (wrapper.payload && Array.isArray(wrapper.payload)) {
        allEvents.push(...wrapper.payload)
      } else if (wrapper.eventType || wrapper.type) {
        // Direct event format
        allEvents.push(wrapper)
      }
    }
    
    const pageViews = allEvents
      .filter((event: any) => event.eventType === 'pageview' || event.type === 'pageview')
      .map((event: any) => ({
        path: event.path || event.page || event.url || '/',
        // Vercel sends country directly on event (not nested)
        country: event.country || event.geo?.country || null,
        // Note: Vercel Web Analytics does NOT provide city data
        city: event.city || event.geo?.city || null,
        region: event.region || event.geo?.region || null,
        // Device info from Vercel
        device: event.deviceType || event.device?.type || null,
        browser: event.clientName || event.browser || null,
        referrer: event.referrer || event.ref || null,
        timestamp: event.timestamp ? new Date(event.timestamp).toISOString() : new Date().toISOString(),
      }))

    if (pageViews.length > 0) {
      const { error } = await supabase
        .from('page_views')
        .insert(pageViews)

      if (error) {
        console.error('Failed to insert page views:', error)
        return NextResponse.json({ error: 'Failed to store analytics' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, count: pageViews.length })
  } catch (error) {
    console.error('Analytics drain error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Allow GET for testing the endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Analytics drain endpoint is ready. Configure this URL in Vercel Web Analytics Drains.' 
  })
}
