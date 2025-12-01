'use server';

/**
 * @fileOverview An AI-powered resume builder assistant.
 *
 * - buildResume - A function that generates or improves a resume.
 * - BuildResumeInput - The input type for the buildResume function.
 * - BuildResumeOutput - The return type for the buildResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BuildResumeInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the current resume, or key points like skills and experience.'),
  jobDescription: z.string().optional().describe('An optional job description to tailor the resume for.'),
});
export type BuildResumeInput = z.infer<typeof BuildResumeInputSchema>;

const BuildResumeOutputSchema = z.object({
  improvedVersion: z.string().describe('A professionally rewritten and formatted version of the resume.'),
});
export type BuildResumeOutput = z.infer<typeof BuildResumeOutputSchema>;

export async function buildResume(input: BuildResumeInput): Promise<BuildResumeOutput> {
  return resumeBuilderFlow(input);
}

const resumeBuilderPrompt = ai.definePrompt({
  name: 'resumeBuilderPrompt',
  input: {schema: BuildResumeInputSchema},
  output: {schema: BuildResumeOutputSchema},
  prompt: `You are an expert career coach and professional resume writer. Your task is to rewrite the provided resume content into a polished, professional, and impactful new version.

  Input Content (could be a full resume or just notes):
  ---
  {{{resumeText}}}
  ---
  
  {{#if jobDescription}}
  The user is targeting the following job. Tailor the rewritten resume to be a strong match for this job description, using relevant keywords and highlighting the most important skills and experiences.
  Job Description:
  ---
  {{{jobDescription}}}
  ---
  {{/if}}

  Your task is to generate a new, improved version of the resume. 
  - Structure it logically with clear sections (e.g., Summary, Experience, Education, Skills).
  - Use strong action verbs to start bullet points.
  - Quantify achievements wherever possible (e.g., "Increased sales by 15%" instead of "Responsible for sales").
  - Ensure the formatting is clean, modern, and easy to read.
  - Correct any grammatical errors or typos.
  - Optimize for applicant tracking systems (ATS) by including relevant keywords from the job description if provided.

  Produce only the rewritten resume text in the 'improvedVersion' field.
  `,
});

const resumeBuilderFlow = ai.defineFlow(
  {
    name: 'resumeBuilderFlow',
    inputSchema: BuildResumeInputSchema,
    outputSchema: BuildResumeOutputSchema,
  },
  async input => {
    const {output} = await resumeBuilderPrompt(input);
    return output!;
  }
);
