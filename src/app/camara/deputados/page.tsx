
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type DeputadoMesa = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  titulo: string;
};

// Dados simulados da Mesa Diretora
const getMesaDiretoraSimulada = (): DeputadoMesa[] => {
  const mesaSimulada: Omit<DeputadoMesa, 'id'>[] = [
    { nome: 'Arthur Lira', siglaPartido: 'PP', siglaUf: 'AL', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/204554.jpg', titulo: 'Presidente' },
    { nome: 'Marcos Pereira', siglaPartido: 'REPUBLICANOS', siglaUf: 'SP', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/160532.jpg', titulo: '1º Vice-Presidente' },
    { nome: 'Sóstenes Cavalcante', siglaPartido: 'PL', siglaUf: 'RJ', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/178943.jpg', titulo: '2º Vice-Presidente' },
    { nome: 'Luciano Bivar', siglaPartido: 'UNIÃO', siglaUf: 'PE', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/73433.jpg', titulo: '1º Secretário' },
    { nome: 'Maria do Rosário', siglaPartido: 'PT', siglaUf: 'RS', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/74398.jpg', titulo: '2º Secretária' },
    { nome: 'Júlio Cesar', siglaPartido: 'PSD', siglaUf: 'PI', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/160583.jpg', titulo: '3º Secretário' },
    { nome: 'Lucio Mosquini', siglaPartido: 'MDB', siglaUf: 'RO', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/178960.jpg', titulo: '4º Secretário' },
    { nome: 'Gilberto Nascimento', siglaPartido: 'PSC', siglaUf: 'SP', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/74400.jpg', titulo: '1º Suplente' },
    { nome: 'Jair Tatto', siglaPartido: 'PT', siglaUf: 'SP', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/121921.jpg', titulo: '2º Suplente' },
    { nome: 'Roberto Monteiro', siglaPartido: 'PL', siglaUf: 'RJ', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/220611.jpg', titulo: '3º Suplente' },
    { nome: 'Rodrigo Gambale', siglaPartido_2: 'PODE', siglaPartido: 'PODE', siglaUf: 'SP', urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/220556.jpg', titulo: '4º Suplente' },
  ];

  const ordem = [
    'Presidente', '1º Vice-Presidente', '2º Vice-Presidente',
    '1º Secretário', '2º Secretária', '3º Secretário', '4º Secretário',
    '1º Suplente', '2º Suplente', '3º Suplente', '4º Suplente'
  ];

  // Adiciona IDs e ordena
  return mesaSimulada
    .map((dep, index) => ({ ...dep, id: 204554 + index }))
    .sort((a, b) => ordem.indexOf(a.titulo) - ordem.indexOf(b.titulo));
};


export default function DeputadosPage() {
  const mesaDiretora = getMesaDiretoraSimulada();

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
            <p className="text-lg mt-4 text-gray-300 max-w-2xl mx-auto">A Mesa Diretora é responsável pela direção dos trabalhos legislativos e dos serviços administrativos da Câmara dos Deputados.</p>
        </div>

        <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-b-white/20 hover:bg-black/30">
                        <TableHead className="text-white w-[100px]">Foto</TableHead>
                        <TableHead className="text-white">Nome</TableHead>
                        <TableHead className="text-white">Partido</TableHead>
                        <TableHead className="text-white">Cargo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mesaDiretora.map((dep) => (
                        <TableRow key={dep.id} className="border-b-white/10 hover:bg-black/30">
                            <TableCell>
                                <Image 
                                    src={dep.urlFoto} 
                                    alt={`Foto de ${dep.nome}`}
                                    width={48}
                                    height={48}
                                    className="rounded-full border-2 border-white/50"
                                />
                            </TableCell>
                            <TableCell className="font-medium">{dep.nome}</TableCell>
                            <TableCell>{`${dep.siglaPartido}-${dep.siglaUf}`}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-blue-300/20 text-blue-100">{dep.titulo}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </main>
    </div>
  );
}
