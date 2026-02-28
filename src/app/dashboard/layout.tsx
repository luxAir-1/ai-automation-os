import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch subscription plan for sidebar badge
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const subscriptionTier = subscription?.plan ?? 'free'

  return (
    <div className="flex min-h-screen bg-surface-1">
      <Sidebar subscriptionTier={subscriptionTier} />
      <div className="flex flex-1 flex-col overflow-auto">
        {/* Subtle top divider visible on mobile below the hamburger header */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent md:hidden" aria-hidden="true" />
        <main className="flex-1 bg-background px-4 py-8 md:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
