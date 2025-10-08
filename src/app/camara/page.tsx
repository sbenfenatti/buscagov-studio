
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Data Definitions ---
const totalDeputados = 513;

const getDemographicData = () => {
  const data = [];
  for (let i = 1; i <= totalDeputados; i++) {
    // Gênero: 90 mulheres (17.5%), 423 homens
    const genero = i <= 90 ? 'Feminino' : 'Masculino';

    // Idade: 135 (21-40), 270 (41-60), 108 (61+)
    let idade;
    if (i <= 108) idade = '61+ anos';
    else if (i <= 108 + 270) idade = '41-60 anos';
    else idade = '21-40 anos';

    // Patrimônio Simplificado: 17 (sem), 31 (até 100k), 101 (100k-500k), 183 (500k-2M), 80 (>5M), (101 de 2-5M ignorados por enquanto)
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


    data.push({ id: i, genero, idade, patrimonio, raca, escolaridade, mandatos });
  }
  return data;
};


// --- Color Mappings ---
const colorConfig = {
  genero: {
    'Masculino': 'hsl(210 80% 55%)',
    'Feminino': 'hsl(340 80% 60%)',
  },
  idade: {
    '61+ anos': 'hsl(280 70% 60%)',
    '41-60 anos': 'hsl(45 90% 55%)',
    '21-40 anos': 'hsl(170 80% 45%)',
  },
  patrimonio: {
    'Acima de R$5 milhões': 'hsl(120 80% 40%)',
    'R$500 mil a R$2 milhões': 'hsl(100 60% 50%)',
    'R$100 mil a R$500 mil': 'hsl(80 60% 60%)',
    'Até R$100 mil': 'hsl(60 70% 70%)',
    'Sem patrimônio declarado': 'hsl(0 0% 80%)',
  },
  raca: {
    'Branca': 'hsl(35 100% 90%)',
    'Parda': 'hsl(30 40% 50%)',
    'Preta': 'hsl(0 0% 20%)',
    'Amarela': 'hsl(60 100% 70%)',
    'Indígena': 'hsl(10 70% 50%)',
    'Não Informado': 'hsl(210 10% 85%)',
  },
  escolaridade: {
    'Pós-graduação': 'hsl(310 80% 50%)',
    'Superior Completo': 'hsl(260 70% 65%)',
    'Ensino Médio': 'hsl(210 60% 75%)',
  },
  mandatos: {
    '5 ou mais': 'hsl(360 90% 45%)',
    '4º Mandato': 'hsl(25 85% 55%)',
    '3º Mandato': 'hsl(50 90% 60%)',
    '2º Mandato': 'hsl(180 60% 60%)',
    '1º Mandato': 'hsl(200 80% 80%)',
  }
};

type FilterType = keyof typeof colorConfig;


// --- Waffle Chart Component ---
const WaffleChart = ({ data, activeFilter, hoveredCategory, setHoveredCategory }: { data: any[], activeFilter: FilterType, hoveredCategory: string | null, setHoveredCategory: (category: string | null) => void }) => {
  return (
    <div 
        className="relative"
        onMouseLeave={() => setHoveredCategory(null)}
    >
        <div className="grid grid-cols-27 grid-rows-19 gap-1.5 w-full max-w-4xl mx-auto">
            {data.map(deputado => {
                const category = deputado[activeFilter];
                const color = colorConfig[activeFilter][category];
                const isHovered = hoveredCategory === category;
                const isAnotherHovered = hoveredCategory !== null && !isHovered;

                return (
                    <div
                        key={deputado.id}
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
                <div className="bg-black/70 text-white text-2xl sm:text-3xl md:text-4xl font-bold p-4 md:p-6 rounded-lg text-center shadow-lg">
                    {hoveredCategory}
                </div>
            </div>
        )}
      <style jsx>{`
        .grid-cols-27 {
          grid-template-columns: repeat(27, minmax(0, 1fr));
        }
        .grid-rows-19 {
          grid-template-rows: repeat(19, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
};


// --- Legend Component ---
const Legend = ({ activeFilter }: { activeFilter: FilterType }) => {
  const items = colorConfig[activeFilter];
  const orderedItems = Object.entries(items).sort(([keyA], [keyB]) => {
      const order = Object.keys(items);
      return order.indexOf(keyA) - order.indexOf(keyB);
  });

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
      {orderedItems.map(([key, color]) => (
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

        <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg p-6 w-full max-w-5xl">
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

    