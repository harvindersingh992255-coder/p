'use server';

/**
 * @fileOverview An AI-powered resume analyzer.
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
  overallScore: z.number().describe('An overall score for the resume (0-100), based on keyword alignment, clarity, and impact.'),
  strengths: z.string().describe('A summary of the strengths of the resume.'),
  weaknesses: z.string().describe('A summary of the weaknesses of the resume.'),
  suggestions: z
    .array(z.string())
    .describe('A list of specific, actionable suggestions for improving the resume.'),
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
  2.  A summary of its strengths and weaknesses.
  3.  A list of actionable suggestions for improvement.

  Focus on clarity, impact, use of action verbs, and keyword optimization. Do not rewrite the resume.
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
