import { Claim } from './extractor';

export interface VerificationResult {
  claim: Claim;
  isVerified: boolean;
  evidence: string;
}

export class Verifier {
  public async verify(claim: Claim): Promise<VerificationResult> {
    console.log(`Verifying claim: "${claim.statement}"`);
    switch (claim.type) {
      case 'MATH_EXPRESSION':
        return this.verifyMathExpression(claim);
      default:
        return {
          claim,
          isVerified: false,
          evidence: `Verification for type '${claim.type}' is not implemented.`,
        };
    }
  }

  private verifyMathExpression(claim: Claim): VerificationResult {
    try {
      // Sanitize the expression: replace single '=' with '===' for safe evaluation
      const expression = claim.statement.replace(/(?<!=)=(?!=)/g, '===');

      // Use a Function constructor for safer evaluation than direct eval()
      const isTrue = new Function(`return ${expression}`)();

      return {
        claim,
        isVerified: !!isTrue,
        evidence: `Expression "${expression}" evaluated to ${isTrue}.`,
      };
    } catch (error: any) {
      return {
        claim,
        isVerified: false,
        evidence: `Failed to evaluate mathematical expression: ${error.message}`,
      };
    }
  }
}
