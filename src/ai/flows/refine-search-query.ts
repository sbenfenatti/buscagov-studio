'use server';
/**
 * @fileOverview This file defines a Genkit flow for refining search queries to improve the accuracy
 * and relevance of search results from government APIs.
 *
 * - refineSearchQuery - An async function that takes a raw search query and refines it using AI.
 * - RefineSearchQueryInput - The input type for the refineSearchQuery function.
 * - RefineSearchQueryOutput - The output type for the refineSearchQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineSearchQueryInputSchema = z.object({
  rawQuery: z.string().describe('The original, unrefined search query entered by the user.'),
});
export type RefineSearchQueryInput = z.infer<typeof RefineSearchQueryInputSchema>;

const RefineSearchQueryOutputSchema = z.object({
  refinedQuery: z.string().describe('The AI-refined search query, optimized for government APIs.'),
});
export type RefineSearchQueryOutput = z.infer<typeof RefineSearchQueryOutputSchema>;

export async function refineSearchQuery(input: RefineSearchQueryInput): Promise<RefineSearchQueryOutput> {
  return refineSearchQueryFlow(input);
}

const refineSearchQueryPrompt = ai.definePrompt({
  name: 'refineSearchQueryPrompt',
  input: {schema: RefineSearchQueryInputSchema},
  output: {schema: RefineSearchQueryOutputSchema},
  prompt: `You are an AI assistant designed to refine search queries for optimal results from government APIs.

  The user has provided the following raw search query:
  """{{rawQuery}}"""

  Please analyze the query and refine it to be more specific, accurate, and relevant to government data.
  Consider using synonyms, expanding abbreviations, and adding relevant keywords.
  The refined query should be suitable for direct use with government API search endpoints.
  Return only refined query.`,
});

const refineSearchQueryFlow = ai.defineFlow(
  {
    name: 'refineSearchQueryFlow',
    inputSchema: RefineSearchQueryInputSchema,
    outputSchema: RefineSearchQueryOutputSchema,
  },
  async input => {
    const {output} = await refineSearchQueryPrompt(input);
    return output!;
  }
);
