'use server';

/**
 * @fileOverview Provides personalized practice recommendations based on user interview performance and career goals.
 *
 * - generatePersonalizedRecommendations - A function that generates personalized practice recommendations.
 * - PersonalizedRecommendationsInput - The input type for the generatePersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the generatePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  interviewPerformance: z
    .string()
    .describe("A summary of the user's interview performance, including strengths and weaknesses."),
  careerGoals: z.string().describe('The user’s stated career goals and target roles.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of personalized practice recommendations, including specific question types, resources, and areas for improvement.'
    ),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function generatePersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `Based on the user's interview performance and career goals, provide personalized practice recommendations.

Interview Performance: {{{interviewPerformance}}}
Career Goals: {{{careerGoals}}}

Recommendations:`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
