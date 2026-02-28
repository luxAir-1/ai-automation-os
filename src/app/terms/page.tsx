import { Navbar } from '@/components/layout/navbar'

export const metadata = {
  title: 'Terms of Service | PropScout AI',
  description: 'Terms of Service for PropScout AI — AI-powered Dutch property investment analysis.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 2026</p>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <strong>Important:</strong> PropScout AI provides property data and analysis for informational
          purposes only. Nothing on this platform constitutes financial, legal, or investment advice.
          Always consult a qualified financial adviser before making investment decisions.
        </div>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">1. About PropScout AI</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            PropScout AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an automated
            property analysis platform that aggregates publicly available Dutch real estate listings
            and applies algorithmic analysis to estimate rental yields, costs, and investment scores.
            Our service is operated from the Netherlands and is subject to Dutch and EU law.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            <strong className="text-foreground">PropScout AI is not a financial adviser, estate agent, or mortgage broker.</strong>{' '}
            The analysis scores, yield estimates, and cost breakdowns provided are algorithmic estimates
            based on publicly available data and general market assumptions. They do not account for your
            personal financial situation, tax position, or investment objectives.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">2. Acceptance of Terms</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            By creating an account or using PropScout AI, you agree to these Terms of Service and our
            Privacy Policy. If you do not agree, do not use the service. We may update these terms from
            time to time; continued use after changes constitutes acceptance.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">3. Service Description</h2>
          <p className="text-sm leading-7 text-muted-foreground">PropScout AI provides:</p>
          <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Automated analysis of Dutch rental property listings from public sources (Funda, Pararius)</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Estimated gross and net rental yields based on market data</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Cost breakdowns including estimated mortgage payments, VvE contributions, and maintenance</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Investment scoring (0–100) based on configurable criteria</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Email and in-app alerts when properties meet your defined thresholds</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />A URL analysis tool to analyze specific property listings on demand</li>
          </ul>
          <p className="text-sm leading-7 text-muted-foreground">
            All data is sourced from publicly available listings. We do not guarantee completeness,
            accuracy, or timeliness of any property data.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">4. User Responsibilities</h2>
          <p className="text-sm leading-7 text-muted-foreground">You agree to:</p>
          <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Provide accurate registration information and keep it up to date</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Keep your account credentials confidential</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Use the service only for lawful purposes in compliance with Dutch and EU law</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Not scrape, copy, or redistribute our analysis output for commercial purposes</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Not attempt to reverse-engineer, overload, or interfere with our systems</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Not use the service to make investment decisions without seeking independent professional advice</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">5. Subscription and Billing</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            PropScout AI offers subscription plans billed monthly or annually. Billing is processed
            through Stripe. By subscribing, you authorise recurring charges to your payment method at
            the frequency and price displayed at checkout.
          </p>
          <ul className="ml-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Free tier:</strong> Limited number of property views and analyses per month, no email alerts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Paid tiers:</strong> Higher limits, email alerts, and priority analysis as described on the pricing page.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Price changes:</strong> We will give at least 30 days&rsquo; notice before increasing subscription prices.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Cancellation:</strong> You may cancel at any time. Access continues until the end of the paid billing period. No partial refunds except as required by law.</span>
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">6. EU 14-Day Withdrawal Right</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Under EU Consumer Rights Directive (and Dutch implementation in Book 6 BW), consumers have
            the right to withdraw from a distance contract within 14 days of purchase without giving a
            reason (&ldquo;herroepingsrecht&rdquo;). To exercise this right, contact us at{' '}
            <a href="mailto:support@propscout.ai" className="underline underline-offset-2 hover:text-foreground">
              support@propscout.ai
            </a>{' '}
            within 14 days of your initial subscription purchase.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            If you explicitly request that the service begins before the 14-day period expires, you
            acknowledge that your withdrawal right may be proportionally reduced to the value of the
            service already provided.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">7. Intellectual Property</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            All original content on PropScout AI — including the scoring algorithm, UI design, brand
            assets, and written analysis templates — is the intellectual property of PropScout AI. You
            may not copy, reproduce, or distribute this content without written permission.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            Property listing data is sourced from public third-party sources (Funda, Pararius, CBS,
            etc.) and is subject to the terms of those providers. We do not claim ownership of
            underlying property data.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">8. Disclaimer of Investment Advice</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            <strong className="text-foreground">
              PropScout AI does not provide financial, investment, legal, or tax advice of any kind.
            </strong>{' '}
            All analysis, scores, yields, and cost estimates are algorithmic outputs generated from
            publicly available data. They are provided for informational and educational purposes only.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">You acknowledge that:</p>
          <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Real estate investment carries significant financial risk, including loss of capital</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Yield estimates may differ materially from actual rental income</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Cost estimates do not account for all expenses, vacancies, or market changes</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />PropScout AI is not regulated by the AFM (Autoriteit Financiele Markten)</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />You will seek independent professional advice before making any investment decision</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">9. Data Accuracy Disclaimer</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            We make reasonable efforts to provide accurate and up-to-date property information, but we
            cannot guarantee the accuracy, completeness, or timeliness of data obtained from
            third-party sources. Property listings may be outdated, withdrawn, or inaccurately
            described by the original source. Always verify all information directly with the relevant
            estate agent or seller before acting on it.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">10. Limitation of Liability</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            To the maximum extent permitted by Dutch law, PropScout AI and its operators shall not be
            liable for:
          </p>
          <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Any investment losses or financial harm resulting from use of our analysis</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Inaccurate, incomplete, or outdated property data</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Service interruptions, data loss, or technical failures</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Decisions made based on our analysis scores or yield estimates</li>
          </ul>
          <p className="text-sm leading-7 text-muted-foreground">
            Where liability cannot be excluded by law, our total liability is limited to the amount
            you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">11. Termination</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            You may terminate your account at any time from account settings. We may suspend or
            terminate your account if you breach these terms, engage in fraudulent activity, or if
            continued operation is required by law. Upon termination, your data will be handled per
            our Privacy Policy.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">12. Governing Law</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            These Terms of Service are governed by the laws of the Netherlands. Any disputes shall be
            submitted to the competent court in Amsterdam, the Netherlands, unless mandatory consumer
            protection law provides otherwise.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">13. Contact</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Questions about these terms:{' '}
            <a href="mailto:legal@propscout.ai" className="underline underline-offset-2 hover:text-foreground">
              legal@propscout.ai
            </a>
          </p>
        </section>
      </main>
    </div>
  )
}
