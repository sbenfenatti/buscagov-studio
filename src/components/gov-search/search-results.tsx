import type { SearchResult } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal, Search } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

type SearchResultsProps = {
  isLoading: boolean;
  data?: SearchResult;
  error?: string;
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InitialState() {
    return (
        <div className="text-center py-16">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Ready to search</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Your search results will appear here.
            </p>
        </div>
    );
}

export default function SearchResults({ isLoading, data, error }: SearchResultsProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return <InitialState />;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>AI-Powered Summary</CardTitle>
          <CardDescription>
            This is a summary of the top results for your refined query: <Badge variant="secondary">{data.refinedQuery}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{data.summary}</p>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Found {data.totalHits} total results.</p>
        </CardFooter>
      </Card>
      
      {data.results.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {data.results.map((food, index) => (
            <AccordionItem value={`item-${index}`} key={food.fdcId} className="border-b-0">
              <Card className="mb-2 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="p-6 text-left hover:no-underline">
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{food.description}</h3>
                        {food.brandOwner && <p className="text-sm text-muted-foreground">{food.brandOwner}</p>}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {food.ingredients && (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <h4 className="font-medium">Ingredients:</h4>
                      <p className="text-muted-foreground">{food.ingredients}</p>
                    </div>
                  )}
                  {!food.ingredients && <p className="text-sm text-muted-foreground">No ingredient information available.</p>}
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
            <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No foods found that match your query.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
