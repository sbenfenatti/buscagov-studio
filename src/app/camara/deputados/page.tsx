
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type DeputadoMesa = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  titulo: string; // O cargo, ex: 'Presidente'
};

// Função para retornar dados simulados da Mesa Diretora
function getMesaDiretoraSimulada(): DeputadoMesa[] {
    const deputados: Omit<DeputadoMesa, 'id' | 'urlFoto'>[] = [
        { nome: 'Arthur Lira', siglaPartido: 'PP', siglaUf: 'AL', titulo: 'Presidente' },
        { nome: 'Marcos Pereira', siglaPartido: 'Republicanos', siglaUf: 'SP', titulo: '1º Vice-Presidente' },
        { nome: 'Sóstenes Cavalcante', siglaPartido: 'PL', siglaUf: 'RJ', titulo: '2º Vice-Presidente' },
        { nome: 'Luciano Bivar', siglaPartido: 'União', siglaUf: 'PE', titulo: '1º Secretário' },
        { nome: 'Maria do Rosário', siglaPartido: 'PT', siglaUf: 'RS', titulo: '2º Secretária' },
        { nome: 'Júlio Cesar', siglaPartido: 'PSD', siglaUf: 'PI', titulo: '3º Secretário' },
        { nome: 'Lúcio Mosquini', siglaPartido: 'MDB', siglaUf: 'RO', titulo: '4º Secretário' },
        { nome: 'Gilberto Nascimento', siglaPartido: 'PSC', siglaUf: 'SP', titulo: '1º Suplente' },
        { nome: 'Jeferson Rodrigues', siglaPartido: 'Republicanos', siglaUf: 'GO', titulo: '2º Suplente' },
        { nome: 'Roberto Monteiro', siglaPartido: 'PL', siglaUf: 'RJ', titulo: '3º Suplente' },
        { nome: 'André Ferreira', siglaPartido: 'PL', siglaUf: 'PE', titulo: '4º Suplente' },
    ];

    return deputados.map((dep, index) => ({
        ...dep,
        id: 204554 + index, // Ids fictícios
        urlFoto: `https://www.camara.leg.br/internet/deputado/bandep/${204554 + index}.jpg`,
    }));
}


const MemberCard = ({ dep, className }: { dep: DeputadoMesa, className?: string }) => (
    <Card className={cn("bg-black/30 backdrop-blur-md border-white/20 text-white text-center w-48 transition-all hover:bg-black/50 hover:scale-105", className)}>
        <CardContent className="p-4 flex flex-col items-center">
            <Image 
                src={dep.urlFoto} 
                alt={`Foto de ${dep.nome}`}
                width={80}
                height={80}
                className="rounded-full border-2 border-white/50 mb-3"
            />
            <h3 className="font-bold text-base">{dep.nome}</h3>
            <p className="text-sm text-gray-300">{`${dep.siglaPartido}-${dep.siglaUf}`}</p>
            <Badge variant="secondary" className="mt-2 bg-blue-300/20 text-blue-100 text-xs">{dep.titulo}</Badge>
        </CardContent>
    </Card>
);

export default function DeputadosPage() {
  const mesaDiretora = getMesaDiretoraSimulada();

  const presidente = mesaDiretora.find(m => m.titulo === 'Presidente');
  const vices = mesaDiretora.filter(m => m.titulo.includes('Vice-Presidente'));
  const secretarios = mesaDiretora.filter(m => m.titulo.includes('Secretári')); // Pega 'Secretário' e 'Secretária'
  const suplentes = mesaDiretora.filter(m => m.titulo.includes('Suplente'));

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
            <h1 className="text-4xl font-bold flex items-center justify-center gap-4"><Shield size={36} /> Mesa Diretora</h1>
            <p className="text-lg mt-4 text-gray-300 max-w-2xl mx-auto">A Mesa Diretora é responsável pela direção dos trabalhos legislativos e dos serviços administrativos da Câmara.</p>
        </div>

        {mesaDiretora.length > 0 ? (
            <div className="flex flex-col items-center gap-y-8">
                {/* Presidente */}
                {presidente && (
                    <div className="flex justify-center">
                        <MemberCard dep={presidente} className="w-52" />
                    </div>
                )}
                
                {/* Vice-Presidentes */}
                {vices.length > 0 && (
                    <div className="flex justify-center gap-x-8">
                        {vices.map(dep => <MemberCard key={dep.id} dep={dep} />)}
                    </div>
                )}

                {/* Secretários */}
                {secretarios.length > 0 && (
                    <div className="flex justify-center flex-wrap gap-6">
                        {secretarios.map(dep => <MemberCard key={dep.id} dep={dep} className="w-44"/>)}
                    </div>
                )}

                {/* Suplentes */}
                {suplentes.length > 0 && (
                    <div className="w-full border-t border-white/20 mt-8 pt-8">
                        <h2 className="text-2xl font-bold text-center mb-6">Suplentes</h2>
                        <div className="flex justify-center flex-wrap gap-6">
                            {suplentes.map(dep => <MemberCard key={dep.id} dep={dep} className="w-44" />)}
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div className="text-center text-gray-400">
                <p>Não foi possível carregar os dados da Mesa Diretora. Tente novamente mais tarde.</p>
            </div>
        )}
      </main>
    </div>
  );
}
