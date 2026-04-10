"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { BarChart2, TrendingUp, AlertCircle, Wifi, Loader2 } from "lucide-react";
import { dadosPorCategoria, dadosPorBairro, empresasSemPresencaDigital, empresasBaixoScore } from "@/lib/api";

const CORES = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5", "#fef3c7", "#fde68a", "#fcd34d"];

type AbaReport = "mercado" | "sem_digital" | "baixo_score";

interface DadoCategoria {
  categoria_principal: string;
  total: number;
  media_nota: number;
  com_site: number;
}

interface DadoBairro {
  bairro: string;
  total: number;
  media_nota: number;
}

interface EmpresaSimples {
  nome: string;
  categoria_principal: string;
  bairro: string;
  nota_google: number | null;
  total_avaliacoes: number | null;
  telefone: string | null;
  score_prospeccao?: number;
}

export default function ReportsPage() {
  const [aba, setAba] = useState<AbaReport>("mercado");
  const [categorias, setCategorias] = useState<DadoCategoria[]>([]);
  const [bairros, setBairros] = useState<DadoBairro[]>([]);
  const [semDigital, setSemDigital] = useState<EmpresaSimples[]>([]);
  const [baixoScore, setBaixoScore] = useState<EmpresaSimples[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  useEffect(() => {
    setCarregando(true);
    Promise.all([dadosPorCategoria(), dadosPorBairro()])
      .then(([cats, bairrs]) => {
        setCategorias(cats);
        setBairros(bairrs);
      })
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    if (aba === "sem_digital") {
      setCarregando(true);
      empresasSemPresencaDigital(categoriaSelecionada || undefined)
        .then(setSemDigital)
        .finally(() => setCarregando(false));
    }
    if (aba === "baixo_score") {
      setCarregando(true);
      empresasBaixoScore(categoriaSelecionada || undefined)
        .then(setBaixoScore)
        .finally(() => setCarregando(false));
    }
  }, [aba, categoriaSelecionada]);

  const abas = [
    { id: "mercado" as const,     icon: BarChart2,    label: "Visão de Mercado"   },
    { id: "sem_digital" as const, icon: Wifi,         label: "Sem Presença Digital" },
    { id: "baixo_score" as const, icon: AlertCircle,  label: "Baixo Score Google" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#141414]">
        <h1 className="text-base font-semibold text-white">Reports Automáticos</h1>
        <p className="text-xs text-gray-500 mt-0.5">Inteligência de mercado baseada nos dados reais de Londrina</p>

        <div className="flex gap-2 mt-3">
          {abas.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                aba === id
                  ? "bg-brand-500/15 text-brand-500 font-medium"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-6">
        {carregando && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={20} className="animate-spin text-gray-600" />
          </div>
        )}

        {/* ── Visão de Mercado ───────────────────────────────────────── */}
        {!carregando && aba === "mercado" && (
          <div className="space-y-6 max-w-5xl">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total de empresas",  valor: "4.325",  sub: "na base de dados" },
                { label: "Com telefone",        valor: "4.091",  sub: "94,7% da base"   },
                { label: "Nota média",          valor: "4.60",   sub: "estrelas Google" },
                { label: "Categorias",          valor: "35",     sub: "segmentos distintos" },
              ].map(({ label, valor, sub }) => (
                <div key={label} className="bg-[#161616] border border-white/6 rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">{valor}</p>
                  <p className="text-xs text-gray-400 mt-1">{label}</p>
                  <p className="text-[11px] text-gray-600">{sub}</p>
                </div>
              ))}
            </div>

            {/* Empresas por categoria */}
            <div className="bg-[#161616] border border-white/6 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-brand-500" />
                <h3 className="text-sm font-medium text-white">Empresas por Categoria</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categorias.slice(0, 15)} layout="vertical" margin={{ left: 160, right: 20 }}>
                  <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="categoria_principal"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={155}
                  />
                  <Tooltip
                    contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                    labelStyle={{ color: "#e5e7eb", fontSize: 12 }}
                    itemStyle={{ color: "#f97316", fontSize: 12 }}
                  />
                  <Bar dataKey="total" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top bairros + pizza */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161616] border border-white/6 rounded-xl p-5">
                <h3 className="text-sm font-medium text-white mb-4">Top 10 Bairros</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={bairros.slice(0, 10)} layout="vertical" margin={{ left: 120, right: 20 }}>
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="bairro"
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={115}
                    />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                      labelStyle={{ color: "#e5e7eb", fontSize: 12 }}
                      itemStyle={{ color: "#fb923c", fontSize: 12 }}
                    />
                    <Bar dataKey="total" fill="#fb923c" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#161616] border border-white/6 rounded-xl p-5">
                <h3 className="text-sm font-medium text-white mb-4">Distribuição por Porte</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Micro",   value: 1800 },
                        { name: "Pequeno", value: 1900 },
                        { name: "Médio",   value: 625  },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {["#f97316", "#fb923c", "#fdba74"].map((cor, i) => (
                        <Cell key={i} fill={cor} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                      itemStyle={{ color: "#e5e7eb", fontSize: 12 }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: "#9ca3af" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── Sem Presença Digital ────────────────────────────────────── */}
        {!carregando && aba === "sem_digital" && (
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#161616] border border-white/6 rounded-xl px-4 py-3 flex-1">
                <p className="text-2xl font-bold text-white">{semDigital.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">empresas sem site e sem Instagram</p>
              </div>
              <select
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                className="bg-[#1e1e1e] border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none"
              >
                <option value="">Todas as categorias</option>
                {[
                  "Restaurantes e Lanchonetes", "Salões de Beleza e Barbearias",
                  "Pet Shops e Veterinários", "Academias", "Farmácias e Drogarias",
                  "Clínicas e Saúde", "Mercados e Minimercados", "Padarias e Confeitarias",
                ].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <LeadsTable rows={semDigital} />
          </div>
        )}

        {/* ── Baixo Score Google ──────────────────────────────────────── */}
        {!carregando && aba === "baixo_score" && (
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#161616] border border-white/6 rounded-xl px-4 py-3 flex-1">
                <p className="text-2xl font-bold text-red-400">{baixoScore.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">empresas com nota abaixo de 3.5 — leads para consultoria de reputação</p>
              </div>
              <select
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                className="bg-[#1e1e1e] border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none"
              >
                <option value="">Todas as categorias</option>
                {["Restaurantes e Lanchonetes", "Academias", "Clínicas e Saúde", "Hotéis e Pousadas"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <LeadsTable rows={baixoScore} showNota />
          </div>
        )}
      </div>
    </div>
  );
}

function LeadsTable({ rows, showNota = false }: { rows: EmpresaSimples[]; showNota?: boolean }) {
  if (!rows.length) {
    return (
      <div className="text-center py-12 text-gray-600 text-sm">
        Nenhum resultado encontrado
      </div>
    );
  }

  return (
    <div className="bg-[#161616] border border-white/6 rounded-xl overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Nome</th>
            <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Categoria</th>
            <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Bairro</th>
            {showNota && <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Nota</th>}
            <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Avaliações</th>
            <th className="text-left px-4 py-2.5 text-gray-600 font-medium">Telefone</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((emp, i) => (
            <tr key={i} className="border-b border-white/3 hover:bg-white/2">
              <td className="px-4 py-2.5 text-gray-200 font-medium">{emp.nome}</td>
              <td className="px-4 py-2.5 text-gray-500">{emp.categoria_principal}</td>
              <td className="px-4 py-2.5 text-gray-500">{emp.bairro}</td>
              {showNota && (
                <td className="px-4 py-2.5 text-red-400 font-medium">
                  {emp.nota_google?.toFixed(1) ?? "—"}
                </td>
              )}
              <td className="px-4 py-2.5 text-gray-500">{emp.total_avaliacoes ?? "—"}</td>
              <td className="px-4 py-2.5 text-gray-500">{emp.telefone ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
