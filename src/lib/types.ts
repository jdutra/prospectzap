export interface Empresa {
  id: string;
  nome: string;
  categoria_principal: string;
  bairro: string;
  lat: number | null;
  lng: number | null;
  telefone: string | null;
  whatsapp: string | null;
  site: string | null;
  instagram: string | null;
  nota_google: number | null;
  total_avaliacoes: number | null;
  score_prospeccao: number;
  score_gap_digital: number;
  score_autoridade: number;
  score_potencial: number;
  porte_estimado: "micro" | "pequeno" | "medio" | null;
  tem_site: boolean;
  tem_instagram: boolean;
  tem_whatsapp: boolean;
  link_maps: string | null;
  endereco: string | null;
  is_rede: boolean;
  // Enriquecimento externo
  email: string | null;
  email_fonte: string | null;
  cnpj: string | null;
  cnpj_situacao: string | null;
  cnpj_abertura: string | null;
  razao_social: string | null;
  cnpj_natureza_juridica: string | null;
  cnpj_porte: string | null;
  cnpj_capital_social: number | string | null;
  fotos_google: number;
  responde_reviews: boolean;
  tem_facebook: boolean;
  facebook_url: string | null;
  enriched_at: string | null;
}

export interface Filtros {
  categoria: string;
  bairro: string;
  scoreMin: number;
  notaMin: number;
  avaliacoesMin: number;
  porte: string;
  temWhatsapp: boolean | null;
  semSite: boolean | null;
  semInstagram: boolean | null;
  crmStatus: string;           // filtro por status CRM do usuário
  cnpjAtivo: boolean | null;   // só CNPJs com situação ATIVA
}

export interface ChatMensagem {
  role: "user" | "assistant";
  content: string;
  rows?: Empresa[];
  count?: number;
  sql?: string;
}

export interface ChatResponse {
  resposta: string;
  sql_gerado: string;
  resultado: { rows: Empresa[]; count: number };
  erro: string | null;
}

export interface BairroIntel {
  bairro: string;
  score_oportunidade: number;
  renda_media: number | null;
  total_comercios: number;
  pct_sem_site: number;
  pct_sem_instagram: number;
}

// CRM de prospecção
export type CRMStatus =
  | "exportado"
  | "contactado"
  | "em_negociacao"
  | "convertido"
  | "sem_resposta"
  | "nao_interessa";

export interface Prospecao {
  id: string;
  empresa_id: string;
  user_id: string;
  status: CRMStatus;
  anotacao: string | null;
  criado_em: string;
  atualizado_em: string;
}

export const CRM_STATUS_LABELS: Record<CRMStatus, string> = {
  exportado:      "Exportado",
  contactado:     "Contactado",
  em_negociacao:  "Em negociação",
  convertido:     "Convertido ✓",
  sem_resposta:   "Sem resposta",
  nao_interessa:  "Não interessa",
};

export const CRM_STATUS_COLORS: Record<CRMStatus, string> = {
  exportado:      "bg-gray-700 text-gray-300 border-gray-600",
  contactado:     "bg-blue-500/15 text-blue-400 border-blue-500/30",
  em_negociacao:  "bg-amber-500/15 text-amber-400 border-amber-500/30",
  convertido:     "bg-green-500/15 text-green-400 border-green-500/30",
  sem_resposta:   "bg-red-500/10 text-red-400 border-red-500/20",
  nao_interessa:  "bg-gray-800 text-gray-600 border-gray-700",
};

// Saturação por bairro/categoria
export interface SaturacaoBairro {
  bairro: string;
  categoria: string;
  total_comercios: number;
  sem_site: number;
  sem_instagram: number;
  sem_whatsapp: number;
  pct_sem_site: number;
  pct_sem_instagram: number;
  pct_sem_whatsapp: number;
  nota_media: number;
  score_medio: number;
  indice_oportunidade: number;
}

// Trending queries
export interface TrendingItem {
  tipo: "categoria" | "bairro";
  termo: string;
  mencoes: number;
}

// ── Tipos usados pelas páginas Next.js (/busca e /chat) ─────────────────────

export interface FiltrosBusca {
  termo?: string;
  categoria?: string;
  bairro?: string;
  notaMin?: number;
  porte?: string;
  temSite?: boolean;
  temWhatsapp?: boolean;
  ordenar?: "nota" | "avaliacoes" | "score" | "nome";
}

export interface MensagemChat {
  id: string;
  role: "user" | "assistant";
  conteudo: string;
  criado_em: string;
  resultado?: { rows: Empresa[]; count: number };
  sql_gerado?: string;
}

export interface RespostaChat {
  resposta: string;
  sql_gerado: string;
  resultado: { rows: Empresa[]; count: number };
  erro: string | null;
}
