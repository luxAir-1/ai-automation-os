import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SeedButtonClient } from './seed-button-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  // Fetch real stats
  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })

  const { count: highScoreDeals } = await supabase
    .from('property_analyses')
    .select('*', { count: 'exact', head: true })
    .gte('overall_score', 75)

  const { count: alertsSent } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  // Fetch top 3 recent deals
  const { data: recentDeals } = await supabase
    .from('properties')
    .select('id, title, city, price, property_analyses(overall_score)')
    .order('created_at', { ascending: false })
    .limit(3)

  const topDeals = (recentDeals ?? []).map((row) => {
    const analyses = row.property_analyses as { overall_score: number | null }[] | null
    const score = Array.isArray(analyses) && analyses[0] ? analyses[0].overall_score : null
    return { id: row.id, title: row.title, city: row.city, price: row.price, score }
  }).filter(d => d.score != null)

  const greeting = profile?.full_name
    ? `Welcome back, ${profile.full_name}`
    : 'Welcome back'
  const subGreeting = user!.email

  const formatEur = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome section */}
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          <span className="text-gradient">{greeting}</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {subGreeting}
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="stagger grid gap-4 sm:grid-cols-3">
        {/* Properties Analyzed */}
        <div className="stat-card rounded-xl border border-border/50 bg-surface-2 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Properties Analyzed</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3/80">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" aria-hidden="true">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
          </div>
          <p className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground fade-in">
            {totalProperties ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">Across all Dutch markets</p>
        </div>

        {/* High-Score Deals */}
        <div className="stat-card rounded-xl border border-border/50 bg-surface-2 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">High-Score Deals</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3/80">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" aria-hidden="true">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground fade-in">
            {highScoreDeals ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">Score 75+ opportunities</p>
        </div>

        {/* Alerts Sent */}
        <div className="stat-card rounded-xl border border-border/50 bg-surface-2 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Alerts Sent</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3/80">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" aria-hidden="true">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </div>
          </div>
          <p className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground fade-in">
            {alertsSent ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">Email notifications</p>
        </div>
      </div>

      {/* Top Deals or Building portfolio */}
      {topDeals.length > 0 ? (
        <div className="space-y-3 fade-in-up">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
            Top Recent Deals
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {topDeals.map((deal) => (
              <Link
                key={deal.id}
                href={`/dashboard/properties/${deal.id}`}
                className="glass-card group flex flex-col rounded-xl px-5 py-4 transition-all duration-200 hover:border-amber/30 hover:shadow-[0_0_20px_hsl(38_92%_55%/0.08)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{deal.title}</p>
                  <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    (deal.score ?? 0) >= 75 ? 'bg-green-900/50 text-green-300' :
                    (deal.score ?? 0) >= 50 ? 'bg-amber-900/50 text-amber-300' :
                    'bg-red-900/50 text-red-300'
                  }`}>
                    {deal.score}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{deal.city}</p>
                <p className="text-sm font-medium text-amber mt-2">{formatEur(deal.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 fade-in-up delay-200">
          <div className="dot-grid relative flex flex-col items-center justify-center rounded-xl py-12">
            <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-amber/20 animate-ping" style={{ animationDuration: '3s' }} aria-hidden="true" />
              <span className="absolute inset-2 rounded-full border border-amber/15 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} aria-hidden="true" />
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 shadow-lg shadow-black/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="hsl(38 92% 55%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse-glow" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                  <path d="M11 8a3 3 0 0 0-3 3" />
                </svg>
              </div>
            </div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Your portfolio is being built
            </h2>
            <p className="mt-2 max-w-md text-center text-sm text-muted-foreground leading-relaxed">
              Seed the database with demo properties to get started, or analyze a property URL directly.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/dashboard/analyze"
                className="rounded-full bg-amber px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-amber/90"
              >
                Analyze a Property
              </Link>
              <SeedButtonClient />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions row */}
      <div className="space-y-3 fade-in-up delay-400">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
          Quick Actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/dashboard/properties"
            className="glass-card group flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-200 hover:border-amber/30 hover:shadow-[0_0_20px_hsl(38_92%_55%/0.08)]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 transition-colors group-hover:bg-amber/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground transition-colors group-hover:text-amber" aria-hidden="true">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Browse Properties</p>
              <p className="text-xs text-muted-foreground">Explore analyzed listings</p>
            </div>
          </Link>

          <Link
            href="/dashboard/settings/criteria"
            className="glass-card group flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-200 hover:border-amber/30 hover:shadow-[0_0_20px_hsl(38_92%_55%/0.08)]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 transition-colors group-hover:bg-amber/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground transition-colors group-hover:text-amber" aria-hidden="true">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Set Criteria</p>
              <p className="text-xs text-muted-foreground">Define investment filters</p>
            </div>
          </Link>

          <Link
            href="/dashboard/analyze"
            className="glass-card group flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-200 hover:border-amber/30 hover:shadow-[0_0_20px_hsl(38_92%_55%/0.08)]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 transition-colors group-hover:bg-amber/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground transition-colors group-hover:text-amber" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Analyze URL</p>
              <p className="text-xs text-muted-foreground">Paste a property link</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
