'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SeedButtonClient() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function handleSeed() {
    setLoading(true)
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setDone(true)
        // Refresh the page to show new data
        router.refresh()
      } else {
        alert(data.error ?? 'Failed to seed')
      }
    } catch {
      alert('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <span className="rounded-full border border-green-500/30 bg-green-900/20 px-4 py-2 text-xs font-semibold text-green-400">
        Seeded!
      </span>
    )
  }

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="rounded-full border border-amber/30 bg-surface-2 px-4 py-2 text-xs font-semibold text-amber transition-colors hover:bg-surface-3 disabled:opacity-50"
    >
      {loading ? 'Seeding…' : 'Load Demo Data'}
    </button>
  )
}
