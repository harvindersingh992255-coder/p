'use server';

/**
 * @fileOverview AI-powered interview question generator.
 *
 * - generateInterviewQuestions - A function that generates interview questions based on job role and industry.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  jobRole: z.string().describe('The job role for which interview questions should be generated.'),
  industry: z.string().describe('The industry related to the job role.'),
  numQuestions: z.number().default(5).describe('The number of interview questions to generate.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of generated interview questions.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const generateInterviewQuestionsPrompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an expert career coach helping candidates prepare for job interviews.
  Generate {{numQuestions}} interview questions for the following job role and industry:

  Job Role: {{{jobRole}}}
  Industry: {{{industry}}}

  The questions should be relevant to the job role and industry, and should cover a range of topics, including:

  - Behavioral questions
  - Technical questions
  - Situational questions
  - Questions about the company

  Format the questions as a numbered list.
`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateInterviewQuestionsPrompt(input);
    return output!;
  }
);
