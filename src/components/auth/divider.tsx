interface DividerProps {
  text: string
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="flex items-center gap-4" role="separator">
      <div className="h-px flex-1 bg-[#e5e5e5] dark:bg-[#333]" />
      <span className="select-none text-xs font-medium uppercase tracking-widest text-[#999] dark:text-[#666]">
        {text}
      </span>
      <div className="h-px flex-1 bg-[#e5e5e5] dark:bg-[#333]" />
    </div>
  )
}
