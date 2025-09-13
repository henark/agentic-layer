import { useState } from 'react';
import { AgentState } from '@/types/agent';

export function useAgent(initialState?: Partial<AgentState>) {
  const [state, setState] = useState<AgentState>({
    messages: [],
    tasks: [],
    config: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
    },
    isRunning: false,
    ...initialState,
  });

  // Placeholder for agent interaction logic
  const runAgent = (intent: string) => {
    console.log(`Running agent with intent: ${intent}`);
    // This would trigger the whole orchestrator flow
  };

  return { state, runAgent, setState };
}
