
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://dados.camara.leg.br/api/v2/legislaturas/57/mesa', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Forward the error status from the external API
      return NextResponse.json(
        { error: `Falha na requisição à API da Câmara: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const membrosAtuais = data.dados.filter((m: any) => m.dataFim === null);

    return NextResponse.json(membrosAtuais);
  } catch (error: any) {
    console.error('Erro no proxy da API da Câmara:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar dados.' },
      { status: 500 }
    );
  }
}
