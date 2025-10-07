'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-20">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md rounded-b-lg border-b border-white/10">
        <div className="flex items-center">
          <svg
            className="h-8 w-8 text-white mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 21h16.5M4.5 3h15M5.25 3v18M9.75 3v18M14.25 3v18M18.75 3v18M3.75 9h16.5"
            />
          </svg>
          <h1 className="text-2xl font-bold text-white">Dados Abertos</h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="#home"
            className="text-white hover:text-blue-300 transition-colors"
          >
            Início
          </a>
          <a
            href="#parliament"
            className="text-white hover:text-blue-300 transition-colors"
          >
            O Parlamento
          </a>
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="section bg-hero-image bg-cover bg-center flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 text-center text-white px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Explore os Dados Abertos
        </h2>
        <p className="text-lg text-gray-200 mb-8">
          Um portal para o cidadão entender a atividade legislativa no Brasil.
        </p>
        <div className="relative rounded-md shadow-sm max-w-2xl mx-auto">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            id="searchInput"
            className="block w-full rounded-md border-0 py-4 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 h-auto"
            placeholder="O que você quer saber sobre o Congresso?"
          />
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce z-10">
        <a href="#parliament" aria-label="Rolar para a próxima seção">
          <ArrowDownCircle className="h-8 w-8" />
        </a>
      </div>
    </section>
  );
}

const parliamentQuestions = [
  'Quais deputados representam o meu estado?',
  'Quais foram as últimas despesas de um parlamentar?',
  'Como um partido orientou a votação de uma proposta?',
  'Qual o histórico de tramitação de um projeto de lei?',
  'Quem são os autores de uma Proposta de Emenda à Constituição (PEC)?',
];

function ParliamentSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestionIndex(
        (prevIndex) => (prevIndex + 1) % parliamentQuestions.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="parliament"
      className="section bg-parliament-image bg-cover bg-center flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          O Coração da Democracia Brasileira
        </h2>
        <div className="text-lg md:text-xl text-gray-200 mb-8 h-12 relative">
          {parliamentQuestions.map((question, index) => (
            <span
              key={index}
              className={cn(
                'question-text absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ease-in-out',
                index === currentQuestionIndex ? 'opacity-100' : 'opacity-0'
              )}
            >
              &ldquo;{question}&rdquo;
            </span>
          ))}
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          <a
            href="#"
            className="flex flex-col items-center text-white hover:text-blue-300 transition-all duration-300 transform hover:scale-110"
          >
            <svg
              className="h-16 w-16"
              viewBox="0 0 100 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path d="M 10 40 Q 50 10 90 40" />
            </svg>
            <span className="mt-2 font-semibold tracking-wide">
              Senado Federal
            </span>
          </a>
          <a
            href="#"
            className="flex flex-col items-center text-white hover:text-blue-300 transition-all duration-300 transform hover:scale-110"
          >
            <svg
              className="h-16 w-16"
              viewBox="0 0 100 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path d="M 10 10 Q 50 40 90 10" />
            </svg>
            <span className="mt-2 font-semibold tracking-wide">
              Câmara dos Deputados
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const body = document.body;
    body.style.scrollSnapType = 'y mandatory';
    body.style.overflowY = 'scroll';
    body.style.height = '100vh';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      body.style.scrollSnapType = 'none';
      body.style.overflowY = 'auto';
      body.style.height = 'auto';
    };
  }, []);

  return (
    <main>
      <Header />
      <HeroSection />
      <ParliamentSection />
    </main>
  );
}
