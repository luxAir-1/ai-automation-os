'use client'

import type { ReactNode } from 'react'

interface SocialButtonProps {
  icon: ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}

export function SocialButton({ icon, label, onClick, disabled }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="
        group flex w-full items-center gap-3 rounded-full border border-[#e5e5e5]
        bg-white px-5 py-3 text-sm font-medium text-[#1a1a1a]
        outline-none transition-all duration-200 ease-out
        hover:border-[#c5c5c5] hover:bg-[#fafafa] hover:shadow-sm
        focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/20 focus-visible:ring-offset-2
        active:scale-[0.99] active:bg-[#f0f0f0]
        disabled:pointer-events-none disabled:opacity-50
        dark:border-[#333] dark:bg-[#1a1a1a] dark:text-[#e5e5e5]
        dark:hover:border-[#444] dark:hover:bg-[#222]
        dark:focus-visible:ring-[#e5e5e5]/20
      "
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  )
}
