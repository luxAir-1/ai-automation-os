import { createClient } from '@/lib/supabase/server'
import { PropertiesClient } from './properties-client'
import type { Property, PropertyAnalysis } from '@/types/database'

export default async function PropertiesPage() {
  const supabase = await createClient()

  const { data: propertiesData, error } = await supabase
    .from('properties')
    .select('*, property_analyses(*)')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching properties:', error)
  }

  // Normalize the joined data: property_analyses comes back as an array
  const properties = (propertiesData ?? []).map((row) => {
    const { property_analyses, ...property } = row as Property & {
      property_analyses: PropertyAnalysis[]
    }
    const analysis = Array.isArray(property_analyses)
      ? property_analyses[0] ?? null
      : (property_analyses as PropertyAnalysis | null) ?? null
    return { property, analysis }
  })

  return <PropertiesClient items={properties} />
}
