'use server';

/**
 * @fileOverview Provides confidence-boosting content from an AI coach.
 *
 * - generatePepTalk - Generates a motivational pep talk.
 * - GeneratePepTalkInput - The input type for the generatePepTalk function.
 * - GeneratePepTalkOutput - The return type for the generatePepTalk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePepTalkInputSchema = z.object({
  topic: z.string().describe('The topic for the pep talk (e.g., "self-doubt", "pre-interview nerves").'),
  jobRole: z.string().optional().describe('The user\'s target job role.'),
});
export type GeneratePepTalkInput = z.infer<typeof GeneratePepTalkInputSchema>;

const GeneratePepTalkOutputSchema = z.object({
  pepTalk: z.string().describe('A motivational and encouraging pep talk.'),
});
export type GeneratePepTalkOutput = z.infer<typeof GeneratePepTalkOutputSchema>;

export async function generatePepTalk(
  input: GeneratePepTalkInput
): Promise<GeneratePepTalkOutput> {
  return confidenceCoachFlow(input);
}

const confidenceCoachPrompt = ai.definePrompt({
  name: 'confidenceCoachPrompt',
  input: {schema: GeneratePepTalkInputSchema},
  output: {schema: GeneratePepTalkOutputSchema},
  prompt: `You are an AI Confidence Coach. Your goal is to provide a user with a powerful, uplifting, and motivational pep talk to boost their confidence.

The user is looking for encouragement about: {{{topic}}}.
{{#if jobRole}}They are preparing for a job as a {{{jobRole}}}. Tailor the message to be relevant to this role.{{/if}}

Generate a short, impactful pep talk. Focus on empowerment, acknowledging their strengths, and helping them overcome their concerns. Use a supportive and inspiring tone.
`,
});

const confidenceCoachFlow = ai.defineFlow(
  {
    name: 'confidenceCoachFlow',
    inputSchema: GeneratePepTalkInputSchema,
    outputSchema: GeneratePepTalkOutputSchema,
  },
  async input => {
    const {output} = await confidenceCoachPrompt(input);
    return output!;
  }
);
