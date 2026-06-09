import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Banknote,
  Building2,
  FileText,
  Gavel,
  Receipt,
  ScrollText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

export const Route = createFileRoute("/transparencia")({
  head: () => ({
    meta: [
      { title: "Portal da Transparência — Câmara Municipal" },
      {
        name: "description",
        content:
          "Consulte despesas, contratos, salários, licitações e atos legislativos da Câmara Municipal.",
      },
      { property: "og:title", content: "Portal da Transparência — Câmara Municipal" },
      { property: "og:description", content: "Dados públicos, contratos, salários e licitações." },
      { property: "og:url", content: "/transparencia" },
    ],
    links: [{ rel: "canonical", href: "/transparencia" }],
  }),
  component: TransparenciaPage,
});

const itens = [
  { icon: Banknote, title: "Execução Orçamentária", desc: "Receitas, despesas e empenhos em tempo real." },
  { icon: Receipt, title: "Folha de Pagamento", desc: "Salários de servidores e parlamentares." },
  { icon: Gavel, title: "Licitações e Contratos", desc: "Processos licitatórios e contratos vigentes." },
  { icon: ScrollText, title: "Atos Legislativos", desc: "Leis, decretos, resoluções e portarias." },
  { icon: Users, title: "Recursos Humanos", desc: "Quadro de servidores, cargos e funções." },
  { icon: Building2, title: "Estrutura Administrativa", desc: "Organograma e atribuições." },
  { icon: FileText, title: "Diárias e Viagens", desc: "Relatórios de deslocamentos e gastos." },
  { icon: ShieldCheck, title: "Lei de Acesso à Informação", desc: "Solicitar informação pública (LAI)." },
];

const indicadores = [
  { label: "Despesas 2026 (R$)", value: "18,7M", trend: "+3.2%" },
  { label: "Contratos vigentes", value: "47", trend: "12 novos" },
  { label: "Processos LAI", value: "184", trend: "100% atendidos" },
  { label: "Atos publicados", value: "1.842", trend: "Atualizado hoje" },
];

function TransparenciaPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-deep via-primary to-primary-deep text-primary-foreground">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="container-page relative py-16 md:py-24">
          <div className="text-xs uppercase tracking-[0.2em] text-gold flex items-center gap-3">
            <span className="gold-divider" /> Lei 12.527/2011 · LAI
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-tight">
            Portal da <span className="text-gold">Transparência</span>
          </h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/85 text-base md:text-lg">
            Dados públicos, atualizados e auditáveis. Tudo o que a Câmara faz, ao alcance de cada
            cidadão.
          </p>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {indicadores.map((i, idx) => (
              <div
                key={i.label}
                className="glass-strong rounded-xl border border-white/15 bg-white/5 p-5 animate-[fade-up_0.5s_ease-out_both]"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="text-[10px] uppercase tracking-wider text-primary-foreground/70">
                  {i.label}
                </div>
                <div className="mt-2 font-display text-3xl font-semibold text-gold">{i.value}</div>
                <div className="mt-1 text-xs text-primary-foreground/75">{i.trend}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <SectionHeading
          eyebrow="Acesso aos dados"
          title="Consulte os dados públicos"
          description="Todos os módulos do Portal da Transparência, organizados por tema."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {itens.map((item, i) => (
            <a
              key={item.title}
              href="#"
              className="card-premium card-premium-hover group p-6 animate-[fade-up_0.5s_ease-out_both]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Acessar <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
