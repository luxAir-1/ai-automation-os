/**
 * PropScout AI — AI Commentary Generator
 *
 * Uses OpenAI to generate investment analysis commentary
 * for Dutch rental properties.
 */

import { getOpenAI } from '@/lib/openai'
import type { ScoringResult } from './scoring'

interface PropertyInfo {
  title: string
  address: string | null
  city: string
  price: number
  square_meters: number | null
  rooms: number | null
  property_type: string | null
  energy_label: string | null
  year_built: number | null
}

interface AICommentary {
  summary: string
  pros: string[]
  cons: string[]
}

const SYSTEM_PROMPT = `You are PropScout AI, a Dutch real estate investment analyst. You analyze rental properties in the Netherlands and provide clear, actionable investment insights.

Rules:
- Write in English (the analysis dashboard is in English)
- Focus on investment-relevant factors: yield, cashflow, WWS regulation, location demand, risks
- Be specific with numbers and comparisons
- Mention Dutch-specific factors: overdrachtsbelasting (transfer tax), WWS points, energy labels, VvE
- Keep the summary to 2-3 sentences
- List exactly 4 pros and 4 cons
- Be honest about both upsides and risks`

export async function generateCommentary(
  property: PropertyInfo,
  scoring: ScoringResult
): Promise<AICommentary> {
  // If OpenAI key is not configured, return a good default
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackCommentary(property, scoring)
  }

  try {
    const openai = getOpenAI()

    const userPrompt = `Analyze this Dutch rental investment property:

Property: ${property.title}
Location: ${property.address ?? 'Unknown'}, ${property.city}
Price: \u20AC${property.price.toLocaleString()}
Size: ${property.square_meters ?? 'Unknown'} m\u00B2
Rooms: ${property.rooms ?? 'Unknown'}
Type: ${property.property_type ?? 'Unknown'}
Energy Label: ${property.energy_label ?? 'Unknown'}
Year Built: ${property.year_built ?? 'Unknown'}

Scoring Results:
- Overall Score: ${scoring.overall_score}/100
- Investment Score: ${scoring.investment_score}/100
- Value Score: ${scoring.value_score}/100
- Estimated Monthly Rent: \u20AC${scoring.estimated_monthly_rent}
- Gross Yield: ${scoring.gross_yield_pct}%
- Net Yield: ${scoring.net_yield_pct}%
- Monthly Cashflow: \u20AC${scoring.monthly_cashflow}
- WWS Points: ${scoring.wws_score} (${scoring.wws_max_rent === 0 ? 'Free market \u2014 liberalized' : `Regulated, max rent \u20AC${scoring.wws_max_rent}`})
- Monthly Costs: Mortgage \u20AC${scoring.estimated_monthly_costs.mortgage}, VvE \u20AC${scoring.estimated_monthly_costs.vve}, Maintenance \u20AC${scoring.estimated_monthly_costs.maintenance}

Respond in JSON format:
{
  "summary": "2-3 sentence investment summary",
  "pros": ["pro 1", "pro 2", "pro 3", "pro 4"],
  "cons": ["con 1", "con 2", "con 3", "con 4"]
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 600,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return generateFallbackCommentary(property, scoring)
    }

    const parsed = JSON.parse(content) as AICommentary
    return {
      summary: parsed.summary || 'Analysis complete.',
      pros: Array.isArray(parsed.pros) ? parsed.pros.slice(0, 4) : [],
      cons: Array.isArray(parsed.cons) ? parsed.cons.slice(0, 4) : [],
    }
  } catch (error) {
    console.error('OpenAI commentary generation failed:', error)
    return generateFallbackCommentary(property, scoring)
  }
}

/**
 * Fallback commentary when OpenAI is not available.
 * Generates reasonable defaults based on scoring data.
 */
function generateFallbackCommentary(
  property: PropertyInfo,
  scoring: ScoringResult
): AICommentary {
  const sqm = property.square_meters ?? 50
  const pricePerSqm = Math.round(property.price / sqm)
  const yieldQuality = scoring.gross_yield_pct >= 5 ? 'solid' : scoring.gross_yield_pct >= 4 ? 'moderate' : 'low'
  const marketSegment = scoring.wws_max_rent === 0 ? 'free-market rental segment (not subject to rent regulation)' : `regulated segment with a WWS max rent of \u20AC${scoring.wws_max_rent}`

  const summary = `This ${sqm} m\u00B2 ${property.property_type ?? 'property'} in ${property.city} offers a ${yieldQuality} gross yield of ${scoring.gross_yield_pct}% at \u20AC${pricePerSqm}/m\u00B2. The property falls under the ${marketSegment}. Monthly cashflow of \u20AC${scoring.monthly_cashflow} provides ${scoring.monthly_cashflow >= 300 ? 'a reasonable buffer' : 'limited margin'} for vacancies and unexpected expenses.`

  const pros: string[] = []
  const cons: string[] = []

  // Generate pros
  if (scoring.gross_yield_pct >= 5) pros.push(`Gross yield of ${scoring.gross_yield_pct}% exceeds the Dutch urban average of ~4.5%`)
  else pros.push(`Gross yield of ${scoring.gross_yield_pct}% is ${scoring.gross_yield_pct >= 4 ? 'near' : 'below'} the Dutch urban average`)

  if (scoring.wws_max_rent === 0) pros.push('Free-market segment \u2014 no rent regulation cap applies')
  else pros.push(`WWS score of ${scoring.wws_score} points places this in the regulated segment`)

  if (scoring.value_score >= 65) pros.push(`Price of \u20AC${pricePerSqm}/m\u00B2 is below the ${property.city} average \u2014 potential value opportunity`)
  else pros.push(`Located in ${property.city} which has strong tenant demand and rental market depth`)

  if (property.energy_label && ['A', 'A+', 'A++', 'B'].includes(property.energy_label.toUpperCase())) {
    pros.push(`Energy label ${property.energy_label} reduces tenant utility costs and improves long-term value`)
  } else {
    pros.push(`${property.rooms ?? 2}-room layout appeals to the largest tenant demographic in Dutch cities`)
  }

  // Generate cons
  if (scoring.monthly_cashflow < 300) cons.push(`Monthly cashflow of \u20AC${scoring.monthly_cashflow} provides limited buffer for vacancy or repairs`)
  else cons.push(`Dutch transfer tax (overdrachtsbelasting) of ${property.price > 440000 ? '10.4%' : '2%'} adds to entry costs`)

  cons.push(`VvE contribution of \u20AC${scoring.estimated_monthly_costs.vve}/month should be verified \u2014 check reserve fund and maintenance plan`)

  if (scoring.estimated_monthly_costs.mortgage > scoring.estimated_monthly_rent * 0.5) {
    cons.push('Mortgage interest represents a large share of rental income \u2014 sensitive to rate increases')
  } else {
    cons.push('Rising interest rates could compress yields on variable-rate refinancing')
  }

  if (scoring.value_score < 50) cons.push(`Price of \u20AC${pricePerSqm}/m\u00B2 is above the ${property.city} average \u2014 limited upside potential`)
  else cons.push('Maintenance costs should be independently verified before purchase')

  return { summary, pros: pros.slice(0, 4), cons: cons.slice(0, 4) }
}
