'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const patrimonioData = [
  { label: 'Sem patrimônio declarado', value: 17, color: 'hsl(260 90% 75%)' },
  { label: 'Até R$100 mil', value: 31, color: 'hsl(260 90% 80%)' },
  { label: 'R$100 mil a R$500 mil', value: 101, color: 'hsl(260 90% 85%)' },
  { label: 'R$500 mil a R$1 milhão', value: 84, color: 'hsl(260 90% 90%)' },
  { label: 'R$1 milhão a R$2 milhões', value: 99, color: 'hsl(260 95% 92%)' },
  { label: 'R$2 milhões a R$5 milhões', value: 101, color: 'hsl(260 100% 94%)' },
  { label: 'Acima de R$5 milhões', value: 80, color: 'hsl(260 100% 96%)' },
].reverse(); // Reverse to have the wealthiest at the top

const totalDeputados = patrimonioData.reduce((sum, item) => sum + item.value, 0);
const maxValue = Math.max(...patrimonioData.map(item => item.value));

const PatrimonioChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartHeight = 250;
  const sliceHeight = chartHeight / patrimonioData.length;

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full">
      <svg width="100%" height={chartHeight} viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none" className="transform -rotate-90">
        <g transform="translate(0, 250) scale(1, -1)">
          {patrimonioData.map((item, index) => {
            const y = index * sliceHeight;
            const itemWidth = (item.value / maxValue) * 90; // 90% of width for margin
            const xOffset = (100 - itemWidth) / 2;
            const isHovered = hoveredIndex === index;

            return (
              <g
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <path
                  d={`M ${xOffset},${y + 2} L ${100 - xOffset},${y + 2} L ${100 - xOffset + 5},${y + sliceHeight / 2} L ${100 - xOffset},${y + sliceHeight - 2} L ${xOffset},${y + sliceHeight - 2} L ${xOffset - 5},${y + sliceHeight / 2} Z`}
                  fill={item.color}
                  className={cn(
                    'transition-all duration-300',
                    isHovered ? 'opacity-100' : 'opacity-70'
                  )}
                  style={{ filter: isHovered ? `drop-shadow(0 0 8px ${item.color})` : 'none' }}
                />
              </g>
            );
          })}
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white">
            {hoveredIndex !== null ? (
                <>
                    <div className="text-3xl font-bold">{patrimonioData[hoveredIndex].value}</div>
                    <div className="text-sm max-w-40">{patrimonioData[hoveredIndex].label}</div>
                </>
            ) : (
                <>
                    <div className="text-3xl font-bold">{totalDeputados}</div>
                    <div className="text-sm">Deputados</div>
                </>
            )}
          </div>
      </div>
    </div>
  );
};


export default function CamaraPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
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
                  <Users className="mr-2 h-4 w-4" />
                  Deputados
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center justify-center text-white text-center" style={{ minHeight: 'calc(100vh - 88px)' }}>
        <div className="mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight">Você se sente representado?</h1>
            <p className="text-lg mt-4 text-gray-300 max-w-3xl mx-auto">Um retrato demográfico da Câmara dos Deputados, mostrando a distribuição de gênero, idade e patrimônio dos 513 parlamentares que decidem o futuro do país.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Gênero</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Visualização de gênero aqui.</p>
                </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Idade</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Visualização de idade aqui.</p>
                </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm h-[350px]">
                <CardHeader>
                    <CardTitle>Patrimônio</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    <PatrimonioChart />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
