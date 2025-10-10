import React from 'react';

import { ApiSource } from './types';

import { DeputiesIcon, LegislaturesIcon, PartiesIcon, VotesIcon, BillsIcon, OrgansIcon, EventsIcon, ReferencesIcon, FrentesIcon, GruposIcon, BlocosIcon, SenadoIcon, CamaraIcon, DiscursoIcon, ParlamentarIcon, PlenarioIcon, ProcessoIcon, LegislacaoIcon, OrcamentoIcon } from './components/icons';

export const API_SOURCES: ApiSource[] = [



name: 'Câmara dos Deputados',

baseUrl: 'https://dadosabertos.camara.leg.br/api/v2',

icon: CamaraIcon,

categories: [



name: 'Deputados',

icon: DeputiesIcon,

endpoints: [



id: 'getDeputados',

method: 'GET',

path: '/deputados',

description: 'Retorna uma lista de dados básicos sobre deputados que estiveram em exercício parlamentar.',

longDescription: 'Retorna uma lista de dados básicos sobre deputados que estiveram em exercício parlamentar. Você pode filtrar por vários parâmetros para refinar os resultados.',

parameters: [

{ name: 'id', type: 'query', description: 'ID do deputado separados por vírgula.', autocomplete: 'deputados' },

{ name: 'nome', type: 'query', description: 'Parte do nome parlamentar do deputado.' },

{ name: 'idLegislatura', type: 'query', description: 'Número da legislatura a que pertenceu o deputado.' },

{ name: 'siglaUf', type: 'query', description: 'Sigla do estado pelo qual foi eleito.', autocomplete: 'ufs' },

{ name: 'siglaPartido', type: 'query', description: 'Sigla do partido do deputado.', autocomplete: 'partidos' },

{ name: 'siglaSexo', type: 'query', description: 'M para masculino, F para feminino ou NI para não informado.', enum: ['M', 'F', 'NI'] },

{ name: 'itens', type: 'query', description: 'Número máximo de itens na resposta.', type: 'number' },

{ name: 'ordem', type: 'query', description: 'Critério de ordenação do resultado.', enum: ['ASC', 'DESC'] },

{ name: 'ordenarPor', type: 'query', description: 'Nome do campo pelos quais a resposta será ordenada.', enum: ['id', 'nome', 'siglaUf', 'siglaPartido'] }

],

},



id: 'getDeputadosId',

method: 'GET',

path: '/deputados/{id}',

description: 'Dados pessoais de um deputado, incluindo nome completo, sexo, data de nascimento, foto, etc.',

longDescription: 'Dados pessoais de um deputado, incluindo nome completo, sexo, data de nascimento, foto, etc.',

parameters: [

{ name: 'id', type: 'path', description: 'ID numérico do deputado na Câmara dos Deputados.' }

],

},



id: 'getDeputadosDespesas',

method: 'GET',

path: '/deputados/{id}/despesas',

description: 'Despesas do deputado por tipo, mês e/ou ano, e por fornecedor.',

longDescription: 'Despesas do deputado por tipo, mês e/ou ano, e por fornecedor.',

parameters: [

{ name: 'id', type: 'path', description: 'ID numérico do deputado na Câmara dos Deputados.' },

{ name: 'idLegislatura', type: 'query', description: 'Número da legislatura.' },

{ name: 'ano', type: 'query', description: 'Ano de ocorrência da despesa (AAAA).', type: 'number' },

{ name: 'mes', type: 'query', description: 'Mês de ocorrência da despesa (MM).', type: 'number' },

{ name: 'cnpjCpfFornecedor', type: 'query', description: 'CNPJ ou CPF do fornecedor.' },

{ name: 'ordem', type: 'query', description: 'Critério de ordenação do resultado.', enum: ['ASC', 'DESC'] },

{ name: 'ordenarPor', type: 'query', description: 'Nome do campo pelos quais a resposta será ordenada.', enum: ['ano', 'mes', 'tipoDespesa', 'valorDocumento', 'valorGlosa', 'valorLiquido'] },

{ name: 'itens', type: 'query', description: 'Número máximo de itens na resposta.', type: 'number' }

],

},



id: 'getDeputadosDiscursos',

method: 'GET',

path: '/deputados/{id}/discursos',

description: 'Lista de discursos feitos pelo deputado.',

longDescription: 'Lista de discursos feitos pelo deputado.',

parameters: [

{ name: 'id', type: 'path', description: 'ID numérico do deputado na Câmara dos Deputados.' },

{ name: 'dataInicio', type: 'query', description: 'Data de início do intervalo de tempo (AAAA-MM-DD).' },

{ name: 'dataFim', type: 'query', description: 'Data de fim do intervalo de tempo (AAAA-MM-DD).' },

{ name: 'ordem', type: 'query', description: 'Critério de ordenação do resultado.', enum: ['ASC', 'DESC'] },

{ name: 'ordenarPor', type: 'query', description: 'Nome do campo pelos quais a resposta será ordenada.', enum: ['dataHoraInicio'] },

{ name: 'itens', type: 'query', description: 'Número máximo de itens na resposta.', type: 'number' }

],

},



id: 'getDeputadosEventos',

method: 'GET',

path: '/deputados/{id}/eventos',

description: 'Eventos dos quais o deputado pode participar, sendo eles sessões plenárias ou de comissões.',

longDescription: 'Eventos dos quais o deputado pode participar, sendo eles sessões plenárias ou de comissões.',

parameters: [

{ name: 'id', type: 'path', description: 'ID numérico do deputado na Câmara dos Deputados.' },

{ name: 'dataInicio', type: 'query', description: 'Data de início do intervalo de tempo (AAAA-MM-DD).' },

{ name: 'dataFim', type: 'query', description: 'Data de fim do intervalo de tempo (AAAA-MM-DD).' },

{ name: 'ordem', type: 'query', description: 'Critério de ordenação do resultado.', enum: ['ASC', 'DESC'] },

{ name: 'ordenarPor', type: 'query', description: 'Nome do campo pelos quais a resposta será ordenada.', enum: ['dataHoraInicio'] },

{ name: 'itens', type: 'query', description: 'Número máximo de itens na resposta.', type: 'number' }

],

},



id: 'getDeputadosOcupacoes',

method: 'GET',

path: '/deputados/{id}/ocupacoes',

description: 'Profissões anteriores ao mandato, declaradas pelo próprio deputado.',

longDescription: 'Profissões anteriores ao mandato, declaradas pelo próprio deputado.',

parameters: [

{ name: 'id', type: 'path', description: 'ID numérico do deputado na Câmara dos Deputados.' },

{ name: 'dataInicio', type: 'query', description: 'Data de início do intervalo de tempo (AAAA-MM-DD).' },

{ name: 'dataFim', type: 'query', description: 'Data de fim do intervalo de tempo (AAAA-MM-DD).' },

{ name: 'ordem', type: 'query', description: 'Critério de ordenação do resultado.', enum: ['ASC', 'DESC'] },

{ name: 'ordenarPor', type: 'query', description: 'Nome do campo pelos quais a resposta será ordenada.', enum: ['entidade'] },

{ name: 'itens', type: 'query', description: 'Número máximo de itens na resposta.', type: 'number' }

],

},



id: 'getDeputadosOrgaos',

method: 'GET',

path: '/deputados/{id}/orgaos',

description: 'Órgãos dos quais o deputado participou.',

longDescription: 'Órgãos dos quais o deputado participou.',

parameters: [

{ name: 'id', type: 'path', description: 'ID numérico do deputado na Câmara dos Deputados.' },

{ name: 'dataInicio', type: 'query', description: 'Data de início do intervalo de tempo (AAAA-MM-DD).' },

{ name: 'dataFim', type: 'query', description: 'Data de fim do intervalo de tempo (AAAA-MM-DD).' },

{ name: 'ordem', type: 'query', description: 'Critério de ordenação do resultado.', enum: ['ASC', 'DESC'] },

{ name: 'ordenarPor', type: 'query', description: 'Nome do campo pelos quais a resposta será ordenada.', enum: ['dataInicio'] },

{ name: 'itens', type: 'query', description: 'Número máximo de itens na resposta.', type: 'number' }

],

}