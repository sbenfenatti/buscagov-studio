import { NextRequest, NextResponse } from 'next/server';
import { generate } from '@genkit-ai/google-genai';
import { googleAI, gemini15Flash } from '@genkit-ai/google-genai';
import { API_SOURCES } from '@/lib/endpoints_parlamento';

// Configure Google AI
googleAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Convert your API_SOURCES into context for AI
    const endpointsContext = generateContextFromAPISources(API_SOURCES);
    
    const prompt = `Você é um assistente especializado em dados do Congresso Nacional brasileiro.

ENDPOINTS DISPONÍVEIS:
${endpointsContext}

INSTRUÇÕES:
- Analise a pergunta do usuário e identifique qual endpoint é mais adequado
- Extraia os parâmetros necessários da pergunta
- Responda APENAS em formato JSON válido
- Se não conseguir identificar um endpoint adequado, use "endpoint_id": "none"

PERGUNTA DO USUÁRIO: "${query}"

Responda no formato JSON:
{
  "endpoint_id": "id_do_endpoint",
  "parameters": {"param": "valor"},
  "explanation": "explicação da escolha"
}`;

    console.log('Sending prompt to AI...');
    
    const response = await generate({
      model: gemini15Flash,
      prompt: prompt,
    });

    console.log('AI Response:', response.text);

    // Parse AI response
    let aiChoice;
    try {
      // Clean the response text in case it has markdown formatting
      const cleanedText = response.text.replace(/```json\n?|\n?```/g, '').trim();
      aiChoice = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return NextResponse.json({ 
        error: 'Failed to parse AI response',
        rawResponse: response.text 
      }, { status: 500 });
    }

    // If no suitable endpoint found
    if (aiChoice.endpoint_id === 'none') {
      return NextResponse.json({
        answer: "Desculpe, não consegui encontrar um endpoint adequado para sua pergunta. Tente perguntar sobre deputados, senadores, proposições ou votações.",
        aiChoice
      });
    }
    
    // Execute the actual API call
    console.log('Executing API call with:', aiChoice);
    const data = await executeAPICall(aiChoice);
    
    // Format the response with AI
    const finalAnswer = await formatResponse(data, query, aiChoice);

    return NextResponse.json({ 
      answer: finalAnswer,
      data: data,
      aiChoice: aiChoice
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

function generateContextFromAPISources(apiSources: any[]) {
  return apiSources.map(source => {
    return source.categories.map((category: any) => {
      return category.endpoints.map((endpoint: any) => {
        const params = endpoint.parameters?.map((p: any) => 
          `${p.name}: ${p.description}`
        ).join(', ') || 'nenhum';
        
        return `ID: ${endpoint.id}
DESCRIÇÃO: ${endpoint.description}
MÉTODO: ${endpoint.method}
PATH: ${endpoint.path}
BASE_URL: ${source.baseUrl}
PARÂMETROS: ${params}
---`;
      }).join('\n');
    }).join('\n');
  }).join('\n');
}

async function executeAPICall(aiChoice: any) {
  // Find the endpoint details
  const endpointDetails = findEndpointById(aiChoice.endpoint_id);
  
  if (!endpointDetails) {
    throw new Error(`Endpoint ${aiChoice.endpoint_id} not found`);
  }

  // Build the URL
  const url = buildAPIURL(endpointDetails.baseUrl, endpointDetails.path, aiChoice.parameters);
  
  console.log('Calling API:', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

function findEndpointById(endpointId: string) {
  for (const source of API_SOURCES) {
    for (const category of source.categories) {
      for (const endpoint of category.endpoints) {
        if (endpoint.id === endpointId) {
          return {
            ...endpoint,
            baseUrl: source.baseUrl
          };
        }
      }
    }
  }
  return null;
}

function buildAPIURL(baseUrl: string, path: string, parameters: any = {}) {
  const url = new URL(path, baseUrl);
  
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
}

async function formatResponse(data: any, originalQuery: string, aiChoice: any) {
  const formatPrompt = `Você recebeu dados de uma API do Congresso Nacional. Formate uma resposta amigável para o cidadão.

PERGUNTA ORIGINAL: "${originalQuery}"
ENDPOINT USADO: ${aiChoice.endpoint_id}
DADOS RECEBIDOS: ${JSON.stringify(data, null, 2).substring(0, 2000)}...

Formate uma resposta em português, clara e objetiva, destacando as informações mais importantes.
Se houver muitos resultados, mostre os primeiros e mencione quantos há no total.
Mantenha um tom respeitoso e informativo.`;

  try {
    const response = await generate({
      model: gemini15Flash,
      prompt: formatPrompt,
    });
    
    return response.text;
  } catch (error) {
    console.error('Error formatting response:', error);
    return `Encontrei ${data?.dados?.length || 0} resultado(s) para sua consulta sobre "${originalQuery}".`;
  }
}