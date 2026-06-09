import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock, FileText, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";

export const Route = createFileRoute("/sessoes")({
  head: () => ({
    meta: [
      { title: "Sessões e Pautas — Câmara Municipal" },
      {
        name: "description",
        content: "Agenda de sessões, pautas, atas e projetos de lei em tramitação na Câmara.",
      },
      { property: "og:title", content: "Sessões — Câmara Municipal" },
      { property: "og:description", content: "Calendário e pautas das sessões legislativas." },
      { property: "og:url", content: "/sessoes" },
    ],
    links: [{ rel: "canonical", href: "/sessoes" }],
  }),
  component: SessoesPage,
});

const proximasSessoes = [
  { tipo: "Sessão Ordinária", data: "16 Jun 2026", hora: "14h00", local: "Plenário Principal", pauta: 7 },
  { tipo: "Audiência Pública", data: "18 Jun 2026", hora: "19h00", local: "Auditório", pauta: 3 },
  { tipo: "Sessão Extraordinária", data: "23 Jun 2026", hora: "10h00", local: "Plenário Principal", pauta: 4 },
];

const projetos = [
  { num: "PL 124/2026", titulo: "Institui o programa municipal de incentivo à leitura", autor: "Ver. Mariana Souza", status: "Em comissão" },
  { num: "PL 118/2026", titulo: "Cria a semana de prevenção à violência doméstica", autor: "Ver. Patrícia Ribeiro", status: "Aprovado em 1º turno" },
  { num: "PL 109/2026", titulo: "Dispõe sobre acessibilidade em logradouros públicos", autor: "Ver. Lucas Andrade", status: "Em plenário" },
  { num: "PL 097/2026", titulo: "Regulamenta horta comunitária em áreas municipais", autor: "Ver. Juliana Martins", status: "Sanção" },
];

const statusColor: Record<string, string> = {
  "Em comissão": "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300",
  "Aprovado em 1º turno": "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300",
  "Em plenário": "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-300",
  Sanção: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300",
};

function SessoesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-deep to-primary text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-gold flex items-center gap-3">
            <span className="gold-divider" /> Atividade Legislativa
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold">Sessões e Pautas</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Calendário oficial das sessões, pautas, atas e tramitação de projetos de lei.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <SectionHeading eyebrow="Calendário" title="Próximas sessões" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {proximasSessoes.map((s, i) => (
            <article
              key={s.tipo + s.data}
              className="card-premium card-premium-hover p-6 animate-[fade-up_0.5s_ease-out_both]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary border border-primary/20">
                  {s.tipo}
                </span>
                <span className="text-xs text-muted-foreground">{s.pauta} pautas</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">{s.data}</h3>
              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-gold" /> {s.hora}</p>
                <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold" /> {s.local}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-5 w-full">
                Ver pauta completa
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 border-y border-border/60">
        <div className="container-page py-16 md:py-20">
          <SectionHeading
            eyebrow="Projetos de Lei"
            title="Em tramitação"
            description="Acompanhe os projetos em análise nas comissões e em plenário."
          />
          <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-semibold">Nº</th>
                  <th className="px-5 py-4 font-semibold">Título</th>
                  <th className="px-5 py-4 font-semibold hidden md:table-cell">Autor</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projetos.map((p) => (
                  <tr key={p.num} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-primary">{p.num}</td>
                    <td className="px-5 py-4 font-medium text-foreground">{p.titulo}</td>
                    <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{p.autor}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusColor[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
