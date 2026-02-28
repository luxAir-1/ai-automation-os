'use client';

import { useCallback, useState } from 'react';

interface DisconnectResult {
  success: boolean;
  error?: string;
  provider: string;
}

export function useDisconnect() {
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const disconnect = useCallback(async (provider: string): Promise<DisconnectResult> => {
    setDisconnecting(provider);
    setError(null);

    try {
      const response = await fetch(`/api/integrations/${provider}/disconnect`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || 'Failed to disconnect service';
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg,
          provider,
        };
      }

      return {
        success: true,
        provider,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg,
        provider,
      };
    } finally {
      setDisconnecting(null);
    }
  }, []);

  return {
    disconnect,
    disconnecting,
    error,
  };
}
