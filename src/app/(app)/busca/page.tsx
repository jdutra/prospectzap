"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Filter, X, Star, Phone, ExternalLink, Loader2,
  Globe, Instagram, Mail, MessageCircle,
} from "lucide-react";
import { buscarEmpresas, listarCategorias, listarBairros } from "@/lib/api";
import type { Empresa, FiltrosBusca } from "@/lib/types";

const CATEGORIAS_RAPIDAS = [
  "Restaurantes e Lanchonetes",
  "Salões de Beleza e Barbearias",
  "Pet Shops e Veterinários",
  "Academias",
  "Farmácias e Drogarias",
  "Clínicas e Saúde",
];

function notaColor(nota: number | null) {
  if (!nota) return "text-gray-600";
  if (nota >= 4.5) return "text-green-400";
  if (nota >= 4.0) return "text-yellow-400";
  return "text-orange-400";
}

export default function BuscaPage() {
  const [filtros, setFiltros] = useState<FiltrosBusca>({ ordenar: "avaliacoes" });
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [painel, setPainel] = useState(false);

  useEffect(() => {
    listarCategorias().then(setCategorias);
  }, []);

  const buscar = useCallback(async (pg = 0) => {
    setCarregando(true);
    try {
      const { data, count } = await buscarEmpresas(filtros, pg);
      if (pg === 0) {
        setEmpresas(data);
      } else {
        setEmpresas((prev) => [...prev, ...data]);
      }
      setTotal(count);
      setPagina(pg);
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    buscar(0);
  }, [buscar]);

  function setFiltro<K extends keyof FiltrosBusca>(key: K, val: FiltrosBusca[K]) {
    setFiltros((prev) => ({ ...prev, [key]: val }));
    setPagina(0);
  }

  function limparFiltros() {
    setFiltros({ ordenar: "avaliacoes" });
  }

  const filtrosAtivos = Object.entries(filtros).filter(
    ([k, v]) => k !== "ordenar" && v !== undefined && v !== ""
  ).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#141414]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-semibold text-white">Busca e Filtros</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {carregando ? "Buscando..." : `${total.toLocaleString("pt-BR")} empresas encontradas`}
            </p>
          </div>
          <div className="flex gap-2">
            {filtrosAtivos > 0 && (
              <button
                onClick={limparFiltros}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-colors"
              >
                <X size={12} />
                Limpar ({filtrosAtivos})
              </button>
            )}
            <button
              onClick={() => setPainel(!painel)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors ${
                painel
                  ? "bg-brand-500/15 text-brand-500 border-brand-500/30"
                  : "text-gray-400 hover:text-white border-white/10 hover:border-white/20"
              }`}
            >
              <Filter size={12} />
              Filtros{filtrosAtivos > 0 ? ` (${filtrosAtivos})` : ""}
            </button>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[#1e1e1e] border border-white/8 rounded-xl px-3 py-2">
            <Search size={14} className="text-gray-600 shrink-0" />
            <input
              type="text"
              value={filtros.termo || ""}
              onChange={(e) => setFiltro("termo", e.target.value)}
              placeholder="Buscar por nome..."
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
            />
            {filtros.termo && (
              <button onClick={() => setFiltro("termo", "")} className="text-gray-600 hover:text-gray-400">
                <X size={12} />
              </button>
            )}
          </div>
          <select
            value={filtros.ordenar || "avaliacoes"}
            onChange={(e) => setFiltro("ordenar", e.target.value as FiltrosBusca["ordenar"])}
            className="bg-[#1e1e1e] border border-white/8 rounded-xl px-3 py-2 text-sm text-gray-300 outline-none cursor-pointer"
          >
            <option value="avaliacoes">+ Avaliações</option>
            <option value="nota">+ Nota</option>
            <option value="score">+ Score</option>
            <option value="nome">Nome</option>
          </select>
        </div>

        {/* Categorias rápidas */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {CATEGORIAS_RAPIDAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro("categoria", filtros.categoria === cat ? "" : cat)}
              className={`shrink-0 px-3 py-1 text-xs rounded-full border transition-colors ${
                filtros.categoria === cat
                  ? "bg-brand-500/20 text-brand-400 border-brand-500/40"
                  : "text-gray-500 border-white/8 hover:border-white/20 hover:text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Painel de filtros avançados */}
      {painel && (
        <div className="px-6 py-4 bg-[#161616] border-b border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Categoria</label>
            <select
              value={filtros.categoria || ""}
              onChange={(e) => setFiltro("categoria", e.target.value)}
              className="w-full bg-[#1e1e1e] border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none"
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Nota mínima</label>
            <select
              value={filtros.notaMin || ""}
              onChange={(e) => setFiltro("notaMin", e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-[#1e1e1e] border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none"
            >
              <option value="">Qualquer</option>
              <option value="3">≥ 3.0</option>
              <option value="3.5">≥ 3.5</option>
              <option value="4">≥ 4.0</option>
              <option value="4.5">≥ 4.5</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Porte</label>
            <select
              value={filtros.porte || ""}
              onChange={(e) => setFiltro("porte", e.target.value)}
              className="w-full bg-[#1e1e1e] border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none"
            >
              <option value="">Todos</option>
              <option value="micro">Micro</option>
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Presença digital</label>
            <div className="space-y-1.5 mt-1">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.temWhatsapp === true}
                  onChange={(e) => setFiltro("temWhatsapp", e.target.checked ? true : undefined)}
                  className="accent-brand-500"
                />
                Tem WhatsApp
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.temSite === false}
                  onChange={(e) => setFiltro("temSite", e.target.checked ? false : undefined)}
                  className="accent-brand-500"
                />
                Sem site (leads digitais)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Lista de resultados */}
      <div className="flex-1 overflow-y-auto p-6">
        {carregando && pagina === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-gray-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {empresas.map((emp) => (
                <EmpresaCard key={emp.id} emp={emp} />
              ))}
            </div>

            {empresas.length < total && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => buscar(pagina + 1)}
                  disabled={carregando}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 text-sm text-gray-300 transition-colors disabled:opacity-50"
                >
                  {carregando ? (
                    <Loader2 size={14} className="animate-spin inline mr-2" />
                  ) : null}
                  Carregar mais ({total - empresas.length} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmpresaCard({ emp }: { emp: Empresa }) {
  const waDigits = (emp.telefone ?? "").replace(/\D/g, "");
  const waLink   = emp.tem_whatsapp && waDigits.length >= 10
    ? `https://wa.me/${waDigits}`
    : null;

  return (
    <div className="bg-[#161616] border border-white/6 rounded-xl p-4 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-white truncate">{emp.nome}</h3>
          {emp.razao_social && emp.razao_social !== emp.nome && (
            <p className="text-[10px] text-gray-600 truncate mt-0.5">{emp.razao_social}</p>
          )}
          <p className="text-xs text-gray-500 mt-0.5">{emp.categoria_principal}</p>
        </div>
        {emp.nota_google && (
          <div className={`flex items-center gap-1 shrink-0 ${notaColor(emp.nota_google)}`}>
            <Star size={11} className="fill-current" />
            <span className="text-xs font-medium">{emp.nota_google.toFixed(1)}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 mb-3">{emp.bairro}</p>

      <div className="flex items-center gap-2 flex-wrap">
        {emp.porte_estimado && (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
              emp.porte_estimado === "medio"
                ? "bg-blue-500/10 text-blue-400"
                : emp.porte_estimado === "pequeno"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-gray-500/10 text-gray-500"
            }`}
          >
            {emp.porte_estimado}
          </span>
        )}
        {emp.cnpj_porte && (
          <span
            className="px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400"
            title="Porte oficial RFB"
          >
            {emp.cnpj_porte}
          </span>
        )}
        {emp.total_avaliacoes && (
          <span className="text-[10px] text-gray-600">
            {emp.total_avaliacoes} avaliações
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 flex-wrap mt-3 pt-3 border-t border-white/5">
        {emp.telefone && (
          <a
            href={`tel:${emp.telefone}`}
            title={emp.telefone}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Phone size={10} />
            <span className="font-mono">{emp.telefone}</span>
          </a>
        )}
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            title={`WhatsApp ${emp.telefone}`}
            className="p-1.5 rounded text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/15 transition-colors"
          >
            <MessageCircle size={12} />
          </a>
        )}
        {emp.site && (
          <a
            href={emp.site}
            target="_blank"
            rel="noopener noreferrer"
            title={emp.site}
            className="p-1.5 rounded text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/15 transition-colors"
          >
            <Globe size={12} />
          </a>
        )}
        {emp.instagram && (
          <a
            href={emp.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title={emp.instagram}
            className="p-1.5 rounded text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/15 transition-colors"
          >
            <Instagram size={12} />
          </a>
        )}
        {emp.email && (
          <a
            href={`mailto:${emp.email}`}
            title={emp.email}
            className="p-1.5 rounded text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/15 transition-colors"
          >
            <Mail size={12} />
          </a>
        )}
        {emp.link_maps && (
          <a
            href={emp.link_maps}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver no Google Maps"
            className="ml-auto p-1.5 text-gray-600 hover:text-brand-500 transition-colors"
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
