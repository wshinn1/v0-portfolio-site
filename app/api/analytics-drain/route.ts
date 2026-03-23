import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// This endpoint receives analytics events from Vercel Web Analytics Drain
// Vercel sends JSON arrays with schema "vercel.analytics.v2" and eventType "pageview"
export async function POST(request: NextRequest) {
  try {
    const events = await request.json()
    
    // Handle both single events and arrays
    const eventArray = Array.isArray(events) ? events : [events]
    
    const pageViews = eventArray
      .filter((event: any) => event.eventType === 'pageview')
      .map((event: any) => ({
        path: event.path || '/',
        country: event.geo?.country || null,
        city: event.geo?.city || null,
        region: event.geo?.region || null,
        device: event.ua?.device || null,
        browser: event.ua?.browser || null,
        referrer: event.referrer || null,
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
