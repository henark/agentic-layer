export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  dependencies?: string[];
  result?: any;
  error?: string;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  tools?: AgentTool[];
  guardrails?: {
    maxCost?: number;
    allowedOperations?: string[];
    blockedContent?: string[];
  };
}

export interface AgentState {
  messages: AgentMessage[];
  tasks: AgentTask[];
  config: AgentConfig;
  isRunning: boolean;
  error?: string;
}
