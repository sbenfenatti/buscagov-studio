'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield, Crown, Group, ClipboardList, Loader2, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

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

type TimelineStep = {
  key: 'secretaria' | 'vice' | 'presidencia' | 'suplencia';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

type BlocoPartidario = {
  id: string;
  nome: string;
  partidos: Array<{
    sigla: string;
    nome: string;
    quantidadeDeputados: number;
  }>;
  totalDeputados: number;
  lider: {
    nome: string;
    partido: string;
  } | null;
};

type DeputadoBloco = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
};

const MemberCard = ({ dep }: { dep: Deputado }) => (
  <div className="bg-black/40 border border-white/20 rounded-lg p-6 flex flex-col items-center text-center transform transition-all hover:scale-105 hover:bg-black/50 min-w-[220px] max-w-[280px]">
    <Image 
      src={dep.urlFoto} 
      alt={`Foto de ${dep.nome}`}
      width={100}
      height={100}
      className="rounded-full border-2 border-white/30 mb-4"
    />
    <h3 className="font-bold text-lg mb-2 text-white">{dep.nome}</h3>
    <p className="text-sm text-gray-300 mb-3">{`${dep.siglaPartido}-${dep.siglaUf}`}</p>
    <Badge variant="secondary" className="text-sm bg-blue-300/10 text-blue-200 px-3 py-1">
      {dep.titulo}
    </Badge>
  </div>
);

const DeputadoCard = ({ dep }: { dep: DeputadoBloco }) => (
  <div className="bg-black/30 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center transform transition-all hover:scale-105 hover:bg-black/40 min-w-[180px] max-w-[220px]">
    <Image 
      src={dep.urlFoto} 
      alt={`Foto de ${dep.nome}`}
      width={80}
      height={80}
      className="rounded-full border border-white/20 mb-3"
    />
    <h4 className="font-semibold text-white text-sm mb-1">{dep.nome}</h4>
    <p className="text-xs text-gray-400">{`${dep.siglaPartido}-${dep.siglaUf}`}</p>
  </div>
);

const BlocoCard = ({ bloco, onToggle, isExpanded, deputados, loadingDeputados }: {
  bloco: BlocoPartidario;
  onToggle: () => void;
  isExpanded: boolean;
  deputados: DeputadoBloco[] | null;
  loadingDeputados: boolean;
}) => (
  <div className="bg-black/40 border border-white/20 rounded-lg overflow-hidden transition-all duration-300">
    {/* Card Header */}
    <div 
      className="p-6 cursor-pointer hover:bg-black/50 transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="h-6 w-6 text-blue-300" />
            <h3 className="font-bold text-lg text-white">{bloco.nome}</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {bloco.partidos.map(partido => (
                <Badge 
                  key={partido.sigla} 
                  variant="outline" 
                  className="text-xs bg-white/10 text-white border-white/20"
                >
                  {partido.sigla}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>
                <strong className="text-white">{bloco.totalDeputados}</strong> deputados
              </span>
              {bloco.lider && (
                <span>
                  Líder: <strong className="text-white">{bloco.lider.nome}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-4">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-white/70" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/70" />
          )}
        </div>
      </div>
    </div>
    
    {/* Expanded Content */}
    {isExpanded && (
      <div className="border-t border-white/10 p-6">
        {loadingDeputados ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-300" />
          </div>
        ) : deputados && deputados.length > 0 ? (
          <>
            <h4 className="text-white font-semibold mb-4">Deputados do Bloco</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {deputados.map(dep => (
                <DeputadoCard key={dep.id} dep={dep} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-center py-4">
            Nenhum deputado encontrado para este bloco.
          </p>
        )}
      </div>
    )}
  </div>
);

const Timeline = ({ 
  steps, 
  activeStep, 
  onStepClick 
}: { 
  steps: TimelineStep[]; 
  activeStep: string; 
  onStepClick: (step: string) => void; 
}) => (
  <div className="relative w-full max-w-4xl mx-auto mb-8">
    {/* Linha horizontal */}
    <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/20" />
    
    <div className="flex justify-between items-start relative">
      {steps.map((step, index) => {
        const isActive = activeStep === step.key;
        const Icon = step.icon;
        
        return (
          <button
            key={step.key}
            onClick={() => onStepClick(step.key)}
            className="flex flex-col items-center group cursor-pointer"
          >
            {/* Ponto da timeline */}
            <div 
              className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all relative z-10 ${
                isActive 
                  ? 'bg-white border-white text-black' 
                  : 'bg-black border-white/40 text-white/70 group-hover:border-white/70 group-hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            
            {/* Label */}
            <span className={`mt-3 text-sm font-medium transition-colors ${
              isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'
            }`}>
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default function DeputadosPage() {
  const [mesaDiretora, setMesaDiretora] = useState<Deputado[]>([]);
  const [blocos, setBlocos] = useState<BlocoPartidario[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBlocos, setLoadingBlocos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorBlocos, setErrorBlocos] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<'secretaria' | 'vice' | 'presidencia' | 'suplencia'>('presidencia');
  
  // Estado para controlar expansão dos blocos e lazy loading
  const [expandedBlocos, setExpandedBlocos] = useState<Set<string>>(new Set());
  const [deputadosBlocos, setDeputadosBlocos] = useState<Record<string, DeputadoBloco[]>>({});
  const [loadingDeputadosBlocos, setLoadingDeputadosBlocos] = useState<Set<string>>(new Set());

  const timelineSteps: TimelineStep[] = [
    { key: 'secretaria', label: 'Secretaria', icon: ClipboardList, description: 'Responsável pela administração interna, atas das sessões e gestão de documentos.' },
    { key: 'vice', label: 'Vice-Presidência', icon: Shield, description: 'Substitui o Presidente em suas ausências, garantindo a continuidade dos trabalhos.' },
    { key: 'presidencia', label: 'Presidência', icon: Crown, description: 'Dirige as sessões da Câmara, representa a instituição e supervisiona todos os trabalhos.' },
    { key: 'suplencia', label: 'Suplência', icon: Group, description: 'Substitui os Secretários quando necessário, garantindo o funcionamento das atividades.' }
  ];

  // Função para carregar deputados de um bloco (lazy loading)
  const loadDeputadosBloco = async (bloco: BlocoPartidario) => {
    if (deputadosBlocos[bloco.id] || loadingDeputadosBlocos.has(bloco.id)) {
      return; // Já carregado ou carregando
    }

    setLoadingDeputadosBlocos(prev => new Set([...prev, bloco.id]));

    try {
      // Busca deputados de cada partido do bloco
      const deputadosPromises = bloco.partidos.map(async (partido) => {
        const response = await fetch(`/api/camara/deputados?siglaPartido=${partido.sigla}&itens=100`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            return result.data.map((dep: any) => ({
              id: dep.id,
              nome: dep.nome,
              siglaPartido: dep.siglaPartido,
              siglaUf: dep.siglaUf,
              urlFoto: dep.urlFoto
            }));
          }
        }
        return [];
      });

      const deputadosArrays = await Promise.all(deputadosPromises);
      const todosDeputados = deputadosArrays.flat();
      
      setDeputadosBlocos(prev => ({
        ...prev,
        [bloco.id]: todosDeputados
      }));
    } catch (error) {
      console.error(`Erro ao carregar deputados do bloco ${bloco.nome}:`, error);
    } finally {
      setLoadingDeputadosBlocos(prev => {
        const newSet = new Set(prev);
        newSet.delete(bloco.id);
        return newSet;
      });
    }
  };

  // Função para alternar expansão de bloco
  const toggleBloco = (blocoId: string) => {
    const bloco = blocos.find(b => b.id === blocoId);
    if (!bloco) return;

    setExpandedBlocos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blocoId)) {
        newSet.delete(blocoId);
      } else {
        newSet.add(blocoId);
        // Carrega deputados quando expande
        loadDeputadosBloco(bloco);
      }
      return newSet;
    });
  };

  useEffect(() => {
    async function getMesaDiretora() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/camara/mesa-diretora?legislatura=57');
        
        if (!response.ok) {
          throw new Error(`Falha na requisição: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Erro desconhecido');
        }
        
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

  useEffect(() => {
    async function getBlocos() {
      try {
        setLoadingBlocos(true);
        setErrorBlocos(null);
        
        const response = await fetch('/api/camara/blocos?legislatura=57');
        
        if (!response.ok) {
          throw new Error(`Falha na requisição: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Erro desconhecido');
        }
        
        setBlocos(result.data || []);
        
      } catch (e: any) {
        console.error('Erro ao buscar dados dos Blocos:', e);
        setErrorBlocos('Não foi possível carregar os dados dos Blocos Parlamentares. Tente novamente mais tarde.');
      } finally {
        setLoadingBlocos(false);
      }
    }
    getBlocos();
  }, []);

  // Filtros mais específicos para separar corretamente os cargos
  const getMembrosPorCategoria = (categoria: 'secretaria' | 'vice' | 'presidencia' | 'suplencia'): Deputado[] => {
    switch (categoria) {
      case 'presidencia':
        return mesaDiretora.filter(m => 
          m.titulo?.toLowerCase() === 'presidente' || 
          (m.titulo?.toLowerCase().includes('presidente') && !m.titulo?.toLowerCase().includes('vice'))
        );
      
      case 'vice':
        return mesaDiretora.filter(m => 
          m.titulo?.toLowerCase().includes('vice-presidente')
        );
      
      case 'secretaria':
        return mesaDiretora.filter(m => 
          m.titulo?.toLowerCase().includes('secretári') && 
          !m.titulo?.toLowerCase().includes('suplente')
        );
      
      case 'suplencia':
        return mesaDiretora.filter(m => 
          m.titulo?.toLowerCase().includes('suplente')
        );
      
      default:
        return [];
    }
  };

  const membrosAtivos = getMembrosPorCategoria(activeStep);
  const stepAtivo = timelineSteps.find(s => s.key === activeStep);

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

      <main className="relative z-10 container mx-auto px-6 py-12 text-white space-y-16">
        {/* Seção Mesa Diretora */}
        <section>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-4">
              <Shield size={36} /> Mesa Diretora
            </h1>
            <p className="text-lg mt-4 text-gray-300 max-w-3xl mx-auto">
              A Mesa Diretora é o órgão responsável pela direção dos trabalhos legislativos e dos serviços administrativos da Câmara. 
              Clique nos pontos da linha do tempo para explorar cada categoria.
            </p>
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
            <div className="space-y-8">
              {/* Timeline Horizontal */}
              <Timeline 
                steps={timelineSteps}
                activeStep={activeStep}
                onStepClick={setActiveStep}
              />
              
              {/* Descrição da categoria ativa */}
              {stepAtivo && (
                <div className="text-center">
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    {stepAtivo.description}
                  </p>
                </div>
              )}
              
              {/* Cards dos membros */}
              {membrosAtivos.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-6">
                  {membrosAtivos.map(dep => (
                    <MemberCard key={dep.id} dep={dep} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    Nenhum membro encontrado para esta categoria.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Seção Blocos Parlamentares */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold flex items-center justify-center gap-4">
              <Building2 size={36} /> Blocos Parlamentares
            </h2>
            <p className="text-lg mt-4 text-gray-300 max-w-3xl mx-auto">
              Os blocos parlamentares são uniões de partidos políticos que se agrupam para fins regimentais e administrativos. 
              Clique em cada bloco para ver os deputados que o compõem.
            </p>
          </div>
          
          {loadingBlocos && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-12 w-12 animate-spin text-blue-300" />
            </div>
          )}

          {errorBlocos && (
              <Alert variant="destructive" className="max-w-xl mx-auto bg-red-900/30 border-red-500/50 text-red-200">
                  <AlertTitle>Erro ao carregar dados</AlertTitle>
                  <AlertDescription>{errorBlocos}</AlertDescription>
              </Alert>
          )}

          {!loadingBlocos && !errorBlocos && (
            <div className="space-y-6">
              {blocos.length > 0 ? (
                blocos.map(bloco => (
                  <BlocoCard
                    key={bloco.id}
                    bloco={bloco}
                    onToggle={() => toggleBloco(bloco.id)}
                    isExpanded={expandedBlocos.has(bloco.id)}
                    deputados={deputadosBlocos[bloco.id] || null}
                    loadingDeputados={loadingDeputadosBlocos.has(bloco.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    Nenhum bloco parlamentar encontrado para esta legislatura.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}