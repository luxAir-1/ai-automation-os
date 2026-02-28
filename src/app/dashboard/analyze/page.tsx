import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AnalyzeForm } from './analyze-form'

export const metadata = {
  title: 'Analyze URL | PropScout AI',
  description: 'Analyze a Pararius or Funda property listing with AI.',
}

export default async function AnalyzePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analyze a Property</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a Pararius or Funda URL to get an instant AI-powered investment analysis.
        </p>
      </div>
      <AnalyzeForm />
    </div>
  )
}
