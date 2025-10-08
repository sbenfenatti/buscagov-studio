import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idLegislatura = searchParams.get('legislatura') || '57'; // Padrão: legislatura atual
    
    const baseURL = 'https://dadosabertos.camara.leg.br/api/v2';
    const endpoint = `${baseURL}/legislaturas/${idLegislatura}/mesa`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Cache por 1 hora (dados da Mesa não mudam frequentemente)
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Erro na API da Câmara: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Retorna dados formatados
    return NextResponse.json({
      success: true,
      source: 'Câmara dos Deputados - API Oficial',
      legislatura: idLegislatura,
      data: data.dados || [],
      links: data.links || [],
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Erro no endpoint mesa-diretora:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Falha ao buscar dados da Mesa Diretora',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}