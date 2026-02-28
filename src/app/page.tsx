import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-background noise">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="radial-glow relative overflow-hidden">
        {/* Dot-grid background decoration */}
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-32 text-center sm:pt-40">
          {/* Staggered reveal */}
          <div className="stagger flex flex-col items-center">
            {/* Tagline pill */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              Enterprise AI Automation Platform
            </div>

            {/* Headline */}
            <h1 className="font-heading text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Automate with
              <br />
              <span className="text-gradient">AI Agents</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Deploy intelligent agents to automate complex workflows. Connect your tools, define tasks, and let AI handle the heavy lifting. Control everything through natural language.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="glow-amber rounded-lg bg-primary px-8 py-3 font-heading text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-lg border-border/60 px-8 py-3 font-heading text-sm font-semibold backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Metrics ────────────────────────────────────── */}
      <section className="relative border-y border-border/40 bg-surface-1/50 backdrop-blur-sm">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-border/40 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            {
              value: '100+',
              label: 'AI Agents Deployed',
              icon: (
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              ),
            },
            {
              value: '1000+',
              label: 'Workflows Automated',
              icon: (
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              ),
            },
            {
              value: '24/7',
              label: 'Always Running',
              icon: (
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              ),
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="stat-card flex items-center gap-4 px-8 py-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                {metric.icon}
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-foreground">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────── */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          {/* Section heading */}
          <div className="fade-in-up mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Why teams choose{' '}
              <span className="text-gradient">AI Automation OS</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Purpose-built for teams that need powerful, extensible AI automation without complexity.
            </p>
          </div>

          {/* Feature cards */}
          <div className="stagger grid gap-6 sm:grid-cols-3">
            {/* Card 1 */}
            <div className="glass-card group rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(38_92%_55%/0.08)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Multi-Agent Orchestration
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Deploy multiple AI agents that work together, each specialized for specific tasks. Coordinate complex workflows across your entire automation stack.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card group rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(38_92%_55%/0.08)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Real-Time Execution
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Agents run 24/7 and respond instantly to events. Monitor execution logs and metrics in real-time, with full audit trails for compliance.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card group rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(38_92%_55%/0.08)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Tool Integration
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Connect any API or tool your agents need. Pre-built integrations for popular services, plus simple API for custom tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────── */}
      <section className="relative border-t border-border/40">
        <div className="radial-glow mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32">
          <div className="fade-in-up flex flex-col items-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to automate{' '}
              <span className="text-gradient">your workflows</span>?
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Start building with AI agents today. Deploy instantly and iterate with confidence.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="glow-amber rounded-lg bg-primary px-8 py-3 font-heading text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                <Link href="/signup">Start Building Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-lg border-border/60 px-8 py-3 font-heading text-sm font-semibold transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-surface-1/50">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="font-heading text-sm font-medium text-muted-foreground">
            <span className="text-gradient">&diams;</span>{' '}
            AI Automation OS
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
