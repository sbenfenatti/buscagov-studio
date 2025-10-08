
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, TrendingUp, Wallet, BookOpen, GraduationCap, BarChart3, Scale, Landmark, Hospital, Mic, Shield, Building, Leaf, Users2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Data Definitions ---
const totalDeputados = 513; // Total seats

const getDemographicData = () => {
  const data = [];
  const profissaoCounts = { 'Advogado (a)': 103, 'Empresário (a)': 84, 'Professor (a)': 50, 'Produtor (a) rural': 40, 'Médico (a)': 36, 'Administrador (a)': 33, 'Engenheiro (a)': 26, 'Jornalista': 23, 'Policial': 21, 'Pastor': 17, 'Bacharel em Direito': 16, 'Economista': 14, 'Delegado (a)': 13, 'Servidor (a) público (a)': 12, 'Político (a)': 10, 'Gestor (a) público (a)': 6, 'Radialista': 6, 'Bancário (a)': 5, 'Bispo evangélico': 5, 'Comerciante': 5, 'Escritor (a)': 5, 'Militar': 5, 'Pedagogo (a)': 5, 'Apresentador': 4, 'Arquiteto (a)': 4, 'Cientista político': 4, 'Comunicador (a)': 4, 'Enfermeiro (a)': 4, 'Teólogo': 4, 'Assistente Social': 3, 'Atleta': 3, 'Ator': 3, 'Dirigente desportivo': 3, 'Influenciador digital': 3, 'Sacerdote católico': 3, 'Ambientalista': 2, 'Auditor': 2, 'Auxiliar de Enfermagem': 2, 'Biólogo (a)': 2, 'Bombeiro Militar': 2, 'Cantor': 2, 'Comerciário': 2, 'Contador': 2, 'Corretor de imóveis': 2, 'Defensor público': 2, 'Estudante': 2, 'Fisioterapeuta': 2, 'Graduado Ciências da Computação': 2, 'Historiador (a)': 2, 'investidor (a)': 2, 'Procurador (a)': 2, 'Promotor de Justiça': 2, 'Trabalhador rural': 2, 'Turismólogo': 2, 'Assessor': 1, 'Ativista Social': 1, 'Autônomo': 1, 'Bibliotecário': 1, 'Caminhoneiro': 1, 'Cientista militar': 1, 'Cientista Social': 1, 'Dona de casa': 1, 'Eletrotécnico': 1, 'Escrevente': 1, 'Escrivão': 1, 'Farmacêutico (a)': 1, 'Geógrafo': 1, 'Geólogo': 1, 'Gerente de projetos': 1, 'Metalúrgico': 1, 'Músico': 1, 'Oficial de Justiça': 1, 'Paraquedista militar': 1, 'Pescador': 1, 'Psicanalista': 1, 'Psicólogo': 1, 'Psicopedagogo': 1, 'Públicitária': 1, 'Sanitarista': 1, 'Sociólogo': 1, 'Técnico agrícola': 1, 'Veterinário': 1};
  let profissoesArray = Object.entries(profissaoCounts).flatMap(([p, count]) => Array(count).fill(p));
  
  for (let i = 1; i <= totalDeputados; i++) {
    // Gênero: 90 Deputadas, 423 Deputados
    const genero = i <= 90 ? 'Deputadas' : 'Deputados';

    // Idade: 135 (21-40), 270 (41-60), 108 (61-87)
    let idade;
    if (i <= 108) idade = '61-87 anos';
    else if (i <= 108 + 270) idade = '41-60 anos';
    else idade = '21-40 anos';

    // Patrimônio Simplificado: 17 (sem), 31 (até 100k), 101 (100k-500k), 183 (500k-2M), 80 (>5M) -> Total 312, precisa remapear
    // Usando contagens da imagem: 80 (>5M), 183 (500k-2M), 101 (100k-500k), 31 (até 100k), 17 (sem)
    let patrimonio;
     if (i <= 80) patrimonio = 'Acima de R$5 milhões';
    else if (i <= 80 + 183) patrimonio = 'R$500 mil a R$2 milhões';
    else if (i <= 80 + 183 + 101) patrimonio = 'R$100 mil a R$500 mil';
    else if (i <= 80 + 183 + 101 + 31) patrimonio = 'Até R$100 mil';
    else patrimonio = 'Sem patrimônio declarado';


    // Raça/Cor: 370 Brancos, 107 Pardos, 27 Pretos, 5 Indígenas, 3 Amarelos, 1 Não Informado
    let raca;
    if (i <= 27) raca = 'Preta';
    else if (i <= 27 + 5) raca = 'Indígena';
    else if (i <= 27 + 5 + 3) raca = 'Amarela';
    else if (i <= 27 + 5 + 3 + 1) raca = 'Não Informado';
    else if (i <= 27 + 5 + 3 + 1 + 107) raca = 'Parda';
    else raca = 'Branca';

    // Escolaridade: 421 Superior, 79 Médio, 13 Pós
    let escolaridade;
    if (i <= 13) escolaridade = 'Pós-graduação';
    else if (i <= 13 + 421) escolaridade = 'Superior Completo';
    else escolaridade = 'Ensino Médio';


    // Mandatos: 228 (1), 118 (2), 70 (3), 42 (4), 55 (5+)
    let mandatos;
    if (i <= 55) mandatos = '5 ou mais';
    else if (i <= 55 + 42) mandatos = '4º Mandato';
    else if (i <= 55 + 42 + 70) mandatos = '3º Mandato';
    else if (i <= 55 + 42 + 70 + 118) mandatos = '2º Mandato';
    else mandatos = '1º Mandato';


    data.push({ id: i, genero, idade, patrimonio, raca, escolaridade, mandatos, profissao: profissoesArray[i-1] || 'Não informada' });
  }
  return data;
};


// --- Color and Icon Mappings ---
const config = {
  genero: {
    'Deputados': { color: 'hsl(210 80% 55%)', icon: Users, count: 423 },
    'Deputadas': { color: 'hsl(340 80% 60%)', icon: Users, count: 90 },
  },
  idade: {
    '61-87 anos': { color: 'hsl(280 70% 60%)', icon: TrendingUp, count: 108 },
    '41-60 anos': { color: 'hsl(45 90% 55%)', icon: TrendingUp, count: 270 },
    '21-40 anos': { color: 'hsl(170 80% 45%)', icon: TrendingUp, count: 135 },
  },
  patrimonio: {
    'Acima de R$5 milhões': { color: 'hsl(300 90% 45%)', icon: Landmark, count: 80 },
    'R$500 mil a R$2 milhões': { color: 'hsl(250 85% 55%)', icon: Landmark, count: 183 },
    'R$100 mil a R$500 mil': { color: 'hsl(200 90% 60%)', icon: Landmark, count: 101 },
    'Até R$100 mil': { color: 'hsl(150 80% 70%)', icon: Landmark, count: 31 },
    'Sem patrimônio declarado': { color: 'hsl(0 0% 80%)', icon: Landmark, count: 17 },
  },
  raca: {
    'Branca': { color: 'hsl(35 100% 90%)', icon: Users2, count: 370 },
    'Parda': { color: 'hsl(30 40% 50%)', icon: Users2, count: 107 },
    'Preta': { color: 'hsl(0 0% 20%)', icon: Users2, count: 27 },
    'Amarela': { color: 'hsl(60 100% 70%)', icon: Users2, count: 3 },
    'Indígena': { color: 'hsl(10 70% 50%)', icon: Users2, count: 5 },
    'Não Informado': { color: 'hsl(210 10% 85%)', icon: Users2, count: 1 },
  },
  escolaridade: {
    'Pós-graduação': { color: 'hsl(310 80% 50%)', icon: GraduationCap, count: 13 },
    'Superior Completo': { color: 'hsl(260 70% 65%)', icon: GraduationCap, count: 421 },
    'Ensino Médio': { color: 'hsl(210 60% 75%)', icon: GraduationCap, count: 79 },
  },
  mandatos: {
    '5 ou mais': { color: 'hsl(360 90% 45%)', icon: BarChart3, count: 55 },
    '4º Mandato': { color: 'hsl(25 85% 55%)', icon: BarChart3, count: 42 },
    '3º Mandato': { color: 'hsl(50 90% 60%)', icon: BarChart3, count: 70 },
    '2º Mandato': { color: 'hsl(180 60% 60%)', icon: BarChart3, count: 118 },
    '1º Mandato': { color: 'hsl(200 80% 80%)', icon: BarChart3, count: 228 },
  }
};

type FilterType = keyof typeof config;


// --- Waffle Chart Component ---
const WaffleChart = ({ data, activeFilter, hoveredCategory, setHoveredCategory }: { data: any[], activeFilter: FilterType, hoveredCategory: string | null, setHoveredCategory: (category: string | null) => void }) => {
  const HoverIcon = hoveredCategory ? config[activeFilter][hoveredCategory]?.icon : null;
  const count = hoveredCategory ? config[activeFilter][hoveredCategory]?.count : 0;
    
  // 33 cols * 16 rows = 528. We will only render 513 items.
  const totalItems = 33 * 16;
  const dataWithPlaceholders = [...data];
  while (dataWithPlaceholders.length < totalItems) {
      dataWithPlaceholders.push({ id: `placeholder-${dataWithPlaceholders.length}`, placeholder: true });
  }

  return (
    <div 
        className="relative"
        onMouseLeave={() => setHoveredCategory(null)}
    >
        <div className="grid grid-cols-33 gap-1.5 w-full mx-auto">
            {dataWithPlaceholders.map(item => {
                if (item.placeholder || item.id > 513) {
                    return <div key={item.id} className="w-full h-0 pb-[100%] opacity-0" />;
                }

                const category = item[activeFilter];
                const color = config[activeFilter][category].color;
                const isHovered = hoveredCategory === category;
                const isAnotherHovered = hoveredCategory !== null && !isHovered;

                return (
                    <div
                        key={item.id}
                        onMouseEnter={() => setHoveredCategory(category)}
                        className={cn(
                            "w-full h-0 pb-[100%] rounded-[2px] transition-all duration-200",
                            isAnotherHovered ? "opacity-20" : "opacity-100",
                            isHovered ? "transform scale-110" : "transform scale-100"
                        )}
                        style={{ backgroundColor: color }}
                    />
                )
            })}
        </div>
        {hoveredCategory && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/70 text-white text-2xl sm:text-3xl md:text-4xl font-bold p-4 md:p-6 rounded-lg text-center shadow-lg flex items-center gap-4">
                    {HoverIcon && <HoverIcon className="h-8 w-8 sm:h-10 sm:w-10" />}
                    <span>{hoveredCategory} ({count})</span>
                </div>
            </div>
        )}
      <style jsx>{`
        .grid-cols-33 {
          grid-template-columns: repeat(33, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
};


// --- Legend Component ---
const Legend = ({ activeFilter }: { activeFilter: FilterType }) => {
  const items = config[activeFilter];
  // The order of items in the legend is now determined by their order in the `config` object
  const orderedItems = Object.entries(items);

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
      {orderedItems.map(([key, { color }]) => (
        <div key={key} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs text-gray-300">{key}</span>
        </div>
      ))}
    </div>
  );
};


export default function CamaraPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('genero');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const demographicData = useMemo(() => getDemographicData(), []);

  const filters: { label: string; key: FilterType }[] = [
    { label: 'Gênero', key: 'genero' },
    { label: 'Idade', key: 'idade' },
    { label: 'Patrimônio', key: 'patrimonio' },
    { label: 'Raça/Cor', key: 'raca' },
    { label: 'Escolaridade', key: 'escolaridade' },
    { label: 'Mandatos', key: 'mandatos' },
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
                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                  Deputados
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center text-white text-center">
        <div className="mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight">Você se sente representado?</h1>
            <p className="text-lg mt-4 text-gray-300 max-w-3xl mx-auto">Cada um dos 513 blocos representa uma cadeira na Câmara dos Deputados. Use os filtros para ver a composição demográfica da casa.</p>
        </div>

        <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg p-6 w-full">
            <div className="flex items-center justify-center flex-wrap gap-4 mb-8">
                {filters.map(filter => (
                    <Button
                        key={filter.key}
                        variant={activeFilter === filter.key ? 'secondary' : 'ghost'}
                        className={cn(
                            'text-white',
                            activeFilter === filter.key ? 'bg-white/20 hover:bg-white/30' : 'hover:bg-white/10'
                        )}
                        onClick={() => setActiveFilter(filter.key)}
                    >
                        {filter.label}
                    </Button>
                ))}
            </div>

            <WaffleChart 
                data={demographicData} 
                activeFilter={activeFilter} 
                hoveredCategory={hoveredCategory}
                setHoveredCategory={setHoveredCategory}
            />
            <Legend activeFilter={activeFilter} />
        </div>

      </main>
    </div>
  );
}

    