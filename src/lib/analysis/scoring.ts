/**
 * PropScout AI — Deterministic Property Scoring Engine
 *
 * Calculates investment scores for Dutch rental properties.
 * Based on the WWS (Woningwaarderingsstelsel) points system
 * and financial analysis metrics.
 */

interface PropertyData {
  price: number
  square_meters: number | null
  rooms: number | null
  city: string
  property_type: string | null
  year_built: number | null
  energy_label: string | null
  estimated_rent?: number
}

interface ScoringResult {
  overall_score: number
  investment_score: number
  value_score: number
  neighborhood_score: number
  wws_score: number
  wws_max_rent: number
  estimated_monthly_rent: number
  gross_yield_pct: number
  net_yield_pct: number
  estimated_monthly_costs: {
    mortgage: number
    vve: number
    maintenance: number
    insurance: number
    management: number
    total: number
  }
  monthly_cashflow: number
  rent_vs_wws_ratio: number
}

// Average price per sqm by Dutch city (2024-2025 data, approximate)
const CITY_AVG_PRICE_PER_SQM: Record<string, number> = {
  amsterdam: 7200,
  rotterdam: 4100,
  'den haag': 4300,
  'the hague': 4300,
  utrecht: 5500,
  eindhoven: 4000,
  groningen: 3500,
  tilburg: 3400,
  almere: 3800,
  breda: 3600,
  nijmegen: 3700,
  arnhem: 3200,
  haarlem: 5800,
  enschede: 2800,
  apeldoorn: 3100,
  amersfoort: 4500,
  leiden: 5200,
  delft: 4800,
  zaandam: 4200,
  default: 4000,
}

// Average monthly rent per sqm by city
const CITY_AVG_RENT_PER_SQM: Record<string, number> = {
  amsterdam: 28,
  rotterdam: 18,
  'den haag': 19,
  'the hague': 19,
  utrecht: 22,
  eindhoven: 17,
  groningen: 16,
  tilburg: 15,
  almere: 16,
  breda: 16,
  nijmegen: 17,
  arnhem: 15,
  haarlem: 24,
  leiden: 21,
  delft: 20,
  default: 17,
}

// WWS points by energy label
const ENERGY_LABEL_POINTS: Record<string, number> = {
  'A++++': 52, 'A+++': 48, 'A++': 44, 'A+': 40, 'A': 36,
  'B': 28, 'C': 18, 'D': 10, 'E': 4, 'F': 0, 'G': -5,
}

function getCityKey(city: string): string {
  return city.toLowerCase().trim()
}

/**
 * Calculate WWS (Woningwaarderingsstelsel) points.
 * Simplified version of the official 2024 point system.
 */
function calculateWWSScore(data: PropertyData): { points: number; maxRent: number } {
  let points = 0

  // Surface area: 1 point per sqm
  const sqm = data.square_meters ?? 50
  points += sqm

  // Rooms: 5 points per separate room (estimate)
  const rooms = data.rooms ?? 2
  points += rooms * 5

  // Energy label
  const label = (data.energy_label ?? 'C').toUpperCase()
  points += ENERGY_LABEL_POINTS[label] ?? 10

  // Year built bonus (newer = more points)
  const year = data.year_built ?? 1970
  if (year >= 2015) points += 12
  else if (year >= 2000) points += 8
  else if (year >= 1980) points += 4

  // Kitchen & bathroom (estimated, add 20-30 points)
  points += 25

  // WOZ value component (simplified: use price as proxy)
  // 1 point per €10,000 of value, capped at 20
  const wozPoints = Math.min(Math.floor(data.price / 10000), 20)
  points += wozPoints

  // Max rent calculation based on WWS points
  // As of 2024: liberalization threshold is 148 points = €879.66
  // Above threshold: free market
  // Below: max rent = points * ~€5.45 (approximate)
  const maxRent = points >= 148
    ? 99999 // Free market — no cap
    : Math.round(points * 5.45)

  return { points, maxRent }
}

/**
 * Estimate monthly rent based on property data and city averages.
 */
function estimateRent(data: PropertyData): number {
  if (data.estimated_rent && data.estimated_rent > 0) return data.estimated_rent
  const sqm = data.square_meters ?? 50
  const cityKey = getCityKey(data.city)
  const rentPerSqm = CITY_AVG_RENT_PER_SQM[cityKey] ?? CITY_AVG_RENT_PER_SQM.default
  return Math.round(sqm * rentPerSqm)
}

/**
 * Calculate monthly costs for an investment property.
 */
function calculateMonthlyCosts(price: number, sqm: number) {
  const ltv = 0.70 // 70% loan-to-value
  const interestRate = 0.045 // 4.5% interest
  const mortgage = Math.round((price * ltv * interestRate) / 12)
  const vve = Math.round(sqm * 2.5) // ~€2.50/sqm/month average
  const maintenance = Math.round((price * 0.004) / 12) // 0.4% of value annually
  const insurance = 40
  const management = 0 // self-managed by default

  return {
    mortgage,
    vve,
    maintenance,
    insurance,
    management,
    total: mortgage + vve + maintenance + insurance + management,
  }
}

/**
 * Calculate investment score (0-100) based on yield and cashflow.
 */
function calculateInvestmentScore(grossYield: number, netYield: number, monthlyCashflow: number): number {
  let score = 0

  // Gross yield scoring (max 40 points)
  if (grossYield >= 8) score += 40
  else if (grossYield >= 6) score += 30 + (grossYield - 6) * 5
  else if (grossYield >= 4) score += 15 + (grossYield - 4) * 7.5
  else score += Math.max(0, grossYield * 3.75)

  // Net yield scoring (max 35 points)
  if (netYield >= 5) score += 35
  else if (netYield >= 3) score += 17.5 + (netYield - 3) * 8.75
  else score += Math.max(0, netYield * 5.83)

  // Cashflow scoring (max 25 points)
  if (monthlyCashflow >= 500) score += 25
  else if (monthlyCashflow >= 200) score += 12.5 + ((monthlyCashflow - 200) / 300) * 12.5
  else if (monthlyCashflow > 0) score += (monthlyCashflow / 200) * 12.5
  else score += 0

  return Math.round(Math.min(100, Math.max(0, score)))
}

/**
 * Calculate value score (0-100) — is the price good for the area?
 */
function calculateValueScore(data: PropertyData): number {
  const sqm = data.square_meters ?? 50
  const pricePerSqm = data.price / sqm
  const cityKey = getCityKey(data.city)
  const avgPrice = CITY_AVG_PRICE_PER_SQM[cityKey] ?? CITY_AVG_PRICE_PER_SQM.default

  // ratio < 1 means cheaper than average (good)
  const ratio = pricePerSqm / avgPrice

  if (ratio <= 0.7) return 95  // 30%+ below average — great deal
  if (ratio <= 0.85) return 80
  if (ratio <= 0.95) return 65
  if (ratio <= 1.05) return 50  // roughly average
  if (ratio <= 1.15) return 35
  if (ratio <= 1.3) return 20
  return 10 // significantly overpriced
}

/**
 * Simple neighborhood score based on city tier.
 */
function calculateNeighborhoodScore(city: string): number {
  const tier1 = ['amsterdam', 'utrecht', 'haarlem', 'leiden']
  const tier2 = ['rotterdam', 'den haag', 'the hague', 'eindhoven', 'delft', 'amersfoort']
  const tier3 = ['groningen', 'tilburg', 'breda', 'nijmegen', 'arnhem', 'almere']

  const key = getCityKey(city)
  if (tier1.includes(key)) return 85
  if (tier2.includes(key)) return 70
  if (tier3.includes(key)) return 55
  return 45
}

/**
 * Main scoring function — returns full analysis.
 */
export function scoreProperty(data: PropertyData): ScoringResult {
  const sqm = data.square_meters ?? 50
  const estimatedRent = estimateRent(data)
  const costs = calculateMonthlyCosts(data.price, sqm)

  const grossYield = ((estimatedRent * 12) / data.price) * 100
  const netYield = (((estimatedRent - costs.total) * 12) / data.price) * 100
  const monthlyCashflow = estimatedRent - costs.total

  const investmentScore = calculateInvestmentScore(grossYield, netYield, monthlyCashflow)
  const valueScore = calculateValueScore(data)
  const neighborhoodScore = calculateNeighborhoodScore(data.city)
  const { points: wwsScore, maxRent: wwsMaxRent } = calculateWWSScore(data)

  // Overall score: weighted average
  const overallScore = Math.round(
    investmentScore * 0.45 + valueScore * 0.30 + neighborhoodScore * 0.25
  )

  return {
    overall_score: overallScore,
    investment_score: investmentScore,
    value_score: valueScore,
    neighborhood_score: neighborhoodScore,
    wws_score: wwsScore,
    wws_max_rent: wwsMaxRent === 99999 ? 0 : wwsMaxRent, // 0 = free market
    estimated_monthly_rent: estimatedRent,
    gross_yield_pct: Math.round(grossYield * 100) / 100,
    net_yield_pct: Math.round(netYield * 100) / 100,
    estimated_monthly_costs: costs,
    monthly_cashflow: monthlyCashflow,
    rent_vs_wws_ratio: wwsMaxRent > 0 && wwsMaxRent < 99999
      ? Math.round((estimatedRent / wwsMaxRent) * 100) / 100
      : 0,
  }
}

export type { PropertyData, ScoringResult }
