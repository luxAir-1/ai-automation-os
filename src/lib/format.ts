/**
 * PropScout AI — Formatting utilities for Dutch locale
 */

/**
 * Formats a price in cents (or euros) as EUR currency string using nl-NL locale.
 * Assumes the input is in euros (not cents) based on the database schema.
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Formats a decimal ratio as a percentage string (e.g. 0.065 → "6,5%")
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formats a date string as a relative date ("2 days ago") or formatted date.
 * Falls back to a locale date string for older dates.
 */
export function formatDate(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return 'zojuist'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minuut' : 'minuten'} geleden`
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'uur' : 'uur'} geleden`
  } else if (diffDays === 1) {
    return 'gisteren'
  } else if (diffDays < 7) {
    return `${diffDays} dagen geleden`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weken'} geleden`
  } else {
    return then.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
}

/**
 * Returns a Tailwind CSS color class based on the investment score.
 * green (>=70), yellow (50-69), red (<50), gray (null/undefined)
 */
export function getScoreColor(score: number | null | undefined): string {
  if (score == null) return 'gray'
  if (score >= 70) return 'green'
  if (score >= 50) return 'yellow'
  return 'red'
}

/**
 * Returns Tailwind CSS background + text classes for a score value.
 */
export function getScoreClasses(score: number | null | undefined): string {
  if (score == null) return 'bg-gray-100 text-gray-600'
  if (score >= 70) return 'bg-green-100 text-green-800'
  if (score >= 50) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}
