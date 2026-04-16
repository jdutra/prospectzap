"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Database, ChevronDown, ChevronUp, User, Zap } from "lucide-react";
import { enviarPergunta } from "@/lib/api";
import type { MensagemChat, RespostaChat } from "@/lib/types";
import ResultsTable from "@/components/ResultsTable";

const SUGESTOES = [
  "Quantos restaurantes tem no Centro com nota acima de 4?",
  "Quais pet shops ficam na Gleba Palhano?",
  "Academias com mais de 100 avaliações em Londrina",
  "Qual categoria tem mais empresas sem presença digital?",
  "Top 10 bairros com mais estabelecimentos",
  "Farmácias com nota abaixo de 3.5",
];

export default function ChatPage() {
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [sqlAberto, setSqlAberto] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function enviar(pergunta?: string) {
    const texto = (pergunta ?? input).trim();
    if (!texto || carregando) return;

    const msgUsuario: MensagemChat = {
      id: crypto.randomUUID(),
      role: "user",
      conteudo: texto,
      criado_em: new Date().toISOString(),
    };

    setMensagens((prev) => [...prev, msgUsuario]);
    setInput("");
    setCarregando(true);

    // Monta histórico para contexto (últimas 8 mensagens)
    const historico = mensagens.slice(-8).map((m) => ({
      role: m.role,
      content: m.conteudo,
    }));

    try {
      const resp: RespostaChat = await enviarPergunta(texto, historico);

      const msgBot: MensagemChat = {
        id: crypto.randomUUID(),
        role: "assistant",
        conteudo: resp.resposta,
        sql_gerado: resp.sql_gerado,
        resultado: resp.resultado ?? undefined,
        criado_em: new Date().toISOString(),
      };

      setMensagens((prev) => [...prev, msgBot]);
    } catch (err) {
      const msgErro: MensagemChat = {
        id: crypto.randomUUID(),
        role: "assistant",
        conteudo: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.",
        criado_em: new Date().toISOString(),
      };
      setMensagens((prev) => [...prev, msgErro]);
      console.error(err);
    } finally {
      setCarregando(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#141414]">
        <h1 className="text-base font-semibold text-white">Chat IA</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Pergunte em português sobre os 4.325 negócios de Londrina
        </p>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {mensagens.length === 0 && (
          <div className="max-w-2xl mx-auto">
            {/* Boas vindas */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-3">
                <Zap size={22} className="text-brand-500" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-1">
                Inteligência de Mercado Local
              </h2>
              <p className="text-sm text-gray-400">
                Faça qualquer pergunta sobre empresas, bairros ou categorias de Londrina.
              </p>
            </div>

            {/* Sugestões */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="text-left px-4 py-3 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-brand-500/30 text-sm text-gray-300 hover:text-white transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensagens.map((msg) => (
          <div key={msg.id} className="max-w-3xl mx-auto">
            {msg.role === "user" ? (
              <div className="flex gap-3 justify-end">
                <div className="max-w-[80%] bg-brand-500/15 border border-brand-500/20 rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-sm text-white">{msg.conteudo}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 mt-1">
                  <User size={13} className="text-brand-500" />
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-1">
                  <Zap size={13} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-[#1a1a1a] border border-white/6 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-sm text-gray-100 whitespace-pre-wrap leading-relaxed">
                      {msg.conteudo}
                    </p>
                  </div>

                  {/* Tabela de resultados */}
                  {msg.resultado && msg.resultado.count > 0 && (
                    <div className="mt-3">
                      <ResultsTable
                        rows={msg.resultado.rows}
                        count={msg.resultado.count}
                      />
                    </div>
                  )}

                  {/* SQL gerado (toggle) */}
                  {msg.sql_gerado && (
                    <button
                      onClick={() =>
                        setSqlAberto(sqlAberto === msg.id ? null : msg.id)
                      }
                      className="mt-2 flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      <Database size={11} />
                      SQL gerado
                      {sqlAberto === msg.id ? (
                        <ChevronUp size={11} />
                      ) : (
                        <ChevronDown size={11} />
                      )}
                    </button>
                  )}
                  {sqlAberto === msg.id && msg.sql_gerado && (
                    <pre className="mt-1 px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-green-400 overflow-x-auto">
                      {msg.sql_gerado}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {carregando && (
          <div className="max-w-3xl mx-auto flex gap-3">
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
              <Loader2 size={13} className="text-gray-400 animate-spin" />
            </div>
            <div className="bg-[#1a1a1a] border border-white/6 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/5 bg-[#141414]">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 items-end bg-[#1e1e1e] border border-white/8 rounded-2xl px-4 py-3 focus-within:border-brand-500/40 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre empresas de Londrina..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 resize-none outline-none min-h-[20px] max-h-[120px]"
              style={{ height: "auto" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
              }}
            />
            <button
              onClick={() => enviar()}
              disabled={!input.trim() || carregando}
              className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shrink-0 hover:bg-brand-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-700 mt-2">
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
}
