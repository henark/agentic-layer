'use client';

import React, { useState, useCallback } from 'react';
import { AgentState, AgentTask } from '@/types/agent';
import { TaskPlanner } from '@/lib/agent/planner';
import { ToolExecutor } from '@/lib/agent/executor';
import { EthicalGuardrails } from '@/lib/agent/governor';
import { AgentCache } from '@/lib/agent/cache';
import { AgentOrchestrator } from '@/lib/agent/orchestrator';
import styles from './AgentLayer.module.css';

interface AgentLayerProps {
  initialConfig?: Partial<AgentState['config']>;
}

export function AgentLayer({ initialConfig }: AgentLayerProps) {
  const [agentState, setAgentState] = useState<AgentState>({
    messages: [],
    tasks: [],
    config: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      ...initialConfig,
    },
    isRunning: false,
  });

  const [userInput, setUserInput] = useState('');

  // These will be properly initialized later
  const planner = new TaskPlanner({
    maxDecompositionDepth: 3,
    enableSelfReflection: true,
    planningModel: 'gpt-4',
  });

  const executor = new ToolExecutor({
    maxConcurrentTasks: 3,
    timeoutMs: 30000,
    retryAttempts: 2,
  });

  const governor = new EthicalGuardrails({
    enabled: true,
    maxCostPerTask: 0.10,
    dailyBudget: 10.0,
    allowedTools: ['web-search', 'code-execution', 'file-operations'],
    contentFilter: {
      enabled: true,
      blockedCategories: ['hate-speech', 'violence'],
    },
  });

  const cache = new AgentCache({
    enabled: true,
    ttlMs: 3600000, // 1 hour
    maxSize: 1000,
    storage: 'memory',
  });

  const orchestrator = new AgentOrchestrator({
    enableParallelExecution: true,
    maxAgents: 5,
    communicationProtocol: 'direct',
  });

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
      isRunning: true,
    }));

    setUserInput('');

    try {
      // Check guardrails first
      const isAllowed = await governor.checkRequest(userInput);
      if (!isAllowed.allowed) {
        throw new Error(isAllowed.reason || 'Request blocked by guardrails');
      }

      // Decompose task
      const tasks = await planner.decomposeTask(userInput);
      const prioritizedTasks = await planner.prioritizeTasks(tasks);

      setAgentState(prev => ({
        ...prev,
        tasks: prioritizedTasks,
      }));

      // Execute tasks via orchestrator
      const results = await orchestrator.executeTasks(prioritizedTasks, {
        executor,
        cache,
        governor,
      });

      // Update state with results
      setAgentState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => ({
          ...task,
          status: 'completed',
          result: results[task.id],
          updatedAt: new Date(),
        })),
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
        <h2>Agentic Layer</h2>
        <div className={styles.status}>
          Status: {agentState.isRunning ? 'Running' : 'Idle'}
        </div>
      </div>

      <div className={styles.messages}>
        {agentState.messages.map(message => (
          <div key={message.id} className={styles.message}>
            <div className={styles.messageRole}>{message.role}</div>
            <div className={styles.messageContent}>{message.content}</div>
          </div>
        ))}
      </div>

      <div className={styles.tasks}>
        <h3>Tasks</h3>
        {agentState.tasks.map(task => (
          <div key={task.id} className={styles.task}>
            <div className={styles.taskStatus}>{task.status}</div>
            <div className={styles.taskDescription}>{task.description}</div>
            {task.result && (
              <div className={styles.taskResult}>
                Result: {JSON.stringify(task.result)}
              </div>
            )}
          </div>
        ))}
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
