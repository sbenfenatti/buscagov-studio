
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield, Crown, Group, ChevronDown, ClipboardList } from 'lucide-react';
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


const TimelineItem = ({ value, title, description, members, icon: Icon, details }: { value: string, title: string, description: string, members: DeputadoMesa[], icon: React.ElementType, details: string }) => {
  return (
    <AccordionItem value={value} className="flex-1 border-none relative group">
      {/* Node and Line */}
      <div className="flex flex-col items-center">
        {/* Top vertical line */}
        <div className="w-0.5 h-8 bg-white/20"></div>
        {/* Circle Node */}
        <div className="w-12 h-12 bg-blue-300 rounded-full border-4 border-black/50 flex items-center justify-center text-black z-10">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <AccordionTrigger className="hover:no-underline flex flex-col text-center p-4">
        <h3 className="text-lg font-bold mt-3">{title}</h3>
        <p className="text-sm text-gray-400 font-normal">{description}</p>
        <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 text-blue-300 mt-2" />
      </AccordionTrigger>

      <AccordionContent className="absolute left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-2xl mt-4 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h4 className="font-bold text-lg mb-2">{title}</h4>
            <p className="text-gray-300 mb-4 text-sm">{details}</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {members.map(dep => <MemberInfo key={dep.id} dep={dep} />)}
            </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};


export default function DeputadosPage() {
  const mesaDiretora = getMesaDiretoraSimulada();

  const presidente = mesaDiretora.filter(m => m.titulo === 'Presidente');
  const vices = mesaDiretora.filter(m => m.titulo.includes('Vice-Presidente'));
  const secretarios = mesaDiretora.filter(m => m.titulo.includes('Secretári')); // Pega 'Secretário' e 'Secretária'
  const suplentes = mesaDiretora.filter(m => m.titulo.includes('Suplente'));
  
  const timelineItems = [
    { value: "presidente", title: "Presidência", description: "Comanda", members: presidente, icon: Crown, details: "A Presidência é o cargo máximo da Mesa Diretora, responsável por dirigir as sessões plenárias, manter a ordem, e representar a Câmara dos Deputados perante os outros Poderes e a sociedade." },
    { value: "vices", title: "Vice-Presidência", description: "Substitui", members: vices, icon: Shield, details: "Os Vice-Presidentes substituem o Presidente em suas ausências ou impedimentos, garantindo a continuidade dos trabalhos legislativos e auxiliando na gestão da Casa." },
    { value: "secretarios", title: "Secretaria", description: "Administra", members: secretarios, icon: ClipboardList, details: "A Secretaria é responsável por funções administrativas cruciais, como a leitura de documentos em plenário, o controle da lista de presença, a apuração de votos e a supervisão da redação das atas." },
    { value: "suplentes", title: "Suplência", description: "Cobre ausências", members: suplentes, icon: Group, details: "Os Suplentes de Secretários são convocados para substituir os secretários titulares em suas ausências, garantindo que as funções administrativas da Mesa Diretora nunca fiquem vagas." },
  ];


  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 bg-camara-background-image bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/70" />
      
      <header className="sticky top-0 z-30 bg-transparent">
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
            <p className="text-lg mt-4 text-gray-300 max-w-2xl mx-auto">A Mesa Diretora é o órgão que dirige os trabalhos da Câmara. Clique em um cargo para ver seus membros e atribuições.</p>
        </div>

        {mesaDiretora.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                <div className="relative w-full flex justify-center items-start">
                   {/* The horizontal line */}
                   <div className="absolute top-14 left-0 w-full h-0.5 bg-white/20" />
                   
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
