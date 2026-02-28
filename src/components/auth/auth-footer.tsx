import Link from 'next/link'

interface AuthFooterProps {
  termsLabel: string
  privacyLabel: string
}

export function AuthFooter({ termsLabel, privacyLabel }: AuthFooterProps) {
  return (
    <footer className="mt-8 text-center" role="contentinfo">
      <nav aria-label="Legal links" className="inline-flex items-center gap-1 text-xs text-[#999] dark:text-[#666]">
        <Link
          href="/terms"
          className="transition-colors duration-200 hover:text-[#1a1a1a] focus-visible:underline dark:hover:text-[#e5e5e5]"
        >
          {termsLabel}
        </Link>
        <span aria-hidden="true" className="mx-1">|</span>
        <Link
          href="/privacy"
          className="transition-colors duration-200 hover:text-[#1a1a1a] focus-visible:underline dark:hover:text-[#e5e5e5]"
        >
          {privacyLabel}
        </Link>
      </nav>
    </footer>
  )
}
