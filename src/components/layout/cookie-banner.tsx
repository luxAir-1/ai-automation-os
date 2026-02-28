'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'ai_automation_os_cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        setVisible(true)
      }
    } catch {
      // localStorage may be unavailable (e.g. private browsing in some browsers)
    }
  }, [])

  function handleAccept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  function handleDecline() {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 animate-[fadeInUp_0.5s_ease-out_forwards] border-t border-border/40 bg-background/70 px-6 py-5 shadow-[0_-8px_30px_hsl(220_16%_0%/0.4)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/50"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-sm leading-relaxed text-muted-foreground">
          We use strictly necessary cookies to keep you logged in, and optional
          analytics cookies to improve the platform. See our{' '}
          <Link
            href="/privacy#cookie-policy"
            className="text-foreground underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary"
          >
            cookie policy
          </Link>{' '}
          for details. By default, only necessary cookies are set.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-border/60 bg-transparent px-5 py-2 font-heading text-sm font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:bg-surface-2 hover:text-foreground"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="glow-amber rounded-lg bg-primary px-5 py-2 font-heading text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
