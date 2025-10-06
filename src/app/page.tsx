'use client';

import React, { useState, useEffect } from 'react';

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
    <section className="relative flex h-screen w-full flex-col items-center justify-center bg-hero-image bg-cover bg-center text-center">
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
    <section className="relative flex h-screen w-full items-center justify-center bg-parliament-image bg-cover bg-center">
       <div className="absolute inset-0 bg-gray-900/70" />
       <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white">Transparência ao seu alcance</h2>
        <p className="mt-4 text-lg text-gray-300">
          Explore dados, visualize tendências e entenda as decisões que moldam o nosso país.
          Comece a pesquisar agora.
        </p>
         <div className="mt-8">
            <input type="text" placeholder="Faça sua pergunta..." className="w-full max-w-lg p-3 rounded-md text-gray-800"/>
        </div>
      </div>
    </section>
  )
}


export default function Home() {
  return (
    <main>
      <header className="fixed top-0 left-0 w-full z-50 bg-gray-900/60 backdrop-blur-md border-b border-white/10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-white">ParlamentoBR</div>
          <div>
            <a href="#inicio" className="text-gray-300 hover:text-white px-3">Início</a>
            <a href="#explorar" className="text-gray-300 hover:text-white px-3">Explorar</a>
            <a href="#sobre" className="text-gray-300 hover:text-white px-3">Sobre</a>
          </div>
        </nav>
      </header>
      <HeroSection />
      <ParliamentSection />
    </main>
  );
}
