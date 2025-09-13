import { useState, useCallback } from 'react';
import { AgentTask } from '@/types/agent';
import { TaskPlanner } from '@/lib/agent/planner';

export function useTaskPlanner() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const planner = new TaskPlanner({
    maxDecompositionDepth: 3,
    enableSelfReflection: true,
    planningModel: 'gpt-4',
  });

  const generatePlan = useCallback(async (goal: string) => {
    setIsLoading(true);
    const newTasks = await planner.decomposeTask(goal);
    const prioritizedTasks = await planner.prioritizeTasks(newTasks);
    setTasks(prioritizedTasks);
    setIsLoading(false);
  }, [planner]);

  return { tasks, isLoading, generatePlan };
}
