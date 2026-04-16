"use client";

import Link from "next/link";
import { MessageCircle, Star, Zap, MapPin, Clock, ShoppingBag, Utensils, Scissors, HeartPulse, CheckCircle, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const CATEGORIAS = [
  { icon: Utensils,    label: "Restaurantes"    },
  { icon: Scissors,   label: "Salões de Beleza" },
  { icon: HeartPulse, label: "Clínicas"         },
  { icon: ShoppingBag,label: "Lojas"            },
];

const PERGUNTAS = [
  { q: "Qual restaurante italiano está aberto agora perto de mim?",           a: "Encontrei 3 restaurantes italianos abertos agora no Centro. O mais próximo é o La Trattoria, a 400m, com nota 4.8 ⭐" },
  { q: "Tem farmácia 24h no Jardim Piza?",                                    a: "Sim! A Farmácia Preço Popular fica na Av. Principal, 342 — aberta 24h, fone (43) 3333-4444." },
  { q: "Qual horário o Shopping Aurora fecha hoje?",                          a: "O Shopping Aurora fecha às 22h hoje (segunda-feira). Lojas âncoras fecham às 21h." },
  { q: "Que horas passa o ônibus 505 na Av. Higienópolis sentido centro?",    a: "O próximo 505 passa às 14h37. Depois às 15h02 e 15h27. Intervalo de ~25min no horário." },
];

const DEPOIMENTOS = [
  { nome: "Ana Claudia", negocio: "Salão Beleza & Cia", texto: "Meus clientes me encontram pelo LondrinaZAP toda semana. Valeu cada centavo.", nota: 5 },
  { nome: "Ricardo M.",  negocio: "Restaurante Sabor",  texto: "Aumentei as reservas em 40% no primeiro mês. O chatbot responde quando eu não posso.", nota: 5 },
  { nome: "Dra. Patrícia", negocio: "Clínica Bem Estar", texto: "Pacientes novos chegam perguntando pelo WhatsApp depois de me achar no LondrinaZAP.", nota: 5 },
];

export default function LandingPage() {
  const [faqAberto, setFaqAberto] = useState<number | null>(null);
  const [demoAtivo, setDemoAtivo] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center">
              <MessageCircle size={16} className="text-white fill-white" />
            </div>
            <span className="font-bold text-white text-lg">LondrinaZAP</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
            <a href="#para-comerciantes" className="hover:text-white transition-colors">Para comerciantes</a>
            <a href="#preco" className="hover:text-white transition-colors">Preço</a>
          </div>
          <a
            href="https://wa.me/5543999999999?text=Quero+anunciar+no+LondrinaZAP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <MessageCircle size={15} />
            Anunciar meu negócio
          </a>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Assistente digital oficial de Londrina
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Londrina na palma
            <br />
            <span className="text-green-400">da sua mão.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Encontre qualquer negócio, horário, ônibus ou evento de Londrina
            conversando pelo WhatsApp — sem app, sem cadastro, sem complicação.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="https://wa.me/5543999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/20"
            >
              <MessageCircle size={20} className="fill-white" />
              Falar com o LondrinaZAP
            </a>
            <a
              href="#como-funciona"
              className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-medium px-8 py-4 rounded-2xl text-lg transition-colors"
            >
              Ver como funciona
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { n: "4.325", label: "negócios cadastrados" },
              { n: "39",    label: "bairros de Londrina"   },
              { n: "100%",  label: "grátis para usuários"  },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-white">{n}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO CHAT ───────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              É só perguntar no WhatsApp
            </h2>
            <p className="text-gray-400 text-lg">Resposta instantânea, sem precisar pesquisar em vários lugares</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Lista de perguntas */}
            <div className="space-y-3">
              {PERGUNTAS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setDemoAtivo(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    demoAtivo === i
                      ? "bg-green-500/10 border-green-500/30 text-white"
                      : "border-white/6 text-gray-500 hover:text-gray-300 hover:border-white/10"
                  }`}
                >
                  <p className="text-sm">{item.q}</p>
                </button>
              ))}
            </div>

            {/* Preview do chat */}
            <div className="bg-[#111] rounded-3xl border border-white/6 overflow-hidden">
              {/* Header WhatsApp */}
              <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageCircle size={16} className="text-white fill-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">LondrinaZAP</p>
                  <p className="text-[11px] text-green-400">● online agora</p>
                </div>
              </div>

              {/* Mensagens */}
              <div className="p-4 space-y-3 min-h-[200px]">
                <div className="flex justify-end">
                  <div className="bg-green-600/80 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%]">
                    {PERGUNTAS[demoAtivo].q}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-[#1e1e1e] text-gray-100 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
                    {PERGUNTAS[demoAtivo].a}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="bg-[#1e1e1e] rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <p className="text-gray-600 text-sm flex-1">Mensagem</p>
                  <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                    <ArrowRight size={13} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIAS ──────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-widest">O que você encontra no LondrinaZAP</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Utensils,     label: "Restaurantes e bares",     n: "513"  },
              { icon: Scissors,    label: "Salões e barbearias",       n: "233"  },
              { icon: HeartPulse,  label: "Clínicas e saúde",          n: "375"  },
              { icon: ShoppingBag, label: "Lojas e comércio",          n: "1.200+" },
              { icon: Clock,       label: "Horários de ônibus",        n: "3 operadoras" },
              { icon: MapPin,      label: "Eventos em Londrina",       n: "sempre atualizado" },
              { icon: Star,        label: "Notas e avaliações",        n: "Google" },
              { icon: Zap,         label: "Respostas instantâneas",    n: "24h / 7 dias" },
            ].map(({ icon: Icon, label, n }) => (
              <div key={label} className="bg-[#111] border border-white/6 rounded-2xl p-4 hover:border-white/10 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-green-400" />
                </div>
                <p className="text-sm text-white font-medium mb-1">{label}</p>
                <p className="text-xs text-gray-500">{n}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA COMERCIANTES ───────────────────────────────────────── */}
      <section id="para-comerciantes" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-6">
                <Zap size={12} />
                Para donos de negócio
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Apareça na frente
                <br />
                dos seus concorrentes
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Quando alguém perguntar pelo seu tipo de negócio no LondrinaZAP,
                <strong className="text-white"> seu estabelecimento aparece primeiro</strong> — antes do Google, antes de qualquer concorrente.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "Aparece em destaque nas buscas do WhatsApp",
                  "Seus horários e contato sempre atualizados",
                  "Promoções e destaques enviados aos moradores do seu bairro",
                  "Sem precisar criar conta ou instalar nada",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">{item}</p>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/5543999999999?text=Quero+anunciar+meu+negócio+no+LondrinaZAP"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
              >
                <MessageCircle size={17} />
                Quero anunciar meu negócio
              </a>
            </div>

            {/* Card de destaque simulado */}
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-500/5 rounded-3xl blur-xl" />
              <div className="relative bg-[#111] border border-orange-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-[11px] font-bold uppercase tracking-wide">Parceiro em destaque</span>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Utensils size={22} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Seu Restaurante</h3>
                    <p className="text-gray-500 text-sm">Culinária brasileira · Centro</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                      <span className="text-xs text-gray-400 ml-1">4.9 (128 avaliações)</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white/3 rounded-xl p-3 text-center">
                    <p className="text-white font-bold text-lg">247</p>
                    <p className="text-gray-500 text-xs">clientes indicados esse mês</p>
                  </div>
                  <div className="bg-white/3 rounded-xl p-3 text-center">
                    <p className="text-white font-bold text-lg">#1</p>
                    <p className="text-gray-500 text-xs">posição na categoria</p>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-xs text-gray-600">Aberto agora · Fecha às 23h · (43) 3333-4444</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">O que os parceiros dizem</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {DEPOIMENTOS.map(({ nome, negocio, texto, nota }) => (
              <div key={nome} className="bg-[#111] border border-white/6 rounded-2xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: nota }).map((_, i) => (
                    <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{texto}"</p>
                <div>
                  <p className="text-white text-sm font-medium">{nome}</p>
                  <p className="text-gray-600 text-xs">{negocio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREÇO ───────────────────────────────────────────────────── */}
      <section id="preco" className="py-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Um preço. Simples assim.
          </h2>
          <p className="text-gray-400 mb-12">Sem taxas escondidas, sem contrato de fidelidade.</p>

          <div className="relative bg-[#111] border border-orange-500/30 rounded-3xl p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 rounded-full text-white text-xs font-bold">
              PLANO ÚNICO
            </div>

            <div className="mb-8">
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-gray-400 text-xl mb-2">R$</span>
                <span className="text-7xl font-bold text-white">79</span>
                <span className="text-gray-400 text-2xl mb-2">,90</span>
              </div>
              <p className="text-gray-500 text-sm">por mês · cancele quando quiser</p>
            </div>

            <div className="space-y-3 mb-8 text-left">
              {[
                "Aparição em destaque nas buscas",
                "Posicionamento acima do Google nas respostas",
                "Horários e contato sempre visíveis",
                "Promoções enviadas para moradores do bairro",
                "Relatório mensal de visualizações",
                "Suporte via WhatsApp",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-400 shrink-0" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/5543999999999?text=Quero+assinar+o+LondrinaZAP+por+R%2479%2C90%2Fmês"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-white font-bold py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/20"
            >
              <MessageCircle size={20} className="fill-white" />
              Começar agora por R$79,90/mês
            </a>
            <p className="text-gray-600 text-xs mt-3">Ativação em até 24h após o pagamento</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Perguntas frequentes</h2>
          <div className="space-y-2">
            {[
              { q: "Como o morador usa o LondrinaZAP?",                     r: "É só salvar o número e mandar mensagem no WhatsApp. Não precisa baixar app nem criar conta. Funciona em qualquer celular." },
              { q: "Meu negócio aparece mesmo sem ser parceiro?",            r: "Sim. Temos 4.325 negócios cadastrados via Google. Parceiros pagantes aparecem em destaque — acima dos demais e com informações completas." },
              { q: "Posso cancelar quando quiser?",                          r: "Sim. Sem multa, sem fidelidade. Basta avisar com 30 dias de antecedência." },
              { q: "Como atualizo meus horários e informações?",             r: "Você envia pelo WhatsApp mesmo. Nossa equipe atualiza em até 2h úteis." },
              { q: "O LondrinaZAP funciona 24 horas?",                      r: "Sim. O assistente responde automaticamente 24h por dia, 7 dias por semana — inclusive feriados." },
            ].map(({ q, r }, i) => (
              <div key={i} className="border border-white/6 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setFaqAberto(faqAberto === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/2 transition-colors"
                >
                  <span className="text-sm text-white font-medium pr-4">{q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 shrink-0 transition-transform ${faqAberto === i ? "rotate-180" : ""}`}
                  />
                </button>
                {faqAberto === i && (
                  <div className="px-5 pb-4">
                    <p className="text-gray-400 text-sm leading-relaxed">{r}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Coloque seu negócio
            <br />
            <span className="text-green-400">no mapa de Londrina.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Mais de 4.000 famílias em Londrina já perguntam pelo WhatsApp.
            <br className="hidden md:block" /> Elas precisam te encontrar.
          </p>
          <a
            href="https://wa.me/5543999999999?text=Quero+anunciar+no+LondrinaZAP"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white font-bold px-10 py-5 rounded-2xl text-xl transition-all hover:scale-105 shadow-2xl shadow-green-500/20"
          >
            <MessageCircle size={24} className="fill-white" />
            Falar com a equipe agora
          </a>
          <p className="text-gray-600 text-sm mt-4">Resposta em até 1h nos dias úteis</p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
              <MessageCircle size={14} className="text-white fill-white" />
            </div>
            <span className="font-bold text-white">LondrinaZAP</span>
          </div>
          <p className="text-gray-600 text-sm">© 2026 LondrinaZAP · Londrina, PR</p>
          <Link href="/chat" className="text-gray-600 text-sm hover:text-gray-400 transition-colors">
            ProspectZAP Intelligence →
          </Link>
        </div>
      </footer>

    </div>
  );
}
