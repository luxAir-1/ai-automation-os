import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateOAuthState, buildAuthorizationUrl } from '@/lib/integrations/oauth-utils';

/**
 * POST /api/integrations/shopify/connect
 *
 * Initiates the OAuth flow for Shopify connection.
 * Shopify is per-store, so we need the shop name from the request body.
 * Returns the authorization URL for the client to open.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Get shop name from request body
    const body = await request.json();
    const { shopName } = body;

    if (!shopName) {
      return NextResponse.json(
        { error: 'Shop name is required' },
        { status: 400 }
      );
    }

    // Validate shop name format
    if (!/^[a-z0-9-]+$/.test(shopName)) {
      return NextResponse.json(
        { error: 'Invalid shop name format' },
        { status: 400 }
      );
    }

    // Get base URL
    const baseUrl = request.headers.get('origin') || `${getProtocol(request)}://${request.headers.get('host')}`;
    const redirectUri = `${baseUrl}/api/integrations/shopify/callback`;

    // Get Shopify OAuth credentials
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    if (!clientId) {
      throw new Error('Missing SHOPIFY_CLIENT_ID environment variable');
    }

    // Generate state
    const state = generateOAuthState(user.id, shopName);

    // Build Shopify-specific authorization URL
    const authUrl = buildAuthorizationUrl(
      {
        provider: 'shopify',
        authUrl: `https://${shopName}.myshopify.com/admin/oauth/authorize`,
        tokenUrl: '', // Not used for building URL
        scopes: ['read_products', 'write_products', 'read_orders', 'write_orders'],
        clientId,
        clientSecret: '', // Not used for building URL
        redirectUri,
      },
      state,
      {
        shop: `${shopName}.myshopify.com`,
      }
    );

    return NextResponse.json({
      authorizationUrl: authUrl,
      provider: 'shopify',
      shopName,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate authorization URL';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

function getProtocol(request: NextRequest): string {
  const host = request.headers.get('host') || '';
  return host.includes('localhost') ? 'http' : 'https';
}
