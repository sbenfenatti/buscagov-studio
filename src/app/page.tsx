import AppLayout from '@/components/gov-search/app-layout';
import SearchClient from '@/components/gov-search/search-client';

export default function Home() {
  return (
    <AppLayout>
      <SearchClient />
    </AppLayout>
  );
}
