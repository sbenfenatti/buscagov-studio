import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hub de Dados do Parlamento Brasileiro',
  description: 'Explore dados do Parlamento Brasileiro com o poder da IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
