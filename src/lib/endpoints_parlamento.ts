// Simplified API sources without React imports for server-side usage
export const API_SOURCES = [
  {
    name: 'Câmara dos Deputados',
    baseUrl: 'https://dadosabertos.camara.leg.br/api/v2',
    categories: [
      {
        name: 'Deputados',
        endpoints: [
          {
            id: 'getDeputados',
            method: 'GET',
            path: '/deputados',
            description: 'Retorna uma lista de dados básicos sobre deputados que estiveram em exercício parlamentar.',
            parameters: [
              { name: 'id', type: 'query', description: 'ID do deputado separados por vírgula.' },
              { name: 'nome', type: 'query', description: 'Parte do nome parlamentar do deputado.' },
              { name: 'siglaUf', type: 'query', description: 'Sigla do estado pelo qual foi eleito.' },
              { name: 'siglaPartido', type: 'query', description: 'Sigla do partido do deputado.' },
              { name: 'siglaSexo', type: 'query', description: 'M para masculino, F para feminino.' }
            ]
          },
          {
            id: 'getDeputadosId',
            method: 'GET', 
            path: '/deputados/{id}',
            description: 'Dados pessoais de um deputado específico.',
            parameters: [
              { name: 'id', type: 'path', description: 'ID numérico do deputado.' }
            ]
          },
          {
            id: 'getDeputadosDespesas',
            method: 'GET',
            path: '/deputados/{id}/despesas', 
            description: 'Despesas do deputado por tipo, mês e/ou ano.',
            parameters: [
              { name: 'id', type: 'path', description: 'ID numérico do deputado.' },
              { name: 'ano', type: 'query', description: 'Ano de ocorrência da despesa (AAAA).' },
              { name: 'mes', type: 'query', description: 'Mês de ocorrência da despesa (MM).' }
            ]
          }
        ]
      },
      {
        name: 'Proposições',
        endpoints: [
          {
            id: 'getProposicoes',
            method: 'GET',
            path: '/proposicoes',
            description: 'Lista proposições (projetos de lei, PECs, etc.) com filtros.',
            parameters: [
              { name: 'siglaTipo', type: 'query', description: 'Tipo da proposição (PL, PEC, MP, etc.).' },
              { name: 'numero', type: 'query', description: 'Número da proposição.' },
              { name: 'ano', type: 'query', description: 'Ano da proposição.' },
              { name: 'keywords', type: 'query', description: 'Palavras-chave no título ou ementa.' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Senado Federal',
    baseUrl: 'https://legis.senado.leg.br/dadosabertos',
    categories: [
      {
        name: 'Senadores',
        endpoints: [
          {
            id: 'getSenadores',
            method: 'GET',
            path: '/senador/lista/atual',
            description: 'Lista de senadores em exercício.',
            parameters: [
              { name: 'partido', type: 'query', description: 'Sigla do partido.' },
              { name: 'uf', type: 'query', description: 'Sigla da unidade federativa.' }
            ]
          }
        ]
      }
    ]
  }
];