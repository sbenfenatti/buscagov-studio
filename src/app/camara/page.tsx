
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CamaraPage() {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Patrimônio</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Visualização de patrimônio aqui.</p>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
