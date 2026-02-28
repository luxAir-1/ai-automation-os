import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { parsePropertyUrl } from '@/lib/analysis/scraper'
import { scoreProperty } from '@/lib/analysis/scoring'
import { generateCommentary } from '@/lib/analysis/ai-commentary'

const ALLOWED_HOSTS = ['pararius.com', 'www.pararius.com', 'pararius.nl', 'www.pararius.nl', 'funda.nl', 'www.funda.nl']

function isAllowedUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl)
    return ALLOWED_HOSTS.includes(parsed.hostname)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  // Parse request body
  let body: { url?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const url = body?.url
  if (typeof url !== 'string' || !url.trim()) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  const trimmedUrl = url.trim()
  if (!isAllowedUrl(trimmedUrl)) {
    return NextResponse.json(
      { error: 'Only Pararius (pararius.com) and Funda (funda.nl) URLs are supported at this time.' },
      { status: 422 }
    )
  }

  try {
    // Step 1: Parse property data from URL
    const propertyData = await parsePropertyUrl(trimmedUrl)

    // Step 2: Run deterministic scoring engine
    const scoring = scoreProperty({
      price: propertyData.price,
      square_meters: propertyData.square_meters,
      rooms: propertyData.rooms,
      city: propertyData.city,
      property_type: propertyData.property_type,
      year_built: propertyData.year_built,
      energy_label: propertyData.energy_label,
    })

    // Step 3: Generate AI commentary (uses OpenAI if available, fallback otherwise)
    const commentary = await generateCommentary(
      {
        title: propertyData.title,
        address: propertyData.address,
        city: propertyData.city,
        price: propertyData.price,
        square_meters: propertyData.square_meters,
        rooms: propertyData.rooms,
        property_type: propertyData.property_type,
        energy_label: propertyData.energy_label,
        year_built: propertyData.year_built,
      },
      scoring
    )

    // Step 4: Persist to database (use service client to bypass RLS)
    const serviceClient = createServiceClient()

    // Upsert property
    const { data: savedProperty } = await serviceClient
      .from('properties')
      .upsert(
        {
          external_id: propertyData.external_id,
          source: propertyData.source,
          url: trimmedUrl,
          title: propertyData.title,
          price: propertyData.price,
          square_meters: propertyData.square_meters,
          rooms: propertyData.rooms,
          property_type: propertyData.property_type as 'apartment' | 'house' | 'studio' | 'room' | 'other' | null,
          city: propertyData.city,
          address: propertyData.address,
          energy_label: propertyData.energy_label,
          year_built: propertyData.year_built,
          listing_status: 'active',
          images: [],
        },
        { onConflict: 'external_id' }
      )
      .select('id')
      .single()

    // Save analysis
    if (savedProperty?.id) {
      await serviceClient.from('property_analyses').upsert(
        {
          property_id: savedProperty.id,
          overall_score: scoring.overall_score,
          investment_score: scoring.investment_score,
          neighborhood_score: scoring.neighborhood_score,
          value_score: scoring.value_score,
          wws_score: scoring.wws_score,
          wws_max_rent: scoring.wws_max_rent,
          ai_summary: commentary.summary,
          ai_pros: commentary.pros as unknown as import('@/types/database').Json,
          ai_cons: commentary.cons as unknown as import('@/types/database').Json,
          scoring_version: '1.0.0',
          analyzed_at: new Date().toISOString(),
        },
        { onConflict: 'property_id' }
      )
    }

    // Return full result
    return NextResponse.json({
      property: {
        title: propertyData.title,
        address: propertyData.address,
        city: propertyData.city,
        price: propertyData.price,
        square_meters: propertyData.square_meters,
        rooms: propertyData.rooms,
        property_type: propertyData.property_type,
        source: propertyData.source,
        url: trimmedUrl,
      },
      analysis: {
        overall_score: scoring.overall_score,
        investment_score: scoring.investment_score,
        value_score: scoring.value_score,
        neighborhood_score: scoring.neighborhood_score,
        estimated_monthly_rent: scoring.estimated_monthly_rent,
        gross_yield_pct: scoring.gross_yield_pct,
        net_yield_pct: scoring.net_yield_pct,
        estimated_monthly_costs: scoring.estimated_monthly_costs,
        monthly_cashflow: scoring.monthly_cashflow,
        ai_summary: commentary.summary,
        ai_pros: commentary.pros,
        ai_cons: commentary.cons,
        wws_max_rent: scoring.wws_max_rent,
        rent_vs_wws_ratio: scoring.rent_vs_wws_ratio,
      },
    })
  } catch (error) {
    console.error('Analysis failed:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
