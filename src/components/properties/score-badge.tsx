'use client'

import { cn } from '@/lib/utils'
import { getScoreClasses } from '@/lib/format'

interface ScoreBadgeProps {
  score: number | null | undefined
  size?: 'sm' | 'lg'
}

export function ScoreBadge({ score, size = 'sm' }: ScoreBadgeProps) {
  const colorClasses = getScoreClasses(score)

  const sizeClasses =
    size === 'lg'
      ? 'h-16 w-16 text-xl font-bold'
      : 'h-10 w-10 text-sm font-semibold'

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full',
        colorClasses,
        sizeClasses
      )}
      title={score != null ? `Score: ${score}/100` : 'Not yet analyzed'}
    >
      {score != null ? score : '–'}
    </div>
  )
}
