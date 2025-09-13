import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function callAnthropic(prompt: string) {
  const response = await anthropic.messages.create({
    model: 'claude-2',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  return response.content;
}
