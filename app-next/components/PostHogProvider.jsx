'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// ── Init ──────────────────────────────────────────────────────────────────────
// Called once on mount. Safe to call multiple times — PostHog guards internally.
function PostHogInit() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: false,   // we do it manually below so we get the right URL
      capture_pageleave: true,
      autocapture: false,        // keep it intentional — we own the event taxonomy
      persistence: 'localStorage+cookie',
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug()
      },
    })
  }, [])

  // Manual pageview on every route change
  useEffect(() => {
    if (!pathname) return
    const url = pathname + (searchParams?.toString() ? '?' + searchParams.toString() : '')
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}

// ── Provider ──────────────────────────────────────────────────────────────────
export default function PostHogProvider({ children }) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    // No key — render children normally, no crash
    return <>{children}</>
  }

  return (
    <PHProvider client={posthog}>
      <PostHogInit />
      {children}
    </PHProvider>
  )
}
