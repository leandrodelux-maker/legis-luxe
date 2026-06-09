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

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                tag: "Legislativo",
                date: "12 Jun 2026",
                title: "Câmara aprova programa de incentivo à educação infantil",
                excerpt: "Projeto destina recursos adicionais à ampliação de vagas em creches e capacitação de professores.",
                img: "https://images.unsplash.com/photo-1577416416421-72e4972844e5?auto=format&fit=crop&q=80&w=800",
              },
              {
                tag: "Projetos",
                date: "08 Jun 2026",
                title: "Plano Diretor recebe contribuições da sociedade civil",
                excerpt: "Audiência reuniu representantes de bairros, entidades e cidadãos para discutir a revisão do PD.",
                img: "https://images.unsplash.com/photo-1582213782179-a0c522262656?auto=format&fit=crop&q=80&w=800",
              },
              {
                tag: "Eventos",
                date: "03 Jun 2026",
                title: "Relatório de gestão do 1º semestre é publicado",
                excerpt: "Documento detalha execução orçamentária, atos legislativos e indicadores de desempenho.",
                img: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
              },
            ].map((n, i) => (
              <article
                key={n.title}
                className="card-premium card-premium-hover group overflow-hidden animate-[fade-up_0.6s_ease-out_both]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={n.img} alt={n.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground">
                    {n.tag}
                  </div>
                </div>
                <div className="p-6">
                  <time className="text-xs uppercase tracking-wider text-muted-foreground">
                    {n.date}
                  </time>
                  <h3 className="mt-2 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{n.excerpt}</p>
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


      {/* AGENDA LEGISLATIVA */}
      <section className="container-page py-20 md:py-24">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          <div>
            <SectionHeading
              eyebrow="Calendário"
              title="Agenda Legislativa"
              description="Acompanhe as próximas sessões ordinárias, solenes e audiências públicas."
            />
            <div className="mt-10 space-y-4">
              {[
                { date: "15 Jun", time: "14:00", type: "Sessão Ordinária", title: "Votação de projetos de infraestrutura urbana" },
                { date: "17 Jun", time: "19:00", type: "Audiência Pública", title: "Debate sobre o novo plano de mobilidade" },
                { date: "22 Jun", time: "14:00", type: "Sessão Solene", title: "Entrega de títulos de cidadão honorário" },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group">
                  <div className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-secondary text-primary font-display border border-border/50">
                    <span className="text-xl font-bold">{item.date.split(" ")[0]}</span>
                    <span className="text-xs uppercase font-medium">{item.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold">{item.type}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <h4 className="mt-1 font-display text-lg font-semibold group-hover:text-primary transition-colors">{item.title}</h4>
                    <Link to="/sessoes" className="mt-2 inline-flex items-center text-sm font-medium text-primary/70 hover:text-primary transition-colors">
                      Detalhes da pauta <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-premium p-8 bg-primary-deep text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar className="h-32 w-32" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-6">Mês de Junho</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-primary-foreground/60 mb-4">
              {["D", "S", "T", "Q", "Q", "S", "S"].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isMeeting = [15, 17, 22].includes(day);
                return (
                  <div 
                    key={i} 
                    className={`aspect-square flex items-center justify-center rounded-md text-sm transition-colors
                      ${isMeeting ? "bg-gold text-gold-foreground font-bold" : "hover:bg-white/10"}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-gold" />
                Sessão Agendada
              </div>
              <Button variant="outline" className="w-full mt-4 border-white/20 hover:bg-white/10 text-white">
                Ver calendário completo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* MESA DIRETORA */}
      <section className="bg-secondary/40 py-20 md:py-24 border-y border-border/60">
        <div className="container-page">
          <SectionHeading
            eyebrow="Liderança"
            title="Mesa Diretora"
            description="Conheça os parlamentares responsáveis pela gestão administrativa da Câmara."
            align="center"
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { role: "Presidente", name: "Dr. Roberto Santos", party: "PSD", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
              { role: "1º Vice-Presidente", name: "Ana Paula Mendes", party: "MDB", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
              { role: "1º Secretário", name: "Carlos Oliveira", party: "PL", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
            ].map((member, i) => (
              <div key={i} className="card-premium group overflow-hidden text-center bg-card">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={member.img} alt={member.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">{member.role}</span>
                  <h4 className="mt-2 font-display text-xl font-bold">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.party}</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                      <span className="sr-only">E-mail</span>
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                      <span className="sr-only">Perfil</span>
                      <Users className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VEREADORES GRID */}
      <section className="container-page py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            eyebrow="Legislativo"
            title="Nossos Vereadores"
            description="Representantes eleitos para o mandato 2025-2028."
          />
          <Button asChild variant="outline">
            <Link to="/vereadores">
              Ver todos os 21 vereadores <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {[
            { name: "Luciana Costa", party: "PT", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" },
            { name: "Ricardo Silva", party: "PP", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
            { name: "Mariana Alves", party: "PSDB", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
            { name: "João Pereira", party: "DEM", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },
            { name: "Sonia Regina", party: "PSB", img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=200" },
            { name: "Marcos Paulo", party: "REP", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" },
          ].map((v, i) => (
            <Link key={i} to="/vereadores" className="group block text-center">
              <div className="relative aspect-square rounded-full overflow-hidden border-2 border-transparent group-hover:border-gold transition-colors mx-auto mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">
                <img src={v.img} alt={v.name} className="h-full w-full object-cover" />
              </div>
              <h5 className="font-display font-bold text-sm leading-tight group-hover:text-primary transition-colors">{v.name}</h5>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{v.party}</p>
            </Link>
          ))}
        </div>
      </section>
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
