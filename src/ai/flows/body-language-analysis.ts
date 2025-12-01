'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing body language during an interview and providing feedback.
 *
 * - bodyLanguageAnalysis - A function that analyzes body language and provides feedback.
 * - BodyLanguageAnalysisInput - The input type for the bodyLanguageAnalysis function.
 * - BodyLanguageAnalysisOutput - The return type for the bodyLanguageAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BodyLanguageAnalysisInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video recording of the interview as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  jobRole: z.string().describe('The job role the user is interviewing for.'),
  interviewType: z.string().describe('The type of interview (e.g., behavioral, technical).'),
});
export type BodyLanguageAnalysisInput = z.infer<typeof BodyLanguageAnalysisInputSchema>;

const BodyLanguageAnalysisOutputSchema = z.object({
  overallScore: z.number().describe('An overall score for the body language during the interview.'),
  feedback: z.string().describe('AI-generated feedback on the body language displayed during the interview.'),
  improvementSuggestions: z.string().describe('Personalized improvement suggestions for body language.'),
});
export type BodyLanguageAnalysisOutput = z.infer<typeof BodyLanguageAnalysisOutputSchema>;

export async function bodyLanguageAnalysis(input: BodyLanguageAnalysisInput): Promise<BodyLanguageAnalysisOutput> {
  return bodyLanguageAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bodyLanguageAnalysisPrompt',
  input: {schema: BodyLanguageAnalysisInputSchema},
  output: {schema: BodyLanguageAnalysisOutputSchema},
  prompt: `You are an AI expert in analyzing body language during job interviews. Analyze the provided video and give feedback and suggestions.

  Job Role: {{{jobRole}}}
  Interview Type: {{{interviewType}}}
  Video: {{media url=videoDataUri}}

  Provide an overall score, feedback, and improvement suggestions based on the video.
  Ensure the feedback is specific, actionable, and relevant to the job role and interview type.
`,
});

const bodyLanguageAnalysisFlow = ai.defineFlow(
  {
    name: 'bodyLanguageAnalysisFlow',
    inputSchema: BodyLanguageAnalysisInputSchema,
    outputSchema: BodyLanguageAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
