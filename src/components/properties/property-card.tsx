'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ScoreBadge } from '@/components/properties/score-badge'
import { formatPrice, formatPercent, formatDate, getScoreClasses } from '@/lib/format'
import type { Property, PropertyAnalysis } from '@/types/database'

interface PropertyCardProps {
  property: Property
  analysis?: PropertyAnalysis | null
  showRemoveButton?: boolean
  onRemove?: (propertyId: string) => void
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Appartement',
  house: 'Woning',
  studio: 'Studio',
  room: 'Kamer',
  other: 'Overig',
}

export function PropertyCard({
  property,
  analysis,
  showRemoveButton = false,
  onRemove,
}: PropertyCardProps) {
  const score = analysis?.overall_score ?? null
  const thumbnailColor = getScoreClasses(score)

  // Net yield: wws_max_rent / price * 12 if available, else null
  const netYield =
    analysis?.wws_max_rent && property.price > 0
      ? (analysis.wws_max_rent * 12) / property.price
      : null

  const propertyTypeLabel =
    property.property_type ? PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type : null

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/dashboard/properties/${property.id}`} className="block">
        {/* Thumbnail placeholder colored by score */}
        <div
          className={`h-32 w-full flex items-center justify-center ${thumbnailColor} opacity-70`}
        >
          <span className="text-4xl font-light text-current opacity-50">
            {property.city.charAt(0).toUpperCase()}
          </span>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/dashboard/properties/${property.id}`}
              className="hover:underline"
            >
              <p className="truncate font-semibold text-sm leading-tight">
                {property.address ?? property.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{property.city}</p>
            </Link>
          </div>
          <ScoreBadge score={score} size="sm" />
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-lg font-bold">{formatPrice(property.price)}</p>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {netYield != null && (
              <span className="font-medium text-green-700">
                {formatPercent(netYield)} rendement
              </span>
            )}
            {propertyTypeLabel && <span>{propertyTypeLabel}</span>}
            {property.square_meters && <span>{property.square_meters} m²</span>}
          </div>

          <p className="text-xs text-muted-foreground">
            {formatDate(property.created_at)}
          </p>
        </div>

        {showRemoveButton && onRemove && (
          <div className="mt-3">
            <button
              onClick={(e) => {
                e.preventDefault()
                onRemove(property.id)
              }}
              className="text-xs text-destructive hover:underline"
            >
              Verwijder uit opgeslagen
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
