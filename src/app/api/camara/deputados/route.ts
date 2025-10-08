import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de consulta
    const siglaPartido = searchParams.get('siglaPartido');
    const siglaUf = searchParams.get('siglaUf');
    const nome = searchParams.get('nome');
    const pagina = parseInt(searchParams.get('pagina') || '1');
    const itens = parseInt(searchParams.get('itens') || '15');
    
    const baseURL = 'https://dadosabertos.camara.leg.br/api/v2';
    const endpoint = `${baseURL}/deputados`;
    
    // Monta parâmetros da consulta
    const params = new URLSearchParams();
    if (siglaPartido) params.append('siglaPartido', siglaPartido);
    if (siglaUf) params.append('siglaUf', siglaUf);
    if (nome) params.append('nome', nome);
    params.append('pagina', pagina.toString());
    params.append('itens', itens.toString());
    
    const response = await fetch(`${endpoint}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Cache por 1 hora (dados dos deputados não mudam frequentemente)
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Erro na API da Câmara: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Formata os dados dos deputados
    const deputados = (data.dados || []).map((deputado: any) => ({
      id: deputado.id,
      nome: deputado.nome,
      siglaPartido: deputado.siglaPartido,
      siglaUf: deputado.siglaUf,
      urlFoto: deputado.urlFoto || `https://www.camara.leg.br/internet/deputado/bandep/${deputado.id}.jpg`
    }));
    
    // Retorna dados formatados
    return NextResponse.json({
      success: true,
      source: 'Câmara dos Deputados - API Oficial',
      data: deputados,
      pagination: {
        pagina: pagina,
        itens: itens,
        total: deputados.length
      },
      links: data.links || [],
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Erro no endpoint deputados:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Falha ao buscar dados dos Deputados',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}