import { AgentTask } from '@/types/agent';

export interface Claim {
  statement: string;
  type: 'MATH_EXPRESSION';
  sourceTaskId: string;
}

export class ClaimExtractor {
  public async extract(taskResult: any, sourceTask: AgentTask): Promise<Claim[]> {
    const claims: Claim[] = [];

    if (taskResult && typeof taskResult.output === 'string') {
      // Regex to find simple mathematical claims like "2 + 2 = 4"
      const mathRegex = /(\d+\s*[\+\-\*\/]\s*\d+\s*==?\s*\d+)/g;
      const matches = taskResult.output.match(mathRegex);

      if (matches) {
        for (const match of matches) {
          claims.push({
            statement: match,
            type: 'MATH_EXPRESSION',
            sourceTaskId: sourceTask.id,
          });
          console.log(`Extracted Claim: "${match}" from task ${sourceTask.id}`);
        }
      }
    }

    return claims;
  }
}
