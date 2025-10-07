'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CamaraPage() {
  return (
    <div className="relative w-full min-h-screen bg-camara-background-image bg-cover bg-center">
      <div className="absolute inset-0 bg-black/70" />
      <header className="relative z-10 bg-transparent">
        <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 py-4 flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                <ArrowLeft />
              </Button>
            </Link>
            <div className="flex items-center ml-4">
              <svg
                className="h-10 w-10 text-blue-300"
                viewBox="0 0 100 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              >
                <path d="M 10 10 Q 50 40 90 10" />
              </svg>
              <h1 className="text-2xl font-bold text-white ml-3">
                Câmara dos Deputados
              </h1>
            </div>
          </div>
        </div>
      </header>
      <main className="relative z-10 container mx-auto px-6 py-8 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Em Construção
          </h2>
          <p className="text-gray-300">
            Esta página está sendo desenvolvida. Em breve, você poderá explorar
            os dados da Câmara dos Deputados aqui.
          </p>
        </div>
      </main>
    </div>
  );
}
