
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, User, PersonStanding } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Componente para a visualização de Gênero
function GenderVisualization() {
  const totalIcons = 100;
  const womenPercentage = 18; // 90 / 513 * 100 ~= 17.5, arredondado para 18% para a grade

  return (
    <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Users className="h-6 w-6" />
          Gênero na Câmara
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-3xl font-bold">
          Para cada <span className="text-pink-300">1 mulher</span>, existem <span className="text-blue-300">4.7 homens</span>.
        </p>
        <p className="text-lg mt-2 text-gray-300">90 Mulheres | 423 Homens</p>
        <div className="mt-6 grid grid-cols-10 gap-2 max-w-sm mx-auto">
          {Array.from({ length: totalIcons }).map((_, i) => (
            <User
              key={i}
              className={cn(
                'h-5 w-5',
                i < womenPercentage ? 'text-pink-300' : 'text-blue-300/70'
              )}
              strokeWidth={1.5}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para a visualização de Idade
function AgeVisualization() {
    const ageGroups = [
        { label: '21-40 anos', count: 135, color: 'bg-green-400/80' },
        { label: '41-60 anos', count: 270, color: 'bg-yellow-400/80' },
        { label: '61-87 anos', count: 108, color: 'bg-red-400/80' },
    ];
    const maxCount = Math.max(...ageGroups.map(g => g.count));

  return (
    <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <PersonStanding className="h-6 w-6" />
          Distribuição de Idade
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
         <p className="text-lg mt-2 mb-6 text-gray-300">A maioria dos deputados (270) tem entre 41 e 60 anos.</p>
        <div className="flex items-end justify-center gap-4 h-48">
            {ageGroups.map(group => (
                 <div key={group.label} className="flex flex-col items-center justify-end w-24">
                    <div 
                        className={cn("w-full rounded-t-md transition-all duration-500", group.color)}
                        style={{ height: `${(group.count / maxCount) * 100}%` }}
                    >
                         <div className="relative h-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-black mix-blend-multiply drop-shadow-lg">{group.count}</span>
                        </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold">{group.label}</p>
                 </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}


export default function DeputadosPage() {
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
            <h1 className="text-5xl font-extrabold tracking-tight">Você se sente representado?</h1>
            <p className="text-lg mt-4 text-gray-300 max-w-3xl mx-auto">Um retrato demográfico da Câmara dos Deputados, mostrando a distribuição de gênero, idade e patrimônio dos 513 parlamentares que decidem o futuro do país.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GenderVisualization />
            <AgeVisualization />
        </div>
      </main>
    </div>
  );
}
