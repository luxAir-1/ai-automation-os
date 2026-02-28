'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Subscription {
  plan: string
  status: string
  current_period_end: string | null
  stripe_customer_id: string | null
}

interface Invoice {
  id: string
  number: string | null
  amount_due: number
  amount_paid: number
  currency: string
  status: string
  created: number
  hosted_invoice_url: string | null
  invoice_pdf: string | null
  period_start: number | null
  period_end: number | null
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  agency: 'Agency',
  founding_member: 'Founding Member',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  canceled: 'Cancelled',
  past_due: 'Past Due',
  trialing: 'Trial',
}

function formatDate(dateStr: string | null | number) {
  if (!dateStr) return '—'
  const date = typeof dateStr === 'number' ? new Date(dateStr * 1000) : new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSubscription()
  }, [])

  async function loadSubscription() {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      setSubscription(sub)

      if (sub?.stripe_customer_id) {
        await loadInvoices()
      }
    } catch (err) {
      setError('Failed to load subscription data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadInvoices() {
    try {
      const res = await fetch('/api/stripe/invoices')
      if (res.ok) {
        const data = await res.json()
        setInvoices(data.invoices || [])
      }
    } catch (err) {
      console.error('Failed to load invoices:', err)
    }
  }

  async function openPortal() {
    try {
      setPortalLoading(true)
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        }
      } else {
        const error = await res.json()
        setError(error.error || 'Failed to open customer portal')
      }
    } catch (err) {
      setError('Failed to open customer portal')
      console.error(err)
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return <div className="max-w-3xl space-y-8"><p>Loading...</p></div>
  }

  const plan = subscription?.plan ?? 'free'
  const status = subscription?.status ?? 'active'
  const planLabel = PLAN_LABELS[plan] ?? plan
  const statusLabel = STATUS_LABELS[status] ?? status
  const nextBillingDate = formatDate(subscription?.current_period_end || null)

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your AI Automation OS plan and billing.</p>
      </div>

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Current plan card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Plan</CardTitle>
            <Badge variant={plan === 'free' ? 'secondary' : 'default'}>{planLabel}</Badge>
          </div>
          <CardDescription>Your subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{statusLabel}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Next billing date</p>
              <p className="font-medium">{nextBillingDate}</p>
            </div>
          </div>

          {subscription?.stripe_customer_id && (
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                onClick={openPortal}
                disabled={portalLoading}
                className="text-sm"
              >
                {portalLoading ? 'Opening...' : 'Manage Subscription'}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Update payment method, download invoices, or cancel subscription.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice History */}
      {invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Your recent invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Invoice #{invoice.number || invoice.id.slice(-8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm ${
                        invoice.status === 'paid'
                          ? 'text-green-600'
                          : invoice.status === 'open'
                          ? 'text-yellow-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {invoice.status === 'paid'
                        ? 'Paid'
                        : invoice.status === 'open'
                        ? 'Pending'
                        : invoice.status}
                    </span>
                    <span className="text-sm font-medium">
                      {formatCurrency(invoice.amount_due, invoice.currency)}
                    </span>
                    {invoice.hosted_invoice_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={invoice.hosted_invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan info */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that fits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span><strong>Starter:</strong> $29/month - Basic AI agents & integrations</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Pro:</strong> $99/month - Advanced agents & priority support</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Agency:</strong> $299/month - Unlimited agents & white-label options</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Contact support to upgrade or downgrade your plan.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
