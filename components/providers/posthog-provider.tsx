'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      console.log('[v0] Initializing PostHog with key:', process.env.NEXT_PUBLIC_POSTHOG_KEY?.substring(0, 10) + '...')
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false, // We'll capture manually for more control
        capture_pageleave: true,
        loaded: (posthog) => {
          console.log('[v0] PostHog loaded successfully')
        }
      })
    } else {
      console.log('[v0] PostHog not initialized - missing key or not in browser')
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}

// Component to track page views
export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + '?' + searchParams.toString()
      }
      console.log('[v0] Capturing pageview:', url)
      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams])

  return null
}
