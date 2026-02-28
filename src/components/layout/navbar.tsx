'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Skip auth if env vars missing (demo mode)
    if (!supabaseUrl || !supabaseAnonKey) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    supabase.auth.getUser().then((result: { data: { user: User | null } }) => {
      setUser(result.data.user || null)
      setLoading(false)
    }).catch(() => {
      setUser(null)
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-foreground transition-colors"
        >
          <span className="inline-block h-2 w-2 rotate-45 rounded-sm bg-primary transition-transform group-hover:scale-125" />
          AI Automation OS
        </Link>

        {/* Center nav links (visible to non-logged-in users) */}
        {!loading && !user && (
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/pricing"
              className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-surface-2" />
          ) : user ? (
            <>
              <span className="hidden max-w-[180px] truncate text-sm text-muted-foreground sm:inline">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="rounded-lg border-border/60 font-body text-sm transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="rounded-lg font-body text-sm text-muted-foreground transition-all hover:bg-surface-2 hover:text-foreground"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="glow-amber rounded-lg bg-primary px-5 font-heading text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
