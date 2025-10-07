'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React, { useState, useEffect } from 'react';

type Deputado = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
};

async function getDeputados() {
  try {
    const response = await fetch('https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome');
    if (!response.ok) {
      throw new Error('Failed to fetch deputados');
    }
    const data = await response.json();
    return data.dados;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function DeputadoCard({ deputado }: { deputado: Deputado }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
      <CardHeader className="p-0">
         <div className="relative w-full h-48">
            <Image
                src={deputado.urlFoto}
                alt={`Foto do deputado ${deputado.nome}`}
                fill
                style={{ objectFit: 'cover' }}
                className="bg-gray-200"
            />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold">{deputado.nome}</CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Badge variant="secondary">{deputado.siglaPartido}</Badge>
        <span className="text-sm font-medium text-gray-500">{deputado.siglaUf}</span>
      </CardFooter>
    </Card>
  );
}

export default function CamaraPage() {
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getDeputados();
      setDeputados(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
       <div className="absolute inset-0 bg-camara-background-image bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/70" />
      <header className="relative z-10 bg-transparent">
        <div className="bg-black/20 backdrop-blur-md">
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
        {loading ? (
            <div className="text-center text-white">Carregando deputados...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {deputados.map((deputado) => (
                    <DeputadoCard key={deputado.id} deputado={deputado} />
                ))}
            </div>
        )}
      </main>
    </div>
  );
}