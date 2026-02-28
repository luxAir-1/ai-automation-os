import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  // Get user's investment criteria
  const { data: criteria } = await supabase
    .from('investment_criteria')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)
    .single()

  // Build property query
  let query = supabase
    .from('properties')
    .select('*, property_analyses(*)')
    .eq('listing_status', 'active')
    .order('created_at', { ascending: false })

  // Apply filters from criteria if they exist
  if (criteria) {
    const cities = criteria.cities as string[] | null
    if (cities && cities.length > 0) {
      query = query.in('city', cities)
    }
    if (criteria.min_price) {
      query = query.gte('price', criteria.min_price)
    }
    if (criteria.max_price) {
      query = query.lte('price', criteria.max_price)
    }
    if (criteria.min_rooms) {
      query = query.gte('rooms', criteria.min_rooms)
    }
    if (criteria.max_rooms) {
      query = query.lte('rooms', criteria.max_rooms)
    }
    if (criteria.min_sqm) {
      query = query.gte('square_meters', criteria.min_sqm)
    }
    if (criteria.max_sqm) {
      query = query.lte('square_meters', criteria.max_sqm)
    }
    const propertyTypes = criteria.property_types as string[] | null
    if (propertyTypes && propertyTypes.length > 0) {
      query = query.in('property_type', propertyTypes)
    }
  }

  const { data: properties, error } = await query.limit(50)

  if (error) {
    console.error('Deal matching error:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }

  // Post-filter by minimum score if criteria exist
  const minScore = criteria?.min_score ?? 0
  const filtered = (properties ?? [])
    .map((row) => {
      const { property_analyses, ...property } = row as Record<string, unknown> & {
        property_analyses: Record<string, unknown>[]
      }
      const analysis = Array.isArray(property_analyses) ? property_analyses[0] ?? null : null
      return { property, analysis }
    })
    .filter((item) => {
      if (!item.analysis) return false
      const score = (item.analysis as Record<string, unknown>).overall_score as number | null
      return score != null && score >= minScore
    })
    .sort((a, b) => {
      const scoreA = ((a.analysis as Record<string, unknown>)?.overall_score as number) ?? 0
      const scoreB = ((b.analysis as Record<string, unknown>)?.overall_score as number) ?? 0
      return scoreB - scoreA
    })

  return NextResponse.json({
    deals: filtered,
    total: filtered.length,
    criteria_applied: !!criteria,
  })
}
