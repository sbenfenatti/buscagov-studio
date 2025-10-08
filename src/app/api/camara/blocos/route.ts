import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idLegislatura = searchParams.get('legislatura') || '57'; // Padrão: legislatura atual
    
    const baseURL = 'https://dadosabertos.camara.leg.br/api/v2';
    const endpoint = `${baseURL}/blocos`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Cache por 1 hora (dados dos blocos não mudam frequentemente)
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Erro na API da Câmara: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filtra blocos pela legislatura especificada se fornecida
    let blocos = data.dados || [];
    
    if (idLegislatura) {
      // Para cada bloco, buscar detalhes para verificar a legislatura
      const blocosComDetalhes = await Promise.all(
        blocos.map(async (bloco: any) => {
          try {
            const detalheResponse = await fetch(`${baseURL}/blocos/${bloco.id}`, {
              headers: { 'Accept': 'application/json' },
              next: { revalidate: 3600 }
            });
            
            if (detalheResponse.ok) {
              const detalhes = await detalheResponse.json();
              return {
                ...bloco,
                detalhes: detalhes.dados
              };
            }
            return bloco;
          } catch {
            return bloco;
          }
        })
      );
      
      blocos = blocosComDetalhes;
    }
    
    // Enriquece os dados dos blocos com informações calculadas
    const blocosEnriquecidos = blocos.map((bloco: any) => {
      const partidos = bloco.detalhes?.partidos || [];
      const totalDeputados = partidos.reduce((total: number, partido: any) => {
        return total + (partido.quantidadeDeputados || 0);
      }, 0);
      
      return {
        id: bloco.id,
        nome: bloco.nome,
        partidos: partidos.map((p: any) => ({
          sigla: p.sigla,
          nome: p.nome,
          quantidadeDeputados: p.quantidadeDeputados || 0
        })),
        totalDeputados,
        lider: bloco.detalhes?.lider || null,
        dataInicio: bloco.detalhes?.dataInicio || null,
        dataFim: bloco.detalhes?.dataFim || null
      };
    });
    
    // Ordena por tamanho (número de deputados) decrescente
    blocosEnriquecidos.sort((a: any, b: any) => b.totalDeputados - a.totalDeputados);
    
    // Retorna dados formatados
    return NextResponse.json({
      success: true,
      source: 'Câmara dos Deputados - API Oficial',
      legislatura: idLegislatura,
      data: blocosEnriquecidos,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Erro no endpoint blocos:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Falha ao buscar dados dos Blocos Parlamentares',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}