'use client';

import { useState, useEffect } from 'react';
import { MCPContext } from '@/types/mcp';
import { mcpServer, initializeMCP } from '@/lib/mcp/server';

export function useMCP() {
  const [context, setContext] = useState<MCPContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize MCP on mount
    initializeMCP();
    setContext(mcpServer.getContext());
    setLoading(false);

    // Subscribe to context changes
    const unsubscribe = mcpServer.subscribe((updatedContext) => {
      setContext(updatedContext);
    });

    return unsubscribe;
  }, []);

  return {
    context,
    loading,
    mcpServer,
  };
}
