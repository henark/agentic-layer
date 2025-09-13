import { AgentTask, AgentTool, AgentConfig } from '@/types/agent';

export interface PlannerConfig {
  maxDecompositionDepth: number;
  enableSelfReflection: boolean;
  planningModel: string;
}

export interface ExecutorConfig {
  maxConcurrentTasks: number;
  timeoutMs: number;
  retryAttempts: number;
}

export interface GovernorConfig {
  enabled: boolean;
  maxCostPerTask: number;
  dailyBudget: number;
  allowedTools: string[];
  contentFilter: {
    enabled: boolean;
    blockedCategories: string[];
  };
}

export interface CacheConfig {
  enabled: boolean;
  ttlMs: number;
  maxSize: number;
  storage: 'memory' | 'redis' | 'file';
}

export interface OrchestratorConfig {
  enableParallelExecution: boolean;
  maxAgents: number;
  communicationProtocol: 'pubsub' | 'direct' | 'queue';
}
