import { useState, useCallback } from 'react';
import { EthicalGuardrails } from '@/lib/agent/governor';

export function useEthicalGuardrails() {
  const [lastCheck, setLastCheck] = useState<{ allowed: boolean; reason?: string } | null>(null);

  const governor = new EthicalGuardrails({
    enabled: true,
    maxCostPerTask: 0.10,
    dailyBudget: 10.0,
    allowedTools: [],
    contentFilter: {
      enabled: true,
      blockedCategories: [],
    },
  });

  const check = useCallback(async (request: string) => {
    const result = await governor.checkRequest(request);
    setLastCheck(result);
    return result;
  }, [governor]);

  return { lastCheck, check };
}
