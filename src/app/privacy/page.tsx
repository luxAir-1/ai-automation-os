import { Navbar } from '@/components/layout/navbar'

export const metadata = {
  title: 'Privacy Policy | PropScout AI',
  description: 'GDPR-compliant Privacy Policy for PropScout AI.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 2026</p>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">1. Data Controller</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            PropScout AI is the data controller for personal data collected through this platform.
            We are based in the Netherlands and process your data in accordance with the General Data
            Protection Regulation (GDPR) and the Dutch implementation (UAVG).
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            Contact:{' '}
            <a href="mailto:privacy@propscout.ai" className="underline underline-offset-2 hover:text-foreground">
              privacy@propscout.ai
            </a>
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">2. Data We Collect</h2>

          <h3 className="text-base font-semibold">Account information</h3>
          <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Email address (required for account creation and notifications)</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Full name (optional, used to personalise the interface)</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Password (stored as a bcrypt hash — we never store plain-text passwords)</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Subscription tier and billing history (managed via Stripe)</li>
          </ul>

          <h3 className="text-base font-semibold">Property preferences</h3>
          <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Saved properties and watchlists</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Investment criteria settings (yield thresholds, location filters, budget range)</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Analysis history (URLs you have submitted for analysis)</li>
          </ul>

          <h3 className="text-base font-semibold">Usage data</h3>
          <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Pages visited and features used within the platform</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />IP address and approximate location (country/city level)</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Browser type and device information</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Log data for security and debugging purposes</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">3. Legal Basis for Processing</h2>
          <p className="text-sm leading-7 text-muted-foreground">We process your personal data on the following legal bases:</p>
          <ul className="ml-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Contract performance (Art. 6(1)(b) GDPR):</strong> Account information and subscription data are required to provide the service you signed up for.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Legitimate interests (Art. 6(1)(f) GDPR):</strong> Usage analytics and security logging to maintain platform quality and prevent fraud.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Consent (Art. 6(1)(a) GDPR):</strong> Marketing emails and non-essential cookies, where you have explicitly opted in.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Legal obligation (Art. 6(1)(c) GDPR):</strong> Retention of financial records for tax compliance (Dutch law requires 7-year retention).</span>
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">4. How We Use Your Data</h2>
          <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Providing and personalising your dashboard experience</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Sending property alerts that match your investment criteria</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Processing subscription payments via Stripe</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Sending transactional emails (account confirmation, password reset, receipts)</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Improving the analysis algorithms and platform features</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Detecting and preventing fraud or misuse</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />Complying with legal obligations</li>
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            We share data with the following sub-processors. Each is subject to a Data Processing Agreement:
          </p>

          <div className="rounded-lg border p-4 text-sm">
            <h3 className="font-semibold">Supabase (database and authentication)</h3>
            <p className="mt-1 leading-6 text-muted-foreground">
              Your account data, saved properties, and preferences are stored in Supabase (AWS eu-west-1, Ireland).
              Supabase is GDPR-compliant.{' '}
              <a href="https://supabase.com/privacy" className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noopener noreferrer">
                Privacy policy
              </a>
            </p>
          </div>

          <div className="rounded-lg border p-4 text-sm">
            <h3 className="font-semibold">Stripe (payment processing)</h3>
            <p className="mt-1 leading-6 text-muted-foreground">
              Payment card details are never stored by PropScout AI. All payment processing is handled by
              Stripe, which is PCI-DSS Level 1 certified. Stripe may store billing address and transaction history.{' '}
              <a href="https://stripe.com/privacy" className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noopener noreferrer">
                Privacy policy
              </a>
            </p>
          </div>

          <div className="rounded-lg border p-4 text-sm">
            <h3 className="font-semibold">OpenAI (AI analysis)</h3>
            <p className="mt-1 leading-6 text-muted-foreground">
              Property listing text may be sent to OpenAI&rsquo;s API to generate analysis summaries.
              We do not send personal account information to OpenAI. OpenAI processes data in the US
              under Standard Contractual Clauses.{' '}
              <a href="https://openai.com/privacy" className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noopener noreferrer">
                Privacy policy
              </a>
            </p>
          </div>

          <div className="rounded-lg border p-4 text-sm">
            <h3 className="font-semibold">Resend (transactional email)</h3>
            <p className="mt-1 leading-6 text-muted-foreground">
              Your email address is shared with Resend to deliver account and alert emails.
              Resend is GDPR-compliant and processes data in the EU.{' '}
              <a href="https://resend.com/privacy" className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noopener noreferrer">
                Privacy policy
              </a>
            </p>
          </div>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">6. Data Retention</h2>
          <ul className="ml-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Account data:</strong> Retained for the duration of your account. Deleted within 30 days of account closure, except where legal retention requirements apply.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Financial records:</strong> Retained for 7 years as required by Dutch tax law.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Usage logs:</strong> Retained for 90 days for security purposes, then deleted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Saved properties and analysis history:</strong> Deleted immediately upon account closure unless you request an export first.</span>
            </li>
          </ul>
        </section>

        <section id="your-rights" className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">7. Your Rights Under GDPR</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            As a data subject, you have the following rights. To exercise any of them, contact us at{' '}
            <a href="mailto:privacy@propscout.ai" className="underline underline-offset-2 hover:text-foreground">
              privacy@propscout.ai
            </a>. We will respond within 30 days.
          </p>
          <ul className="ml-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Right of access (Art. 15):</strong> Request a copy of all personal data we hold about you.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Right to rectification (Art. 16):</strong> Correct inaccurate or incomplete data. You can update most data directly in account settings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Right to erasure (Art. 17):</strong> Request deletion of your personal data (&ldquo;right to be forgotten&rdquo;), subject to legal retention obligations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Right to data portability (Art. 20):</strong> Receive your data in a machine-readable format (JSON/CSV export available from account settings).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Right to restriction of processing (Art. 18):</strong> Request that we limit how we process your data in certain circumstances.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Right to object (Art. 21):</strong> Object to processing based on legitimate interests, including profiling.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Right to withdraw consent:</strong> Where processing is based on consent, you may withdraw at any time (e.g., unsubscribing from marketing emails).</span>
            </li>
          </ul>
          <p className="text-sm leading-7 text-muted-foreground">
            If you believe your rights have been violated, you have the right to lodge a complaint with
            the Dutch Data Protection Authority (Autoriteit Persoonsgegevens):{' '}
            <a href="https://www.autoriteitpersoonsgegevens.nl" className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noopener noreferrer">
              autoriteitpersoonsgegevens.nl
            </a>
          </p>
        </section>

        <section id="cookie-policy" className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">8. Cookie Policy</h2>
          <p className="text-sm leading-7 text-muted-foreground">We use the following types of cookies:</p>
          <ul className="ml-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Strictly necessary cookies:</strong> Authentication session cookies required for you to stay logged in. These cannot be declined without breaking the service.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Functional cookies:</strong> Remember your preferences (e.g., cookie consent choice, UI settings). No consent required.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span><strong className="text-foreground">Analytics cookies:</strong> Only set with your explicit consent. We use these to understand platform usage and improve features.</span>
            </li>
          </ul>
          <p className="text-sm leading-7 text-muted-foreground">
            You can manage your cookie preferences at any time using the cookie banner at the bottom
            of the page. Declining analytics cookies does not affect your access to the service.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">9. Data Security</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            We implement appropriate technical and organisational measures to protect your data,
            including TLS encryption in transit, encrypted storage, access controls, and regular
            security reviews. However, no system is completely secure and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">10. Changes to This Policy</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you of material
            changes by email or via an in-app notice at least 14 days before the changes take effect.
            Your continued use of the service after the effective date constitutes acceptance.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold">11. Contact</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            For privacy-related enquiries:{' '}
            <a href="mailto:privacy@propscout.ai" className="underline underline-offset-2 hover:text-foreground">
              privacy@propscout.ai
            </a>
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            Postal address: PropScout AI, Netherlands
          </p>
        </section>
      </main>
    </div>
  )
}
