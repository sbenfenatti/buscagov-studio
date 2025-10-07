import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CamaraPage() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <div className="flex items-center ml-4">
            <svg
              className="h-10 w-10 text-blue-800"
              viewBox="0 0 100 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path d="M 10 10 Q 50 40 90 10" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 ml-3">
              Câmara dos Deputados
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            Em Construção
          </h2>
          <p className="text-gray-600">
            Esta página está sendo desenvolvida. Em breve, você poderá explorar
            os dados da Câmara dos Deputados aqui.
          </p>
        </div>
      </main>
    </div>
  );
}
