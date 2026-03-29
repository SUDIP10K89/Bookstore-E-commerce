// This is a server-side file.
'use server';

/**
 * @fileOverview Personalized book recommendations flow.
 *
 * This file defines a Genkit flow that provides personalized book recommendations
 * based on user browsing history and past purchases.
 *
 * @exports {
 *   getBookRecommendations - A function to trigger the personalized book recommendation flow.
 *   PersonalizedBookRecommendationsInput - The input type for the getBookRecommendations function.
 *   PersonalizedBookRecommendationsOutput - The output type for the getBookRecommendations function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for the personalized book recommendations flow.
const PersonalizedBookRecommendationsInputSchema = z.object({
  browsingHistory: z.array(z.string()).describe('List of book titles the user has browsed.'),
  purchaseHistory: z.array(z.string()).describe('List of book titles the user has purchased.'),
  userId: z.string().optional().describe('The ID of the user. Optional.'),
});

export type PersonalizedBookRecommendationsInput = z.infer<typeof PersonalizedBookRecommendationsInputSchema>;

// Output schema for the personalized book recommendations flow.
const PersonalizedBookRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('List of recommended book titles.'),
});

export type PersonalizedBookRecommendationsOutput = z.infer<typeof PersonalizedBookRecommendationsOutputSchema>;

/**
 * Wrapper function to trigger the personalized book recommendation flow.
 * @param input - The input data for generating personalized book recommendations.
 * @returns A promise that resolves to the personalized book recommendations.
 */
export async function getBookRecommendations(input: PersonalizedBookRecommendationsInput): Promise<PersonalizedBookRecommendationsOutput> {
  return personalizedBookRecommendationsFlow(input);
}

// Define the prompt for generating personalized book recommendations.
const personalizedBookRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedBookRecommendationsPrompt',
  input: {schema: PersonalizedBookRecommendationsInputSchema},
  output: {schema: PersonalizedBookRecommendationsOutputSchema},
  prompt: `You are a book recommendation expert. Based on the user's browsing history and past purchases, recommend books that they might be interested in. Only recommend books. Do not recommend other items.

  Browsing History: {{#if browsingHistory}}{{{browsingHistory}}}{{else}}None{{/if}}
  Purchase History: {{#if purchaseHistory}}{{{purchaseHistory}}}{{else}}None{{/if}}

  Recommendations: `,
});

// Define the Genkit flow for generating personalized book recommendations.
const personalizedBookRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedBookRecommendationsFlow',
    inputSchema: PersonalizedBookRecommendationsInputSchema,
    outputSchema: PersonalizedBookRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedBookRecommendationsPrompt(input);
    return output!;
  }
);
