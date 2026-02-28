'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { PropertyCard } from '@/components/properties/property-card'
import type { Property, PropertyAnalysis } from '@/types/database'

interface PropertyItem {
  property: Property
  analysis: PropertyAnalysis | null
}

interface PropertiesClientProps {
  items: PropertyItem[]
}

const SCORE_RANGES = [
  { label: 'Alle scores', value: 'all' },
  { label: 'Hoog (70–100)', value: 'high' },
  { label: 'Middel (50–69)', value: 'medium' },
  { label: 'Laag (<50)', value: 'low' },
  { label: 'Niet geanalyseerd', value: 'none' },
]

const SORT_OPTIONS = [
  { label: 'Nieuwste eerst', value: 'newest' },
  { label: 'Oudste eerst', value: 'oldest' },
  { label: 'Hoogste score', value: 'score_desc' },
  { label: 'Laagste prijs', value: 'price_asc' },
  { label: 'Hoogste prijs', value: 'price_desc' },
]

export function PropertiesClient({ items }: PropertiesClientProps) {
  const [search, setSearch] = useState('')
  const [scoreRange, setScoreRange] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  // Collect unique cities from data
  const cities = useMemo(() => {
    const set = new Set(items.map((i) => i.property.city))
    return ['all', ...Array.from(set).sort()]
  }, [items])

  const filtered = useMemo(() => {
    let result = [...items]

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        ({ property }) =>
          (property.address ?? '').toLowerCase().includes(q) ||
          property.city.toLowerCase().includes(q) ||
          property.title.toLowerCase().includes(q)
      )
    }

    // City filter
    if (cityFilter !== 'all') {
      result = result.filter(({ property }) => property.city === cityFilter)
    }

    // Score range filter
    if (scoreRange !== 'all') {
      result = result.filter(({ analysis }) => {
        const s = analysis?.overall_score ?? null
        if (scoreRange === 'none') return s == null
        if (s == null) return false
        if (scoreRange === 'high') return s >= 70
        if (scoreRange === 'medium') return s >= 50 && s < 70
        if (scoreRange === 'low') return s < 50
        return true
      })
    }

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return (
            new Date(a.property.created_at).getTime() -
            new Date(b.property.created_at).getTime()
          )
        case 'score_desc': {
          const sa = a.analysis?.overall_score ?? -1
          const sb = b.analysis?.overall_score ?? -1
          return sb - sa
        }
        case 'price_asc':
          return a.property.price - b.property.price
        case 'price_desc':
          return b.property.price - a.property.price
        case 'newest':
        default:
          return (
            new Date(b.property.created_at).getTime() -
            new Date(a.property.created_at).getTime()
          )
      }
    })

    return result
  }, [items, search, cityFilter, scoreRange, sort])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Woningen</h1>
        <p className="mt-1 text-muted-foreground">
          {items.length} geanalyseerde woningen
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Zoek op adres of stad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <select
          value={scoreRange}
          onChange={(e) => setScoreRange(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {SCORE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city === 'all' ? 'Alle steden' : city}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          {items.length === 0 ? (
            <>
              <p className="text-lg font-medium text-muted-foreground">
                Nog geen woningen geanalyseerd
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                PropScout AI scant dagelijks nieuwe huurwoningen op Pararius en
                Funda. Zodra er geschikte deals zijn gevonden, verschijnen ze
                hier.
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">
              Geen woningen gevonden met de huidige filters.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ property, analysis }) => (
            <PropertyCard
              key={property.id}
              property={property}
              analysis={analysis}
            />
          ))}
        </div>
      )}
    </div>
  )
}
