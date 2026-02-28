'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { InvestmentCriteria } from '@/types/database'

type PropertyType = 'apartment' | 'house' | 'studio'

interface CriteriaFormProps {
  userId: string
  existingCriteria: InvestmentCriteria | null
}

export function CriteriaForm({ userId, existingCriteria }: CriteriaFormProps) {
  const supabase = createClient()

  const existingCities = Array.isArray(existingCriteria?.cities)
    ? (existingCriteria.cities as string[]).join(', ')
    : ''
  const existingPropertyTypes = Array.isArray(existingCriteria?.property_types)
    ? (existingCriteria.property_types as string[])
    : []

  const [cities, setCities] = useState(existingCities)
  const [minBudget, setMinBudget] = useState(existingCriteria?.min_price?.toString() ?? '')
  const [maxBudget, setMaxBudget] = useState(existingCriteria?.max_price?.toString() ?? '')
  const [minYield, setMinYield] = useState('')
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(
    existingPropertyTypes.filter((t): t is PropertyType =>
      ['apartment', 'house', 'studio'].includes(t)
    )
  )
  const [minScore, setMinScore] = useState(existingCriteria?.min_score?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function togglePropertyType(type: PropertyType) {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const cityList = cities
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    const payload = {
      user_id: userId,
      name: existingCriteria?.name ?? 'My Criteria',
      cities: cityList,
      min_price: minBudget ? Number(minBudget) : null,
      max_price: maxBudget ? Number(maxBudget) : null,
      property_types: propertyTypes,
      min_score: minScore ? Number(minScore) : null,
      is_active: true,
      updated_at: new Date().toISOString(),
    }

    let error

    if (existingCriteria?.id) {
      const result = await supabase
        .from('investment_criteria')
        .update(payload)
        .eq('id', existingCriteria.id)
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
      setMessage({ type: 'error', text: 'Could not save criteria. Please try again.' })
    } else {
      setMessage({ type: 'success', text: 'Investment criteria saved successfully.' })
    }
  }

  const propertyTypeOptions: { value: PropertyType; label: string }[] = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'studio', label: 'Studio' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Criteria</CardTitle>
        <CardDescription>
          Set your filters so PropScout AI can find properties that match your strategy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target cities */}
          <div className="space-y-2">
            <Label htmlFor="cities">Target Cities</Label>
            <Input
              id="cities"
              placeholder="Amsterdam, Rotterdam, Utrecht"
              value={cities}
              onChange={(e) => setCities(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter city names separated by commas.
            </p>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBudget">Min Budget (EUR)</Label>
              <Input
                id="minBudget"
                type="number"
                min={0}
                placeholder="100000"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxBudget">Max Budget (EUR)</Label>
              <Input
                id="maxBudget"
                type="number"
                min={0}
                placeholder="500000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
            </div>
          </div>

          {/* Net yield target */}
          <div className="space-y-2">
            <Label htmlFor="minYield">Min Net Yield Target (%)</Label>
            <Input
              id="minYield"
              type="number"
              min={0}
              max={100}
              step={0.1}
              placeholder="5.0"
              value={minYield}
              onChange={(e) => setMinYield(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Minimum gross rental yield you expect.
            </p>
          </div>

          {/* Property types */}
          <div className="space-y-2">
            <Label>Property Types</Label>
            <div className="flex flex-wrap gap-4">
              {propertyTypeOptions.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={propertyTypes.includes(value)}
                    onChange={() => togglePropertyType(value)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Min score threshold */}
          <div className="space-y-2">
            <Label htmlFor="minScore">Min Score Threshold (0–100)</Label>
            <Input
              id="minScore"
              type="number"
              min={0}
              max={100}
              placeholder="60"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Only show properties with an AI score above this number.
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
            {saving ? 'Saving…' : 'Save Criteria'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
