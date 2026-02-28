'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { InvestmentCriteria } from '@/types/database'

interface AlertPreferencesFormProps {
  userId: string
  criteria: InvestmentCriteria | null
}

export function AlertPreferencesForm({ userId, criteria }: AlertPreferencesFormProps) {
  const supabase = createClient()

  const [emailEnabled, setEmailEnabled] = useState(criteria?.is_active ?? false)
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [minAlertScore, setMinAlertScore] = useState(criteria?.min_score?.toString() ?? '60')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const payload = {
      user_id: userId,
      name: criteria?.name ?? 'My Criteria',
      cities: criteria?.cities ?? [],
      min_price: criteria?.min_price ?? null,
      max_price: criteria?.max_price ?? null,
      property_types: criteria?.property_types ?? [],
      min_score: minAlertScore ? Number(minAlertScore) : null,
      is_active: emailEnabled,
      updated_at: new Date().toISOString(),
    }

    let error

    if (criteria?.id) {
      const result = await supabase
        .from('investment_criteria')
        .update(payload)
        .eq('id', criteria.id)
        .eq('user_id', userId)
      error = result.error
    } else {
      const result = await supabase
        .from('investment_criteria')
        .insert({ ...payload, created_at: new Date().toISOString() })
      error = result.error
    }

    setSaving(false)

    if (error) {
      setMessage({ type: 'error', text: 'Could not save alert preferences. Please try again.' })
    } else {
      setMessage({ type: 'success', text: 'Alert preferences saved.' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Preferences</CardTitle>
        <CardDescription>
          Choose when and how you receive property match notifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email alerts toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium text-sm">Email Alerts</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Receive matching property deals in your inbox.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailEnabled}
              onClick={() => setEmailEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                emailEnabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  emailEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Alert frequency */}
          <div className="space-y-2">
            <Label>Alert Frequency</Label>
            <div className="flex gap-3">
              {(['daily', 'weekly'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFrequency(option)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    frequency === option
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-input hover:bg-accent'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum score to alert */}
          <div className="space-y-2">
            <Label htmlFor="minAlertScore">Minimum Score to Alert (0–100)</Label>
            <Input
              id="minAlertScore"
              type="number"
              min={0}
              max={100}
              placeholder="60"
              value={minAlertScore}
              onChange={(e) => setMinAlertScore(e.target.value)}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              Only send alerts for properties with an AI score above this threshold.
            </p>
          </div>

          {/* Feedback */}
          {message && (
            <div
              className={`rounded-md px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
