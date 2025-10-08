
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, TrendingUp, Landmark, Users2, GraduationCap, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Data Definitions ---
const totalDeputados = 513;

const getDemographicData = () => {
  const data = Array.from({ length: totalDeputados }, (_, i) => ({ id: i }));

  const camaraCounts = {
    genero: { 'Deputadas': 90, 'Deputados': 423 },
    idade: { '61-87 anos': 108, '41-60 anos': 270, '21-40 anos': 135 },
    patrimonio: { 'Acima de R$5 milhões': 80, 'R$500 mil a R$2 milhões': 183, 'R$100 mil a R$500 mil': 101, 'Até R$100 mil': 31, 'Sem patrimônio declarado': 17 },
    raca: { 'Branca': 370, 'Parda': 107, 'Preta': 27, 'Amarela': 3, 'Indígena': 5, 'Não Informado': 1 },
    escolaridade: { 'Pós-graduação': 13, 'Superior Completo': 421, 'Ensino Médio': 79 },
    mandatos: { '5 ou mais': 55, '4º Mandato': 42, '3º Mandato': 70, '2º Mandato': 118, '1º Mandato': 228 },
  };

  // Shuffle array function
  const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Assign categories to the 513 deputies
  for (const key in camaraCounts) {
    const categoryKey = key as keyof typeof camaraCounts;
    const distribution = Object.entries(camaraCounts[categoryKey]).flatMap(([category, count]) => Array(count).fill(category));
    shuffle(distribution);
    for (let i = 0; i < totalDeputados; i++) {
        if (distribution[i]) {
            data[i][categoryKey] = distribution[i];
        }
    }
  }

  return data;
};


// --- Color and Icon Mappings ---
const colorConfig = {
  genero: {
    'Deputados': { color: 'hsl(210 80% 55%)', icon: Users },
    'Deputadas': { color: 'hsl(340 80% 60%)', icon: Users },
  },
  idade: {
    '61-87 anos': { color: 'hsl(280 70% 60%)', icon: TrendingUp },
    '41-60 anos': { color: 'hsl(45 90% 55%)', icon: TrendingUp },
    '21-40 anos': { color: 'hsl(170 80% 45%)', icon: TrendingUp },
  },
  patrimonio: {
    'Acima de R$5 milhões': { color: 'hsl(300 90% 45%)', icon: Landmark },
    'R$500 mil a R$2 milhões': { color: 'hsl(250 85% 55%)', icon: Landmark },
    'R$100 mil a R$500 mil': { color: 'hsl(200 90% 60%)', icon: Landmark },
    'Até R$100 mil': { color: 'hsl(150 80% 70%)', icon: Landmark },
    'Sem patrimônio declarado': { color: 'hsl(0 0% 80%)', icon: Landmark },
  },
  raca: {
    'Branca': { color: 'hsl(35 100% 90%)', icon: Users2 },
    'Parda': { color: 'hsl(30 40% 50%)', icon: Users2 },
    'Preta': { color: 'hsl(0 0% 20%)', icon: Users2 },
    'Indígena': { color: 'hsl(10 70% 50%)', icon: Users2 },
    'Amarela': { color: 'hsl(60 100% 70%)', icon: Users2 },
    'Não Informado': { color: 'hsl(210 10% 85%)', icon: Users2 },
  },
  escolaridade: {
    'Pós-graduação': { color: 'hsl(310 80% 50%)', icon: GraduationCap },
    'Superior Completo': { color: 'hsl(260 70% 65%)', icon: GraduationCap },
    'Ensino Médio': { color: 'hsl(210 60% 75%)', icon: GraduationCap },
  },
  mandatos: {
    '5 ou mais': { color: 'hsl(360 90% 45%)', icon: BarChart3 },
    '4º Mandato': { color: 'hsl(25 85% 55%)', icon: BarChart3 },
    '3º Mandato': { color: 'hsl(50 90% 60%)', icon: BarChart3 },
    '2º Mandato': { color: 'hsl(180 60% 60%)', icon: BarChart3 },
    '1º Mandato': { color: 'hsl(200 80% 80%)', icon: BarChart3 },
  }
};

type FilterType = keyof typeof colorConfig;


// --- Waffle Chart Component ---
const WaffleChart = ({ data, activeFilter, hoveredCategory, setHoveredCategory }: { data: any[], activeFilter: FilterType, hoveredCategory: string | null, setHoveredCategory: (category: string | null) => void }) => {
  const counts = useMemo(() => {
    return data.reduce((acc, item) => {
      const category = item[activeFilter];
      if (category) {
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [data, activeFilter]);

  const HoverIcon = hoveredCategory ? colorConfig[activeFilter][hoveredCategory]?.icon : null;
  const categoryCount = hoveredCategory ? counts[hoveredCategory] : 0;
    
  return (
    <div 
        className="relative w-full max-w-4xl mx-auto"
        onMouseLeave={() => setHoveredCategory(null)}
    >
        <div className="grid grid-cols-33 gap-1.5 w-full">
            {data.map(item => {
                if (!item) return null;

                const category = item[activeFilter];
                if (!category || !colorConfig[activeFilter][category]) return <div key={item.id} className="w-full h-0 pb-[100%] rounded-[2px] bg-gray-700" />;

                const color = colorConfig[activeFilter][category].color;
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
                    <span>{hoveredCategory} ({categoryCount} deputados)</span>
                </div>
            </div>
        )}
      <style jsx>{`
        .grid-cols-33 { grid-template-columns: repeat(33, minmax(0, 1fr)); }
      `}</style>
    </div>
  );
};


// --- Legend Component ---
const Legend = ({ activeFilter }: { activeFilter: FilterType }) => {
  const items = colorConfig[activeFilter];
  if (!items) return null;
  const orderedItems = Object.entries(items);

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
      {orderedItems.map(([key, { color }]) => (
        <div key={key} className="flex items-center gap-2 text-xs text-gray-300">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span>{key}</span>
        </div>
      ))}
    </div>
  );
};


export default function CamaraPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('genero');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const data = useMemo(() => getDemographicData(), []);
  
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
                <Button variant="secondary" className="text-white bg-white/20 hover:bg-white/30">
                  <Users className="mr-2 h-4 w-4" />
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
            <p className="text-lg mt-4 text-gray-300 max-w-3xl mx-auto">Cada bloco representa uma cadeira na Câmara. Use os filtros para explorar a demografia dos deputados.</p>
        </div>

        <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg p-6 w-full">
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-6 mb-8">
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
                data={data} 
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
