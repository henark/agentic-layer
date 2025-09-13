import { useState, useCallback, useMemo } from 'react';
import { AgentTask } from '@/types/agent';
import { ToolExecutor } from '@/lib/agent/executor';

export function useToolExecutor() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);

  const executor = useMemo(() => new ToolExecutor({
    maxConcurrentTasks: 3,
    timeoutMs: 30000,
    retryAttempts: 2,
  }), []);

  const execute = useCallback(async (task: AgentTask) => {
    setIsExecuting(true);
    const result = await executor.executeTask(task);
    setResults(prev => ({ ...prev, [task.id]: result }));
    setIsExecuting(false);
  }, [executor]);

  return { results, isExecuting, execute };
}
