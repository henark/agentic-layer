import { AgentTask } from '@/types/agent';
import { OrchestratorConfig } from './types';
import { ToolExecutor } from './executor';
import { AgentCache } from './cache';
import { EthicalGuardrails } from './governor';
import { ClaimExtractor } from './extractor';
import { Verifier, VerificationResult } from './verifier';

interface ExecutionContext {
  executor: ToolExecutor;
  cache: AgentCache;
  governor: EthicalGuardrails;
}

export interface OrchestrationResult {
  taskResults: Record<string, any>;
  verificationResults: VerificationResult[];
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
  ): Promise<OrchestrationResult> {
    console.log(`Orchestrating execution of ${tasks.length} tasks.`);
    const taskResults: Record<string, any> = {};
    const verificationResults: VerificationResult[] = [];

    for (const task of tasks) {
      const taskResult = await context.executor.executeTask(task);
      taskResults[task.id] = taskResult;
      console.log(`Task ${task.id} executed with result:`, taskResult);

      const claims = await this.extractor.extract(taskResult, task);

      if (claims.length > 0) {
        console.log(`Found ${claims.length} claims to verify for task ${task.id}.`);

        for (const claim of claims) {
          const verification = await this.verifier.verify(claim);
          verificationResults.push(verification);
          console.log('Verification Result:', verification);

          if (!verification.isVerified) {
            console.error(`VERIFICATION FAILED for claim "${claim.statement}". Evidence: ${verification.evidence}`);
            task.error = `Verification failed: ${verification.evidence}`;
            task.status = 'failed';
          }
        }
      }
    }

    return { taskResults, verificationResults };
  }
}
