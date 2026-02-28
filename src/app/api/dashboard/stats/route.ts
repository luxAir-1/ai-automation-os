import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  // Count total properties (analyzed)
  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })

  // Count high-score deals (overall_score >= 75)
  const { count: highScoreDeals } = await supabase
    .from('property_analyses')
    .select('*', { count: 'exact', head: true })
    .gte('overall_score', 75)

  // Count user's alerts
  const { count: alertsSent } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Count user's saved properties
  const { count: savedCount } = await supabase
    .from('saved_properties')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get latest properties with high scores
  const { data: topDeals } = await supabase
    .from('properties')
    .select('id, title, city, price, property_analyses(overall_score)')
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({
    properties_analyzed: totalProperties ?? 0,
    high_score_deals: highScoreDeals ?? 0,
    alerts_sent: alertsSent ?? 0,
    saved_count: savedCount ?? 0,
    top_deals: topDeals ?? [],
  })
}
