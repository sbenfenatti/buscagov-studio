
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
    else patrimonio = 'Sem patrimônio';


    // Raça/Cor: 370 Brancos, 107 Pardos, 27 Pretos, 5 Indígenas, 3 Amarelos, 1 Não Informado
    let raca;
    if (i <= 370) raca = 'Branca';
    else if (i <= 370 + 107) raca = 'Parda';
    else if (i <= 370 + 107 + 27) raca = 'Preta';
    else if (i <= 370 + 107 + 27 + 5) raca = 'Indígena';
    else if (i <= 370 + 107 + 27 + 5 + 3) raca = 'Amarela';
    else raca = 'Não Informado';

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
    'Acima de R$5 milhões': 'hsl(360 90% 55%)',
    'R$500 mil a R$2 milhões': 'hsl(30 80% 60%)',
    'R$100 mil a R$500 mil': 'hsl(90 70% 60%)',
    'Até R$100 mil': 'hsl(120 60% 75%)',
    'Sem patrimônio': 'hsl(0 0% 70%)',
  },
  raca: {
    'Branca': 'hsl(35 60% 80%)',
    'Parda': 'hsl(30 40% 50%)',
    'Preta': 'hsl(0 0% 20%)',
    'Indígena': 'hsl(10 70% 50%)',
    'Amarela': 'hsl(60 100% 70%)',
    'Não Informado': 'hsl(210 10% 85%)',
  },
  escolaridade: {
    'Pós-graduação': 'hsl(310 70% 55%)',
    'Superior Completo': 'hsl(260 70% 65%)',
    'Ensino Médio': 'hsl(210 70% 70%)',
  },
  mandatos: {
    '5 ou mais': 'hsl(100 90% 20%)',
    '4º Mandato': 'hsl(120 70% 30%)',
    '3º Mandato': 'hsl(140 50% 45%)',
    '2º Mandato': 'hsl(160 60% 60%)',
    '1º Mandato': 'hsl(180 80% 80%)',
  }
};

type FilterType = keyof typeof colorConfig;


// --- Waffle Chart Component ---
const WaffleChart = ({ data, activeFilter }: { data: any[], activeFilter: FilterType }) => {
  return (
    <div className="grid grid-cols-27 grid-rows-19 gap-1.5 w-full max-w-4xl mx-auto">
      {data.map(deputado => (
        <Tooltip key={deputado.id} content={`${deputado.id}: ${deputado[activeFilter]}`}>
          <div
            className="w-full h-0 pb-[100%] rounded-[2px] transition-colors duration-500"
            style={{ backgroundColor: colorConfig[activeFilter][deputado[activeFilter]] }}
          />
        </Tooltip>
      ))}
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


// --- Tooltip for interactivity ---
const Tooltip = ({ children, content }) => {
    const [show, setShow] = useState(false);
    return (
        <div
            className="relative"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            <div className={cn(
                "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-xs rounded py-1 px-2 transition-opacity duration-300 pointer-events-none z-30",
                show ? "opacity-100" : "opacity-0"
            )}>
                {content}
            </div>
        </div>
    );
}

// --- Legend Component ---
const Legend = ({ activeFilter }: { activeFilter: FilterType }) => {
  const items = colorConfig[activeFilter];
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
      {Object.entries(items).map(([key, color]) => (
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

            <WaffleChart data={demographicData} activeFilter={activeFilter} />
            <Legend activeFilter={activeFilter} />
        </div>

      </main>
    </div>
  );
}
