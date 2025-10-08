
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield, Crown, User, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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

const MemberInfo = ({ dep }: { dep: DeputadoMesa }) => (
    <div className="flex flex-col items-center text-center p-2">
        <Image 
            src={dep.urlFoto} 
            alt={`Foto de ${dep.nome}`}
            width={80}
            height={80}
            className="rounded-full border-2 border-white/50 mb-3"
        />
        <h3 className="font-bold text-md">{dep.nome}</h3>
        <p className="text-xs text-gray-300">{`${dep.siglaPartido}-${dep.siglaUf}`}</p>
        <Badge variant="secondary" className="mt-2 bg-blue-300/20 text-blue-100 text-xs">{dep.titulo}</Badge>
    </div>
);

const TimelineItem = ({ value, title, description, members, icon: Icon, side }: { value: string, title: string, description: string, members: DeputadoMesa[], icon: React.ElementType, side: 'left' | 'right' }) => {
    if (!members || members.length === 0) return null;

    return (
        <div className="relative w-full">
            {/* The Circle on the timeline */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-300 rounded-full border-4 border-black/50 flex items-center justify-center">
                 <Icon className="text-black h-4 w-4" />
            </div>

            <AccordionItem value={value} className={cn(
                "relative border-none w-[calc(50%-2rem)]",
                side === 'left' ? 'mr-auto' : 'ml-auto'
            )}>
                 <AccordionTrigger className="hover:no-underline bg-black/30 backdrop-blur-md border border-white/20 text-white rounded-lg p-6 flex flex-col items-center gap-2 text-center">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-sm text-gray-300 font-normal">{description}</p>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 text-blue-300 mt-2" />
                </AccordionTrigger>
                <AccordionContent className="mt-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                        {members.map(dep => <MemberInfo key={dep.id} dep={dep} />)}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </div>
    )
};


export default function DeputadosPage() {
  const mesaDiretora = getMesaDiretoraSimulada();

  const presidente = mesaDiretora.filter(m => m.titulo === 'Presidente');
  const vices = mesaDiretora.filter(m => m.titulo.includes('Vice-Presidente'));
  const secretarios = mesaDiretora.filter(m => m.titulo.includes('Secretári')); // Pega 'Secretário' e 'Secretária'
  const suplentes = mesaDiretora.filter(m => m.titulo.includes('Suplente'));
  
  const timelineItems = [
    { value: "presidente", title: "Presidência", description: "Comanda as sessões.", members: presidente, icon: Crown, side: 'left' as const },
    { value: "vices", title: "Vice-Presidência", description: "Substituem o presidente.", members: vices, icon: Users, side: 'right' as const },
    { value: "secretarios", title: "Secretaria", description: "Controlam atas e frequência.", members: secretarios, icon: User, side: 'left' as const },
    { value: "suplentes", title: "Suplência", description: "Substituem os secretários.", members: suplentes, icon: Users, side: 'right' as const },
  ];


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
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-4"><Shield size={36} /> Mesa Diretora</h1>
            <p className="text-lg mt-4 text-gray-300 max-w-2xl mx-auto">A Mesa Diretora é responsável pela direção dos trabalhos legislativos. Clique em cada cargo para ver os membros.</p>
        </div>

        {mesaDiretora.length > 0 ? (
             <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
                <div className="relative flex flex-col items-center gap-12">
                   {/* The vertical line */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-white/20" />
                   
                   {timelineItems.map((item) => (
                       <TimelineItem key={item.value} {...item} />
                   ))}
                </div>
            </Accordion>
        ) : (
            <div className="text-center text-gray-400">
                <p>Não foi possível carregar os dados da Mesa Diretora. Tente novamente mais tarde.</p>
            </div>
        )}
      </main>
    </div>
  );
}
