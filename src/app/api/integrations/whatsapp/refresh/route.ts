import { NextRequest, NextResponse } from 'next/server';
import { refreshOAuthToken, getOAuthConfig } from '@/lib/integrations/oauth-utils';

/**
 * POST /api/integrations/whatsapp/refresh
 *
 * Refreshes a WhatsApp OAuth token using the refresh token.
 * Note: WhatsApp tokens typically don't expire, but this endpoint is provided for consistency.
 * Called by the token refresh service when needed.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      // WhatsApp tokens typically don't have refresh tokens
      // Return success with the same token
      return NextResponse.json(
        {
          access_token: refreshToken,
          refresh_token: refreshToken,
          expires_at: null,
          expires_in: null,
        }
      );
    }

    // Get OAuth config (redirect URI not used for refresh, but needed for config)
    const baseUrl = request.headers.get('origin') || `${getProtocol(request)}://${request.headers.get('host')}`;
    const redirectUri = `${baseUrl}/api/integrations/whatsapp/callback`;
    const oauthConfig = getOAuthConfig('whatsapp', redirectUri);

    // Attempt to refresh the token
    const tokenData = await refreshOAuthToken(oauthConfig, refreshToken);

    // WhatsApp tokens don't have expiry
    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: null,
      expires_in: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to refresh token';
    console.error('[WhatsApp Refresh] Error:', message);

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
