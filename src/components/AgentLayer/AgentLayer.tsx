'use client';

import React, { useState, useCallback, useMemo } from 'react';
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

  const planner = useMemo(() => new TaskPlanner({ maxDecompositionDepth: 3, enableSelfReflection: true, planningModel: 'gpt-4' }), []);
  const executor = useMemo(() => new ToolExecutor({ maxConcurrentTasks: 3, timeoutMs: 30000, retryAttempts: 2 }), []);
  const governor = useMemo(() => new EthicalGuardrails({ enabled: true, maxCostPerTask: 0.10, dailyBudget: 10.0, allowedTools: ['*'], contentFilter: { enabled: false, blockedCategories: [] } }), []);
  const cache = useMemo(() => new AgentCache({ enabled: true, ttlMs: 3600000, maxSize: 1000, storage: 'memory' }), []);
  const orchestrator = useMemo(() => new AgentOrchestrator({ enableParallelExecution: true, maxAgents: 5, communicationProtocol: 'direct' }), []);

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
      tasks: [],
      verifications: [],
      isRunning: true,
      error: undefined,
    }));

    try {
      const isAllowed = await governor.checkRequest(userInput);
      if (!isAllowed.allowed) {
        throw new Error(isAllowed.reason || 'Request blocked by guardrails');
      }

      // This is still a simplified flow, but it uses the real modules now.
      const initialTasks = await planner.decomposeTask(userInput);
      const prioritizedTasks = await planner.prioritizeTasks(initialTasks);

      setAgentState(prev => ({ ...prev, tasks: prioritizedTasks }));

      const { verificationResults } = await orchestrator.executeTasks(prioritizedTasks, {
        executor,
        cache,
        governor,
      });

      setAgentState(prev => ({
        ...prev,
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
        {agentState.messages.map((message, index) => (
          <div key={index} className={styles.message}>
            <div className={styles.messageRole}>{message.role}</div>
            <div className={styles.messageContent}>{message.content}</div>
          </div>
        ))}
      </div>

      <div className={styles.execution}>
        <div className={styles.tasks}>
            <h3>Tasks</h3>
            {agentState.tasks.length === 0 && <p>No tasks planned.</p>}
            {agentState.tasks.map(task => (
              <div key={task.id} className={styles.task}>
                <div className={styles.taskStatus}>{task.status}</div>
                <div className={styles.taskDescription}>{task.description}</div>
              </div>
            ))}
        </div>
        <div className={styles.verifications}>
            <h3>Verifications</h3>
            {agentState.verifications.length === 0 && <p>No claims to verify.</p>}
            {agentState.verifications.map((v, index) => (
                <div key={index} className={styles.verificationItem}>
                    <span className={v.isVerified ? styles.verified : styles.notVerified}>
                        {v.isVerified ? '✅ VERIFIED' : '❌ FAILED'}
                    </span>
                    <p><strong>Claim:</strong> &quot;{v.claim.statement}&quot;</p>
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
          Send
        </button>
      </form>
    </div>
  );
}
