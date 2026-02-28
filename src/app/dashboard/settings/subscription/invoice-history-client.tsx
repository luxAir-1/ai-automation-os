'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Invoice {
  id: string
  number: string | null
  amount_due: number
  amount_paid: number | null
  currency: string
  status: string
  created: number
  hosted_invoice_url: string | null
  invoice_pdf: string | null
  period_start?: number
  period_end?: number
}

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stripe/invoices')
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data.invoices || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function formatDate(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    open: 'secondary',
    uncollectible: 'destructive',
    void: 'outline',
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Invoice History</h2>
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Your past invoices and payment history</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading invoices...</p>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No invoices found. When you subscribe to a plan, your invoices will appear here.
            </p>
          ) : (
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {invoice.number || `Invoice ${invoice.id.slice(-8)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.period_start && invoice.period_end
                        ? `${formatDate(invoice.period_start)} - ${formatDate(invoice.period_end)}`
                        : formatDate(invoice.created)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusColors[invoice.status] || 'outline'}>
                      {invoice.status}
                    </Badge>
                    <p className="text-sm font-medium">
                      {formatAmount(invoice.amount_due, invoice.currency)}
                    </p>
                    {invoice.hosted_invoice_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
