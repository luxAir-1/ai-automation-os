import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * DELETE /api/integrations/[provider]/disconnect
 *
 * Disconnects a user from a service by:
 * 1. Removing the connection from the database
 * 2. Attempting to revoke tokens with the provider (if supported)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
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
    // Find the connection
    const { data: connection, error: fetchError } = await supabase
      .from('connected_services')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .single();

    if (fetchError || !connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      );
    }

    // Attempt to revoke the token with the provider
    await revokeTokenWithProvider(provider, connection.access_token);

    // Delete the connection from the database
    const { error: deleteError } = await supabase
      .from('connected_services')
      .delete()
      .eq('id', connection.id);

    if (deleteError) {
      throw new Error(`Failed to delete connection: ${deleteError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully disconnected ${provider}`,
      provider,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to disconnect';
    console.error(`[Disconnect ${provider}] Error:`, message);

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

/**
 * Attempt to revoke a token with the provider.
 * Not all providers support token revocation.
 */
async function revokeTokenWithProvider(provider: string, token: string): Promise<void> {
  if (!token) return;

  try {
    switch (provider) {
      case 'gmail':
      case 'google-calendar':
      case 'youtube':
        // Google OAuth revocation
        await fetch('https://oauth2.googleapis.com/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `token=${encodeURIComponent(token)}`,
        });
        break;

      case 'whatsapp':
        // WhatsApp token revocation via Graph API
        try {
          await fetch('https://graph.facebook.com/v18.0/me/permissions', {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch {
          // Revocation may fail, but we still want to delete locally
        }
        break;

      case 'shopify':
        // Shopify token revocation is done server-side and not exposed to clients
        // We just remove the token locally
        break;

      default:
        // Unknown provider, skip revocation
        break;
    }
  } catch (err) {
    // Log but don't fail if revocation fails
    console.warn(`[Revoke ${provider}] Token revocation failed:`, err);
  }
}
