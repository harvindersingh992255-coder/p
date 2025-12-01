'use server';

/**
 * @fileOverview Provides AI-generated feedback on interview responses, including scoring and personalized improvement suggestions.
 *
 * - analyzeInterviewResponse - A function that analyzes interview responses and provides feedback.
 * - AnalyzeInterviewResponseInput - The input type for the analyzeInterviewResponse function.
 * - AnalyzeInterviewResponseOutput - The return type for the analyzeInterviewResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInterviewResponseInputSchema = z.object({
  jobRole: z.string().describe('The job role for which the interview is being conducted.'),
  industry: z.string().describe('The industry of the job.'),
  question: z.string().describe('The interview question asked.'),
  response: z.string().describe('The candidate\'s response to the interview question.'),
  transcript: z.string().optional().describe('Optional full transcript of the interview.'),
});
export type AnalyzeInterviewResponseInput = z.infer<
  typeof AnalyzeInterviewResponseInputSchema
>;

const AnalyzeInterviewResponseOutputSchema = z.object({
  score: z.number().describe('An overall score for the response (0-100).'),
  strengths: z.string().describe('A summary of the candidate\'s strengths in the response.'),
  weaknesses: z.string().describe('A summary of the candidate\'s weaknesses in the response.'),
  improvementSuggestions: z
    .string()
    .describe('Specific, actionable suggestions for improving the response.'),
  bodyLanguageFeedback: z
    .string()
    .optional()
    .describe('Optional feedback on the candidate\'s body language, if available.'),
});

export type AnalyzeInterviewResponseOutput = z.infer<
  typeof AnalyzeInterviewResponseOutputSchema
>;

export async function analyzeInterviewResponse(
  input: AnalyzeInterviewResponseInput
): Promise<AnalyzeInterviewResponseOutput> {
  return analyzeInterviewResponseFlow(input);
}

const analyzeInterviewResponsePrompt = ai.definePrompt({
  name: 'analyzeInterviewResponsePrompt',
  input: {schema: AnalyzeInterviewResponseInputSchema},
  output: {schema: AnalyzeInterviewResponseOutputSchema},
  prompt: `You are an AI-powered interview coach providing feedback on a candidate's response to an interview question.

  Job Role: {{{jobRole}}}
  Industry: {{{industry}}}
  Question: {{{question}}}
  Response: {{{response}}}

  Analyze the response and provide the following:

  1.  A score (0-100) reflecting the overall quality of the response.
  2.  A summary of the candidate's strengths.
  3.  A summary of the candidate's weaknesses.
  4.  Specific, actionable suggestions for improving the response.

  {% if transcript %} Full Interview Transcript: {{{transcript}}} {% endif %}

  Focus on content, clarity, and relevance to the job role and industry.  If the full interview transcript is provided, also incorporate how this response fits into the larger interview context.

  Ensure that all fields in the output schema are populated.
  `,
});

const analyzeInterviewResponseFlow = ai.defineFlow(
  {
    name: 'analyzeInterviewResponseFlow',
    inputSchema: AnalyzeInterviewResponseInputSchema,
    outputSchema: AnalyzeInterviewResponseOutputSchema,
  },
  async input => {
    const {output} = await analyzeInterviewResponsePrompt(input);
    return output!;
  }
);
