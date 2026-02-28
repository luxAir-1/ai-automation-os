import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CriteriaForm } from '@/components/criteria/criteria-form'

export const metadata = {
  title: 'Investment Criteria — PropScout AI',
}

export default async function CriteriaPage() {
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
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Investment Criteria</h1>
        <p className="text-muted-foreground mt-1">
          Define what you are looking for and PropScout AI will surface matching deals.
        </p>
      </div>
      <CriteriaForm userId={user.id} existingCriteria={criteria} />
    </div>
  )
}
