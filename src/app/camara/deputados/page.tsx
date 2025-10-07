
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Deputado = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
};

async function getDeputados(page: number = 1, items: number = 24): Promise<{deputados: Deputado[], hasNext: boolean}> {
  try {
    const response = await fetch(`https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome&pagina=${page}&itens=${items}`);
    if (!response.ok) {
      console.error('Failed to fetch deputados:', response.statusText);
      return { deputados: [], hasNext: false };
    }
    const data = await response.json();
    const hasNext = data.links.some((link: { rel: string; }) => link.rel === 'next');
    return { deputados: data.dados, hasNext };
  } catch (error) {
    console.error(error);
    return { deputados: [], hasNext: false };
  }
}

function DeputadoCard({ deputado }: { deputado: Deputado }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-2xl bg-white/10 border-white/20 text-white">
      <CardHeader className="p-0">
         <div className="relative w-full h-40">
            <Image
                src={deputado.urlFoto}
                alt={`Foto do deputado ${deputado.nome}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="bg-gray-700"
            />
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow">
        <CardTitle className="text-base font-bold">{deputado.nome}</CardTitle>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <Badge variant="secondary" className="bg-blue-200/30 text-blue-100 text-xs">{deputado.siglaPartido}</Badge>
        <span className="text-sm font-medium text-gray-300">{deputado.siglaUf}</span>
      </CardFooter>
    </Card>
  );
}

export default function DeputadosPage() {
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchDeputados = async () => {
      setLoading(true);
      const { deputados, hasNext } = await getDeputados(page);
      setDeputados(deputados);
      setHasNextPage(hasNext);
      setLoading(false);
    };

    fetchDeputados();
  }, [page]);
  
  return (
    <div className="relative w-full min-h-screen overflow-auto">
       <div className="absolute inset-0 bg-camara-background-image bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/70" />
      <header className="sticky top-0 z-20 bg-transparent">
        <div className="bg-black/20 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
             <div className="flex items-center">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white mr-4">
                    <ArrowLeft />
                    </Button>
                </Link>
                <Link href="/camara">
                    <svg
                        className="h-10 w-10 text-blue-300 cursor-pointer"
                        viewBox="0 0 100 50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                    >
                        <path d="M 10 10 Q 50 40 90 10" />
                    </svg>
                </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/camara/deputados">
                <Button variant="secondary" className="text-white bg-white/20 hover:bg-white/30">
                  <Users className="mr-2 h-4 w-4" />
                  Deputados
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="relative z-10 container mx-auto px-6 py-8 text-white">
        {loading ? (
            <div className="text-center text-white text-lg">Carregando deputados...</div>
        ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {deputados.map((deputado) => (
                      <DeputadoCard key={deputado.id} deputado={deputado} />
                  ))}
              </div>
              <div className="flex justify-center items-center mt-8 gap-4">
                <Button onClick={() => setPage(p => p - 1)} disabled={page <= 1} variant="secondary">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-lg font-semibold">{page}</span>
                <Button onClick={() => setPage(p => p + 1)} disabled={!hasNextPage} variant="secondary">
                  Próximo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
        )}
      </main>
    </div>
  );
}
