export interface Empresa {
  id: string;
  google_place_id: string | null;
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
  porte_estimado: "micro" | "pequeno" | "medio" | null;
  tem_site: boolean;
  tem_instagram: boolean;
  tem_whatsapp: boolean;
  link_maps: string | null;
  endereco: string | null;
  is_rede: boolean | null;
  cadastrado_londrinazap: boolean | null;
  atualizado_em: string | null;
}

export interface MensagemChat {
  id: string;
  role: "user" | "assistant";
  conteudo: string;
  sql_gerado?: string;
  resultado?: {
    rows: Record<string, unknown>[];
    count: number;
  };
  criado_em: string;
}

export interface RespostaChat {
  resposta: string;
  sql_gerado: string;
  resultado: {
    rows: Record<string, unknown>[];
    count: number;
  } | null;
  erro: string | null;
}

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

export type TipoReport =
  | "mapa_oportunidades"
  | "analise_saturacao"
  | "score_territorio"
  | "report_nicho"
  | "analise_digitalizacao"
  | "sem_presenca_digital"
  | "baixo_score_google";
