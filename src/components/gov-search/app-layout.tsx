import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/gov-search/sidebar';
import Header from '@/components/gov-search/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
