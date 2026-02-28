import { NextRequest, NextResponse } from 'next/server';
import { refreshOAuthToken, getOAuthConfig } from '@/lib/integrations/oauth-utils';

/**
 * POST /api/integrations/google-calendar/refresh
 *
 * Refreshes a Google Calendar OAuth token using the refresh token.
 * Called by the token refresh service when a token is expiring.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Get OAuth config (redirect URI not used for refresh, but needed for config)
    const baseUrl = request.headers.get('origin') || `${getProtocol(request)}://${request.headers.get('host')}`;
    const redirectUri = `${baseUrl}/api/integrations/google-calendar/callback`;
    const oauthConfig = getOAuthConfig('google-calendar', redirectUri);

    // Refresh the token
    const tokenData = await refreshOAuthToken(oauthConfig, refreshToken);

    // Calculate new expiry
    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null;

    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt,
      expires_in: tokenData.expires_in,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to refresh token';
    console.error('[Calendar Refresh] Error:', message);

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
