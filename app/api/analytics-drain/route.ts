import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// This endpoint receives analytics events from Vercel Web Analytics Drain
export async function POST(request: NextRequest) {
  try {
    const events = await request.json()
    
    // Handle both single events and arrays
    const eventArray = Array.isArray(events) ? events : [events]
    
    const pageViews = eventArray
      .filter((event: any) => event.type === 'pageview')
      .map((event: any) => ({
        path: event.payload?.path || event.path || '/',
        country: event.payload?.country || event.geo?.country || null,
        city: event.payload?.city || event.geo?.city || null,
        region: event.payload?.region || event.geo?.region || null,
        device: event.payload?.device || null,
        browser: event.payload?.browser || null,
        referrer: event.payload?.referrer || null,
        timestamp: event.payload?.timestamp || event.timestamp || new Date().toISOString(),
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
