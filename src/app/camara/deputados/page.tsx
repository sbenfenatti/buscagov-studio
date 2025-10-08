
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield, Crown, Group, ClipboardList, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';


type DeputadoMesa = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  titulo: string; // O cargo, ex: 'Presidente'
};

// Função para retornar dados simulados da Mesa Diretora
function getMesaDiretoraSimulada(): DeputadoMesa[] {
    const deputados: Omit<DeputadoMesa, 'id' | 'urlFoto'>[] = [
        { nome: 'Arthur Lira', siglaPartido: 'PP', siglaUf: 'AL', titulo: 'Presidente' },
        { nome: 'Marcos Pereira', siglaPartido: 'Republicanos', siglaUf: 'SP', titulo: '1º Vice-Presidente' },
        { nome: 'Sóstenes Cavalcante', siglaPartido: 'PL', siglaUf: 'RJ', titulo: '2º Vice-Presidente' },
        { nome: 'Luciano Bivar', siglaPartido: 'União', siglaUf: 'PE', titulo: '1º Secretário' },
        { nome: 'Maria do Rosário', siglaPartido: 'PT', siglaUf: 'RS', titulo: '2º Secretária' },
        { nome: 'Júlio Cesar', siglaPartido: 'PSD', siglaUf: 'PI', titulo: '3º Secretário' },
        { nome: 'Lúcio Mosquini', siglaPartido: 'MDB', siglaUf: 'RO', titulo: '4º Secretário' },
        { nome: 'Gilberto Nascimento', siglaPartido: 'PSC', siglaUf: 'SP', titulo: '1º Suplente' },
        { nome: 'Jeferson Rodrigues', siglaPartido: 'Republicanos', siglaUf: 'GO', titulo: '2º Suplente' },
        { nome: 'Roberto Monteiro', siglaPartido: 'PL', siglaUf: 'RJ', titulo: '3º Suplente' },
        { nome: 'André Ferreira', siglaPartido: 'PL', siglaUf: 'PE', titulo: '4º Suplente' },
    ];

    return deputados.map((dep, index) => ({
        ...dep,
        id: 204554 + index, // Ids fictícios
        urlFoto: `https://www.camara.leg.br/internet/deputado/bandep/${204554 + index}.jpg`,
    }));
}

const MemberCard = ({ dep }: { dep: DeputadoMesa }) => (
    <Card className="bg-black/40 border-white/20 text-white w-full max-w-xs transform transition-transform hover:scale-105 hover:bg-black/60">
        <CardContent className="flex flex-col items-center text-center p-6">
            <Image 
                src={dep.urlFoto} 
                alt={`Foto de ${dep.nome}`}
                width={100}
                height={100}
                className="rounded-full border-4 border-white/30 mb-4 shadow-lg"
            />
            <h3 className="font-bold text-xl">{dep.nome}</h3>
            <p className="text-md text-gray-300">{`${dep.siglaPartido}-${dep.siglaUf}`}</p>
            <Badge variant="secondary" className="mt-3 bg-blue-300/20 text-blue-100 text-sm">{dep.titulo}</Badge>
        </CardContent>
    </Card>
);


const timelineItemsConfig = [
    { key: "presidente", title: "Presidência", icon: Crown },
    { key: "vices", title: "Vice-Presidência", icon: Shield },
    { key: "secretarios", title: "Secretaria", icon: ClipboardList },
    { key: "suplentes", title: "Suplência", icon: Group },
];

export default function DeputadosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const mesaDiretora = getMesaDiretoraSimulada();

  const presidente = mesaDiretora.filter(m => m.titulo === 'Presidente');
  const vices = mesaDiretora.filter(m => m.titulo.includes('Vice-Presidente'));
  const secretarios = mesaDiretora.filter(m => m.titulo.includes('Secretári'));
  const suplentes = mesaDiretora.filter(m => m.titulo.includes('Suplente'));
  
  const categoryMembers: Record<string, DeputadoMesa[]> = {
    presidente,
    vices,
    secretarios,
    suplentes,
  };

  const currentMembers = selectedCategory ? categoryMembers[selectedCategory] : [];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">
      <div className="absolute inset-0 bg-camara-background-image bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      
      <header className="sticky top-0 z-30 bg-transparent">
        <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
             <div className="flex items-center">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white mr-4">
                        <ArrowLeft />
                    </Button>
                </Link>
                <Link href="/camara">
                    <svg
                        className="h-10 w-10 text-blue-400 cursor-pointer"
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
         <div className="text-center mb-16">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-4"><Shield size={36} /> Mesa Diretora</h1>
            <p className="text-lg mt-4 text-gray-300 max-w-2xl mx-auto">A Mesa Diretora é o órgão que dirige os trabalhos da Câmara. Selecione uma categoria para ver seus membros.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 min-h-[50vh]">
            {/* Vertical Timeline Navigation */}
            <div className="relative flex md:flex-col justify-center items-center md:items-start md:w-20">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/20 md:top-0 md:left-1/2 md:w-0.5 md:h-full" />
                
                {timelineItemsConfig.map((item, index) => {
                    const isSelected = selectedCategory === item.key;
                    return (
                        <div key={item.key} className="relative z-10 flex-1 flex justify-center">
                            <button 
                                onClick={() => setSelectedCategory(item.key)}
                                className={cn(
                                    "w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 transform hover:scale-110",
                                    isSelected 
                                      ? "bg-blue-400 text-black border-black/50" 
                                      : "bg-gray-700 text-gray-300 border-black/50 hover:bg-gray-600"
                                )}
                                aria-label={`Ver ${item.title}`}
                            >
                               <item.icon className="h-6 w-6" />
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center p-4">
                {currentMembers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentMembers.map(dep => <MemberCard key={dep.id} dep={dep} />)}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 flex flex-col items-center">
                        <Info className="w-16 h-16 mb-4"/>
                        <h2 className="text-2xl font-bold">Selecione uma categoria</h2>
                        <p className="max-w-sm mt-2">Clique em um dos ícones à esquerda para visualizar os membros correspondentes da Mesa Diretora.</p>
                    </div>
                )}
            </div>
        </div>

      </main>
    </div>
  );
}
