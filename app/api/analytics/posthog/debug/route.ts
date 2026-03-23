import { NextRequest, NextResponse } from 'next/server'

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID || '341992'

export async function GET(request: NextRequest) {
  const debug: Record<string, any> = {
    hasApiKey: !!POSTHOG_API_KEY,
    apiKeyPrefix: POSTHOG_API_KEY?.substring(0, 10) || 'NOT SET',
    projectId: PROJECT_ID,
    hostEnv: POSTHOG_HOST,
  }

  if (!POSTHOG_API_KEY) {
    return NextResponse.json({ 
      ...debug,
      error: 'POSTHOG_PERSONAL_API_KEY not configured'
    })
  }

  try {
    const apiHost = POSTHOG_HOST.replace('us.i.posthog.com', 'us.posthog.com')
    const apiUrl = `${apiHost}/api/projects/${PROJECT_ID}/query/`
    debug.apiUrl = apiUrl

    const hogqlQuery = `
      SELECT 
        properties.$current_url as url,
        properties.$pathname as pathname,
        properties.$geoip_country_name as country,
        properties.$geoip_city_name as city,
        timestamp
      FROM events 
      WHERE event = '$pageview' 
        AND timestamp >= now() - INTERVAL 7 DAY
      ORDER BY timestamp DESC
      LIMIT 10
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

    debug.responseStatus = response.status
    debug.responseStatusText = response.statusText

    const responseText = await response.text()
    
    try {
      debug.responseData = JSON.parse(responseText)
    } catch {
      debug.responseText = responseText.substring(0, 1000)
    }

    return NextResponse.json(debug)
  } catch (error) {
    debug.error = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(debug)
  }
}
