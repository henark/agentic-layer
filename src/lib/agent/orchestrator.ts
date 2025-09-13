import { AgentTask } from '@/types/agent';
import { OrchestratorConfig } from './types';
import { ToolExecutor } from './executor';
import { AgentCache } from './cache';
import { EthicalGuardrails } from './governor';
import { ClaimExtractor } from './extractor';
import { Verifier } from './verifier';

interface ExecutionContext {
  executor: ToolExecutor;
  cache: AgentCache;
  governor: EthicalGuardrails;
}

export class AgentOrchestrator {
  private config: OrchestratorConfig;
  private extractor: ClaimExtractor;
  private verifier: Verifier;

  constructor(config: OrchestratorConfig) {
    this.config = config;
    this.extractor = new ClaimExtractor();
    this.verifier = new Verifier();
    console.log('AgentOrchestrator initialized with config:', config);
  }

  async executeTasks(
    tasks: AgentTask[],
    context: ExecutionContext
  ): Promise<Record<string, any>> {
    console.log(`Orchestrating execution of ${tasks.length} tasks.`);
    const results: Record<string, any> = {};

    for (const task of tasks) {
      // 1. Execute the task
      const taskResult = await context.executor.executeTask(task);
      results[task.id] = taskResult;
      console.log(`Task ${task.id} executed with result:`, taskResult);

      // 2. Extract claims from the result
      const claims = await this.extractor.extract(taskResult, task);

      if (claims.length > 0) {
        console.log(`Found ${claims.length} claims to verify for task ${task.id}.`);

        // 3. Verify each claim
        for (const claim of claims) {
          const verificationResult = await this.verifier.verify(claim);
          console.log('Verification Result:', verificationResult);

          // 4. Handle verification failure (simple log for now)
          if (!verificationResult.isVerified) {
            console.error(`VERIFICATION FAILED for claim "${claim.statement}". Evidence: ${verificationResult.evidence}`);
            // In a real system, this would trigger a replan or other corrective action.
            task.error = `Verification failed: ${verificationResult.evidence}`;
            task.status = 'failed';
          }
        }
      }
    }

    return results;
  }
}
