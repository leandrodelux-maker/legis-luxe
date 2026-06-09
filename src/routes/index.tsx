import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  FileText,
  Gavel,
  ScrollText,
  Users,
  Building2,
  Eye,
  MessageSquare,
} from "lucide-react";
import heroImg from "@/assets/hero-camara.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Câmara Municipal — Portal Oficial" },
      {
        name: "description",
        content:
          "Acompanhe o trabalho dos vereadores, agenda de sessões, projetos de lei e dados de transparência da Câmara Municipal.",
      },
      { property: "og:title", content: "Câmara Municipal — Portal Oficial" },
      { property: "og:description", content: "Transparência, legislação e participação cidadã." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const quickAccess = [
  { icon: Users, label: "Vereadores", to: "/vereadores", desc: "Conheça os parlamentares" },
  { icon: Calendar, label: "Sessões", to: "/sessoes", desc: "Pautas e calendário" },
  { icon: ScrollText, label: "Projetos de Lei", to: "/sessoes", desc: "Acompanhe a tramitação" },
  { icon: Eye, label: "Transparência", to: "/transparencia", desc: "Dados públicos" },
];

const noticias = [
  {
    tag: "Sessão Ordinária",
    date: "12 Jun 2026",
    title: "Câmara aprova programa de incentivo à educação infantil",
    excerpt:
      "Projeto destina recursos adicionais à ampliação de vagas em creches e capacitação de professores.",
  },
  {
    tag: "Audiência Pública",
    date: "08 Jun 2026",
    title: "Plano Diretor recebe contribuições da sociedade civil",
    excerpt:
      "Audiência reuniu representantes de bairros, entidades e cidadãos para discutir a revisão do PD.",
  },
  {
    tag: "Transparência",
    date: "03 Jun 2026",
    title: "Relatório de gestão do 1º semestre é publicado",
    excerpt:
      "Documento detalha execução orçamentária, atos legislativos e indicadores de desempenho.",
  },
];

const stats = [
  { value: "21", label: "Vereadores" },
  { value: "184", label: "Projetos em 2026" },
  { value: "47", label: "Sessões realizadas" },
  { value: "100%", label: "Transparência ativa" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt="Edifício da Câmara Municipal ao entardecer"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/95 via-primary-deep/80 to-primary-deep/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        </div>

        <div className="container-page py-20 md:py-28 lg:py-36 text-primary-foreground">
          <div className="max-w-3xl animate-[fade-up_0.8s_ease-out]">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-gold backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              Portal Oficial · Legislativo Municipal
            </div>
            <h1 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
              A voz do <span className="text-gold">cidadão</span>,<br />
              no centro das decisões.
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-primary-foreground/85 leading-relaxed">
              Acompanhe em tempo real o trabalho dos vereadores, a tramitação de projetos de lei
              e os dados de transparência da Câmara Municipal.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold h-12 px-6"
              >
                <Link to="/sessoes">
                  Próximas sessões <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-6 border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white backdrop-blur-sm"
              >
                <Link to="/transparencia">Portal da Transparência</Link>
              </Button>
            </div>
          </div>

          {/* Stats glass card */}
          <div className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl glass-strong overflow-hidden border border-white/15 bg-white/5 max-w-4xl">
            {stats.map((s) => (
              <div key={s.label} className="bg-primary-deep/40 p-6 md:p-7 text-center">
                <div className="font-display text-3xl md:text-4xl font-semibold text-gold">
                  {s.value}
                </div>
                <div className="mt-1 text-xs md:text-sm uppercase tracking-wider text-primary-foreground/75">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="container-page py-20 md:py-24">
        <SectionHeading
          eyebrow="Acesso rápido"
          title="Tudo o que você precisa, à mão"
          description="Serviços e informações principais para acompanhar o trabalho legislativo."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Users, label: "Vereadores", to: "/vereadores", desc: "Conheça os parlamentares" },
            { icon: Calendar, label: "Sessões", to: "/sessoes", desc: "Pautas e calendário" },
            { icon: Eye, label: "Transparência", to: "/transparencia", desc: "Dados públicos" },
            { icon: MessageSquare, label: "Ouvidoria", to: "/contato", desc: "Envie sua manifestação" },
            { icon: FileText, label: "SIC", to: "/transparencia", desc: "Acesso à informação" },
            { icon: Calendar, label: "Agenda", to: "/sessoes", desc: "Eventos e audiências" },
          ].map((item, i) => (
            <Link
              key={item.label}
              to={item.to}
              className="card-premium card-premium-hover group p-6 animate-[fade-up_0.6s_ease-out_both]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-deep text-primary-foreground shadow-elegant ring-1 ring-gold/20 transition-transform group-hover:scale-110">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                {item.label}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Acessar <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NOTÍCIAS */}
      <section className="bg-secondary/40 border-y border-border/60">
        <div className="container-page py-20 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHeading
              eyebrow="Últimas notícias"
              title="O legislativo em movimento"
              description="Cobertura editorial das sessões, audiências e ações da Câmara."
            />
            <Button asChild variant="outline" className="self-start md:self-auto">
              <Link to="/noticias">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {noticias.map((n, i) => (
              <article
                key={n.title}
                className="card-premium card-premium-hover group overflow-hidden animate-[fade-up_0.6s_ease-out_both]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary-deep via-primary to-primary/70">
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay [background-image:radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
                  <Building2 className="absolute right-4 bottom-4 h-16 w-16 text-white/15" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground">
                    {n.tag}
                  </div>
                </div>
                <div className="p-6">
                  <time className="text-xs uppercase tracking-wider text-muted-foreground">
                    {n.date}
                  </time>
                  <h3 className="mt-2 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{n.excerpt}</p>
                  <Link
                    to="/noticias"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                  >
                    Ler matéria <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPARÊNCIA CTA */}
      <section className="container-page py-20 md:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-deep via-primary to-primary-deep p-10 md:p-16 text-primary-foreground shadow-elegant">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-gold">
                <Gavel className="h-3 w-3" /> Lei de Acesso à Informação
              </div>
              <h2 className="mt-5 font-display text-3xl md:text-5xl font-semibold leading-tight">
                Transparência é compromisso, não exceção.
              </h2>
              <p className="mt-5 text-base md:text-lg text-primary-foreground/85 leading-relaxed">
                Consulte despesas, contratos, salários, atas e atos legislativos. Tudo aberto,
                auditável e acessível.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 h-12 px-6">
                  <Link to="/transparencia">Acessar Portal</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-6 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <Link to="/contato">
                    <MessageSquare className="h-4 w-4" /> Ouvidoria
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FileText, label: "Atos Legislativos", value: "1.842" },
                { icon: Eye, label: "Documentos Públicos", value: "12k+" },
                { icon: Gavel, label: "Licitações 2026", value: "37" },
                { icon: Users, label: "Servidores", value: "162" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-strong rounded-xl border border-white/15 bg-white/5 p-5 backdrop-blur-md"
                >
                  <item.icon className="h-5 w-5 text-gold" />
                  <div className="mt-3 font-display text-2xl font-semibold">{item.value}</div>
                  <div className="text-xs uppercase tracking-wider text-primary-foreground/75">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
