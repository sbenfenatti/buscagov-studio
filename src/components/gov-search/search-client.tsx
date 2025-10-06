'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleSearch, type SearchResult } from '@/app/actions';
import SearchForm from './search-form';
import SearchResults from './search-results';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function SearchClient() {
  const [searchState, setSearchState] = useState<{
    isLoading: boolean;
    data?: SearchResult;
    error?: string;
  }>({
    isLoading: false,
  });
  const { toast } = useToast();

  const onSearch = async (query: string) => {
    setSearchState({ isLoading: true, error: undefined });
    const { data, error } = await handleSearch(query);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Search Error',
        description: error,
      });
      setSearchState({ isLoading: false, error });
    } else {
      setSearchState({ isLoading: false, data });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Search Government Data</CardTitle>
          <CardDescription>
            Enter a query to search for food data from public U.S. government APIs. Our AI will refine your query and summarize the results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchForm onSearch={onSearch} isLoading={searchState.isLoading} />
        </CardContent>
      </Card>

      <SearchResults
        isLoading={searchState.isLoading}
        data={searchState.data}
        error={searchState.error}
      />
    </div>
  );
}
