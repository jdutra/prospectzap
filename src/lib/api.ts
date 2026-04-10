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
  const { data, error } = await supabase
    .from("empresas_londrina")
    .select("categoria_principal, nota_google, tem_site");
  if (error) { console.error("dadosPorCategoria:", error); return []; }

  const map: Record<string, { total: number; notas: number[]; com_site: number }> = {};
  for (const r of data ?? []) {
    const cat = r.categoria_principal ?? "Outros";
    if (!map[cat]) map[cat] = { total: 0, notas: [], com_site: 0 };
    map[cat].total++;
    if (r.nota_google) map[cat].notas.push(r.nota_google);
    if (r.tem_site) map[cat].com_site++;
  }
  return Object.entries(map)
    .map(([categoria_principal, v]) => ({
      categoria_principal,
      total: v.total,
      media_nota: v.notas.length ? Math.round((v.notas.reduce((a, b) => a + b, 0) / v.notas.length) * 100) / 100 : 0,
      com_site: v.com_site,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 20);
}

export async function dadosPorBairro() {
  const { data, error } = await supabase
    .from("empresas_londrina")
    .select("bairro, nota_google")
    .not("bairro", "is", null)
    .neq("bairro", "Londrina");
  if (error) { console.error("dadosPorBairro:", error); return []; }

  const map: Record<string, { total: number; notas: number[] }> = {};
  for (const r of data ?? []) {
    const b = r.bairro ?? "";
    if (!b) continue;
    if (!map[b]) map[b] = { total: 0, notas: [] };
    map[b].total++;
    if (r.nota_google) map[b].notas.push(r.nota_google);
  }
  return Object.entries(map)
    .map(([bairro, v]) => ({
      bairro,
      total: v.total,
      media_nota: v.notas.length ? Math.round((v.notas.reduce((a, b) => a + b, 0) / v.notas.length) * 100) / 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 20);
}

export async function empresasSemPresencaDigital(categoria?: string) {
  let query = supabase
    .from("empresas_londrina")
    .select("nome, categoria_principal, bairro, nota_google, total_avaliacoes, telefone, score_prospeccao")
    .eq("tem_site", false)
    .eq("tem_instagram", false)
    .order("total_avaliacoes", { ascending: false, nullsFirst: false })
    .limit(50);
  if (categoria) query = query.eq("categoria_principal", categoria);
  const { data, error } = await query;
  if (error) console.error("empresasSemPresencaDigital:", error);
  return data ?? [];
}

export async function empresasBaixoScore(categoria?: string) {
  let query = supabase
    .from("empresas_londrina")
    .select("nome, categoria_principal, bairro, nota_google, total_avaliacoes, telefone")
    .lt("nota_google", 3.5)
    .not("nota_google", "is", null)
    .order("nota_google", { ascending: true })
    .limit(50);
  if (categoria) query = query.eq("categoria_principal", categoria);
  const { data, error } = await query;
  if (error) console.error("empresasBaixoScore:", error);
  return data ?? [];
}
