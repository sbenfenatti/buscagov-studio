# Scripts

Este diretório contém scripts para sincronização de dados do BuscaGov Studio.

## Configuração

### Variáveis de Ambiente

Configure as seguintes variáveis como **Secrets** no repositório GitHub:

- `SUPABASE_URL`: URL do seu projeto Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Service Role Key do Supabase (com bypass RLS)

**Para configurar no GitHub:**
1. Vá em Settings > Secrets and variables > Actions
2. Clique em "New repository secret"
3. Adicione cada variável

### Desenvolvimento Local

Crie um arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

## Scripts Disponíveis

### `sync/referencias_gerais.ts`

Sincroniza dados de referência da API da Câmara para a tabela `referencias_gerais`.

**Uso:**
```bash
npm run sync:referencias
```

**O que faz:**
- Busca todas as referências da API da Câmara (UFs, tipos de proposição, etc.)
- Faz upsert na tabela `referencias_gerais`
- Operação idempotente (pode rodar múltiplas vezes)

**Categorias sincronizadas:**
- `uf`: Estados brasileiros
- `tipos_proposicao`: Tipos de proposições (PL, PEC, etc.)
- `tipos_orgao`: Tipos de órgãos
- `tipos_evento`: Tipos de eventos
- `temas_proposicao`: Temas das proposições
- `tipos_autor`: Tipos de autores
- `situacao_deputado`: Situações dos deputados
- `cod_tipo_profissao`: Códigos de tipos de profissão
- `tipo_despesa`: Tipos de despesas

## Recomendações SQL

Para garantir a integridade dos dados, execute esta migration no Supabase:

```sql
-- Índice único para idempotência
CREATE UNIQUE INDEX IF NOT EXISTS uniq_referencias_categoria_codigo
ON referencias_gerais (categoria, codigo);

-- RLS para segurança
ALTER TABLE referencias_gerais ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública
DROP POLICY IF EXISTS "referencias_public_select" ON referencias_gerais;
CREATE POLICY "referencias_public_select"
ON referencias_gerais FOR SELECT
USING (true);

-- Apenas service role pode modificar (bypass RLS)
```