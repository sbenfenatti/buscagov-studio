// src/lib/api/referencias.ts
/* Câmara - Referências
   Base: https://dadosabertos.camara.leg.br/api/v2 (ver paths em endpoints_parlamento.ts)
*/
type CamaraListResponse<T> = {
  dados: T[];
  links?: { rel: string; href: string }[];
};

const CAMARA_BASE_URL = "https://dadosabertos.camara.leg.br/api/v2";

// Backoff simples para lidar com 429/5xx
async function fetchCamara<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${CAMARA_BASE_URL}/${path}`;
  let attempt = 0;
  const max = 3;
  let lastErr: any;

  while (attempt < max) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          accept: "application/json",
          ...(init?.headers || {}),
        },
        // Câmara aceita sem auth; adicionar headers aqui se necessário
      });
      if (!res.ok) {
        if (res.status >= 500 || res.status === 429) {
          throw new Error(`HTTP ${res.status}`);
        }
        const body = await res.text();
        throw new Error(`Fetch failed ${res.status}: ${body}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      lastErr = err;
      attempt += 1;
      if (attempt >= max) break;
      // backoff exponencial
      await new Promise((r) => setTimeout(r, 400 * 2 ** (attempt - 1)));
    }
  }
  throw lastErr;
}

// Heurística genérica de mapeamento para {codigo, valor}
function mapCodigoValor(obj: any): { codigo: string; valor: string } {
  const codigoKey = ["sigla", "codigo", "cod", "id"].find((k) => k in obj);
  const valorKey = ["nome", "titulo", "descricao", "descricaoTipo", "desc"].find((k) => k in obj);

  const codigo = String(codigoKey ? obj[codigoKey] : obj?.sigla ?? obj?.codigo ?? obj?.id ?? "");
  const valor = String(valorKey ? obj[valorKey] : obj?.nome ?? obj?.titulo ?? obj?.descricao ?? "");

  return { codigo, valor };
}

// Funções de referência (paths conforme endpoints_parlamento.ts)
export async function getReferenciasUF() {
  // referencias/uf
  const data = await fetchCamara<CamaraListResponse<any>>("referencias/uf");
  return data.dados.map(mapCodigoValor);
}

export async function getReferenciasTiposProposicao() {
  // referencias/proposicoes/siglaTipo
  const data = await fetchCamara<CamaraListResponse<any>>("referencias/proposicoes/siglaTipo");
  return data.dados.map(mapCodigoValor);
}

export async function getReferenciasTiposOrgao() {
  // referencias/tiposOrgao
  const data = await fetchCamara<CamaraListResponse<any>>("referencias/tiposOrgao");
  return data.dados.map(mapCodigoValor);
}

export async function getReferenciasTiposEvento() {
  // referencias/tiposEvento
  const data = await fetchCamara<CamaraListResponse<any>>("referencias/tiposEvento");
  return data.dados.map(mapCodigoValor);
}

export async function getReferenciasTemasProposicao() {
  // referencias/proposicoes/codTema
  const data = await fetchCamara<CamaraListResponse<any>>("referencias/proposicoes/codTema");
  return data.dados.map(mapCodigoValor);
}

export async function getReferenciasTiposAutor() {
  // referencias/tiposAutor
  const data = await fetchCamara<CamaraListResponse<any>>("referencias/tiposAutor");
  return data.dados.map(mapCodigoValor);
}

// Usadas por campos específicos de outras tabelas
export async function getReferenciasSituacaoDeputado() {
  // referencias/situacoesDeputado
  const data = await fetchCamara<CamaraListResponse<any>>("referencias/situacoesDeputado");
  return data.dados.map(mapCodigoValor);
}

export async function getReferenciasCodTipoProfissao() {
  // referencias/deputados/codTipoProfissao
  const data = await fetchCamara<CamaraListResponse<any>>("referencias/deputados/codTipoProfissao");
  return data.dados.map(mapCodigoValor);
}

export async function getReferenciasTipoDespesa() {
  // referencias/deputados/tipoDespesa
  const data = await fetchCamara<CamaraListResponse<any>>("referencias/deputados/tipoDespesa");
  return data.dados.map(mapCodigoValor);
}

// Utilitário para obter todas com rotulagem de categoria
export async function getTodasReferencias() {
  const [
    ufs,
    tiposProposicao,
    tiposOrgao,
    tiposEvento,
    temasProposicao,
    tiposAutor,
    situacaoDeputado,
    tiposProfissao,
    tipoDespesa,
  ] = await Promise.all([
    getReferenciasUF(),
    getReferenciasTiposProposicao(),
    getReferenciasTiposOrgao(),
    getReferenciasTiposEvento(),
    getReferenciasTemasProposicao(),
    getReferenciasTiposAutor(),
    getReferenciasSituacaoDeputado(),
    getReferenciasCodTipoProfissao(),
    getReferenciasTipoDespesa(),
  ]);

  return [
    ...ufs.map((x) => ({ categoria: "uf", ...x })),
    ...tiposProposicao.map((x) => ({ categoria: "tipos_proposicao", ...x })),
    ...tiposOrgao.map((x) => ({ categoria: "tipos_orgao", ...x })),
    ...tiposEvento.map((x) => ({ categoria: "tipos_evento", ...x })),
    ...temasProposicao.map((x) => ({ categoria: "temas_proposicao", ...x })),
    ...tiposAutor.map((x) => ({ categoria: "tipos_autor", ...x })),
    ...situacaoDeputado.map((x) => ({ categoria: "situacao_deputado", ...x })),
    ...tiposProfissao.map((x) => ({ categoria: "cod_tipo_profissao", ...x })),
    ...tipoDespesa.map((x) => ({ categoria: "tipo_despesa", ...x })),
  ];
}