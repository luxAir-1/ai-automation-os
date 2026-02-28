import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  generateOAuthState,
  buildAuthorizationUrl,
  getOAuthConfig,
} from '@/lib/integrations/oauth-utils';

/**
 * POST /api/integrations/gmail/connect
 *
 * Initiates the OAuth flow for Gmail connection.
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
    // Get base URL
    const baseUrl = request.headers.get('origin') || `${getProtocol(request)}://${request.headers.get('host')}`;
    const redirectUri = `${baseUrl}/api/integrations/gmail/callback`;

    // Get OAuth config
    const oauthConfig = getOAuthConfig('gmail', redirectUri);

    // Generate state
    const state = generateOAuthState(user.id);

    // Build authorization URL
    const authUrl = buildAuthorizationUrl(oauthConfig, state);

    return NextResponse.json({
      authorizationUrl: authUrl,
      provider: 'gmail',
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
