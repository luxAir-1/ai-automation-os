import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthCard } from '@/components/auth/auth-card'

export const metadata = {
  title: 'Inloggen — PropScout AI',
}

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f5f5f5] dark:bg-background">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 radial-glow" />
        <div className="absolute inset-0 dot-grid opacity-40" />

        {/* Decorative amber ring */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full opacity-[0.07]"
          style={{
            background:
              'conic-gradient(from 180deg, hsl(38 92% 55%), transparent 40%, transparent 60%, hsl(38 92% 55%))',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-md px-12 text-center fade-in">
          {/* Logo mark */}
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-surface-2 glow-amber">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>

          <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground mb-4">
            <span className="text-gradient">PropScout AI</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground leading-relaxed mb-8">
            AI-gestuurde analyse van Nederlandse huurwoningen. Vind hoog-rendement investeringen met data-gedreven inzichten.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['AI Analyse', 'Marktdata', 'Rendement Score'].map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-border bg-surface-2/60 px-3.5 py-1.5 font-body text-xs text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Auth Card */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2 lg:px-8">
        <AuthCard mode="login" />
      </div>
    </div>
  )
}
