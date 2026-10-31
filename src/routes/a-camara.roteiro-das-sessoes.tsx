import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, FileText, Gavel, Info, ListOrdered, MessageSquare, Mic, Sparkles, Users, Vote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/a-camara/roteiro-das-sessoes")({
  head: () => ({
    meta: [
      { title: "Roteiro das Sessões — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content:
          "Passo a passo das sessões da Câmara Municipal: abertura, leitura da ata, apresentação de proposituras, Ordem do Dia, Tribuna Livre e explicações pessoais.",
      },
      { property: "og:title", content: "Roteiro das Sessões — Câmara Municipal de Adelândia" },
      {
        property: "og:description",
        content: "Como funciona, etapa por etapa, uma sessão plenária do Legislativo municipal.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoteiroPage,
});

const TIPOS = [
  { chave: "Sessão Ordinária", titulo: "Ordinárias", icone: Gavel, texto: "Realizadas periodicamente conforme o calendário legislativo, destinam-se à apreciação regular das matérias em pauta." },
  { chave: "Sessão Extraordinária", titulo: "Extraordinárias", icone: Sparkles, texto: "Convocadas fora do calendário ordinário para tratar de matéria urgente e relevante ao interesse público." },
  { chave: "Sessão Solene", titulo: "Solenes", icone: Users, texto: "Destinadas a homenagens, posses e comemorações cívicas, sem deliberação de matérias legislativas." },
];

const ETAPAS = [
  {
    icone: Gavel,
    titulo: "Abertura dos trabalhos",
    texto: "Constatado o quórum regimental, o Presidente pronuncia: “Em nome de Deus declaro aberto os trabalhos da presente sessão”.",
    nota: "A Câmara somente se reúne com a presença de, no mínimo, 1/3 dos vereadores. Para deliberar sobre qualquer matéria, é exigida a presença da maioria absoluta dos membros.",
  },
  { icone: FileText, titulo: "Leitura e votação da ata", texto: "É feita a leitura da ata da sessão anterior, submetida em seguida à votação do plenário." },
  { icone: ListOrdered, titulo: "Apresentação das proposituras", texto: "O 1º Secretário faz a leitura das proposituras apresentadas no dia: projetos, indicações, requerimentos e moções." },
  { icone: CheckCircle2, titulo: "Ordem do Dia", texto: "O Presidente declara aberta a Ordem do Dia, período destinado à apreciação das matérias constantes da pauta. Esgotada a pauta, anuncia a Ordem do Dia da sessão seguinte e concede as inscrições para a Tribuna Livre." },
  { icone: Mic, titulo: "Explicações pessoais", texto: "Com duração de 45 minutos, destinam-se ao pronunciamento dos vereadores inscritos até o final da Ordem do Dia ou, alternativamente, por sorteio entre os presentes, por 7 minutos cada, facultado 1/3 a mais do tempo aos líderes." },
  { icone: MessageSquare, titulo: "Encerramento", texto: "Após as explicações pessoais, não havendo mais nada a tratar, o Presidente declara encerrados os trabalhos e convida os presentes para a próxima sessão ordinária." },
];

function RoteiroPage() {
  const [atual, setAtual] = useState(0);
  const [contagem, setContagem] = useState<Record<string, number>>({});

  useEffect(() => {
    supabase.from("sessoes").select("tipo").then(({ data }) => {
      const c: Record<string, number> = {};
      for (const s of (data as { tipo: string | null }[]) ?? []) if (s.tipo) c[s.tipo] = (c[s.tipo] ?? 0) + 1;
      setContagem(c);
    });
  }, []);

  const etapa = ETAPAS[atual];

  return (
    <>
      <CabecalhoPagina
        titulo="Roteiro das Sessões"
        trilha={[{ rotulo: "A Câmara" }]}
        icone={ListOrdered}
        descricao="Como acontece, etapa por etapa, uma sessão plenária. As sessões são públicas e qualquer pessoa pode acompanhar no plenário."
        numeros={[{ rotulo: "Etapas", valor: ETAPAS.length }, { rotulo: "Tipos de sessão", valor: TIPOS.length }]}
      />

      <div className="container-page py-8 md:py-10 space-y-10">
        <section aria-labelledby="titulo-etapas">
          <h2 id="titulo-etapas" className="font-display font-bold text-2xl text-foreground">Siga a sessão, passo a passo</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Clique em uma etapa para ver o que acontece nela.</p>
          <div className="grid gap-4 lg:grid-cols-[340px_1fr] mt-4">
            <ol className="bg-card border border-border rounded-2xl p-2 space-y-1 self-start">
              {ETAPAS.map((e, i) => (
                <li key={e.titulo}>
                  <button type="button" aria-current={i === atual ? "step" : undefined} onClick={() => setAtual(i)} className={`w-full flex items-center gap-3 rounded-xl p-2.5 text-left transition ${i === atual ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                    <span className={`w-8 h-8 shrink-0 rounded-lg grid place-items-center font-display text-sm font-bold ${i === atual ? "bg-white/20" : "bg-primary/10 text-primary"}`}>{i + 1}</span>
                    <span className="text-sm font-semibold leading-snug">{e.titulo}</span>
                  </button>
                </li>
              ))}
            </ol>
            <article aria-live="polite" className="flex flex-col bg-card border border-border rounded-2xl p-5 md:p-7">
              <span className="w-12 h-12 rounded-xl grid place-items-center bg-primary text-primary-foreground"><etapa.icone className="w-6 h-6" aria-hidden /></span>
              <p className="text-sm font-bold mt-4" style={{ color: "#8A5A00" }}>Etapa {atual + 1} de {ETAPAS.length}</p>
              <h3 className="font-display font-bold text-2xl text-foreground leading-snug">{etapa.titulo}</h3>
              <p className="text-foreground/85 leading-relaxed mt-2 max-w-3xl">{etapa.texto}</p>
              {etapa.nota && (
                <p className="flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 p-3 text-sm leading-relaxed text-foreground mt-4 max-w-3xl">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#8A5A00" }} aria-hidden />
                  <span><strong>Quórum: </strong>{etapa.nota}</span>
                </p>
              )}
              <div className="flex items-center justify-between gap-2 mt-auto pt-6">
                <button type="button" disabled={atual === 0} onClick={() => setAtual(atual - 1)} className="inline-flex items-center gap-1 h-10 px-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition disabled:opacity-50 disabled:pointer-events-none"><ChevronLeft className="w-4 h-4" aria-hidden /> Anterior</button>
                <button type="button" disabled={atual === ETAPAS.length - 1} onClick={() => setAtual(atual + 1)} className="inline-flex items-center gap-1 h-10 px-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:pointer-events-none">Próxima <ChevronRight className="w-4 h-4" aria-hidden /></button>
              </div>
            </article>
          </div>
        </section>

        <section aria-labelledby="titulo-tipos">
          <h2 id="titulo-tipos" className="font-display font-bold text-2xl text-foreground">Tipos de sessão</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Com o total de sessões publicadas neste site.</p>
          <ul className="grid gap-4 md:grid-cols-3 mt-4">
            {TIPOS.map((t) => (
              <li key={t.chave} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary text-primary-foreground"><t.icone className="w-5 h-5" aria-hidden /></span>
                  <span className="font-display text-2xl font-bold text-foreground tabular-nums">{contagem[t.chave] ?? "–"}</span>
                </div>
                <h3 className="font-display font-bold text-foreground mt-3">{t.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{t.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="titulo-votacao" className="flex flex-col md:flex-row md:items-center gap-4 rounded-2xl text-white p-5 md:p-6" style={{ background: "linear-gradient(120deg, var(--primary-deep), var(--primary))" }}>
          <Vote className="w-9 h-9 shrink-0" aria-hidden />
          <div className="flex-1">
            <h2 id="titulo-votacao" className="font-display font-bold text-xl">Na prática: um projeto pode passar por mais de uma votação</h2>
            <p className="text-white/90 text-sm leading-relaxed mt-1 max-w-3xl">As atas de junho e julho de 2024 registram projetos de lei votados três vezes antes da aprovação final, às vezes na mesma sessão, a pedido de um vereador.</p>
          </div>
          <Link to={ROUTES.sessoes} className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-white/90 transition shrink-0">Ver as sessões <ArrowRight className="w-4 h-4" aria-hidden /></Link>
        </section>

        <nav aria-label="Continue navegando" className="grid gap-3 sm:grid-cols-3">
          {[
            { to: ROUTES.regimentoInterno, rotulo: "Regimento Interno", icone: BookOpen },
            { to: ROUTES.comissoes, rotulo: "Comissões", icone: Users },
            { to: ROUTES.projetos, rotulo: "Atos Legislativos", icone: FileText },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="group flex items-center gap-3 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition focus-visible:outline-2 focus-visible:outline-offset-2">
              <l.icone className="w-5 h-5 text-primary" aria-hidden />
              <span className="flex-1 text-sm font-semibold text-foreground">{l.rotulo}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
