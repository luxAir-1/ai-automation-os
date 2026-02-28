import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/service'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  })
}

// Stripe requires the raw body for signature verification — disable body parsing.
export const dynamic = 'force-dynamic'

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const stripe = getStripe()
  const supabase = createServiceClient()
  const userId = session.metadata?.userId

  if (!userId) {
    console.error('[webhook] checkout.session.completed: missing userId in metadata')
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sess = session as any
  const subscriptionId: string | undefined =
    typeof sess.subscription === 'string' ? sess.subscription : sess.subscription?.id

  if (!subscriptionId) return

  // Fetch full subscription from Stripe to get period dates.
  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId)
  const customerId =
    typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer.id

  // Map Stripe price to our plan enum.
  const priceId = stripeSub.items.data[0]?.price?.id ?? ''
  const plan = mapPriceIdToPlan(priceId)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = stripeSub as any
  await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      plan,
      status: mapStripeStatus(stripeSub.status),
      current_period_start: sub.current_period_start
        ? new Date(sub.current_period_start * 1000).toISOString()
        : null,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = createServiceClient()
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('[webhook] subscription.updated: missing userId in metadata')
    return
  }

  const customerId =
    typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

  const priceId = subscription.items.data[0]?.price?.id ?? ''
  const plan = mapPriceIdToPlan(priceId)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = subscription as any
  await supabase
    .from('subscriptions')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan,
      status: mapStripeStatus(subscription.status),
      current_period_start: sub.current_period_start
        ? new Date(sub.current_period_start * 1000).toISOString()
        : null,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = createServiceClient()
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('[webhook] subscription.deleted: missing userId in metadata')
    return
  }

  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inv = invoice as any
  const subscriptionId: string | undefined =
    typeof inv.subscription === 'string'
      ? inv.subscription
      : inv.subscription?.id ?? inv.parent?.subscription_details?.subscription

  if (!subscriptionId) return

  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapStripeStatus(
  stripeStatus: string
): 'active' | 'canceled' | 'past_due' | 'trialing' {
  switch (stripeStatus) {
    case 'active':
      return 'active'
    case 'canceled':
      return 'canceled'
    case 'past_due':
      return 'past_due'
    case 'trialing':
      return 'trialing'
    default:
      return 'active'
  }
}

function mapPriceIdToPlan(
  priceId: string
): 'free' | 'starter' | 'pro' | 'founding_member' {
  const starterPriceId = process.env.STRIPE_PRICE_STARTER
  const proPriceId = process.env.STRIPE_PRICE_PRO
  const foundingPriceId = process.env.STRIPE_PRICE_FOUNDING

  if (priceId === starterPriceId) return 'starter'
  if (priceId === proPriceId) return 'pro'
  if (priceId === foundingPriceId) return 'founding_member'
  return 'free'
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature verification failed'
    console.error('[webhook] signature error:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        // Unhandled event type — acknowledge receipt.
        break
    }
  } catch (err) {
    console.error(`[webhook] error handling ${event.type}:`, err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
