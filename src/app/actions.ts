'use server';

import { refineSearchQuery } from '@/ai/flows/refine-search-query';
import { summarizeSearchResults } from '@/ai/flows/summarize-search-results';
import type { SearchResponse, Food } from '@/lib/types';

const API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
const API_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

export interface SearchResult {
  summary: string;
  refinedQuery: string;
  results: Food[];
  totalHits: number;
}

export async function handleSearch(
  query: string
): Promise<{ data?: SearchResult; error?: string }> {
  if (!query) {
    return { error: 'Search query cannot be empty.' };
  }

  try {
    // 1. Refine search query with AI
    const { refinedQuery } = await refineSearchQuery({ rawQuery: query });

    // 2. Fetch data from government API
    const response = await fetch(
      `${API_URL}?query=${encodeURIComponent(refinedQuery)}&api_key=${API_KEY}&pageSize=10`
    );

    if (!response.ok) {
      console.error('API Error:', response.status, await response.text());
      return { error: `API request failed with status ${response.status}. Please try again.` };
    }

    const data: SearchResponse = await response.json();

    if (!data.foods || data.foods.length === 0) {
      return {
        data: {
          summary: "No results found for your query. Try searching for something else.",
          refinedQuery,
          results: [],
          totalHits: 0,
        },
      };
    }

    // 3. Format results for AI summary
    const resultsString = data.foods
      .map(
        (food) =>
          `- ${food.description} ${
            food.brandOwner ? `by ${food.brandOwner}` : ''
          }`
      )
      .join('\n');

    // 4. Summarize results with AI
    const { summary } = await summarizeSearchResults({
      query: refinedQuery,
      results: resultsString,
    });

    return {
      data: {
        summary,
        refinedQuery,
        results: data.foods,
        totalHits: data.totalHits,
      },
    };
  } catch (e) {
    console.error('Search failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      error: `An unexpected error occurred during the search. Details: ${errorMessage}`,
    };
  }
}
