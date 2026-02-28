/**
 * OAuth Utilities
 *
 * Shared utilities for OAuth 2.0 flows across all providers.
 * Handles common operations: state generation, token exchange, callback parsing.
 */

import crypto from 'crypto';

export interface OAuthConfig {
  provider: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

/**
 * Generate a cryptographically secure state parameter for OAuth flow.
 * Returns a base64-encoded JSON object with user info and timestamp.
 */
export function generateOAuthState(userId: string, serviceId?: string): string {
  const state = {
    userId,
    serviceId,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  return Buffer.from(JSON.stringify(state)).toString('base64');
}

/**
 * Verify and decode an OAuth state parameter.
 * Returns null if validation fails.
 */
export function verifyOAuthState(
  state: string | null,
  userId: string
): { serviceId?: string; timestamp: number } | null {
  if (!state) return null;

  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));

    // Verify userId matches
    if (decoded.userId !== userId) {
      console.error('[OAuth] State userId mismatch');
      return null;
    }

    // Verify state is not too old (5 minutes)
    if (Date.now() - decoded.timestamp > 5 * 60 * 1000) {
      console.error('[OAuth] State expired');
      return null;
    }

    return {
      serviceId: decoded.serviceId,
      timestamp: decoded.timestamp,
    };
  } catch (err) {
    console.error('[OAuth] State verification failed:', err);
    return null;
  }
}

/**
 * Build an OAuth authorization URL for a given provider.
 */
export function buildAuthorizationUrl(
  config: OAuthConfig,
  state: string,
  additionalParams?: Record<string, string>
): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scopes.join(' '),
    state,
    access_type: 'offline',
    prompt: 'consent',
    ...additionalParams,
  });

  return `${config.authUrl}?${params.toString()}`;
}

/**
 * Exchange an authorization code for tokens via the provider's token endpoint.
 */
export async function exchangeCodeForToken(
  config: OAuthConfig,
  code: string
): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
  });

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Token exchange failed: ${errorData.error_description || response.statusText}`
    );
  }

  return response.json();
}

/**
 * Refresh an OAuth token using the refresh token.
 */
export async function refreshOAuthToken(
  config: OAuthConfig,
  refreshToken: string
): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Token refresh failed: ${errorData.error_description || response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get provider-specific OAuth configuration from environment variables.
 */
export function getOAuthConfig(
  provider: string,
  redirectUri: string
): OAuthConfig {
  const configs: Record<string, Omit<OAuthConfig, 'clientId' | 'clientSecret' | 'redirectUri'>> = {
    gmail: {
      provider: 'gmail',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify',
      ],
    },
    'google-calendar': {
      provider: 'google-calendar',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
    },
    youtube: {
      provider: 'youtube',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube',
      ],
    },
    whatsapp: {
      provider: 'whatsapp',
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
      scopes: ['whatsapp_business_messaging', 'whatsapp_business_management'],
    },
    shopify: {
      provider: 'shopify',
      authUrl: '', // Dynamic per store
      tokenUrl: '', // Dynamic per store
      scopes: ['read_products', 'write_products', 'read_orders', 'write_orders'],
    },
  };

  const baseConfig = configs[provider];
  if (!baseConfig) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  return {
    ...baseConfig,
    clientId: getEnvVar(`${provider.toUpperCase()}_CLIENT_ID`),
    clientSecret: getEnvVar(`${provider.toUpperCase()}_CLIENT_SECRET`),
    redirectUri,
  };
}

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}
