import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  verifyOAuthState,
  exchangeCodeForToken,
  getOAuthConfig,
} from '@/lib/integrations/oauth-utils';

/**
 * GET /api/integrations/google-calendar/callback
 *
 * OAuth callback handler for Google Calendar.
 * Exchanges authorization code for tokens and stores them in the database.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Get callback parameters
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Check for OAuth errors
  if (error) {
    return NextResponse.json(
      {
        error: `OAuth error: ${error}`,
        errorDescription,
      },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  // Verify authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Verify state
  const stateData = verifyOAuthState(state, user.id);
  if (!stateData) {
    return NextResponse.json({ error: 'Invalid or expired state' }, { status: 400 });
  }

  try {
    // Get OAuth config
    const baseUrl = request.headers.get('origin') || `${getProtocol(request)}://${request.headers.get('host')}`;
    const redirectUri = `${baseUrl}/api/integrations/google-calendar/callback`;
    const oauthConfig = getOAuthConfig('google-calendar', redirectUri);

    // Exchange code for tokens
    const tokenData = await exchangeCodeForToken(oauthConfig, code);

    // Get user's Calendar account info
    let providerAccountId = 'calendar-' + Date.now();
    try {
      const profileResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/settings/primary', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        providerAccountId = profile.value || providerAccountId;
      }
    } catch {
      // If we can't get profile, use default ID
    }

    // Calculate token expiry
    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null;

    // Check if connection already exists
    const { data: existingConnection } = await supabase
      .from('connected_services')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', 'google-calendar')
      .eq('provider_account_id', providerAccountId)
      .single();

    let connectionId: string;

    if (existingConnection) {
      // Update existing connection
      const { data, error: updateError } = await supabase
        .from('connected_services')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || undefined,
          token_expires_at: expiresAt,
          last_refresh_at: new Date().toISOString(),
          refresh_status: 'active',
        })
        .eq('id', existingConnection.id)
        .select('id')
        .single();

      if (updateError) {
        throw new Error(`Failed to update connection: ${updateError.message}`);
      }

      connectionId = data?.id || existingConnection.id;
    } else {
      // Create new connection
      const { data, error: insertError } = await supabase
        .from('connected_services')
        .insert({
          user_id: user.id,
          provider: 'google-calendar',
          provider_account_id: providerAccountId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          token_expires_at: expiresAt,
          refresh_status: 'active',
          connected_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (insertError) {
        throw new Error(`Failed to create connection: ${insertError.message}`);
      }

      connectionId = data?.id || '';
    }

    // Redirect to success page or dashboard
    const successUrl = new URL('/integrations?success=google-calendar', request.url);
    successUrl.searchParams.set('connectionId', connectionId);

    return NextResponse.redirect(successUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to complete OAuth flow';
    console.error('[Calendar OAuth] Error:', message);

    // Redirect to error page
    const errorUrl = new URL('/integrations?error=google-calendar', request.url);
    errorUrl.searchParams.set('message', encodeURIComponent(message));

    return NextResponse.redirect(errorUrl);
  }
}

function getProtocol(request: NextRequest): string {
  const host = request.headers.get('host') || '';
  return host.includes('localhost') ? 'http' : 'https';
}
