import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlertPreferencesForm } from '@/components/alerts/alert-preferences-form'

export const metadata = {
  title: 'Alert Preferences — PropScout AI',
}

export default async function AlertsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: criteria } = await supabase
    .from('investment_criteria')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alert Preferences</h1>
        <p className="text-muted-foreground mt-1">
          Control when and how PropScout AI notifies you about matching properties.
        </p>
      </div>
      <AlertPreferencesForm userId={user.id} criteria={criteria} />
    </div>
  )
}
