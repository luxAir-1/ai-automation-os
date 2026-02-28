import { createClient } from '@/lib/supabase/server'
import { SavedPropertiesClient } from './saved-properties-client'
import type { Property, PropertyAnalysis, SavedProperty } from '@/types/database'

interface SavedWithProperty extends SavedProperty {
  properties: (Property & { property_analyses: PropertyAnalysis[] }) | null
}

export default async function SavedPropertiesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: savedData, error } = await supabase
    .from('saved_properties')
    .select('*, properties(*, property_analyses(*))')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved properties:', error)
  }

  const items = ((savedData ?? []) as SavedWithProperty[])
    .filter((row) => row.properties != null)
    .map((row) => {
      const { property_analyses, ...property } = row.properties!
      const analysis: PropertyAnalysis | null = Array.isArray(property_analyses)
        ? property_analyses[0] ?? null
        : (property_analyses as PropertyAnalysis | null) ?? null
      return {
        savedId: row.id,
        property: property as Property,
        analysis,
      }
    })

  return <SavedPropertiesClient items={items} userId={user!.id} />
}
