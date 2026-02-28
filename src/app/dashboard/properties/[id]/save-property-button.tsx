'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface SavePropertyButtonProps {
  propertyId: string
  userId: string
  initialSaved: boolean
}

export function SavePropertyButton({
  propertyId,
  userId,
  initialSaved,
}: SavePropertyButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleToggle() {
    setLoading(true)
    const supabase = createClient()

    if (saved) {
      await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId)
      setSaved(false)
    } else {
      await supabase.from('saved_properties').insert({
        user_id: userId,
        property_id: propertyId,
      })
      setSaved(true)
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <Button
      variant={saved ? 'secondary' : 'default'}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? 'Bezig...' : saved ? 'Opgeslagen' : 'Opslaan'}
    </Button>
  )
}
