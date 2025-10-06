'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

const formSchema = z.object({
  query: z.string().min(3, { message: 'Search query must be at least 3 characters long.' }),
});

type SearchFormProps = {
  onSearch: (query: string) => void;
  isLoading: boolean;
};

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSearch(values.query);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input
                    placeholder="e.g., 'organic kale', 'low sodium cheese', 'avocado toast'"
                    className="pl-10 text-base"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Search
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
