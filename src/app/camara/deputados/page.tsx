
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
  dataInicio: string;
  dataFim: string | null;
};

async function getMesaDiretora() {
  try {
    const legislaturaId = 57; // Legislatura atual
    const response = await fetch(`https://dadosabertos.camara.leg.br/api/v2/legislaturas/${legislaturaId}/mesa`, {
      next: { revalidate: 3600 } // Revalida a cada 1 hora
    });
    if (!response.ok) {
      throw new Error('Falha ao buscar dados da API');
    }
    const data = await response.json();

    const mesaAtual = data.dados.filter((membro: DeputadoMesa) => membro.dataFim === null);

    const deputadosOrdenados = mesaAtual.sort((a: DeputadoMesa, b: DeputadoMesa) => {
        const ordem = [
            'Presidente', '1º Vice-Presidente', '2º Vice-Presidente',
            '1º Secretário', '2º Secretário', '3º Secretário', '4º Secretário',
            '1º Suplente', '2º Suplente', '3º Suplente', '4º Suplente'
        ];
        return ordem.indexOf(a.titulo) - ordem.indexOf(b.titulo);
    });

    return deputadosOrdenados as DeputadoMesa[];
  } catch (error) {
    console.error('Erro ao buscar dados da Mesa Diretora:', error);
    return [];
  }
}


export default async function DeputadosPage() {
  const mesaDiretora = await getMesaDiretora();

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
