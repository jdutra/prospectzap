import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import {
  Download, ArrowUpDown, Star, Wifi, Globe, Instagram,
  ExternalLink, Sparkles, Target, Camera, Phone, Mail, MessageCircle,
} from "lucide-react";
import { Empresa, Prospecao, CRM_STATUS_LABELS, CRM_STATUS_COLORS, CRMStatus } from "../lib/types";
import PitchModal from "./PitchModal";
import CRMModal from "./CRMModal";

const col = createColumnHelper<Empresa>();

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 100 ? "bg-orange/15 text-orange border-orange/30" :
    score >= 70  ? "bg-amber-radar/15 text-amber-radar border-amber-radar/30" :
    score >= 40  ? "bg-blue-500/15 text-blue-400 border-blue-500/30" :
                  "bg-gray-700 text-gray-500 border-gray-700";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md border font-mono text-xs font-bold ${color}`}>
      {score}
    </span>
  );
}

function SubScores({ e }: { e: Empresa }) {
  return (
    <div className="flex gap-1" title={`Gap: ${e.score_gap_digital} | Autoridade: ${e.score_autoridade} | Potencial: ${e.score_potencial}`}>
      <span className="w-1.5 rounded-full bg-orange/70" style={{ height: `${Math.max(4, (e.score_gap_digital / 50) * 16)}px`, alignSelf: "flex-end" }} />
      <span className="w-1.5 rounded-full bg-blue-400/70" style={{ height: `${Math.max(4, (e.score_autoridade / 50) * 16)}px`, alignSelf: "flex-end" }} />
      <span className="w-1.5 rounded-full bg-green-radar/70" style={{ height: `${Math.max(4, (e.score_potencial / 40) * 16)}px`, alignSelf: "flex-end" }} />
    </div>
  );
}

function ContactChips({ e }: { e: Empresa }) {
  const stop = (ev: React.MouseEvent) => ev.stopPropagation();
  const waDigits = (e.telefone ?? "").replace(/\D/g, "");
  const chips: JSX.Element[] = [];

  if (e.telefone) {
    chips.push(
      <a
        key="tel"
        href={`tel:${e.telefone}`}
        onClick={stop}
        title={e.telefone}
        className="p-1 rounded text-gray-400 hover:text-orange hover:bg-orange/10 transition-colors"
      >
        <Phone size={12} />
      </a>
    );
  }
  if (e.tem_whatsapp && waDigits.length >= 10) {
    chips.push(
      <a
        key="wa"
        href={`https://wa.me/${waDigits}`}
        target="_blank"
        rel="noreferrer"
        onClick={stop}
        title={`WhatsApp ${e.telefone}`}
        className="p-1 rounded text-gray-400 hover:text-green-radar hover:bg-green-radar/10 transition-colors"
      >
        <MessageCircle size={12} />
      </a>
    );
  }
  if (e.site) {
    chips.push(
      <a
        key="site"
        href={e.site}
        target="_blank"
        rel="noreferrer"
        onClick={stop}
        title={e.site}
        className="p-1 rounded text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
      >
        <Globe size={12} />
      </a>
    );
  }
  if (e.instagram) {
    chips.push(
      <a
        key="insta"
        href={e.instagram}
        target="_blank"
        rel="noreferrer"
        onClick={stop}
        title={e.instagram}
        className="p-1 rounded text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 transition-colors"
      >
        <Instagram size={12} />
      </a>
    );
  }
  if (e.email) {
    chips.push(
      <a
        key="mail"
        href={`mailto:${e.email}`}
        onClick={stop}
        title={e.email}
        className="p-1 rounded text-gray-400 hover:text-amber-radar hover:bg-amber-radar/10 transition-colors"
      >
        <Mail size={12} />
      </a>
    );
  }

  if (chips.length === 0) {
    return <span className="text-gray-700 text-xs">—</span>;
  }
  return <div className="flex items-center gap-0.5">{chips}</div>;
}

function GapIcons({ e }: { e: Empresa }) {
  return (
    <div className="flex items-center gap-2">
      <span title={e.tem_whatsapp ? "Tem WhatsApp" : "Sem WhatsApp"}>
        <Wifi size={13} className={e.tem_whatsapp ? "text-green-radar" : "text-gray-700"} />
      </span>
      <span title={e.tem_site ? "Tem site" : "Sem site"}>
        <Globe size={13} className={e.tem_site ? "text-blue-400" : "text-gray-700"} />
      </span>
      <span title={e.tem_instagram ? "Tem Instagram" : "Sem Instagram"}>
        <Instagram size={13} className={e.tem_instagram ? "text-purple-400" : "text-gray-700"} />
      </span>
      {e.fotos_google > 0 && (
        <span title={`${e.fotos_google} fotos no Google`} className="flex items-center gap-0.5">
          <Camera size={11} className="text-gray-500" />
          <span className="text-gray-600 text-xs font-mono">{e.fotos_google}</span>
        </span>
      )}
    </div>
  );
}

function CnpjBadge({ situacao }: { situacao: string | null }) {
  if (!situacao) return null;
  const isAtiva = situacao.toUpperCase().includes("ATIVA");
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${
      isAtiva
        ? "bg-green-500/10 text-green-400 border-green-500/20"
        : "bg-red-500/10 text-red-400 border-red-500/20"
    }`}>
      {isAtiva ? "CNPJ ✓" : "CNPJ ✗"}
    </span>
  );
}

interface Props {
  empresas: Empresa[];
  loading: boolean;
  onSelect: (e: Empresa) => void;
  onChatResults: (rows: Empresa[]) => void;
  prospecoes?: Record<string, Prospecao>;
  onProspecaoSave?: (p: Prospecao) => void;
  isLoggedIn?: boolean;
}

function exportCSV(empresas: Empresa[]) {
  const headers = [
    "nome","razao_social","categoria","bairro","nota_google","total_avaliacoes",
    "score_prospeccao","score_gap_digital","score_autoridade","score_potencial",
    "porte_google","porte_rf","natureza_juridica","capital_social",
    "telefone","whatsapp_link","site","instagram","email","email_fonte",
    "tem_whatsapp","tem_site","tem_instagram",
    "link_maps","cnpj","cnpj_situacao","cnpj_abertura",
    "fotos_google","responde_reviews",
  ].join(",");

  const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  const rows = empresas.map((e) => {
    const waDigits = (e.telefone ?? "").replace(/\D/g, "");
    const waLink   = e.tem_whatsapp && waDigits.length >= 10
      ? `https://wa.me/${waDigits}`
      : "";
    return [
      q(e.nome),
      q(e.razao_social),
      q(e.categoria_principal),
      q(e.bairro),
      e.nota_google ?? "",
      e.total_avaliacoes ?? "",
      e.score_prospeccao,
      e.score_gap_digital ?? 0,
      e.score_autoridade ?? 0,
      e.score_potencial ?? 0,
      q(e.porte_estimado),
      q(e.cnpj_porte),
      q(e.cnpj_natureza_juridica),
      e.cnpj_capital_social ?? "",
      q(e.telefone),
      q(waLink),
      q(e.site),
      q(e.instagram),
      q(e.email),
      q(e.email_fonte),
      e.tem_whatsapp ? "sim" : "não",
      e.tem_site ? "sim" : "não",
      e.tem_instagram ? "sim" : "não",
      q(e.link_maps),
      q(e.cnpj),
      q(e.cnpj_situacao),
      q(e.cnpj_abertura),
      e.fotos_google ?? 0,
      e.responde_reviews ? "sim" : "não",
    ].join(",");
  });

  const csv = [headers, ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `radar-londrina-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResultsTable({
  empresas,
  loading,
  onSelect,
  prospecoes = {},
  onProspecaoSave,
  isLoggedIn = false,
}: Props) {
  const [sorting, setSorting]         = useState<SortingState>([{ id: "score_prospeccao", desc: true }]);
  const [pitchEmpresa, setPitchEmpresa] = useState<Empresa | null>(null);
  const [crmEmpresa, setCrmEmpresa]    = useState<Empresa | null>(null);

  const columns = [
    col.accessor("nome", {
      header: "Nome",
      cell: (i) => (
        <span className="text-gray-100 text-sm font-medium truncate max-w-[160px] block">
          {i.getValue()}
        </span>
      ),
    }),
    col.accessor("categoria_principal", {
      header: "Categoria",
      cell: (i) => <span className="text-gray-400 text-xs">{i.getValue()}</span>,
    }),
    col.accessor("bairro", {
      header: "Bairro",
      cell: (i) => <span className="text-gray-400 text-xs">{i.getValue()}</span>,
    }),
    col.accessor("nota_google", {
      header: "Nota",
      cell: (i) => {
        const v = i.getValue();
        if (!v) return <span className="text-gray-600">—</span>;
        return (
          <span className="flex items-center gap-1 text-amber-radar text-xs font-mono">
            <Star size={11} className="fill-amber-radar" />
            {Number(v).toFixed(1)}
          </span>
        );
      },
    }),
    col.accessor("total_avaliacoes", {
      header: "Reviews",
      cell: (i) => (
        <span className="text-gray-500 text-xs font-mono">
          {i.getValue()?.toLocaleString("pt-BR") ?? "—"}
        </span>
      ),
    }),
    col.accessor("score_prospeccao", {
      header: "Score",
      cell: (i) => (
        <div className="flex items-center gap-2">
          <ScoreBadge score={Math.round(i.getValue())} />
          <SubScores e={i.row.original} />
        </div>
      ),
    }),
    col.display({
      id: "gap",
      header: "Gap digital",
      cell: ({ row }) => <GapIcons e={row.original} />,
    }),
    col.display({
      id: "contato",
      header: "Contato",
      cell: ({ row }) => <ContactChips e={row.original} />,
    }),
    col.accessor("porte_estimado", {
      header: "Porte",
      cell: (i) => (
        <span className="text-gray-500 text-xs capitalize">{i.getValue() ?? "—"}</span>
      ),
    }),
    // CRM status column
    col.display({
      id: "crm",
      header: "CRM",
      cell: ({ row }) => {
        const p = prospecoes[row.original.id];
        if (!p) {
          return isLoggedIn ? (
            <button
              onClick={(e) => { e.stopPropagation(); setCrmEmpresa(row.original); }}
              className="text-xs text-gray-600 hover:text-orange transition-colors px-2 py-0.5 rounded border border-transparent hover:border-orange/30"
            >
              + Registrar
            </button>
          ) : null;
        }
        return (
          <button
            onClick={(e) => { e.stopPropagation(); setCrmEmpresa(row.original); }}
            className={`text-xs px-2 py-0.5 rounded border transition-all hover:opacity-80 ${CRM_STATUS_COLORS[p.status as CRMStatus]}`}
          >
            {CRM_STATUS_LABELS[p.status as CRMStatus]}
          </button>
        );
      },
    }),
    col.display({
      id: "acoes",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setPitchEmpresa(row.original); }}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-orange/10 text-orange border border-orange/30 hover:bg-orange/20 transition-colors"
            title="Gerar pitch IA"
          >
            <Sparkles size={11} />
            <span>Pitch</span>
          </button>
          {isLoggedIn && (
            <button
              onClick={(e) => { e.stopPropagation(); setCrmEmpresa(row.original); }}
              className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors"
              title="Registrar prospecção"
            >
              <Target size={12} />
            </button>
          )}
          {row.original.link_maps && (
            <a
              href={row.original.link_maps}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-gray-500 hover:text-orange transition-colors"
              title="Ver no Google Maps"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: empresas,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="h-full flex flex-col bg-gray-950">
        {/* Toolbar */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-700/60 bg-gray-900">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs font-mono">
              {empresas.length.toLocaleString("pt-BR")} empresas exibidas
            </span>
            {/* Sub-score legend */}
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange/70" /> Gap
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400/70" /> Autoridade
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-radar/70" /> Potencial
              </span>
            </div>
          </div>
          <button
            onClick={() => exportCSV(empresas)}
            disabled={empresas.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange/10 border border-orange/30 rounded-lg text-orange text-xs font-syne font-semibold hover:bg-orange/20 transition-colors disabled:opacity-40"
          >
            <Download size={12} /> Exportar CSV
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-orange/40 border-t-orange rounded-full animate-spin" />
            </div>
          ) : empresas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-600">
              <span className="text-2xl mb-2">🔍</span>
              <span className="text-sm">Nenhum resultado para os filtros selecionados</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-gray-900 z-10">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b border-gray-700/60">
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`px-3 py-2.5 text-gray-500 text-xs font-mono uppercase tracking-wider whitespace-nowrap ${
                          header.column.getCanSort() ? "cursor-pointer hover:text-orange select-none" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <ArrowUpDown size={10} className="opacity-40" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onSelect(row.original)}
                    className="border-b border-gray-800/60 hover:bg-gray-800/40 cursor-pointer transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modais */}
      {pitchEmpresa && (
        <PitchModal empresa={pitchEmpresa} onClose={() => setPitchEmpresa(null)} />
      )}
      {crmEmpresa && (
        <CRMModal
          empresa={crmEmpresa}
          prospecao={prospecoes[crmEmpresa.id] ?? null}
          onClose={() => setCrmEmpresa(null)}
          onSave={(p) => {
            onProspecaoSave?.(p);
            setCrmEmpresa(null);
          }}
        />
      )}
    </>
  );
}
