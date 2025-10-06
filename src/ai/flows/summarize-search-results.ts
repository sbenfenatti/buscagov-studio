'use server';

/**
 * @fileOverview Summarizes search results using AI to provide key information quickly.
 *
 * - summarizeSearchResults - A function that summarizes search results.
 * - SummarizeSearchResultsInput - The input type for the summarizeSearchResults function.
 * - SummarizeSearchResultsOutput - The return type for the summarizeSearchResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSearchResultsInputSchema = z.object({
  query: z.string().describe('The original search query.'),
  results: z.string().describe('The search results to summarize.'),
});
export type SummarizeSearchResultsInput = z.infer<typeof SummarizeSearchResultsInputSchema>;

const SummarizeSearchResultsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the search results.'),
});
export type SummarizeSearchResultsOutput = z.infer<typeof SummarizeSearchResultsOutputSchema>;

export async function summarizeSearchResults(input: SummarizeSearchResultsInput): Promise<SummarizeSearchResultsOutput> {
  return summarizeSearchResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSearchResultsPrompt',
  input: {schema: SummarizeSearchResultsInputSchema},
  output: {schema: SummarizeSearchResultsOutputSchema},
  prompt: `Summarize the following search results for the query "{{query}}".\n\nSearch Results:\n{{results}}\n\nSummary: `,
});

const summarizeSearchResultsFlow = ai.defineFlow(
  {
    name: 'summarizeSearchResultsFlow',
    inputSchema: SummarizeSearchResultsInputSchema,
    outputSchema: SummarizeSearchResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
