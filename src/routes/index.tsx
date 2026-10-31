import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FileText, Gavel, MessageSquare, Newspaper, Search, Shield, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero-camara.jpg";
import { Button } from "@/components/ui/button";
import { QuickAccess } from "@/components/quick-access";
import { ConteudoInicial } from "@/components/conteudo-inicial";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Câmara Municipal — Portal Oficial" },
      {
        name: "description",
        content:
          "Acompanhe vereadores, sessões, projetos de lei, transparência, ouvidoria e e-SIC da Câmara Municipal.",
      },
      { property: "og:title", content: "Câmara Municipal — Portal Oficial" },
      { property: "og:description", content: "Transparência, legislação e participação cidadã." },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroImg, fetchPriority: "high" } as any,
    ],
  }),
  component: HomePage,
});

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

function HomePage() {
  const [hero, setHero] = useState<HeroData | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("hero_media_url, hero_media_type, hero_title, hero_subtitle, hero_eyebrow")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setHero(data as HeroData | null));
  }, []);

  const mediaUrl = hero?.hero_media_url || null;
  const isVideo = hero?.hero_media_type === "video";
  const title = hero?.hero_title || "Câmara Municipal";
  const subtitle = hero?.hero_subtitle || "Transparência, serviços e informação ao alcance do cidadão";
  const eyebrow = hero?.hero_eyebrow || "Portal Oficial do Município";

  return (
    <>
      {/* ======================= HERO ======================= */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero">
          {isVideo && mediaUrl ? (
            <video src={mediaUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <img src={mediaUrl || heroImg} alt="Município" fetchPriority="high" decoding="async" className="h-full w-full object-cover opacity-50" />
          )}



        </div>

        <div className="container-page py-8 md:py-10 lg:py-14 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white animate-[fade-up_0.6s_ease-out]">
            <Sparkles className="h-3 w-3" /> {eyebrow}
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight animate-[fade-up_0.7s_ease-out]">
            {title}
            <span className="block text-gold">a serviço do cidadão.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed animate-[fade-up_0.8s_ease-out]">
            {subtitle}
          </p>

          <form className="mt-7 max-w-xl animate-[fade-up_0.9s_ease-out]">
            <div className="flex items-stretch rounded-xl bg-white shadow-xl shadow-primary-deep/40 overflow-hidden ring-1 ring-white/10">
              <div className="flex items-center pl-4 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="search"
                placeholder="O que você procura? Ex: IPTU, licitações, vereador..."
                className="flex-1 px-3 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none text-sm"
              />
              <Button type="submit" className="h-10 rounded-none rounded-r-xl px-5 bg-gold hover:bg-gold/90 text-gold-foreground font-bold text-sm">
                Buscar
              </Button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 animate-[fade-up_1s_ease-out]">
            {heroPills.map((p) => (
              <Link
                key={p.label}
                to={p.to}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-medium transition-all hover:-translate-y-0.5"
              >
                <p.icon className="h-3.5 w-3.5 text-gold" /> {p.label}
              </Link>
            ))}
          </div>
        </div>





        <svg aria-hidden viewBox="0 0 1440 80" className="block w-full h-12 md:h-16 -mb-px text-background" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,40 C240,90 480,0 720,30 C960,60 1200,80 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </section>

      {/* QUICK ACCESS */}
      <QuickAccess />

      <ConteudoInicial />
    </>
  );
}
