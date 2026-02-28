import { cn } from '@/lib/utils'

interface DisclaimerProps {
  className?: string
}

export function Disclaimer({ className }: DisclaimerProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900',
        className
      )}
    >
      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        <strong className="font-medium text-gray-600 dark:text-gray-300">Disclaimer: </strong>
        PropScout AI provides property analysis for informational purposes only. This is not financial,
        legal, or investment advice. Yield estimates and investment scores are algorithmic outputs based
        on publicly available data and may not reflect actual returns. Always consult a qualified adviser
        before making investment decisions. PropScout AI is not regulated by the AFM.
      </p>
    </div>
  )
}
