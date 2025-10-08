'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield, Crown, Group, ClipboardList, Loader2 } from 'lucide-react';
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

type DeputadoPlenario = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
};

type TimelineStep = {
  key: 'secretaria' | 'vice' | 'presidencia' | 'suplencia';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

// Cores para partidos - paleta diversificada
const partidoCores: Record<string, string> = {
  'PT': '#FF0000',
  'PL': '#0066CC', 
  'UNIÃO': '#FFA500',
  'PP': '#800080',
  'PSD': '#FFD700',
  'REPUBLICANOS': '#008000',
  'MDB': '#32CD32',
  'PDT': '#FF1493',
  'PSB': '#FF6347',
  'PSDB': '#4169E1',
  'SOLIDARIEDADE': '#FF8C00',
  'PODE': '#9370DB',
  'PSOL': '#DC143C',
  'CIDADANIA': '#7FFF00',
  'AVANTE': '#00CED1',
  'PMN': '#B22222',
  'PROS': '#CD853F',
  'PC do B': '#8B0000',
  'PATRIOTA': '#4682B4',
  'REDE': '#00FF7F'
};

// Função para gerar cor para partido não mapeado
const gerarCorPartido = (sigla: string): string => {
  if (partidoCores[sigla]) return partidoCores[sigla];
  
  // Gera cor baseada no hash da sigla
  let hash = 0;
  for (let i = 0; i < sigla.length; i++) {
    hash = sigla.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
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

// Componente do Chart Semicircular do Plenário - GEOMETRIA DEFINITIVAMENTE CORRIGIDA
const PlenarioChart = ({ deputados, hoveredPartido, setHoveredPartido }: {
  deputados: DeputadoPlenario[];
  hoveredPartido: string | null;
  setHoveredPartido: (partido: string | null) => void;
}) => {
  const partidosData = useMemo(() => {
    const contagem = deputados.reduce((acc, dep) => {
      acc[dep.siglaPartido] = (acc[dep.siglaPartido] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Ordena partidos por quantidade (maior primeiro)
    const partidosOrdenados = Object.entries(contagem)
      .sort(([,a], [,b]) => b - a)
      .map(([sigla, quantidade]) => ({ sigla, quantidade, cor: gerarCorPartido(sigla) }));
    
    return partidosOrdenados;
  }, [deputados]);

  // Distribui deputados em posições semicirculares - GEOMETRIA FINAL CORRIGIDA
  const posicoes = useMemo(() => {
    const totalDeputados = deputados.length;
    const numeroFileiras = 8;
    const raioBase = 60;
    const espacamentoFileira = 25;
    const centerX = 0;
    const centerY = 0;
    
    // CONFIGURAÇÃO CORRETA: Semicírculo côncavo VOLTADO PARA CIMA
    // Ângulos: de π (180°) até 0 (0°) = semicírculo SUPERIOR
    const anguloInicio = Math.PI; // 180° - esquerda
    const anguloFim = 0; // 0° - direita
    const anguloTotal = Math.PI; // Amplitude de 180°
    
    const posicoesList: Array<{
      x: number;
      y: number;
      partido: string;
      cor: string;
    }> = [];
    
    // Calcula cadeiras por fileira baseado no comprimento do arco
    const calcularCadeirasFileira = (fileira: number): number => {
      const raio = raioBase + fileira * espacamentoFileira;
      const comprimentoArco = raio * anguloTotal;
      const espacamentoCadeira = 6;
      return Math.floor(comprimentoArco / espacamentoCadeira);
    };
    
    // Distribui deputados proporcionalmente pelas fileiras
    let deputadoIndex = 0;
    
    for (let fileira = 0; fileira < numeroFileiras && deputadoIndex < totalDeputados; fileira++) {
      const cadeirasNestaFileira = calcularCadeirasFileira(fileira);
      const raio = raioBase + fileira * espacamentoFileira;
      
      // Calcula quantos deputados colocar nesta fileira
      const fileirasRestantes = numeroFileiras - fileira;
      const cadeirasRestantes = Array.from({ length: fileirasRestantes }, (_, i) => 
        calcularCadeirasFileira(fileira + i)
      ).reduce((sum, count) => sum + count, 0);
      
      const deputadosRestantes = totalDeputados - deputadoIndex;
      const deputadosNestaFileira = Math.min(
        cadeirasNestaFileira,
        Math.ceil(deputadosRestantes * cadeirasNestaFileira / cadeirasRestantes)
      );
      
      // Posiciona deputados nesta fileira
      for (let cadeira = 0; cadeira < deputadosNestaFileira && deputadoIndex < totalDeputados; cadeira++) {
        // Calcula o ângulo para esta cadeira
        const progresso = deputadosNestaFileira > 1 ? cadeira / (deputadosNestaFileira - 1) : 0.5;
        const angulo = anguloInicio - (progresso * anguloTotal); // De π para 0
        
        // COORDENADAS CORRETAS: Semicírculo côncavo para CIMA
        const x = centerX + Math.cos(angulo) * raio;
        const y = centerY - Math.sin(angulo) * raio; // NEGATIVO para inverter (côncavo para CIMA)
        
        // Encontra o partido do deputado atual
        let partidoAtual = '';
        let contadorPartidos = 0;
        
        for (const { sigla, quantidade } of partidosData) {
          if (deputadoIndex < contadorPartidos + quantidade) {
            partidoAtual = sigla;
            break;
          }
          contadorPartidos += quantidade;
        }
        
        posicoesList.push({
          x,
          y,
          partido: partidoAtual,
          cor: gerarCorPartido(partidoAtual)
        });
        
        deputadoIndex++;
      }
    }
    
    return posicoesList;
  }, [deputados, partidosData]);

  const totalDeputados = deputados.length;
  const partidoInfo = hoveredPartido ? partidosData.find(p => p.sigla === hoveredPartido) : null;

  return (
    <div 
      className="relative w-full h-80 flex items-center justify-center"
      onMouseLeave={() => setHoveredPartido(null)}
    >
      {/* SVG do semicírculo côncavo VOLTADO PARA CIMA */}
      <svg 
        viewBox="-300 -220 600 280" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Plenário da Câmara dos Deputados"
      >
        {posicoes.map((pos, index) => {
          const isHovered = hoveredPartido === pos.partido;
          const isAnotherHovered = hoveredPartido !== null && !isHovered;
          
          return (
            <circle
              key={index}
              cx={pos.x}
              cy={pos.y}
              r={isHovered ? "5" : "3"}
              fill={pos.cor}
              className={cn(
                "transition-all duration-200 ease-out cursor-pointer",
                isAnotherHovered ? "opacity-30" : "opacity-100",
                isHovered ? "drop-shadow-lg scale-125" : ""
              )}
              onMouseEnter={() => setHoveredPartido(pos.partido)}
              aria-label={`Deputado do partido ${pos.partido}`}
            />
          );
        })}
      </svg>
      
      {/* Legenda Central - Posicionada na base do semicírculo */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="text-center bg-black/80 backdrop-blur-lg rounded-xl px-6 py-4 border border-white/20 shadow-2xl">
          {hoveredPartido && partidoInfo ? (
            <>
              <div 
                className="text-3xl font-bold transition-all duration-200"
                style={{ color: partidoInfo.cor }}
              >
                {hoveredPartido}
              </div>
              <div className="text-lg text-white">
                {partidoInfo.quantidade} deputados
              </div>
              <div className="text-sm text-gray-300 mt-1">
                {((partidoInfo.quantidade / totalDeputados) * 100).toFixed(1)}% do plenário
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-white">
                🏛️ {totalDeputados}
              </div>
              <div className="text-lg text-gray-200">
                Deputados Federais
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const [deputados, setDeputados] = useState<DeputadoPlenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDeputados, setLoadingDeputados] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDeputados, setErrorDeputados] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<'secretaria' | 'vice' | 'presidencia' | 'suplencia'>('presidencia');
  const [hoveredPartido, setHoveredPartido] = useState<string | null>(null);

  const timelineSteps: TimelineStep[] = [
    { key: 'secretaria', label: 'Secretaria', icon: ClipboardList, description: 'Responsável pela administração interna, atas das sessões e gestão de documentos.' },
    { key: 'vice', label: 'Vice-Presidência', icon: Shield, description: 'Substitui o Presidente em suas ausências, garantindo a continuidade dos trabalhos.' },
    { key: 'presidencia', label: 'Presidência', icon: Crown, description: 'Dirige as sessões da Câmara, representa a instituição e supervisiona todos os trabalhos.' },
    { key: 'suplencia', label: 'Suplência', icon: Group, description: 'Substitui os Secretários quando necessário, garantindo o funcionamento das atividades.' }
  ];

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
    async function getDeputados() {
      try {
        setLoadingDeputados(true);
        setErrorDeputados(null);
        
        const response = await fetch('/api/camara/deputados?itens=513');
        
        if (!response.ok) {
          throw new Error(`Falha na requisição: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Erro desconhecido');
        }
        
        const deputadosData = result.data.map((dep: any) => ({
          id: dep.id,
          nome: dep.nome,
          siglaPartido: dep.siglaPartido,
          siglaUf: dep.siglaUf
        }));
        
        setDeputados(deputadosData);
        
      } catch (e: any) {
        console.error('Erro ao buscar dados dos Deputados:', e);
        setErrorDeputados('Não foi possível carregar os dados dos Deputados. Tente novamente mais tarde.');
      } finally {
        setLoadingDeputados(false);
      }
    }
    getDeputados();
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

        {/* Seção Plenário - SIMPLIFICADO E CORRIGIDO */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold flex items-center justify-center gap-4">
              🏛️ Plenário da Câmara
            </h2>
          </div>
          
          {loadingDeputados && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-12 w-12 animate-spin text-blue-300" />
            </div>
          )}

          {errorDeputados && (
              <Alert variant="destructive" className="max-w-xl mx-auto bg-red-900/30 border-red-500/50 text-red-200">
                  <AlertTitle>Erro ao carregar dados</AlertTitle>
                  <AlertDescription>{errorDeputados}</AlertDescription>
              </Alert>
          )}

          {!loadingDeputados && !errorDeputados && deputados.length > 0 && (
            /* Card Liquid Glass */
            <div 
              className="relative mx-auto max-w-5xl p-8 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 40% 70%, rgba(88, 199, 250, 0.1) 0%, transparent 50%),
                  linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)
                `,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Liquid Glass animated background */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `
                    radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 60%, rgba(88, 199, 250, 0.2) 0%, transparent 50%)
                  `,
                  animation: 'liquidMove 10s ease-in-out infinite alternate'
                }}
              />
              
              <PlenarioChart
                deputados={deputados}
                hoveredPartido={hoveredPartido}
                setHoveredPartido={setHoveredPartido}
              />
              
              {/* Estilo da animação */}
              <style jsx>{`
                @keyframes liquidMove {
                  0% { transform: scale(1) rotate(0deg); }
                  100% { transform: scale(1.1) rotate(2deg); }
                }
              `}</style>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}