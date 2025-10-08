
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
            width={96}
            height={96}
            className="rounded-full border-2 border-white/50 mb-3"
        />
        <h3 className="font-bold text-lg">{dep.nome}</h3>
        <p className="text-sm text-gray-300">{`${dep.siglaPartido}-${dep.siglaUf}`}</p>
        <Badge variant="secondary" className="mt-2 bg-blue-300/20 text-blue-100 text-xs">{dep.titulo}</Badge>
    </div>
);

const GroupAccordionItem = ({ value, title, description, members, icon: Icon }: { value: string, title: string, description: string, members: DeputadoMesa[], icon: React.ElementType }) => {
    if (!members || members.length === 0) return null;
    return (
        <AccordionItem value={value} className="bg-black/30 backdrop-blur-md border-white/20 text-white rounded-lg px-6 mb-4">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4">
                    <Icon className="text-blue-300 h-8 w-8" />
                    <div>
                        <h3 className="text-xl font-bold text-left">{title}</h3>
                        <p className="text-sm text-gray-300 text-left">{description}</p>
                    </div>
                </div>
                 <ChevronDown className="h-6 w-6 shrink-0 transition-transform duration-200 text-blue-300" />
            </AccordionTrigger>
            <AccordionContent>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 pt-4 border-t border-white/20">
                    {members.map(dep => <MemberInfo key={dep.id} dep={dep} />)}
                </div>
            </AccordionContent>
        </AccordionItem>
    )
};


export default function DeputadosPage() {
  const mesaDiretora = getMesaDiretoraSimulada();

  const presidente = mesaDiretora.filter(m => m.titulo === 'Presidente');
  const vices = mesaDiretora.filter(m => m.titulo.includes('Vice-Presidente'));
  const secretarios = mesaDiretora.filter(m => m.titulo.includes('Secretári')); // Pega 'Secretário' e 'Secretária'
  const suplentes = mesaDiretora.filter(m => m.titulo.includes('Suplente'));

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
            <p className="text-lg mt-4 text-gray-300 max-w-2xl mx-auto">A Mesa Diretora é responsável pela direção dos trabalhos legislativos e dos serviços administrativos da Câmara. Clique em cada cargo para ver os membros.</p>
        </div>

        {mesaDiretora.length > 0 ? (
            <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
                <GroupAccordionItem 
                    value="presidente"
                    title="Presidência"
                    description="Representa a Câmara e comanda as sessões."
                    members={presidente}
                    icon={Crown}
                />
                <GroupAccordionItem 
                    value="vices"
                    title="Vice-Presidência"
                    description="Substituem o presidente em suas ausências."
                    members={vices}
                    icon={Users}
                />
                <GroupAccordionItem 
                    value="secretarios"
                    title="Secretaria"
                    description="Controlam a ata e a frequência dos deputados."
                    members={secretarios}
                    icon={User}
                />
                <GroupAccordionItem 
                    value="suplentes"
                    title="Suplência"
                    description="Substituem os secretários em suas ausências."
                    members={suplentes}
                    icon={Users}
                />
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
