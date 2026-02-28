'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Disclaimer } from '@/components/layout/disclaimer'

interface AnalysisResult {
  property: {
    title: string
    address: string
    city: string
    price: number
    square_meters: number | null
    rooms: number | null
    property_type: string
    source: string
    url: string
  }
  analysis: {
    overall_score: number
    investment_score: number
    value_score: number
    neighborhood_score?: number
    estimated_monthly_rent: number
    gross_yield_pct: number
    net_yield_pct: number
    estimated_monthly_costs: {
      mortgage: number
      vve: number
      maintenance: number
      insurance: number
      management?: number
      total: number
    }
    monthly_cashflow: number
    ai_summary: string
    ai_pros: string[]
    ai_cons: string[]
    wws_max_rent: number | null
    rent_vs_wws_ratio: number | null
  }
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : score >= 50
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold ${color}`}>
      {score}/100
    </span>
  )
}

function formatEur(amount: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}

function formatPct(value: number) {
  return `${value.toFixed(2)}%`
}

export function AnalyzeForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    setProgress(10)

    // Simulate progress ticks
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.floor(Math.random() * 15) + 5
      })
    }, 600)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Unknown error' }))
        setError(data.error ?? `Request failed with status ${res.status}`)
        return
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : 'Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyze a Property</CardTitle>
          <CardDescription>
            Paste a listing URL from Pararius or Funda to get an instant AI investment analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="url">Listing URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://www.pararius.com/apartment/amsterdam/... or https://www.funda.nl/koop/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !url.trim()}>
                  {loading ? 'Analyzing…' : 'Analyze'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported: pararius.com and funda.nl listings
              </p>
            </div>

            {/* Progress bar */}
            {loading && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Scraping and analyzing listing…</span>
                  <span>{Math.min(progress, 100)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          <strong>Error: </strong>{error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Property summary */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">{result.property.title}</CardTitle>
                  <CardDescription>
                    {result.property.address ? `${result.property.address}, ` : ''}{result.property.city}
                    {' · '}
                    <a
                      href={result.property.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      View original listing
                    </a>
                  </CardDescription>
                </div>
                <div className="shrink-0 text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Score</div>
                  <ScoreBadge score={result.analysis.overall_score} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Asking Price</p>
                  <p className="mt-0.5 text-lg font-semibold">{formatEur(result.property.price)}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Gross Yield</p>
                  <p className="mt-0.5 text-lg font-semibold">{formatPct(result.analysis.gross_yield_pct)}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Net Yield</p>
                  <p className="mt-0.5 text-lg font-semibold">{formatPct(result.analysis.net_yield_pct)}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Monthly Cashflow</p>
                  <p className={`mt-0.5 text-lg font-semibold ${result.analysis.monthly_cashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatEur(result.analysis.monthly_cashflow)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scores */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Investment Score</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${result.analysis.investment_score}%` }} />
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{result.analysis.investment_score}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Value Score</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${result.analysis.value_score}%` }} />
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{result.analysis.value_score}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estimated Rent</p>
                <p className="mt-1 text-2xl font-bold">{formatEur(result.analysis.estimated_monthly_rent)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly costs breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estimated Monthly Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mortgage (interest-only, 70% LTV)</span>
                  <span className="font-medium">{formatEur(result.analysis.estimated_monthly_costs.mortgage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VvE / service charges</span>
                  <span className="font-medium">{formatEur(result.analysis.estimated_monthly_costs.vve)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maintenance reserve</span>
                  <span className="font-medium">{formatEur(result.analysis.estimated_monthly_costs.maintenance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance</span>
                  <span className="font-medium">{formatEur(result.analysis.estimated_monthly_costs.insurance)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total costs</span>
                  <span>{formatEur(result.analysis.estimated_monthly_costs.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WWS */}
          {result.analysis.wws_max_rent !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">WWS Rent Regulation</CardTitle>
                <CardDescription>Woningwaarderingsstelsel (Dutch rental regulation)</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Max regulated rent</span>
                  <span className="font-medium">{formatEur(result.analysis.wws_max_rent)}/mo</span>
                </div>
                {result.analysis.rent_vs_wws_ratio !== null && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-muted-foreground">Rent as % of WWS max</span>
                    <span className={`font-medium ${result.analysis.rent_vs_wws_ratio > 1 ? 'text-amber-600' : 'text-green-600'}`}>
                      {formatPct(result.analysis.rent_vs_wws_ratio * 100)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{result.analysis.ai_summary}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">Pros</p>
                  <ul className="space-y-1">
                    {result.analysis.ai_pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 text-green-500">+</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">Cons</p>
                  <ul className="space-y-1">
                    {result.analysis.ai_cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 text-red-500">-</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Disclaimer />
        </div>
      )}
    </div>
  )
}
