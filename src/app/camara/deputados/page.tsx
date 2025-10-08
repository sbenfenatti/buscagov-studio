
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const mesaDiretora = {
  presidente: {
    nome: 'Arthur Lira',
    partido: 'PP',
    uf: 'AL',
    fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/204554.jpg',
    cargo: 'Presidente',
  },
  vicePresidentes: [
    { nome: 'Marcos Pereira', partido: 'Republicanos', uf: 'SP', fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/160554.jpg', cargo: '1º Vice-Presidente' },
    { nome: 'Sóstenes Cavalcante', partido: 'PL', uf: 'RJ', fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/178943.jpg', cargo: '2º Vice-Presidente' },
  ],
  secretarios: [
    { nome: 'Luciano Bivar', partido: 'União', uf: 'PE', fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/73434.jpg', cargo: '1º Secretário' },
    { nome: 'Maria do Rosário', partido: 'PT', uf: 'RS', fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/74398.jpg', cargo: '2ª Secretária' },
    { nome: 'Júlio Cesar', partido: 'PSD', uf: 'PI', fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/74825.jpg', cargo: '3º Secretário' },
    { nome: 'Lucio Mosquini', partido: 'MDB', uf: 'RO', fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/178962.jpg', cargo: '4º Secretário' },
  ],
  suplentes: [
    { nome: 'Gilberto Nascimento', partido: 'PSC', uf: 'SP', fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/178968.jpg', cargo: '1º Suplente' },
    { nome: 'Miguel Lombardi', partido: 'PL', uf: 'SP', fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/160591.jpg', cargo: '2º Suplente' },
    { nome: 'Zé Vitor', partido: 'PL', uf: 'MG', fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/204459.jpg', cargo: '3º Suplente' },
    { nome: 'Delegado Palumbo', partido: 'MDB', uf: 'SP', fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/220552.jpg', cargo: '4º Suplente' },
  ],
};

type DeputadoCardProps = {
  nome: string;
  partido: string;
  uf: string;
  fotoUrl: string;
  cargo: string;
  size?: 'large' | 'medium' | 'small';
};

const DeputadoCard = ({ nome, partido, uf, fotoUrl, cargo, size = 'medium' }: DeputadoCardProps) => {
  const cardSize = {
    large: 'w-full max-w-sm',
    medium: 'w-full max-w-[280px]',
    small: 'w-full max-w-[240px]',
  };
  const imageSize = {
    large: { width: 160, height: 160 },
    medium: { width: 128, height: 128 },
    small: { width: 96, height: 96 },
  };

  return (
    <Card className={`bg-black/20 border-white/20 text-white text-center transform transition-transform duration-300 hover:scale-105 hover:bg-black/40 ${cardSize[size]}`}>
      <CardContent className="p-6 flex flex-col items-center">
        <Image
          src={fotoUrl}
          alt={`Foto de ${nome}`}
          width={imageSize[size].width}
          height={imageSize[size].height}
          className="rounded-full border-4 border-white/50 mb-4"
        />
        <h3 className={`font-bold ${size === 'large' ? 'text-2xl' : 'text-xl'}`}>{nome}</h3>
        <p className="text-gray-300 text-sm">{`${partido}-${uf}`}</p>
        <Badge variant="secondary" className="mt-4 bg-blue-300/20 text-blue-100">{cargo}</Badge>
      </CardContent>
    </Card>
  );
};


export default function DeputadosPage() {
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
      <main className="relative z-10 container mx-auto px-6 py-12 text-white">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-4"><Shield size={36} /> Mesa Diretora</h1>
            <p className="text-lg mt-4 text-gray-300 max-w-2xl mx-auto">A Mesa Diretora é responsável pela direção dos trabalhos legislativos e dos serviços administrativos da Câmara dos Deputados.</p>
        </div>

        {/* Presidente */}
        <div className="flex justify-center mb-8">
            <DeputadoCard {...mesaDiretora.presidente} size="large" />
        </div>

        {/* Vice-Presidentes */}
        <div className="flex justify-center flex-wrap gap-8 mb-10">
            {mesaDiretora.vicePresidentes.map(dep => <DeputadoCard key={dep.nome} {...dep} size="medium" />)}
        </div>
        
        <Separator className="bg-white/20 my-12" />

        {/* Secretários */}
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Secretaria</h2>
        </div>
        <div className="flex justify-center flex-wrap gap-6 mb-10">
            {mesaDiretora.secretarios.map(dep => <DeputadoCard key={dep.nome} {...dep} size="small" />)}
        </div>
        
        {/* Suplentes */}
        <div className="flex justify-center flex-wrap gap-6">
            {mesaDiretora.suplentes.map(dep => <DeputadoCard key={dep.nome} {...dep} size="small" />)}
        </div>
      </main>
    </div>
  );
}
