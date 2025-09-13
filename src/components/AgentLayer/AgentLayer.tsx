'use client';

import React, { useState, useCallback } from 'react';
import { AgentState, AgentTask } from '@/types/agent';
import { TaskPlanner } from '@/lib/agent/planner';
import { ToolExecutor } from '@/lib/agent/executor';
import { EthicalGuardrails } from '@/lib/agent/governor';
import { AgentCache } from '@/lib/agent/cache';
import { AgentOrchestrator } from '@/lib/agent/orchestrator';
import { VerificationResult } from '@/lib/agent/verifier';
import styles from './AgentLayer.module.css';

interface AgentLayerProps {
  initialConfig?: Partial<AgentState['config']>;
}

// Extend component state to include verification results
interface ComponentState extends AgentState {
  verifications: VerificationResult[];
}

export function AgentLayer({ initialConfig }: AgentLayerProps) {
  const [agentState, setAgentState] = useState<ComponentState>({
    messages: [],
    tasks: [],
    verifications: [],
    config: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      ...initialConfig,
    },
    isRunning: false,
  });

  const [userInput, setUserInput] = useState('');

  // These instances are created for the component's lifecycle
  const [planner] = useState(() => new TaskPlanner({ maxDecompositionDepth: 3, enableSelfReflection: true, planningModel: 'gpt-4' }));
  const [executor] = useState(() => new ToolExecutor({ maxConcurrentTasks: 3, timeoutMs: 30000, retryAttempts: 2 }));
  const [governor] = useState(() => new EthicalGuardrails({ enabled: true, maxCostPerTask: 0.10, dailyBudget: 10.0, allowedTools: ['*'], contentFilter: { enabled: false, blockedCategories: [] } }));
  const [cache] = useState(() => new AgentCache({ enabled: true, ttlMs: 3600000, maxSize: 1000, storage: 'memory' }));
  const [orchestrator] = useState(() => new AgentOrchestrator({ enableParallelExecution: true, maxAgents: 5, communicationProtocol: 'direct' }));

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user' as const,
      content: userInput,
      timestamp: new Date(),
    };

    setAgentState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      tasks: [], // Reset tasks for new input
      verifications: [], // Reset verifications
      isRunning: true,
      error: undefined,
    }));

    // This is a mock execution flow for demonstration
    // In a real app, this would be more complex
    const mockTask = {
        id: 'mock_task_1',
        description: `Simulate execution for: ${userInput}`,
        status: 'pending',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date(),
    } as AgentTask;

    const mockTaskResult = {
        output: `The result of the task is: 2 + 2 = 4 and 3 * 5 = 15. Also, 10 - 2 = 7 is incorrect.`
    };

    try {
        const claims = await orchestrator['extractor'].extract(mockTaskResult, mockTask);
        const verificationResults: VerificationResult[] = [];
        for (const claim of claims) {
            const result = await orchestrator['verifier'].verify(claim);
            verificationResults.push(result);
        }

        setAgentState(prev => ({
            ...prev,
            tasks: [mockTask],
            verifications: verificationResults,
            isRunning: false,
        }));

    } catch (error) {
      setAgentState(prev => ({
        ...prev,
        isRunning: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }

  }, [userInput, planner, executor, governor, cache, orchestrator]);

  return (
    <div className={styles.agentLayer}>
      <div className={styles.header}>
        <h2>Agentic Layer with Verification</h2>
        <div className={styles.status}>
          Status: {agentState.isRunning ? 'Running' : 'Idle'}
        </div>
      </div>

      <div className={styles.messages}>
        {/* Messages rendering... */}
      </div>

      <div className={styles.execution}>
        <div className={styles.tasks}>
            <h3>Tasks</h3>
            {/* Tasks rendering... */}
        </div>
        <div className={styles.verifications}>
            <h3>Verifications</h3>
            {agentState.verifications.length === 0 && <p>No claims to verify.</p>}
            {agentState.verifications.map((v, index) => (
                <div key={index} className={styles.verificationItem}>
                    <span className={v.isVerified ? styles.verified : styles.notVerified}>
                        {v.isVerified ? '✅ VERIFIED' : '❌ FAILED'}
                    </span>
                    <p><strong>Claim:</strong> "{v.claim.statement}"</p>
                    <p><strong>Evidence:</strong> {v.evidence}</p>
                </div>
            ))}
        </div>
      </div>

      {agentState.error && (
        <div className={styles.error}>
          Error: {agentState.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your request..."
          disabled={agentState.isRunning}
          className={styles.input}
        />
        <button
          type="submit"
          disabled={agentState.isRunning || !userInput.trim()}
          className={styles.submitButton}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
