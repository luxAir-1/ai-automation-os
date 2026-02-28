'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Properties',
    href: '/dashboard/properties',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Saved',
    href: '/dashboard/saved',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    ),
  },
  {
    label: 'Analyze URL',
    href: '/dashboard/analyze',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
]

interface SidebarProps {
  subscriptionTier?: string | null
}

function TierBadge({ tier }: { tier?: string | null }) {
  const label =
    tier === 'pro'
      ? 'Pro'
      : tier === 'founding_member'
      ? 'Founding Member'
      : tier === 'starter'
      ? 'Starter'
      : 'Free'

  return (
    <div className="border-t border-border/50 px-4 py-4">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all duration-300',
            tier === 'pro'
              ? 'bg-amber/15 text-amber shadow-[0_0_12px_hsl(38_92%_55%/0.12)]'
              : tier === 'founding_member'
              ? 'bg-gradient-to-r from-amber/20 to-orange-500/20 text-transparent bg-clip-text font-bold'
              : tier === 'starter'
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-surface-3 text-muted-foreground'
          )}
        >
          {tier === 'founding_member' ? (
            <span className="bg-gradient-to-r from-amber to-orange-400 bg-clip-text text-transparent font-bold">
              {label}
            </span>
          ) : (
            label
          )}
        </div>
        <span className="text-[11px] text-muted-foreground/60 uppercase tracking-widest">plan</span>
      </div>
    </div>
  )
}

export function Sidebar({ subscriptionTier }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const navContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileOpen(false)}
        >
          {/* Amber diamond icon */}
          <div className="relative flex h-8 w-8 items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              <path
                d="M14 2L24 14L14 26L4 14L14 2Z"
                fill="url(#diamond-gradient)"
                stroke="hsl(38 92% 55%)"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              <path
                d="M14 6L20 14L14 22L8 14L14 6Z"
                fill="hsl(38 92% 55%)"
                fillOpacity="0.25"
              />
              <defs>
                <linearGradient id="diamond-gradient" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="hsl(38 92% 60%)" />
                  <stop offset="1" stopColor="hsl(28 100% 48%)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-heading text-base font-semibold tracking-tight text-foreground">
              PropScout
            </span>
            <span className="inline-flex items-center rounded-md bg-amber/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber">
              AI
            </span>
          </div>
        </Link>
      </div>

      {/* Divider below brand */}
      <div className="mx-4 border-t border-border/40" />

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4" aria-label="Sidebar navigation">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-surface-2 text-foreground'
                  : 'text-muted-foreground hover:bg-surface-3/60 hover:text-foreground'
              )}
            >
              {/* Active left accent bar */}
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-amber"
                  aria-hidden="true"
                />
              )}
              {/* Icon with amber tint when active */}
              <span
                className={cn(
                  'shrink-0 transition-colors duration-200',
                  active ? 'text-amber' : 'text-muted-foreground group-hover:text-foreground/70'
                )}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Subscription tier badge */}
      <TierBadge tier={subscriptionTier} />
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border/40 bg-surface-1 md:block">
        {navContent}
      </aside>

      {/* Mobile: hamburger header */}
      <div className="flex h-14 items-center gap-3 border-b border-border/40 bg-surface-1 px-4 md:hidden">
        <button
          type="button"
          aria-label="Open sidebar"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="font-heading text-base font-semibold tracking-tight text-foreground">
            PropScout
          </span>
          <span className="inline-flex items-center rounded-md bg-amber/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber">
            AI
          </span>
        </div>
      </div>

      {/* Mobile: overlay drawer */}
      {mobileOpen && (
        <>
          {/* Dark backdrop with blur */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <aside
            className="fixed inset-y-0 left-0 z-50 w-56 border-r border-border/40 bg-surface-1 shadow-2xl shadow-black/50 md:hidden animate-slide-in-left"
          >
            {/* Close button */}
            <div className="absolute right-3 top-3 z-10">
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            {navContent}
          </aside>
        </>
      )}
    </>
  )
}
