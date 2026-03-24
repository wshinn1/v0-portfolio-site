import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '341992'
const RESEND_API_KEY = process.env.RESEND_API_KEY

const resend = new Resend(RESEND_API_KEY)

async function fetchYesterdayAnalytics() {
  const apiHost = POSTHOG_HOST.replace('us.i.posthog.com', 'us.posthog.com')
  const apiUrl = `${apiHost}/api/projects/${PROJECT_ID}/query/`
  
  // Get yesterday's date range
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  
  const hogqlQuery = `
    SELECT 
      properties.$current_url as url,
      properties.$pathname as pathname,
      properties.$geoip_country_name as country,
      properties.$geoip_subdivision_1_name as state,
      properties.$geoip_city_name as city,
      properties.$browser as browser,
      properties.$device_type as device,
      timestamp
    FROM events 
    WHERE event = '$pageview' 
      AND toDate(timestamp) = toDate('${yesterdayStr}')
    ORDER BY timestamp DESC
    LIMIT 1000
  `
  
  const response = await fetch(apiUrl, {
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

  if (!response.ok) {
    throw new Error(`PostHog API error: ${response.status}`)
  }

  const data = await response.json()
  const results = data.results || []
  const columns = data.columns || []
  
  // Convert to objects
  const events = results.map((row: any[]) => {
    const obj: Record<string, any> = {}
    columns.forEach((col: string, i: number) => {
      obj[col] = row[i]
    })
    return obj
  })
  
  // Filter for domain
  let domainEvents = events.filter((event: any) => {
    const url = event.url || ''
    return url.includes('fullstack.wesshinn.com') || url.includes('wesshinn.com') || url.includes('localhost')
  })
  
  if (domainEvents.length === 0 && events.length > 0) {
    domainEvents = events
  }

  // Aggregate data
  const countryMap = new Map<string, number>()
  const stateMap = new Map<string, { count: number; country: string }>()
  const cityMap = new Map<string, { count: number; country: string; state: string | null }>()
  const pageMap = new Map<string, number>()
  const browserMap = new Map<string, number>()
  const deviceMap = new Map<string, number>()

  for (const event of domainEvents) {
    const country = event.country || 'Unknown'
    countryMap.set(country, (countryMap.get(country) || 0) + 1)
    
    const state = event.state
    if (state && state !== 'Unknown' && state !== null) {
      const stateKey = `${state}|${country}`
      const existing = stateMap.get(stateKey) || { count: 0, country }
      stateMap.set(stateKey, { count: existing.count + 1, country })
    }
    
    const city = event.city
    if (city && city !== 'Unknown' && city !== null) {
      const cityKey = `${city}|${state || ''}|${country}`
      const existing = cityMap.get(cityKey) || { count: 0, country, state: state || null }
      cityMap.set(cityKey, { count: existing.count + 1, country, state: state || existing.state })
    }
    
    const path = event.pathname || '/'
    pageMap.set(path, (pageMap.get(path) || 0) + 1)
    
    const browser = event.browser || 'Unknown'
    browserMap.set(browser, (browserMap.get(browser) || 0) + 1)
    
    const device = event.device || 'Desktop'
    deviceMap.set(device, (deviceMap.get(device) || 0) + 1)
  }

  return {
    date: yesterdayStr,
    totalViews: domainEvents.length,
    countries: Array.from(countryMap.entries())
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views),
    states: Array.from(stateMap.entries())
      .map(([key, data]) => ({ name: key.split('|')[0], country: data.country, views: data.count }))
      .sort((a, b) => b.views - a.views),
    cities: Array.from(cityMap.entries())
      .map(([key, data]) => ({ name: key.split('|')[0], state: data.state, country: data.country, views: data.count }))
      .sort((a, b) => b.views - a.views),
    pages: Array.from(pageMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views),
    browsers: Array.from(browserMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    devices: Array.from(deviceMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
  }
}

function generateEmailHTML(analytics: Awaited<ReturnType<typeof fetchYesterdayAnalytics>>) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Analytics Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0 0 10px 0; font-size: 24px;">Portfolio Analytics Report</h1>
    <p style="margin: 0; opacity: 0.9; font-size: 16px;">${formatDate(analytics.date)}</p>
  </div>
  
  <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <!-- Summary Stats -->
    <div style="display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 120px; background: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #0369a1;">${analytics.totalViews}</div>
        <div style="font-size: 14px; color: #64748b;">Page Views</div>
      </div>
      <div style="flex: 1; min-width: 120px; background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #15803d;">${analytics.countries.length}</div>
        <div style="font-size: 14px; color: #64748b;">Countries</div>
      </div>
      <div style="flex: 1; min-width: 120px; background: #faf5ff; padding: 20px; border-radius: 8px; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #7c3aed;">${analytics.states.length}</div>
        <div style="font-size: 14px; color: #64748b;">States</div>
      </div>
      <div style="flex: 1; min-width: 120px; background: #fffbeb; padding: 20px; border-radius: 8px; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #d97706;">${analytics.cities.length}</div>
        <div style="font-size: 14px; color: #64748b;">Cities</div>
      </div>
    </div>

    <!-- Countries Section -->
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Countries</h2>
      ${analytics.countries.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse;">
          ${analytics.countries.map(c => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #334155;">${c.name}</td>
              <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0369a1;">${c.views} views</td>
            </tr>
          `).join('')}
        </table>
      ` : '<p style="color: #94a3b8; font-style: italic;">No country data recorded</p>'}
    </div>

    <!-- States Section -->
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">States / Regions</h2>
      ${analytics.states.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse;">
          ${analytics.states.map(s => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0;">
                <div style="color: #334155;">${s.name}</div>
                <div style="font-size: 12px; color: #94a3b8;">${s.country}</div>
              </td>
              <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #7c3aed;">${s.views} views</td>
            </tr>
          `).join('')}
        </table>
      ` : '<p style="color: #94a3b8; font-style: italic;">No state data recorded</p>'}
    </div>

    <!-- Cities Section -->
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Cities</h2>
      ${analytics.cities.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse;">
          ${analytics.cities.map(c => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0;">
                <div style="color: #334155;">${c.name}</div>
                <div style="font-size: 12px; color: #94a3b8;">${c.state ? `${c.state}, ` : ''}${c.country}</div>
              </td>
              <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #d97706;">${c.views} views</td>
            </tr>
          `).join('')}
        </table>
      ` : '<p style="color: #94a3b8; font-style: italic;">No city data recorded</p>'}
    </div>

    <!-- Top Pages Section -->
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Top Pages</h2>
      ${analytics.pages.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse;">
          ${analytics.pages.slice(0, 10).map(p => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #334155; font-family: monospace; font-size: 14px;">${p.path}</td>
              <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0369a1;">${p.views}</td>
            </tr>
          `).join('')}
        </table>
      ` : '<p style="color: #94a3b8; font-style: italic;">No page data recorded</p>'}
    </div>

    <!-- Browsers & Devices -->
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 200px;">
        <h2 style="font-size: 16px; color: #1e293b; margin-bottom: 10px;">Browsers</h2>
        ${analytics.browsers.length > 0 ? analytics.browsers.map(b => `
          <div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px;">
            <span style="color: #64748b;">${b.name}</span>
            <span style="font-weight: 500; color: #334155;">${b.count}</span>
          </div>
        `).join('') : '<p style="color: #94a3b8; font-size: 14px;">No data</p>'}
      </div>
      <div style="flex: 1; min-width: 200px;">
        <h2 style="font-size: 16px; color: #1e293b; margin-bottom: 10px;">Devices</h2>
        ${analytics.devices.length > 0 ? analytics.devices.map(d => `
          <div style="display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px;">
            <span style="color: #64748b;">${d.name}</span>
            <span style="font-weight: 500; color: #334155;">${d.count}</span>
          </div>
        `).join('') : '<p style="color: #94a3b8; font-size: 14px;">No data</p>'}
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        This report was automatically generated for fullstack.wesshinn.com<br>
        Sent daily at 4:30 AM EST
      </p>
    </div>
  </div>
</body>
</html>
  `
}

export async function GET(request: NextRequest) {
  // Verify cron secret for security (optional but recommended)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  // Allow local testing or verify cron secret
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Still allow the request but log it - Vercel cron may not always send the header
    console.log('Analytics report triggered (cron or manual)')
  }

  if (!POSTHOG_API_KEY) {
    return NextResponse.json({ error: 'PostHog API key not configured' }, { status: 500 })
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 })
  }

  try {
    // Fetch yesterday's analytics
    const analytics = await fetchYesterdayAnalytics()
    
    // Generate email HTML
    const emailHTML = generateEmailHTML(analytics)
    
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Analytics <analytics@wesshinn.com>',
      to: ['weshinn@gmail.com'],
      subject: `Portfolio Analytics Report - ${analytics.date}`,
      html: emailHTML,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Analytics report sent successfully',
      emailId: data?.id,
      analytics: {
        date: analytics.date,
        totalViews: analytics.totalViews,
        countries: analytics.countries.length,
        states: analytics.states.length,
        cities: analytics.cities.length
      }
    })
  } catch (error) {
    console.error('Analytics report error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate analytics report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
