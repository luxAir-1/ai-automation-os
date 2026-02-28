import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'

export const metadata = {
  title: 'Pricing — AI Automation OS',
}

const plans = [
  {
    key: 'starter',
    name: 'Starter',
    price: 29,
    description: 'For creators & consultants getting started with AI automation.',
    features: [
      '2 AI agents',
      '3 integrations (Gmail, Calendar, WhatsApp)',
      'Basic automation workflows',
      'Email support',
      '1,000 agent executions/month',
    ],
    popular: false,
    priceId: 'price_starter',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 99,
    description: 'Most popular for growing businesses.',
    features: [
      '10 AI agents',
      'Unlimited integrations',
      'Advanced automation workflows',
      'Priority support',
      '10,000 agent executions/month',
      'RAG knowledge bot',
      'Multi-language support',
    ],
    popular: true,
    priceId: 'price_pro',
  },
  {
    key: 'agency',
    name: 'Agency',
    price: 299,
    description: 'For agencies and teams scaling with AI.',
    features: [
      'Unlimited AI agents',
      'Unlimited integrations',
      'Custom workflows',
      'Dedicated support',
      'Unlimited executions',
      'White-label options',
      'API access',
      'Team collaboration',
    ],
    popular: false,
    priceId: 'price_agency',
  },
]

export default async function PricingPage() {
  let isLoggedIn = false
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    isLoggedIn = !!user
  } catch {
    // Public page — auth not required.
  }

  const ctaHref = isLoggedIn ? '/dashboard/settings/subscription' : '/signup'

  return (
    <div className="min-h-screen bg-background noise">
      <Navbar />

      {/* ── Header ───────────────────────────────────────────── */}
      <section className="radial-glow relative pt-20 pb-16">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-20" />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="stagger flex flex-col items-center">
            {/* Badge */}
            <div className="glow-amber mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-5 py-2 text-sm font-semibold text-primary backdrop-blur-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Launch Special — First month 50% off
            </div>

            {/* Heading */}
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Simple, transparent{' '}
              <span className="text-gradient">pricing</span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Replace expensive Zapier workflows with affordable AI employees.
              Cancel any time.
            </p>
          </div>
        </div>
      </section>

      {/* ── Plan Cards ───────────────────────────────────────── */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="stagger grid gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={`relative flex flex-col rounded-2xl p-[1px] transition-all duration-300 ${
                  plan.popular
                    ? 'border-gradient glow-amber'
                    : ''
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`flex h-full flex-col rounded-2xl p-8 ${
                    plan.popular
                      ? 'bg-surface-2'
                      : 'glass-card'
                  }`}
                >
                  {/* Plan name & description */}
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mt-6 flex items-end gap-1.5">
                    <span className={`font-heading text-5xl font-extrabold leading-none ${plan.popular ? 'text-gradient' : 'text-foreground'}`}>
                      ${plan.price}
                    </span>
                    <span className="mb-1 text-sm text-muted-foreground">/mo</span>
                  </div>

                  {/* Divider */}
                  <div className="my-6 h-px w-full bg-border/50" />

                  {/* Features */}
                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-8">
                    <Link
                      href={ctaHref}
                      className={`flex w-full items-center justify-center rounded-xl py-3 font-heading text-sm font-semibold transition-all ${
                        plan.popular
                          ? 'glow-amber bg-primary text-primary-foreground hover:brightness-110'
                          : 'border border-border/60 bg-surface-3/50 text-foreground hover:border-primary/40 hover:bg-primary/5'
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-muted-foreground">
            All prices in USD. VAT may apply based on your location.
          </p>
        </div>
      </section>
    </div>
  )
}
