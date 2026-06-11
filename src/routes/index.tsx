import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Gavel,
  Users,
  MessageSquare,
  Shield,
  FileText,
  BookOpen,
  Search,
  Sparkles,
  Newspaper,
  User,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero-camara.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { QuickAccess } from "@/components/quick-access";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

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

const stats = [
  { value: "21", label: "Vereadores" },
  { value: "184", label: "Projetos em 2026" },
  { value: "47", label: "Sessões realizadas" },
  { value: "100%", label: "Transparência ativa" },
];

const heroPills = [
  { icon: Shield, label: "Transparência", to: "/transparencia" },
  { icon: FileText, label: "e-SIC", to: "/contato" },
  { icon: MessageSquare, label: "Ouvidoria", to: "/contato" },
  { icon: BookOpen, label: "Carta de Serviços", to: "/transparencia" },
  { icon: Gavel, label: "Licitações", to: "/transparencia" },
  { icon: Newspaper, label: "Diário Oficial", to: "/noticias" },
];

type HeroData = {
  hero_media_url: string | null;
  hero_media_type: string;
  hero_title: string;
  hero_subtitle: string;
  hero_eyebrow: string;
};

type Vereador = Tables<"vereadores">;

type MesaMember = {
  id: string;
  cargo: string;
  vereadores: {
    id: string;
    nome: string;
    partido: string | null;
    foto_url: string | null;
  };
};

type DbNoticia = {
  id: string;
  titulo: string;
  resumo: string | null;
  categoria: string | null;
  publicado_em: string | null;
  created_at: string;
  imagem_url: string | null;
  slug: string;
};

type DbSessao = {
  id: string;
  titulo: string;
  tipo: string | null;
  data_sessao: string;
  local: string | null;
  status: string;
};

function HomePage() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [vereadores, setVereadores] = useState<Vereador[]>([]);
  const [mesaDiretora, setMesaDiretora] = useState<MesaMember[]>([]);
  const [noticias, setNoticias] = useState<DbNoticia[]>([]);
  const [proximasSessoes, setProximasSessoes] = useState<DbSessao[]>([]);
  const [loadingVereadores, setLoadingVereadores] = useState(true);
  const [loadingMesa, setLoadingMesa] = useState(true);
  const [loadingNoticias, setLoadingNoticias] = useState(true);
  const [loadingSessoes, setLoadingSessoes] = useState(true);

  useEffect(() => {
    // Fetch Hero settings
    supabase
      .from("site_settings")
      .select("hero_media_url, hero_media_type, hero_title, hero_subtitle, hero_eyebrow")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setHero(data as HeroData | null));

    // Fetch active vereadores
    supabase
      .from("vereadores")
      .select("*")
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        setVereadores(data || []);
        setLoadingVereadores(false);
      });

    // Fetch Mesa Diretora
    supabase
      .from("mesa_diretora")
      .select("id, cargo, vereadores(id, nome, partido, foto_url)")
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .then(({ data }) => {
        setMesaDiretora((data as any) || []);
        setLoadingMesa(false);
      });

    // Fetch Latest News
    supabase
      .from("noticias")
      .select("id, titulo, resumo, categoria, publicado_em, created_at, imagem_url, slug")
      .eq("publicado", true)
      .order("publicado_em", { ascending: false, nullsFirst: false })
      .limit(3)
      .then(({ data }) => {
        setNoticias((data as DbNoticia[]) || []);
        setLoadingNoticias(false);
      });

    // Fetch Next Sessions
    supabase
      .from("sessoes")
      .select("id, titulo, tipo, data_sessao, local, status")
      .gte("data_sessao", new Date().toISOString())
      .eq("status", "agendada")
      .order("data_sessao", { ascending: true })
      .limit(3)
      .then(({ data }) => {
        setProximasSessoes((data as DbSessao[]) || []);
        setLoadingSessoes(false);
      });
  }, []);

  const mediaUrl = hero?.hero_media_url || null;
  const isVideo = hero?.hero_media_type === "video";
  const title = hero?.hero_title || "Câmara Municipal";
  const subtitle = hero?.hero_subtitle || "Transparência, serviços e informação ao alcance do cidadão";
  const eyebrow = hero?.hero_eyebrow || "Portal Oficial do Município";

  return (
    <>
      {/* HERO — full-bleed media with overlay, centered content, search pill row */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {isVideo && mediaUrl ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={mediaUrl || heroImg}
              alt="Imagem do município"
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/85 via-primary-deep/75 to-primary-deep/85" />
        </div>

        <div className="container-page py-10 md:py-14 lg:py-16 text-white text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold animate-[fade-up_0.6s_ease-out]">
            <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
          </div>

          <h1 className="mt-3 font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.02] tracking-tight animate-[fade-up_0.7s_ease-out]">

            {title}
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg text-white/85 leading-relaxed animate-[fade-up_0.8s_ease-out]">
            {subtitle}
          </p>

          {/* Search bar */}
          <form className="mt-10 max-w-2xl mx-auto animate-[fade-up_0.9s_ease-out]">
            <div className="flex items-stretch rounded-2xl bg-white shadow-2xl shadow-primary-deep/30 overflow-hidden">
              <div className="flex items-center pl-4 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="search"
                placeholder="O que você procura? Ex: IPTU, licitações..."
                className="flex-1 px-3 h-14 text-slate-700 placeholder:text-slate-400 focus:outline-none text-base"
              />
              <Button
                type="submit"
                className="h-14 rounded-none rounded-r-2xl px-6 md:px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base"
              >
                Buscar
              </Button>
            </div>
          </form>

          {/* Pill quick links */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 animate-[fade-up_1s_ease-out]">
            {heroPills.map((p) => (
              <Link
                key={p.label}
                to={p.to}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium transition-colors"
              >
                <p.icon className="h-4 w-4 text-gold" /> {p.label}
              </Link>
            ))}
          </div>

        </div>


        {/* Decorative wave bottom */}
        <svg
          aria-hidden
          viewBox="0 0 1440 80"
          className="block w-full h-12 md:h-16 -mb-px text-background"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,40 C240,90 480,0 720,30 C960,60 1200,80 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
      </section>



      {/* QUICK ACCESS */}
      <QuickAccess />


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

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 min-h-[400px]">
            {loadingNoticias ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
                <p className="text-muted-foreground font-medium">Carregando notícias...</p>
              </div>
            ) : noticias.length > 0 ? (
              noticias.map((n, i) => (
                <article
                  key={n.id}
                  className="card-premium card-premium-hover group overflow-hidden animate-[fade-up_0.6s_ease-out_both]"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                    {n.imagem_url ? (
                      <img
                        src={n.imagem_url}
                        alt={n.titulo}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary-deep/10 to-primary/10">
                        <Newspaper className="w-16 h-16 text-primary/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {n.categoria && (
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground">
                        {n.categoria}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <time className="text-xs uppercase tracking-wider text-muted-foreground">
                      {new Date(n.publicado_em || n.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                    <h3 className="mt-2 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {n.titulo}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {n.resumo}
                    </p>
                    <Link
                      to="/noticias"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                    >
                      Ler matéria <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                Nenhuma notícia encontrada.
              </div>
            )}
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
              {loadingSessoes ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-gold" />
                </div>
              ) : proximasSessoes.length > 0 ? (
                proximasSessoes.map((item, i) => {
                  const dateObj = new Date(item.data_sessao);
                  const day = dateObj.toLocaleDateString("pt-BR", { day: "2-digit" });
                  const month = dateObj.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase();
                  const time = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                  
                  return (
                    <div key={item.id} className="flex gap-6 p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group">
                      <div className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-secondary text-primary font-display border border-border/50 shrink-0">
                        <span className="text-xl font-bold">{day}</span>
                        <span className="text-xs uppercase font-medium">{month}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold uppercase tracking-wider text-gold truncate">
                            {item.tipo || "Sessão"}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">•</span>
                          <span className="text-xs text-muted-foreground shrink-0">{time}</span>
                        </div>
                        <h4 className="mt-1 font-display text-lg font-semibold group-hover:text-primary transition-colors truncate">
                          {item.titulo}
                        </h4>
                        <Link to="/sessoes" className="mt-2 inline-flex items-center text-sm font-medium text-primary/70 hover:text-primary transition-colors">
                          Detalhes da pauta <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-secondary/20 rounded-xl border border-dashed border-border text-muted-foreground">
                  Nenhuma sessão agendada para os próximos dias.
                </div>
              )}
            </div>
          </div>
          <div className="card-premium p-8 bg-primary-deep text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar className="h-32 w-32" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-6">
              Mês de {new Date().toLocaleDateString("pt-BR", { month: "long" })}
            </h3>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-primary-foreground/60 mb-4">
              {["D", "S", "T", "Q", "Q", "S", "S"].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {(() => {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                return Array.from({ length: 42 }).map((_, i) => {
                  const day = i - firstDay + 1;
                  const isValidDay = day > 0 && day <= daysInMonth;
                  
                  if (!isValidDay) return <div key={i} />;
                  
                  const isMeeting = proximasSessoes.some(s => {
                    const sDate = new Date(s.data_sessao);
                    return sDate.getDate() === day && sDate.getMonth() === month && sDate.getFullYear() === year;
                  });

                  return (
                    <div 
                      key={i} 
                      className={`aspect-square flex items-center justify-center rounded-md text-sm transition-colors
                        ${isMeeting ? "bg-gold text-gold-foreground font-bold" : "hover:bg-white/10"}`}
                    >
                      {day}
                    </div>
                  );
                });
              })()}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-gold" />
                Sessão Agendada
              </div>
              <Button asChild variant="outline" className="w-full mt-4 border-white/20 hover:bg-white/10 text-white">
                <Link to="/sessoes">Ver calendário completo</Link>
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
            {loadingMesa ? (
              <div className="col-span-full flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : mesaDiretora.length > 0 ? (
              mesaDiretora.map((member) => (
                <div key={member.id} className="card-premium group overflow-hidden text-center bg-card">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {member.vereadores.foto_url ? (
                      <img src={member.vereadores.foto_url} alt={member.vereadores.nome} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-100">
                        <User className="w-20 h-20 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-gold">{member.cargo}</span>
                    <h4 className="mt-2 font-display text-xl font-bold">{member.vereadores.nome}</h4>
                    <p className="text-sm text-muted-foreground">{member.vereadores.partido}</p>
                    <div className="mt-4 flex justify-center gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                        <span className="sr-only">Mensagem</span>
                        <MessageSquare className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" asChild className="h-8 w-8 p-0 rounded-full">
                        <Link to={`/vereadores/${member.vereadores.id}`}>
                          <span className="sr-only">Perfil</span>
                          <Users className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                Nenhum membro da Mesa Diretora cadastrado.
              </div>
            )}
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
        <div className="mt-12 grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 min-h-[160px]">
          {loadingVereadores ? (
            <div className="col-span-full flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <p className="text-sm text-muted-foreground font-medium">Carregando vereadores...</p>
            </div>
          ) : (
            vereadores.map((v) => (
              <Link key={v.id} to={`/vereadores/${v.id}`} className="group block text-center animate-[fade-up_0.5s_ease-out_both]">
                <div className="relative aspect-square rounded-full overflow-hidden border-2 border-transparent group-hover:border-gold transition-colors mx-auto mb-4 grayscale group-hover:grayscale-0 transition-all duration-300 bg-secondary/30 flex items-center justify-center">
                  {v.foto_url ? (
                    <img src={v.foto_url} alt={v.nome} className="h-full w-full object-cover" />
                  ) : (
                    <User className="w-1/2 h-1/2 text-primary/20" />
                  )}
                </div>
                <h5 className="font-display font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 px-1">
                  {v.nome}
                </h5>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  {v.partido || "-"}
                </p>
              </Link>
            ))
          )}
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
                { icon: Gavel, label: "Licitações", value: "37" },
                { icon: FileText, label: "Contratos", value: "142" },
                { icon: FileText, label: "Leis", value: "2.4k" },
                { icon: Gavel, label: "Projetos", value: "184" },
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
