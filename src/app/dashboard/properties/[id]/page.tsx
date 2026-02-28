import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScoreBadge } from '@/components/properties/score-badge'
import { formatPrice, formatPercent, formatDate } from '@/lib/format'
import { SavePropertyButton } from './save-property-button'
import type { Property, PropertyAnalysis } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Appartement',
  house: 'Woning',
  studio: 'Studio',
  room: 'Kamer',
  other: 'Overig',
}

const INTERIOR_LABELS: Record<string, string> = {
  furnished: 'Gemeubileerd',
  unfurnished: 'Kaal',
  shell: 'Casco',
  upholstered: 'Gestoffeerd',
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: row, error } = await supabase
    .from('properties')
    .select('*, property_analyses(*)')
    .eq('id', id)
    .single()

  if (error || !row) {
    notFound()
  }

  const { property_analyses, ...property } = row as Property & {
    property_analyses: PropertyAnalysis[]
  }
  const analysis: PropertyAnalysis | null = Array.isArray(property_analyses)
    ? property_analyses[0] ?? null
    : (property_analyses as PropertyAnalysis | null) ?? null

  // Check if already saved
  let isSaved = false
  if (user) {
    const { data: saved } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', id)
      .maybeSingle()
    isSaved = !!saved
  }

  // Cost breakdown calculations
  const purchasePrice = property.price
  const transferTax = purchasePrice * 0.104
  const notaryCost = 1500 // typical estimate
  const valuationCost = 500 // typical estimate
  const totalAcquisitionCost = purchasePrice + transferTax + notaryCost + valuationCost

  // Yields
  const estimatedMonthlyRent = analysis?.wws_max_rent ?? null
  const grossYield =
    estimatedMonthlyRent && purchasePrice > 0
      ? (estimatedMonthlyRent * 12) / purchasePrice
      : null
  // Net yield: subtract approx 25% for costs/vacancy
  const netYield = grossYield ? grossYield * 0.75 : null
  const monthlyCashFlow = estimatedMonthlyRent
    ? estimatedMonthlyRent - purchasePrice * 0.004 // rough mortgage estimate
    : null

  const aiPros = Array.isArray(analysis?.ai_pros)
    ? (analysis.ai_pros as string[])
    : []
  const aiCons = Array.isArray(analysis?.ai_cons)
    ? (analysis.ai_cons as string[])
    : []

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/properties">← Terug naar overzicht</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {property.address ?? property.title}
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">{property.city}</p>
          <p className="mt-2 text-3xl font-bold">{formatPrice(purchasePrice)}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
            {property.property_type && (
              <span>{PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type}</span>
            )}
            {property.square_meters && <span>{property.square_meters} m²</span>}
            {property.rooms && <span>{property.rooms} kamers</span>}
            {property.interior && (
              <span>{INTERIOR_LABELS[property.interior] ?? property.interior}</span>
            )}
            {property.energy_label && (
              <span className="font-medium">Energielabel {property.energy_label}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Geplaatst {formatDate(property.first_seen_at)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <ScoreBadge score={analysis?.overall_score ?? null} size="lg" />
          {analysis?.overall_score != null && (
            <p className="text-xs text-muted-foreground">Investeringsscore</p>
          )}
          {user && (
            <SavePropertyButton
              propertyId={id}
              userId={user.id}
              initialSaved={isSaved}
            />
          )}
        </div>
      </div>

      {/* Key Metrics */}
      {(grossYield || netYield || monthlyCashFlow || analysis?.wws_score) && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {netYield != null && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Netto rendement</p>
                <p className="mt-1 text-2xl font-bold text-green-700">
                  {formatPercent(netYield)}
                </p>
              </CardContent>
            </Card>
          )}
          {grossYield != null && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Bruto rendement</p>
                <p className="mt-1 text-2xl font-bold">
                  {formatPercent(grossYield)}
                </p>
              </CardContent>
            </Card>
          )}
          {monthlyCashFlow != null && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                  Maandelijkse cashflow
                </p>
                <p
                  className={`mt-1 text-2xl font-bold ${monthlyCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}
                >
                  {formatPrice(monthlyCashFlow)}
                </p>
              </CardContent>
            </Card>
          )}
          {analysis?.wws_score != null && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">WWS punten</p>
                <p className="mt-1 text-2xl font-bold">{analysis.wws_score}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kosten overzicht</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aankoopprijs</span>
              <span className="font-medium">{formatPrice(purchasePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Overdrachtsbelasting (10,4%)
              </span>
              <span className="font-medium">{formatPrice(transferTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Notariskosten (schatting)</span>
              <span className="font-medium">{formatPrice(notaryCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxatiekosten (schatting)</span>
              <span className="font-medium">{formatPrice(valuationCost)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Totale verwervingskosten</span>
                <span>{formatPrice(totalAcquisitionCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparable Rentals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Huurindicatie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {estimatedMonthlyRent ? (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Geschatte maandhuur (WWS max)
                  </span>
                  <span className="font-medium">
                    {formatPrice(estimatedMonthlyRent)}/mnd
                  </span>
                </div>
                {analysis?.wws_max_rent && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WWS maximale huur</span>
                    <span className="font-medium">
                      {formatPrice(analysis.wws_max_rent)}
                    </span>
                  </div>
                )}
                {analysis?.rent_vs_wws_ratio != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Huur vs. WWS ratio
                    </span>
                    <span className="font-medium">
                      {formatPercent(analysis.rent_vs_wws_ratio)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                Geen huurindicatie beschikbaar
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Commentary */}
      {(analysis?.ai_summary || aiPros.length > 0 || aiCons.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Analyse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis?.ai_summary && (
              <p className="text-sm leading-relaxed">{analysis.ai_summary}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {aiPros.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-green-700">
                    Voordelen
                  </p>
                  <ul className="space-y-1">
                    {aiPros.map((pro, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-green-600 shrink-0">+</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiCons.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-red-700">
                    Nadelen
                  </p>
                  <ul className="space-y-1">
                    {aiCons.map((con, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-red-600 shrink-0">−</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risico beoordeling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reguleringsrisico</span>
            <span className="font-medium">
              {analysis?.wws_score != null
                ? analysis.wws_score > 143
                  ? 'Laag — vrije sector'
                  : 'Hoog — gereguleerde sector'
                : 'Onbekend'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Opkoopbescherming</span>
            <span className="font-medium">
              {property.price < 510000
                ? 'Mogelijk van toepassing'
                : 'Niet van toepassing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bron listing</span>
            <span className="font-medium capitalize">{property.source}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium capitalize">
              {property.listing_status === 'active'
                ? 'Actief'
                : property.listing_status === 'rented'
                  ? 'Verhuurd'
                  : 'Ingetrokken'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Score breakdown */}
      {(analysis?.investment_score != null ||
        analysis?.neighborhood_score != null ||
        analysis?.value_score != null) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3 text-sm">
            {analysis?.investment_score != null && (
              <div>
                <p className="text-muted-foreground">Investering</p>
                <p className="text-xl font-bold">{analysis.investment_score}</p>
              </div>
            )}
            {analysis?.neighborhood_score != null && (
              <div>
                <p className="text-muted-foreground">Buurt</p>
                <p className="text-xl font-bold">{analysis.neighborhood_score}</p>
              </div>
            )}
            {analysis?.value_score != null && (
              <div>
                <p className="text-muted-foreground">Waarde</p>
                <p className="text-xl font-bold">{analysis.value_score}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* External link */}
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <a href={property.url} target="_blank" rel="noopener noreferrer">
            Bekijk originele listing
          </a>
        </Button>
      </div>
    </div>
  )
}
