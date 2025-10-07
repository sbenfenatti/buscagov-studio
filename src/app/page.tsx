'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const questions = [
  'Qual deputado federal mais gastou com viagens em 2023?',
  'Quais os projetos de lei sobre meio ambiente mais recentes?',
  'Como foi a votação da última reforma tributária na Câmara?',
];

function HeroSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    }, 5000); // Change question every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative flex h-screen w-full flex-col items-center justify-center bg-hero-image bg-cover bg-center text-center">
      <div className="absolute inset-0 bg-gray-900/60" />
      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-bold text-white md:text-6xl">
          Hub de Dados do Parlamento Brasileiro
        </h1>
        <p className="mt-4 text-lg text-gray-300 md:text-xl">
          Sua fonte de informações sobre a atividade legislativa no Brasil,
          simplificada com Inteligência Artificial.
        </p>

        <div className="relative mt-8 h-16">
          {questions.map((question, index) => (
            <p
              key={index}
              className={`question-text absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-2xl font-medium text-white transition-opacity duration-1000 ease-in-out ${
                index === currentQuestionIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              &ldquo;{question}&rdquo;
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParliamentSection() {
  return (
    <section id="explorar" className="relative flex h-screen w-full items-center justify-center bg-parliament-image bg-cover bg-center">
       <div className="absolute inset-0 bg-gray-900/70" />
       <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white">Transparência ao seu alcance</h2>
        <p className="mt-4 text-lg text-gray-300">
          Explore dados, visualize tendências e entenda as decisões que moldam o nosso país.
          Comece a pesquisar agora.
        </p>
         <form className="mt-8 flex w-full max-w-2xl mx-auto items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Faça sua pergunta sobre deputados, projetos de lei, votações..." 
              className="flex-1 p-6 text-lg bg-gray-100/90 text-gray-800 placeholder:text-gray-500 border-transparent focus:border-blue-500 focus:ring-blue-500"
            />
            <Button type="submit" size="lg" className="p-6 bg-blue-600 hover:bg-blue-700">
              <Search className="h-6 w-6" />
              <span className="sr-only">Pesquisar</span>
            </Button>
        </form>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="sobre" className="bg-gray-800 py-20 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">Sobre o Projeto</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
          O ParlamentoBR é uma plataforma de código aberto que visa facilitar o acesso e a compreensão dos dados públicos do legislativo brasileiro. Utilizando inteligência artificial, transformamos dados brutos em informações claras e acessíveis para qualquer cidadão.
        </p>
      </div>
    </section>
  );
}


export default function Home() {
  return (
    <main>
      <header className="fixed top-0 left-0 w-full z-50 bg-gray-900/60 backdrop-blur-md border-b border-white/10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-white">ParlamentoBR</div>
          <div>
            <a href="#inicio" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors">Início</a>
            <a href="#explorar" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors">Explorar</a>
            <a href="#sobre" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors">Sobre</a>
          </div>
        </nav>
      </header>
      <HeroSection />
      <ParliamentSection />
      <AboutSection />
    </main>
  );
}
