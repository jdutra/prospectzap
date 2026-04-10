import { supabase, FUNCTIONS_URL } from "./supabase";
import type { Empresa, FiltrosBusca, RespostaChat } from "./types";

// ── Chat IA ──────────────────────────────────────────────────────────────────

export async function enviarPergunta(
  pergunta: string,
  historico: { role: string; content: string }[] = [],
  sessaoId?: string
): Promise<RespostaChat> {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(`${FUNCTIONS_URL}/prospectzap-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
    body: JSON.stringify({ pergunta, historico, sessao_id: sessaoId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Erro ao processar pergunta");
  }

  return res.json();
}

// ── Busca e Filtros ───────────────────────────────────────────────────────────

export async function buscarEmpresas(
  filtros: FiltrosBusca,
  pagina = 0,
  porPagina = 50
): Promise<{ data: Empresa[]; count: number }> {
  let query = supabase
    .from("empresas_londrina")
    .select("*", { count: "exact" });

  if (filtros.termo) {
    query = query.ilike("nome", `%${filtros.termo}%`);
  }
  if (filtros.categoria) {
    query = query.eq("categoria_principal", filtros.categoria);
  }
  if (filtros.bairro) {
    query = query.ilike("bairro", `%${filtros.bairro}%`);
  }
  if (filtros.notaMin) {
    query = query.gte("nota_google", filtros.notaMin);
  }
  if (filtros.porte) {
    query = query.eq("porte_estimado", filtros.porte);
  }
  if (filtros.temSite === true) {
    query = query.eq("tem_site", true);
  }
  if (filtros.temSite === false) {
    query = query.eq("tem_site", false);
  }
  if (filtros.temWhatsapp === true) {
    query = query.eq("tem_whatsapp", true);
  }

  // Ordenação
  switch (filtros.ordenar) {
    case "nota":
      query = query.order("nota_google", { ascending: false, nullsFirst: false });
      break;
    case "avaliacoes":
      query = query.order("total_avaliacoes", { ascending: false, nullsFirst: false });
      break;
    case "score":
      query = query.order("score_prospeccao", { ascending: false });
      break;
    default:
      query = query.order("total_avaliacoes", { ascending: false, nullsFirst: false });
  }

  query = query.range(pagina * porPagina, (pagina + 1) * porPagina - 1);

  const { data, error, count } = await query;
  if (error) throw error;

  return { data: (data || []) as Empresa[], count: count || 0 };
}

// ── Metadados para filtros ────────────────────────────────────────────────────

export async function listarCategorias(): Promise<string[]> {
  const { data } = await supabase
    .from("empresas_londrina")
    .select("categoria_principal")
    .order("categoria_principal");

  const unicas = [...new Set((data || []).map((r) => r.categoria_principal))];
  return unicas.filter(Boolean);
}

export async function listarBairros(): Promise<string[]> {
  const { data } = await supabase
    .from("empresas_londrina")
    .select("bairro")
    .not("bairro", "is", null)
    .order("bairro");

  const unicos = [...new Set((data || []).map((r) => r.bairro))];
  return unicos.filter(Boolean).slice(0, 100);
}

// ── Dados para Reports ────────────────────────────────────────────────────────

export async function dadosPorCategoria() {
  const { data } = await supabase.rpc("run_select_query", {
    sql: `
      SELECT categoria_principal, COUNT(*) as total,
             ROUND(AVG(nota_google)::numeric, 2) as media_nota,
             COUNT(CASE WHEN tem_site THEN 1 END) as com_site
      FROM empresas_londrina
      GROUP BY categoria_principal
      ORDER BY total DESC
      LIMIT 20
    `,
  });
  return data ? JSON.parse(data) : [];
}

export async function dadosPorBairro() {
  const { data } = await supabase.rpc("run_select_query", {
    sql: `
      SELECT bairro, COUNT(*) as total,
             ROUND(AVG(nota_google)::numeric, 2) as media_nota
      FROM empresas_londrina
      WHERE bairro IS NOT NULL AND bairro != 'Londrina'
      GROUP BY bairro
      ORDER BY total DESC
      LIMIT 20
    `,
  });
  return data ? JSON.parse(data) : [];
}

export async function empresasSemPresencaDigital(categoria?: string) {
  let sql = `
    SELECT nome, categoria_principal, bairro, nota_google, total_avaliacoes, telefone, score_prospeccao
    FROM empresas_londrina
    WHERE tem_site = false AND tem_instagram = false
  `;
  if (categoria) sql += ` AND categoria_principal = '${categoria.replace(/'/g, "''")}'`;
  sql += " ORDER BY total_avaliacoes DESC NULLS LAST LIMIT 50";

  const { data } = await supabase.rpc("run_select_query", { sql });
  return data ? JSON.parse(data) : [];
}

export async function empresasBaixoScore(categoria?: string) {
  let sql = `
    SELECT nome, categoria_principal, bairro, nota_google, total_avaliacoes, telefone
    FROM empresas_londrina
    WHERE nota_google < 3.5 AND nota_google IS NOT NULL
  `;
  if (categoria) sql += ` AND categoria_principal = '${categoria.replace(/'/g, "''")}'`;
  sql += " ORDER BY nota_google ASC, total_avaliacoes DESC NULLS LAST LIMIT 50";

  const { data } = await supabase.rpc("run_select_query", { sql });
  return data ? JSON.parse(data) : [];
}
