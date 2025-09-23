'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

interface PostHogAnalyticsProps {
  apiKey?: string
  host?: string
}

export default function PostHogAnalytics({ apiKey, host }: PostHogAnalyticsProps) {
  useEffect(() => {
    if (!apiKey) return

    posthog.init(apiKey, {
      api_host: host || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })
  }, [apiKey, host])

  return null
}
