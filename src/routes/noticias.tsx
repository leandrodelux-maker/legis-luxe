import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/section-heading";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/noticias")({
  head: () => ({
    meta: [
      { title: "Notícias — Câmara Municipal" },
      {
        name: "description",
        content: "Cobertura das sessões, audiências públicas e ações do legislativo municipal.",
      },
      { property: "og:title", content: "Notícias — Câmara Municipal" },
      { property: "og:description", content: "Últimas notícias da Câmara Municipal." },
      { property: "og:url", content: "/noticias" },
    ],
    links: [{ rel: "canonical", href: "/noticias" }],
  }),
  component: NoticiasPage,
});

type DbNoticia = {
  id: string;
  titulo: string;
  resumo: string | null;
  categoria: string | null;
  publicado_em: string | null;
  created_at: string;
  imagem_url: string | null;
};

const categorias = ["Todas", "Sessão", "Audiência", "Comissão", "Transparência", "Projetos de Lei"];

function NoticiasPage() {
  const [noticias, setNoticias] = useState<DbNoticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("noticias")
      .select("id, titulo, resumo, categoria, publicado_em, created_at, imagem_url")
      .eq("publicado", true)
      .order("publicado_em", { ascending: false, nullsFirst: false })
      .then(({ data }) => {
        setNoticias(data ?? []);
        setLoading(false);
      });
  }, []);
  return (
    <>
      <section className="bg-gradient-to-br from-primary-deep to-primary text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-gold flex items-center gap-3">
            <span className="gold-divider" /> Comunicação Institucional
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold">Notícias</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Acompanhe a cobertura editorial das sessões, audiências públicas e atividades dos
            parlamentares.
          </p>

          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notícias..."
                className="pl-9 h-11 bg-white/95 text-foreground border-white/20"
                aria-label="Buscar notícias"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex flex-wrap gap-2">
          {categorias.map((c, i) => (
            <button
              key={c}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                i === 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background text-foreground/70 hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-10 text-center text-muted-foreground py-12">Carregando notícias...</div>
        ) : noticias.length === 0 ? (
          <div className="mt-10 text-center text-muted-foreground py-12">
            Nenhuma notícia publicada ainda.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {noticias.map((n, i) => {
              const date = n.publicado_em ?? n.created_at;
              return (
                <article
                  key={n.id}
                  className="card-premium card-premium-hover group overflow-hidden animate-[fade-up_0.5s_ease-out_both]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary-deep via-primary to-primary/70">
                    {n.imagem_url ? (
                      <img src={n.imagem_url} alt={n.titulo} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <Building2 className="absolute right-4 bottom-4 h-16 w-16 text-white/15" />
                    )}
                    {n.categoria && (
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground">
                        {n.categoria}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <time className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    </time>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                      {n.titulo}
                    </h3>
                    {n.resumo && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{n.resumo}</p>}
                    <button className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                      Ler mais <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
