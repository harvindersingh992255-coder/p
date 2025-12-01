'use server';

/**
 * @fileOverview An AI-powered resume analyzer and builder assistant.
 *
 * - analyzeResume - A function that analyzes a resume and provides feedback.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the resume.'),
  jobDescription: z.string().optional().describe('An optional job description to compare against.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  overallScore: z.number().describe('An overall score for the resume (0-100).'),
  feedback: z.string().describe('A summary of the strengths and weaknesses of the resume.'),
  suggestions: z
    .array(z.string())
    .describe('A list of specific, actionable suggestions for improving the resume.'),
  improvedVersion: z.string().describe('An improved version of the resume text based on the suggestions.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return resumeAnalysisFlow(input);
}

const resumeAnalysisPrompt = ai.definePrompt({
  name: 'resumeAnalysisPrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert career coach and resume writer. Analyze the following resume text.
  
  {{#if jobDescription}}
  The user is targeting the following job:
  ---
  {{{jobDescription}}}
  ---
  Tailor your analysis to how well the resume matches this job description.
  {{/if}}

  Resume Content:
  ---
  {{{resumeText}}}
  ---

  Provide the following analysis:
  1.  An overall score (0-100) for the resume.
  2.  Constructive feedback summarizing its strengths and weaknesses.
  3.  A list of actionable suggestions for improvement.
  4.  A rewritten, improved version of the resume text that incorporates your suggestions.

  Focus on clarity, impact, use of action verbs, and keyword optimization.
  `,
});

const resumeAnalysisFlow = ai.defineFlow(
  {
    name: 'resumeAnalysisFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await resumeAnalysisPrompt(input);
    return output!;
  }
);
