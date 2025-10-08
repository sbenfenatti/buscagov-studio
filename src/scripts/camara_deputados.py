from fastapi import APIRouter, Query
from typing import Optional, List
import requests

router = APIRouter()
base_url = "https://dadosabertos.camara.leg.br/api/v2"

# Helper function to make requests
def _make_request(endpoint: str, params: Optional[dict] = None):
    params = {k: v for k, v in params.items() if v is not None} if params else {}
    response = requests.get(f"{base_url}/{endpoint}", params=params)
    response.raise_for_status()  # Raise an exception for bad status codes
    return response.json()

# Endpoints da Categoria "Deputados"

@router.get("/deputados", tags=["Deputados"])
def get_deputados(
    id: Optional[List[int]] = Query(None, description='ID do deputado (separados por vírgula).'),
    nome: Optional[str] = Query(None, description='Parte do nome parlamentar.'),
    siglaUf: Optional[str] = Query(None, description='Sigla da UF (e.g., SP, RJ).'),
    siglaPartido: Optional[str] = Query(None, description='Sigla do partido (e.g., PT, PL).'),
    pagina: Optional[int] = Query(1, description='Número da página de resultados.'),
    itens: Optional[int] = Query(15, description='Número de itens por página.')
):
    """
    Retorna uma lista de dados básicos sobre deputados que estiveram em exercício parlamentar.
    """
    params = {"id": id, "nome": nome, "siglaUf": siglaUf, "siglaPartido": siglaPartido, "pagina": pagina, "itens": itens}
    return _make_request("deputados", params)

@router.get("/deputados/{id}", tags=["Deputados"])
def get_deputado_by_id(id: int):
    """
    Retorna os dados cadastrais de um parlamentar específico.
    """
    return _make_request(f"deputados/{id}")

@router.get("/deputados/{id}/despesas", tags=["Deputados"])
def get_deputado_despesas(
    id: int,
    idLegislatura: Optional[int] = Query(None, description='ID da legislatura.'),
    ano: Optional[int] = Query(None, description='Ano da despesa (e.g., 2023).'),
    mes: Optional[int] = Query(None, description='Mês da despesa (e.g., 1-12).'),
    cnpjCpfFornecedor: Optional[str] = Query(None, description='CNPJ ou CPF do fornecedor.'),
    pagina: Optional[int] = Query(1, description='Número da página.'),
    itens: Optional[int] = Query(15, description='Itens por página.'),
    ordenarPor: Optional[str] = Query(None, description='Campo para ordenação.')
):
    """
    Retorna as despesas com exercício parlamentar do deputado.
    """
    params = {"idLegislatura": idLegislatura, "ano": ano, "mes": mes, "cnpjCpfFornecedor": cnpjCpfFornecedor, "pagina": pagina, "itens": itens, "ordenarPor": ordenarPor}
    return _make_request(f"deputados/{id}/despesas", params)

@router.get("/deputados/{id}/discursos", tags=["Deputados"])
def get_deputado_discursos(
    id: int,
    dataInicio: Optional[str] = Query(None, description='Data de início (AAAA-MM-DD).'),
    dataFim: Optional[str] = Query(None, description='Data de fim (AAAA-MM-DD).')
):
    """
    Lista de discursos feitos por um deputado.
    """
    params = {"dataInicio": dataInicio, "dataFim": dataFim}
    return _make_request(f"deputados/{id}/discursos", params)

@router.get("/deputados/{id}/eventos", tags=["Deputados"])
def get_deputado_eventos(id: int):
    """
    Lista de eventos com a participação de um deputado.
    """
    return _make_request(f"deputados/{id}/eventos")

@router.get("/deputados/{id}/frentes", tags=["Deputados"])
def get_deputado_frentes(id: int):
    """
    Frentes parlamentares das quais um deputado é integrante.
    """
    return _make_request(f"deputados/{id}/frentes")

@router.get("/deputados/{id}/ocupacoes", tags=["Deputados"])
def get_deputado_ocupacoes(id: int):
    """
    Empregos e atividades que o deputado já teve.
    """
    return _make_request(f"deputados/{id}/ocupacoes")

@router.get("/deputados/{id}/orgaos", tags=["Deputados"])
def get_deputado_orgaos(id: int):
    """
    Órgãos dos quais um deputado é integrante.
    """
    return _make_request(f"deputados/{id}/orgaos")

@router.get("/deputados/{id}/historico", tags=["Deputados"])
def get_deputado_historico(
    id: int,
    dataInicio: Optional[str] = Query(None, description="Data de início (AAAA-MM-DD)."),
    dataFim: Optional[str] = Query(None, description="Data de fim (AAAA-MM-DD).")
):
    """
    Lista de mudanças no exercício parlamentar de um deputado (mudança de partido, licenças, etc.).
    """
    params = {"dataInicio": dataInicio, "dataFim": dataFim}
    return _make_request(f"deputados/{id}/historico", params)

@router.get("/deputados/{id}/mandatosExternos", tags=["Deputados"])
def get_deputado_mandatos_externos(id: int):
    """
    Lista outros cargos eletivos que o parlamentar já exerceu fora da Câmara dos Deputados.
    """
    return _make_request(f"deputados/{id}/mandatosExternos")

@router.get("/deputados/{id}/profissoes", tags=["Deputados"])
def get_deputado_profissoes(id: int):
    """
    Apresenta as profissões que o parlamentar declarou à Câmara.
    """
    return _make_request(f"deputados/{id}/profissoes")

# Endpoints da Categoria "Frentes"

@router.get("/frentes", tags=["Frentes"])
def get_frentes(
    idLegislatura: Optional[int] = Query(None, description="ID da legislatura.")
):
    """
    Retorna uma lista de frentes parlamentares.
    """
    params = {"idLegislatura": idLegislatura}
    return _make_request("frentes", params)

@router.get("/frentes/{id}", tags=["Frentes"])
def get_frente_by_id(id: int):
    """
    Retorna informações detalhadas sobre uma frente parlamentar.
    """
    return _make_request(f"frentes/{id}")

@router.get("/frentes/{id}/membros", tags=["Frentes"])
def get_frente_membros(id: int):
    """
    Retorna uma lista de deputados membros de uma frente.
    """
    return _make_request(f"frentes/{id}/membros")

# Endpoints da Categoria "Partidos"

@router.get("/partidos", tags=["Partidos"])
def get_partidos(
    sigla: Optional[str] = Query(None, description="Sigla do partido (e.g., PT, PL)."),
    dataInicio: Optional[str] = Query(None, description="Data de início (AAAA-MM-DD)."),
    dataFim: Optional[str] = Query(None, description="Data de fim (AAAA-MM-DD).")
):
    """
    Retorna uma lista de partidos políticos que têm ou já tiveram deputados.
    """
    params = {"sigla": sigla, "dataInicio": dataInicio, "dataFim": dataFim}
    return _make_request("partidos", params)

@router.get("/partidos/{id}", tags=["Partidos"])
def get_partido_by_id(id: int):
    """
    Retorna informações detalhadas sobre um partido.
    """
    return _make_request(f"partidos/{id}")

@router.get("/partidos/{id}/membros", tags=["Partidos"])
def get_partido_membros(id: int):
    """
    Retorna uma lista de deputados membros de um partido.
    """
    return _make_request(f"partidos/{id}/membros")

@router.get("/partidos/{id}/lideres", tags=["Partidos"])
def get_partido_lideres(id: int):
    """
    Lista de líderes e vice-líderes de um partido.
    """
    return _make_request(f"partidos/{id}/lideres")

# Endpoints da Categoria "Votações"

@router.get("/votacoes", tags=["Votações"])
def get_votacoes(
    dataInicio: Optional[str] = Query(None, description="Data de início (AAAA-MM-DD)."),
    dataFim: Optional[str] = Query(None, description="Data de fim (AAAA-MM-DD)."),
    idProposicao: Optional[int] = Query(None, description="ID da proposição.")
):
    """
    Retorna uma lista de informações básicas sobre as votações ocorridas.
    """
    params = {"dataInicio": dataInicio, "dataFim": dataFim, "idProposicao": idProposicao}
    return _make_request("votacoes", params)

@router.get("/votacoes/{id}", tags=["Votações"])
def get_votacao_by_id(id: str):
    """
    Retorna informações detalhadas sobre uma votação específica.
    """
    return _make_request(f"votacoes/{id}")

@router.get("/votacoes/{id}/votos", tags=["Votações"])
def get_votacao_votos(id: str):
    """
    Retorna como cada parlamentar votou em uma votação.
    """
    return _make_request(f"votacoes/{id}/votos")

@router.get("/votacoes/{id}/orientacoes", tags=["Votações"])
def get_votacao_orientacoes(id: str):
    """
    O voto recomendado pelas lideranças.
    """
    return _make_request(f"votacoes/{id}/orientacoes")

# Endpoints da Categoria "Proposições"

@router.get("/proposicoes", tags=["Proposições"])
def get_proposicoes(
    ano: Optional[int] = Query(None, description="Ano de apresentação."),
    siglaTipo: Optional[str] = Query(None, description="Sigla do tipo (e.g., PL, PEC)."),
    numero: Optional[int] = Query(None, description="Número da proposição."),
    idDeputadoAutor: Optional[int] = Query(None, description="ID do deputado autor.")
):
    """
    Lista de informações básicas sobre projetos de lei, resoluções, etc.
    """
    params = {"ano": ano, "siglaTipo": siglaTipo, "numero": numero, "idDeputadoAutor": idDeputadoAutor}
    return _make_request("proposicoes", params)

@router.get("/proposicoes/{id}", tags=["Proposições"])
def get_proposicao_by_id(id: int):
    """
    Informações detalhadas sobre uma proposição específica.
    """
    return _make_request(f"proposicoes/{id}")

@router.get("/proposicoes/{id}/autores", tags=["Proposições"])
def get_proposicao_autores(id: int):
    """
    Lista pessoas e/ou entidades autoras de uma proposição.
    """
    return _make_request(f"proposicoes/{id}/autores")

@router.get("/proposicoes/{id}/relacionadas", tags=["Proposições"])
def get_proposicao_relacionadas(id: int):
    """
    Lista de proposições relacionadas a uma em especial.
    """
    return _make_request(f"proposicoes/{id}/relacionadas")

@router.get("/proposicoes/{id}/tramitacoes", tags=["Proposições"])
def get_proposicao_tramitacoes(id: int):
    """
    O histórico de passos na tramitação de uma proposta.
    """
    return _make_request(f"proposicoes/{id}/tramitacoes")

@router.get("/proposicoes/{id}/votacoes", tags=["Proposições"])
def get_proposicao_votacoes(id: int):
    """
    Votações sobre uma proposição específica.
    """
    return _make_request(f"proposicoes/{id}/votacoes")

@router.get("/proposicoes/{id}/temas", tags=["Proposições"])
def get_proposicao_temas(id: int):
    """
    Apresenta a lista de áreas temáticas com as quais uma proposição se relaciona.
    """
    return _make_request(f"proposicoes/{id}/temas")

# Endpoints da Categoria "Legislaturas"

@router.get("/legislaturas", tags=["Legislaturas"])
def get_legislaturas(
    id: Optional[int] = Query(None, description="ID da legislatura."),
    data: Optional[str] = Query(None, description="Data (AAAA-MM-DD).")
):
    """
    Lista os períodos de mandatos e atividades parlamentares da Câmara.
    """
    params = {"id": id, "data": data}
    return _make_request("legislaturas", params)

@router.get("/legislaturas/{id}", tags=["Legislaturas"])
def get_legislatura_by_id(id: int):
    """
    Informações extras sobre uma determinada legislatura da Câmara.
    """
    return _make_request(f"legislaturas/{id}")

@router.get("/legislaturas/{id}/mesa", tags=["Legislaturas"])
def get_legislatura_mesa(id: int):
    """
    Deputados que fizeram parte da Mesa Diretora.
    """
    return _make_request(f"legislaturas/{id}/mesa")

@router.get("/legislaturas/{id}/lideres", tags=["Legislaturas"])
def get_legislatura_lideres(id: int):
    """
    Retorna a lista de parlamentares que ocuparam cargos de liderança ao longo da legislatura.
    """
    return _make_request(f"legislaturas/{id}/lideres")

# Endpoints da Categoria "Órgãos"

@router.get("/orgaos", tags=["Órgãos"])
def get_orgaos(
    sigla: Optional[str] = Query(None, description="Sigla do órgão."),
    dataInicio: Optional[str] = Query(None, description="Data de início (AAAA-MM-DD)."),
    dataFim: Optional[str] = Query(None, description="Data de fim (AAAA-MM-DD).")
):
    """
    A lista das comissões e outros órgãos legislativos da Câmara.
    """
    params = {"sigla": sigla, "dataInicio": dataInicio, "dataFim": dataFim}
    return _make_request("orgaos", params)

@router.get("/orgaos/{id}", tags=["Órgãos"])
def get_orgao_by_id(id: int):
    """
    Informações detalhadas sobre um órgão da Câmara.
    """
    return _make_request(f"orgaos/{id}")

@router.get("/orgaos/{id}/eventos", tags=["Órgãos"])
def get_orgao_eventos(id: int):
    """
    Eventos ocorridos ou previstos em um órgão.
    """
    return _make_request(f"orgaos/{id}/eventos")

@router.get("/orgaos/{id}/membros", tags=["Órgãos"])
def get_orgao_membros(id: int):
    """
    Lista de parlamentares que ocupam cargos em um órgão.
    """
    return _make_request(f"orgaos/{id}/membros")

@router.get("/orgaos/{id}/votacoes", tags=["Órgãos"])
def get_orgao_votacoes(id: int):
    """
    Votações de um órgão.
    """
    return _make_request(f"orgaos/{id}/votacoes")

# Endpoints da Categoria "Eventos"

@router.get("/eventos", tags=["Eventos"])
def get_eventos(
    dataInicio: Optional[str] = Query(None, description="Data de início (AAAA-MM-DD)."),
    dataFim: Optional[str] = Query(None, description="Data de fim (AAAA-MM-DD)."),
    idOrgao: Optional[int] = Query(None, description="ID do órgão.")
):
    """
    Lista de eventos como reuniões de comissões e sessões do plenário.
    """
    params = {"dataInicio": dataInicio, "dataFim": dataFim, "idOrgao": idOrgao}
    return _make_request("eventos", params)

@router.get("/eventos/{id}", tags=["Eventos"])
def get_evento_by_id(id: int):
    """
    Detalhes de um evento.
    """
    return _make_request(f"eventos/{id}")

@router.get("/eventos/{id}/deputados", tags=["Eventos"])
def get_evento_deputados(id: int):
    """
    Deputados participantes de um evento.
    """
    return _make_request(f"eventos/{id}/deputados")

@router.get("/eventos/{id}/orgaos", tags=["Eventos"])
def get_evento_orgaos(id: int):
    """
    Órgãos organizadores de um evento.
    """
    return _make_request(f"eventos/{id}/orgaos")

@router.get("/eventos/{id}/pauta", tags=["Eventos"])
def get_evento_pauta(id: int):
    """
    Proposições de um evento.
    """
    return _make_request(f"eventos/{id}/pauta")

@router.get("/eventos/{id}/votacoes", tags=["Eventos"])
def get_evento_votacoes(id: int):
    """
    Votações de um evento.
    """
    return _make_request(f"eventos/{id}/votacoes")

# Endpoints da Categoria "Blocos"

@router.get("/blocos", tags=["Blocos"])
def get_blocos(idLegislatura: Optional[int] = Query(None, description="ID da legislatura.")):
    """
    Lista de blocos partidários.
    """
    return _make_request("blocos", {"idLegislatura": idLegislatura})

@router.get("/blocos/{id}", tags=["Blocos"])
def get_bloco_by_id(id: str):
    """
    Detalhes de um bloco partidário.
    """
    return _make_request(f"blocos/{id}")

# Endpoints da Categoria "Grupos"

@router.get("/grupos", tags=["Grupos"])
def get_grupos(
    id: Optional[int] = Query(None, description="ID do grupo."),
    idLegislatura: Optional[int] = Query(None, description="ID da legislatura.")
):
    """
    Lista de grupos e conselhos.
    """
    params = {"id": id, "idLegislatura": idLegislatura}
    return _make_request("grupos", params)

@router.get("/grupos/{id}", tags=["Grupos"])
def get_grupo_by_id(id: int):
    """
    Detalhes de um grupo.
    """
    return _make_request(f"grupos/{id}")

@router.get("/grupos/{id}/membros", tags=["Grupos"])
def get_grupo_membros(id: int):
    """
    Membros de um grupo.
    """
    return _make_request(f"grupos/{id}/membros")

# Endpoints da Categoria "Referências"

@router.get("/referencias/proposicoes/siglaTipo", tags=["Referências"])
def get_referencias_proposicoes_sigla_tipo():
    """
    Lista os tipos de proposição.
    """
    return _make_request("referencias/proposicoes/siglaTipo")

@router.get("/referencias/proposicoes/temas", tags=["Referências"])
def get_referencias_proposicoes_temas():
    """
    Retorna a lista de temas de proposições.
    """
    return _make_request("referencias/proposicoes/temas")

@router.get("/referencias/situacoesDeputado", tags=["Referências"])
def get_referencias_situacoes_deputado():
    """
    Lista as possíveis situações de um deputado.
    """
    return _make_request("referencias/situacoesDeputado")

@router.get("/referencias/situacoesProposicao", tags=["Referências"])
def get_referencias_situacoes_proposicao():
    """
    Lista as possíveis situações de uma proposição.
    """
    return _make_request("referencias/situacoesProposicao")

@router.get("/referencias/tiposOrgao", tags=["Referências"])
def get_referencias_tipos_orgao():
    """
    Lista de tipos de órgãos da Câmara.
    """
    return _make_request("referencias/tiposOrgao")

@router.get("/referencias/ufs", tags=["Referências"])
def get_referencias_ufs():
    """
    Lista de Unidades Federativas do Brasil.
    """
    return _make_request("referencias/ufs")
