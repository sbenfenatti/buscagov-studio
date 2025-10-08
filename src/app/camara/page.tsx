
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, TrendingUp, Landmark, Users2, GraduationCap, BarChart3, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// --- Data Definitions ---
const totalDeputados = 513;

const getDemographicData = (source: 'camara' | 'brasil') => {
  if (source === 'brasil') {
    // For Brasil, we just need a representative 100-item array for percentage-based logic
    const brasilData: any[] = [];
    const brasilCounts = {
        genero: { 'Deputadas': 51, 'Deputados': 49 },
        idade: { '61-87 anos': 15, '41-60 anos': 26, '21-40 anos': 30, 'Outras faixas': 29 },
        raca: { 'Branca': 43, 'Parda': 45, 'Preta': 10, 'Amarela': 1, 'Indígena': 1 },
        escolaridade: { 'Superior Completo ou mais': 22, 'Ensino Médio': 50, 'Fundamental ou menos': 28 },
    };
    for (const key in brasilCounts) {
        let currentCount = 0;
        for (const category in brasilCounts[key as keyof typeof brasilCounts]) {
            for (let i = 0; i < brasilCounts[key as keyof typeof brasilCounts][category]; i++) {
                if (!brasilData[currentCount]) brasilData[currentCount] = { id: currentCount };
                brasilData[currentCount][key] = category;
                currentCount++;
            }
        }
    }
    return brasilData;
  }
  
  // For Câmara, generate 513 deputies with specific distributions
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
const config = {
  genero: {
    'Deputados': { color: 'hsl(210 80% 55%)', icon: Users, camaraCount: 423, brasilCount: 49 },
    'Deputadas': { color: 'hsl(340 80% 60%)', icon: Users, camaraCount: 90, brasilCount: 51 },
  },
  idade: {
    '61-87 anos': { color: 'hsl(280 70% 60%)', icon: TrendingUp, camaraCount: 108, brasilCount: 15 },
    '41-60 anos': { color: 'hsl(45 90% 55%)', icon: TrendingUp, camaraCount: 270, brasilCount: 26 },
    '21-40 anos': { color: 'hsl(170 80% 45%)', icon: TrendingUp, camaraCount: 135, brasilCount: 30 },
  },
  patrimonio: {
    'Acima de R$5 milhões': { color: 'hsl(300 90% 45%)', icon: Landmark, camaraCount: 80, brasilCount: 0 },
    'R$500 mil a R$2 milhões': { color: 'hsl(250 85% 55%)', icon: Landmark, camaraCount: 183, brasilCount: 0 },
    'R$100 mil a R$500 mil': { color: 'hsl(200 90% 60%)', icon: Landmark, camaraCount: 101, brasilCount: 0 },
    'Até R$100 mil': { color: 'hsl(150 80% 70%)', icon: Landmark, camaraCount: 31, brasilCount: 0 },
    'Sem patrimônio declarado': { color: 'hsl(0 0% 80%)', icon: Landmark, camaraCount: 17, brasilCount: 0 },
  },
  raca: {
    'Branca': { color: 'hsl(35 100% 90%)', icon: Users2, camaraCount: 370, brasilCount: 43 },
    'Parda': { color: 'hsl(30 40% 50%)', icon: Users2, camaraCount: 107, brasilCount: 45 },
    'Preta': { color: 'hsl(0 0% 20%)', icon: Users2, camaraCount: 27, brasilCount: 10 },
    'Amarela': { color: 'hsl(60 100% 70%)', icon: Users2, camaraCount: 3, brasilCount: 1 },
    'Indígena': { color: 'hsl(10 70% 50%)', icon: Users2, camaraCount: 5, brasilCount: 1 },
    'Não Informado': { color: 'hsl(210 10% 85%)', icon: Users2, camaraCount: 1, brasilCount: 0 },
  },
  escolaridade: {
    'Pós-graduação': { color: 'hsl(310 80% 50%)', icon: GraduationCap, camaraCount: 13, brasilCount: 4 },
    'Superior Completo': { color: 'hsl(260 70% 65%)', icon: GraduationCap, camaraCount: 421, brasilCount: 18 },
    'Ensino Médio': { color: 'hsl(210 60% 75%)', icon: GraduationCap, camaraCount: 79, brasilCount: 50 },
  },
  mandatos: {
    '5 ou mais': { color: 'hsl(360 90% 45%)', icon: BarChart3, camaraCount: 55, brasilCount: 0 },
    '4º Mandato': { color: 'hsl(25 85% 55%)', icon: BarChart3, camaraCount: 42, brasilCount: 0 },
    '3º Mandato': { color: 'hsl(50 90% 60%)', icon: BarChart3, camaraCount: 70, brasilCount: 0 },
    '2º Mandato': { color: 'hsl(180 60% 60%)', icon: BarChart3, camaraCount: 118, brasilCount: 0 },
    '1º Mandato': { color: 'hsl(200 80% 80%)', icon: BarChart3, camaraCount: 228, brasilCount: 0 },
  }
};

type FilterType = keyof typeof config;


// --- Waffle Chart Component ---
const WaffleChart = ({ data, activeFilter, hoveredCategory, setHoveredCategory, className }: { data: any[], activeFilter: FilterType, hoveredCategory: string | null, setHoveredCategory: (category: string | null) => void, className?: string }) => {
  const HoverIcon = hoveredCategory ? config[activeFilter][hoveredCategory]?.icon : null;
  const camaraCount = hoveredCategory ? config[activeFilter][hoveredCategory]?.camaraCount : 0;
    
  return (
    <div 
        className={cn("relative", className)}
        onMouseLeave={() => setHoveredCategory(null)}
    >
        <div className="grid grid-cols-33 gap-1.5 w-full mx-auto">
            {data.map(item => {
                if (!item || item.id >= 513) {
                    return <div key={item.id} className="w-full h-0 pb-[100%] opacity-0" />;
                }

                const category = item[activeFilter];
                if (!category || !config[activeFilter][category]) return <div key={item.id} className="w-full h-0 pb-[100%] rounded-[2px] bg-gray-700" />;

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
                    <span>{hoveredCategory} ({camaraCount} deputados)</span>
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
const Legend = ({ activeFilter, compare }: { activeFilter: FilterType, compare: boolean }) => {
  const items = config[activeFilter];
  if (!items) return null;
  const orderedItems = Object.entries(items);

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
      {orderedItems.map(([key, { color, camaraCount, brasilCount }]) => (
        <div key={key} className="flex items-center gap-2 text-xs text-gray-300">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span>{key}</span>
          {compare && (
            <span className="font-semibold">({camaraCount} / {brasilCount}%)</span>
          )}
        </div>
      ))}
    </div>
  );
};


export default function CamaraPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('genero');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [compare, setCompare] = useState(false);

  const camaraData = useMemo(() => getDemographicData('camara'), []);
  
  const filters: { label: string; key: FilterType }[] = [
    { label: 'Gênero', key: 'genero' },
    { label: 'Idade', key: 'idade' },
    { label: 'Patrimônio', key: 'patrimonio' },
    { label: 'Raça/Cor', key: 'raca' },
    { label: 'Escolaridade', key: 'escolaridade' },
    { label: 'Mandatos', key: 'mandatos' },
  ];
  
  const currentFilters = compare ? filters.filter(f => f.key !== 'patrimonio' && f.key !== 'mandatos') : filters;

  React.useEffect(() => {
    if(compare && (activeFilter === 'patrimonio' || activeFilter === 'mandatos')) {
        setActiveFilter('genero');
    }
  }, [compare, activeFilter]);


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
            <p className="text-lg mt-4 text-gray-300 max-w-3xl mx-auto">Cada bloco representa uma cadeira na Câmara. Use os filtros para explorar a demografia dos deputados e compare com os dados da população brasileira.</p>
        </div>

        <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg p-6 w-full">
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-6 mb-8">
                {currentFilters.map(filter => (
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
                <div className="flex items-center space-x-2">
                    <Switch id="compare-switch" checked={compare} onCheckedChange={setCompare} />
                    <Label htmlFor="compare-switch" className="text-white">Comparar com o Brasil</Label>
                </div>
            </div>

            <WaffleChart 
                data={camaraData} 
                activeFilter={activeFilter} 
                hoveredCategory={hoveredCategory}
                setHoveredCategory={setHoveredCategory}
                className="w-full max-w-4xl"
            />

            <Legend activeFilter={activeFilter} compare={compare}/>
        </div>

      </main>
    </div>
  );
}
