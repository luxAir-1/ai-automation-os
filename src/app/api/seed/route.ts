import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { SEED_PROPERTIES } from '@/lib/seed-data'

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Seed endpoint is only available in development' }, { status: 403 })
  }

  const supabase = createServiceClient()
  let inserted = 0
  let errors = 0

  for (const { property, analysis } of SEED_PROPERTIES) {
    // Upsert property
    const { data: savedProperty, error: propError } = await supabase
      .from('properties')
      .upsert(
        {
          external_id: property.external_id,
          source: property.source,
          url: property.url,
          title: property.title,
          price: property.price,
          square_meters: property.square_meters,
          rooms: property.rooms,
          property_type: property.property_type,
          city: property.city,
          neighborhood: property.neighborhood,
          postal_code: property.postal_code,
          address: property.address,
          year_built: property.year_built,
          energy_label: property.energy_label,
          interior: property.interior,
          listing_status: property.listing_status,
          images: property.images,
        },
        { onConflict: 'external_id' }
      )
      .select('id')
      .single()

    if (propError || !savedProperty) {
      console.error(`Failed to insert property ${property.external_id}:`, propError)
      errors++
      continue
    }

    // Upsert analysis
    const { error: analysisError } = await supabase
      .from('property_analyses')
      .upsert(
        {
          property_id: savedProperty.id,
          overall_score: analysis.overall_score,
          investment_score: analysis.investment_score,
          value_score: analysis.value_score,
          neighborhood_score: analysis.neighborhood_score,
          wws_score: analysis.wws_score,
          wws_max_rent: analysis.wws_max_rent,
          ai_summary: analysis.ai_summary,
          ai_pros: analysis.ai_pros,
          ai_cons: analysis.ai_cons,
          scoring_version: '1.0.0',
          analyzed_at: new Date().toISOString(),
        },
        { onConflict: 'property_id' }
      )

    if (analysisError) {
      console.error(`Failed to insert analysis for ${property.external_id}:`, analysisError)
      errors++
    } else {
      inserted++
    }
  }

  return NextResponse.json({
    message: `Seeded ${inserted} properties with analyses. ${errors} errors.`,
    inserted,
    errors,
    total: SEED_PROPERTIES.length,
  })
}
