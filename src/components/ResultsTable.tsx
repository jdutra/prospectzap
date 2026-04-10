"use client";

import { useState } from "react";
import { ExternalLink, Phone, Star, ChevronDown, ChevronUp } from "lucide-react";
import type { Empresa } from "@/lib/types";

interface Props {
  rows: Empresa[];
  count: number;
}

const COLUNAS_PADRAO = ["nome", "categoria_principal", "bairro", "nota_google", "total_avaliacoes", "porte_estimado", "telefone"];

function notaColor(nota: number | null) {
  if (!nota) return "text-gray-600";
  if (nota >= 4.5) return "text-green-400";
  if (nota >= 4.0) return "text-yellow-400";
  if (nota >= 3.0) return "text-orange-400";
  return "text-red-400";
}

export default function ResultsTable({ rows, count }: Props) {
  const [expandido, setExpandido] = useState(false);
  const exibir = expandido ? rows : rows.slice(0, 5);

  if (!rows.length) return null;

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
            {expandido ? (
              <><ChevronUp size={12} /> Menos</>
            ) : (
              <><ChevronDown size={12} /> Ver todos ({rows.length})</>
            )}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              {COLUNAS_PADRAO.map((col) => (
                <th
                  key={col}
                  className="text-left px-3 py-2 text-gray-600 font-medium uppercase tracking-wide text-[10px]"
                >
                  {col.replace(/_/g, " ")}
                </th>
              ))}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {exibir.map((emp, i) => (
              <tr
                key={emp.id || i}
                className="border-b border-white/3 hover:bg-white/2 transition-colors"
              >
                <td className="px-3 py-2 text-gray-200 font-medium max-w-[200px] truncate">
                  {emp.nome}
                </td>
                <td className="px-3 py-2 text-gray-400">{emp.categoria_principal}</td>
                <td className="px-3 py-2 text-gray-400">{emp.bairro}</td>
                <td className="px-3 py-2">
                  {emp.nota_google ? (
                    <span className={`flex items-center gap-1 ${notaColor(emp.nota_google)}`}>
                      <Star size={10} className="fill-current" />
                      {emp.nota_google.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-gray-700">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-400">
                  {emp.total_avaliacoes ?? "—"}
                </td>
                <td className="px-3 py-2">
                  {emp.porte_estimado ? (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        emp.porte_estimado === "medio"
                          ? "bg-blue-500/15 text-blue-400"
                          : emp.porte_estimado === "pequeno"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-gray-500/15 text-gray-400"
                      }`}
                    >
                      {emp.porte_estimado}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2 text-gray-500">
                  {emp.telefone ? (
                    <span className="flex items-center gap-1">
                      <Phone size={10} />
                      {emp.telefone}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2">
                  {emp.link_maps && (
                    <a
                      href={emp.link_maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-brand-500 transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
