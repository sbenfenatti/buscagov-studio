'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield, Crown, Group, ClipboardList, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type Deputado = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  titulo: string | null;
  dataInicio: string;
  dataFim: string | null;
};

const MemberCard = ({ dep }: { dep: Deputado }) => (
    <div className="bg-black/40 border border-white/20 rounded-lg p-4 flex flex-col items-center text-center transform transition-transform hover:scale-105 hover:bg-black/60">
        <Image 
            src={dep.urlFoto} 
            alt={`Foto de ${dep.nome}`}
            width={80}
            height={80}
            className="rounded-full border-2 border-white/30 mb-3"
        />
        <h3 className="font-bold text-md">{dep.nome}</h3>
        <p className="text-sm text-gray-300">{`${dep.siglaPartido}-${dep.siglaUf}`}</p>
        <Badge variant="secondary" className="mt-2 text-xs bg-blue-300/10 text-blue-200">{dep.titulo}</Badge>
    </div>
);

const GroupAccordionItem = ({ title, icon: Icon, members, description }: { title: string, icon: React.ElementType, members: Deputado[], description: string }) => {
    if (members.length === 0) return null;

    return (
        <AccordionItem value={title} className="border-b-0">
            <AccordionTrigger className="bg-black/40 hover:bg-black/60 border border-white/20 rounded-lg p-6 flex justify-center items-center gap-3 text-white hover:no-underline [&[data-state=open]>svg]:text-blue-400">
                <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-white transition-colors" />
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>
            </AccordionTrigger>
            <AccordionContent className="mt-4 text-white p-6 bg-black/30 rounded-lg border border-white/10">
                <p className="text-gray-300 mb-6 text-center">{description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {members.map(dep => <MemberCard key={dep.id} dep={dep} />)}
                </div>
            </AccordionContent>
        </AccordionItem>
    )
};


export default function DeputadosPage() {
  const [mesaDiretora, setMesaDiretora] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getMesaDiretora() {
      try {
        setLoading(true);
        setError(null);
        
        // Agora usa nosso endpoint interno
        const response = await fetch('/api/camara/mesa-diretora?legislatura=57');
        
        if (!response.ok) {
          throw new Error(`Falha na requisição: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Erro desconhecido');
        }
        
        // Filtra apenas membros atuais (sem data fim)
        const membrosAtuais = result.data.filter((m: Deputado) => m.dataFim === null);
        setMesaDiretora(membrosAtuais);
        
      } catch (e: any) {
        console.error('Erro ao buscar dados da Mesa Diretora:', e);
        setError('Não foi possível carregar os dados da Mesa Diretora. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    getMesaDiretora();
  }, []);

  const presidente = mesaDiretora.filter(m => m.titulo?.includes('Presidente'));
  const vices = mesaDiretora.filter(m => m.titulo?.includes('Vice-Presidente'));
  const secretarios = mesaDiretora.filter(m => m.titulo?.includes('Secretári'));
  const suplentes = mesaDiretora.filter(m => m.titulo?.includes('Suplente'));

  const groups = [
    { title: "Presidência", icon: Crown, members: presidente, description: "Dirige as sessões da Câmara, representa a instituição e supervisiona todos os trabalhos legislativos e administrativos." },
    { title: "Vice-Presidência", icon: Shield, members: vices, description: "Substitui o Presidente em suas ausências ou impedimentos, garantindo a continuidade dos trabalhos da Casa." },
    { title: "Secretaria", icon: ClipboardList, members: secretarios, description: "Responsável pela administração interna, como a ata das sessões, a numeração de projetos e a gestão de documentos." },
    { title: "Suplência", icon: Group, members: suplentes, description: "Substituem os Secretários em suas ausências, garantindo o quórum e o funcionamento das atividades administrativas." },
  ]
  
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
         <div className="text-center mb-12">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-4"><Shield size={36} /> Mesa Diretora</h1>
            <p className="text-lg mt-4 text-gray-300 max-w-3xl mx-auto">A Mesa Diretora é o órgão responsável pela direção dos trabalhos legislativos e dos serviços administrativos da Câmara. Clique em um cargo para ver seus membros e atribuições.</p>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-12 w-12 animate-spin text-blue-300" />
          </div>
        )}

        {error && (
            <Alert variant="destructive" className="max-w-xl mx-auto bg-red-900/30 border-red-500/50 text-red-200">
                <AlertTitle>Erro ao carregar dados</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {!loading && !error && (
            <div className="relative w-full max-w-5xl mx-auto">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/20 -translate-y-1/2" />
                <Accordion type="single" collapsible className="relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0">
                    {groups.map((group, index) => (
                        <div key={group.title} className="w-full md:w-auto flex flex-col items-center z-10">
                            <div className="w-full md:w-auto flex flex-col items-center">
                                {index !== 0 && <div className="block md:hidden w-0.5 h-8 bg-white/20" />}
                                <GroupAccordionItem 
                                    key={group.title}
                                    title={group.title}
                                    icon={group.icon}
                                    members={group.members}
                                    description={group.description}
                                />
                                {index !== groups.length - 1 && <div className="block md:hidden w-0.5 h-8 bg-white/20" />}
                            </div>
                        </div>
                    ))}
                </Accordion>
            </div>
        )}
      </main>
    </div>
  );
}