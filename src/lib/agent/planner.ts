import { AgentTask } from '@/types/agent';
import { PlannerConfig } from './types';
import { v4 as uuidv4 } from 'uuid';

export class TaskPlanner {
  private config: PlannerConfig;

  constructor(config: PlannerConfig) {
    this.config = config;
  }

  async decomposeTask(
    goal: string,
    context?: string
  ): Promise<AgentTask[]> {
    // Implementation for task decomposition
    console.log(`Decomposing task for goal: ${goal}`, context);
    const tasks: AgentTask[] = [
      {
        id: this.generateId(),
        description: `Analyze goal: ${goal}`,
        status: 'pending',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.generateId(),
        description: `Create execution plan for: ${goal}`,
        status: 'pending',
        priority: 'high',
        dependencies: [
          // This is a bit of a hack, in a real scenario the ID would be available
          // For now, we assume the first task's ID can be predicted or is irrelevant for the stub
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return tasks;
  }

  async prioritizeTasks(tasks: AgentTask[]): Promise<AgentTask[]> {
    // Sort by priority and dependencies
    return tasks.sort((a, b) => {
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  private generateId(): string {
    return uuidv4();
  }
}
