'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PropertyCard } from '@/components/properties/property-card'
import { createClient } from '@/lib/supabase/client'
import type { Property, PropertyAnalysis } from '@/types/database'

interface SavedItem {
  savedId: string
  property: Property
  analysis: PropertyAnalysis | null
}

interface SavedPropertiesClientProps {
  items: SavedItem[]
  userId: string
}

export function SavedPropertiesClient({
  items: initialItems,
  userId,
}: SavedPropertiesClientProps) {
  const [items, setItems] = useState(initialItems)
  const [removing, setRemoving] = useState<string | null>(null)
  const router = useRouter()

  const handleRemove = useCallback(
    async (propertyId: string) => {
      const item = items.find((i) => i.property.id === propertyId)
      if (!item) return

      setRemoving(propertyId)
      const supabase = createClient()

      await supabase
        .from('saved_properties')
        .delete()
        .eq('id', item.savedId)
        .eq('user_id', userId)

      setItems((prev) => prev.filter((i) => i.property.id !== propertyId))
      setRemoving(null)
      router.refresh()
    },
    [items, userId, router]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Opgeslagen woningen</h1>
        <p className="mt-1 text-muted-foreground">
          {items.length} {items.length === 1 ? 'woning' : 'woningen'} opgeslagen
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Nog geen opgeslagen woningen
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Blader door woningen en sla je favorieten op om ze hier terug te
            vinden.
          </p>
          <a
            href="/dashboard/properties"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Bekijk alle woningen
          </a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ property, analysis, savedId }) => (
            <div
              key={savedId}
              className={removing === property.id ? 'opacity-50 pointer-events-none' : ''}
            >
              <PropertyCard
                property={property}
                analysis={analysis}
                showRemoveButton
                onRemove={handleRemove}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
