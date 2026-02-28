import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Settings — PropScout AI',
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  founding_member: 'Founding Member',
}

const settingsCards = [
  {
    href: '/dashboard/settings/criteria',
    title: 'Investment Criteria',
    description: 'Set target cities, budget, property types, and minimum score filters.',
  },
  {
    href: '/dashboard/settings/subscription',
    title: 'Subscription',
    description: 'View your current plan, upgrade, or manage billing.',
  },
  {
    href: '/dashboard/settings/alerts',
    title: 'Alert Preferences',
    description: 'Configure email alerts, frequency, and score thresholds.',
  },
]

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .maybeSingle()

  const plan = subscription?.plan ?? 'free'
  const planLabel = PLAN_LABELS[plan] ?? plan

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
        </div>
        <Badge variant={plan === 'free' ? 'secondary' : 'default'} className="text-sm px-3 py-1">
          {planLabel}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settingsCards.map((card) => (
          <Link key={card.href} href={card.href} className="group block">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription className="text-sm">{card.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
