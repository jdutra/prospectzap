"use client";

import { useState } from "react";
import { ExternalLink, Phone, Star, ChevronDown, ChevronUp } from "lucide-react";
import type { Empresa } from "@/lib/types";

interface Props {
  rows: Record<string, unknown>[];
  count: number;
}

const COLUNAS_EMPRESA = ["nome", "categoria_principal", "bairro", "nota_google", "total_avaliacoes", "porte_estimado", "telefone"];

function notaColor(nota: number | null) {
  if (!nota) return "text-gray-600";
  if (nota >= 4.5) return "text-green-400";
  if (nota >= 4.0) return "text-yellow-400";
  if (nota >= 3.0) return "text-orange-400";
  return "text-red-400";
}

function isEmpresaData(rows: Record<string, unknown>[]): boolean {
  return rows.length > 0 && "nome" in rows[0];
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "number") return val.toLocaleString("pt-BR");
  if (typeof val === "boolean") return val ? "Sim" : "Não";
  return String(val);
}

// Tabela genérica para resultados agregados (COUNT, GROUP BY, etc.)
function GenericTable({ rows }: { rows: Record<string, unknown>[] }) {
  const cols = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/5">
            {cols.map((col) => (
              <th key={col} className="text-left px-3 py-2 text-gray-600 font-medium uppercase tracking-wide text-[10px]">
                {col.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/3 hover:bg-white/2">
              {cols.map((col) => (
                <td key={col} className="px-3 py-2 text-gray-300">
                  {formatValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Tabela especializada para dados de empresas
function EmpresaTableRows({ rows }: { rows: Empresa[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/5">
            {COLUNAS_EMPRESA.map((col) => (
              <th key={col} className="text-left px-3 py-2 text-gray-600 font-medium uppercase tracking-wide text-[10px]">
                {col.replace(/_/g, " ")}
              </th>
            ))}
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((emp, i) => (
            <tr key={(emp as Empresa).id || i} className="border-b border-white/3 hover:bg-white/2 transition-colors">
              <td className="px-3 py-2 text-gray-200 font-medium max-w-[180px] truncate">{emp.nome}</td>
              <td className="px-3 py-2 text-gray-400">{emp.categoria_principal}</td>
              <td className="px-3 py-2 text-gray-400">{emp.bairro}</td>
              <td className="px-3 py-2">
                {emp.nota_google ? (
                  <span className={`flex items-center gap-1 ${notaColor(emp.nota_google)}`}>
                    <Star size={10} className="fill-current" />
                    {emp.nota_google.toFixed(1)}
                  </span>
                ) : <span className="text-gray-700">—</span>}
              </td>
              <td className="px-3 py-2 text-gray-400">{emp.total_avaliacoes ?? "—"}</td>
              <td className="px-3 py-2">
                {emp.porte_estimado ? (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    emp.porte_estimado === "medio" ? "bg-blue-500/15 text-blue-400"
                    : emp.porte_estimado === "pequeno" ? "bg-yellow-500/15 text-yellow-400"
                    : "bg-gray-500/15 text-gray-400"
                  }`}>{emp.porte_estimado}</span>
                ) : "—"}
              </td>
              <td className="px-3 py-2 text-gray-500">
                {emp.telefone ? (
                  <span className="flex items-center gap-1"><Phone size={10} />{emp.telefone}</span>
                ) : "—"}
              </td>
              <td className="px-3 py-2">
                {emp.link_maps && (
                  <a href={emp.link_maps} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-500 transition-colors">
                    <ExternalLink size={12} />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResultsTable({ rows, count }: Props) {
  const [expandido, setExpandido] = useState(false);

  if (!rows.length) return null;

  const isEmpresa = isEmpresaData(rows);
  const exibir = expandido ? rows : rows.slice(0, 5);

  // Resultado agregado com 1 linha e sem campo "nome" — não vale a pena mostrar tabela
  if (!isEmpresa && rows.length === 1 && Object.keys(rows[0]).length <= 2) return null;

  return (
    <div className="border border-white/6 rounded-xl overflow-hidden">
      <div className="px-3 py-2 bg-white/3 border-b border-white/6 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {count > rows.length
            ? `Mostrando ${rows.length} de ${count} resultados`
            : `${count} resultado${count !== 1 ? "s" : ""}`}
        </span>
        {rows.length > 5 && (
          <button
            onClick={() => setExpandido(!expandido)}
            className="text-xs text-brand-500 flex items-center gap-1 hover:text-brand-400"
          >
            {expandido ? <><ChevronUp size={12} /> Menos</> : <><ChevronDown size={12} /> Ver todos ({rows.length})</>}
          </button>
        )}
      </div>

      {isEmpresa
        ? <EmpresaTableRows rows={exibir as unknown as Empresa[]} />
        : <GenericTable rows={exibir} />
      }
    </div>
  );
}
