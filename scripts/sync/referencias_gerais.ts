// scripts/sync/referencias_gerais.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { getTodasReferencias } from "../../src/lib/api/referencias";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // usar a service role key (server-side)

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Faltam SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no ambiente.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

type RefRow = {
  categoria: string;
  codigo: string;
  valor: string;
  ativo?: boolean;
};

async function ensureUniqueIndex() {
  // Cria índice único se não existir (opcional; recomendado rodar via migration SQL)
  // Caso use migrations separadas, remova esta chamada e aplique o SQL no seu fluxo de migração.
  const { error } = await supabase.rpc("exec", {
    sql: `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'uniq_referencias_categoria_codigo'
        ) THEN
          CREATE UNIQUE INDEX uniq_referencias_categoria_codigo
          ON referencias_gerais (categoria, codigo);
        END IF;
      END
      $$;
    `,
  } as any);
  if (error) {
    console.warn("Aviso: não foi possível garantir índice único via RPC. Aplique via migration SQL.");
  }
}

async function upsertBatch(rows: RefRow[]) {
  const chunk = 500;
  for (let i = 0; i < rows.length; i += chunk) {
    const slice = rows.slice(i, i + chunk);
    const { error } = await supabase
      .from("referencias_gerais")
      .upsert(slice.map((r) => ({ ...r, ativo: true })), {
        onConflict: "categoria,codigo",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Erro no upsert:", error);
      throw error;
    }
  }
}

async function main() {
  // Opcional: garantir índice único
  // await ensureUniqueIndex();

  const todas = await getTodasReferencias();
  // Remover duplicatas por (categoria,codigo)
  const map = new Map<string, RefRow>();
  for (const r of todas) {
    const key = `${r.categoria}__${r.codigo}`;
    if (!map.has(key)) map.set(key, r as RefRow);
  }
  const rows = Array.from(map.values());
  console.log(`Sincronizando ${rows.length} referências...`);

  await upsertBatch(rows);

  console.log("Referências sincronizadas com sucesso.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});