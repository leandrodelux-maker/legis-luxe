import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Check, Link2, Newspaper, Tag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/noticias/$slug")({
  head: () => ({
    meta: [
      { title: "Notícia — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content: "Leia a íntegra da notícia publicada pela Câmara Municipal de Adelândia.",
      },
      { property: "og:title", content: "Notícia — Câmara Municipal de Adelândia" },
      {
        property: "og:description",
        content: "Notícia institucional da Câmara Municipal de Adelândia.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NoticiaDetalhe,
});

type Noticia = {
  id: string;
  titulo: string;
  resumo: string | null;
  conteudo: string;
  categoria: string | null;
  autor: string | null;
  imagem_url: string | null;
  publicado_em: string | null;
  created_at: string;
};
type Outra = { id: string; slug: string; titulo: string; publicado_em: string | null };

function NoticiaDetalhe() {
  const { slug } = Route.useParams();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [outras, setOutras] = useState<Outra[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setCarregando(true);
    supabase
      .from("noticias")
      .select("id, titulo, resumo, conteudo, categoria, autor, imagem_url, publicado_em, created_at")
      .eq("slug", slug)
      .eq("publicado", true)
      .maybeSingle()
      .then(({ data }) => {
        setNoticia((data as Noticia) ?? null);
        setCarregando(false);
      });
    supabase
      .from("noticias")
      .select("id, slug, titulo, publicado_em")
      .eq("publicado", true)
      .neq("slug", slug)
      .order("publicado_em", { ascending: false, nullsFirst: false })
      .limit(3)
      .then(({ data }) => setOutras((data as Outra[]) ?? []));
  }, [slug]);

  const data = noticia?.publicado_em ?? noticia?.created_at;
  const copiar = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <>
      <CabecalhoPagina
        titulo={carregando ? "Carregando…" : noticia?.titulo ?? "Notícia não encontrada"}
        trilha={[{ rotulo: "Notícias", to: ROUTES.noticias }]}
        descricao={carregando ? "" : noticia?.resumo ?? (noticia ? "" : "Esta notícia não está disponível.")}
      >
        {noticia && (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/90 mt-3">
            {data && <li className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" aria-hidden /> {new Date(data).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</li>}
            {noticia.autor && <li className="inline-flex items-center gap-1.5"><User className="w-4 h-4" aria-hidden /> {noticia.autor}</li>}
            {noticia.categoria && <li className="inline-flex items-center gap-1.5"><Tag className="w-4 h-4" aria-hidden /> {noticia.categoria}</li>}
          </ul>
        )}
      </CabecalhoPagina>

      <div className="container-page py-8 md:py-10">
        {carregando ? (
          <div className="h-80 rounded-2xl bg-muted animate-pulse" aria-hidden />
        ) : !noticia ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-10 text-center">
            <Newspaper className="w-9 h-9 text-primary mx-auto" aria-hidden />
            <p className="font-semibold text-foreground mt-3">Ela pode ter sido removida ou o endereço está incorreto.</p>
            <Link to="/noticias" className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold mt-4 hover:opacity-90 transition"><ArrowLeft className="w-4 h-4" aria-hidden /> Ver todas as notícias</Link>
          </div>
        ) : (
          <div className={`grid gap-8 ${outras.length ? "lg:grid-cols-[1fr_300px]" : "max-w-3xl mx-auto"}`}>
            <article className="min-w-0">
              {noticia.imagem_url && <img src={noticia.imagem_url} alt="" className="w-full rounded-2xl border border-border mb-6" />}
              <div className="prose prose-slate max-w-none prose-headings:font-display prose-a:text-primary" dangerouslySetInnerHTML={{ __html: noticia.conteudo }} />
              <div className="flex flex-wrap gap-2 mt-8 pt-5 border-t border-border">
                <Link to="/noticias" className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition"><ArrowLeft className="w-4 h-4" aria-hidden /> Todas as notícias</Link>
                <button type="button" onClick={copiar} className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition">
                  {copiado ? <Check className="w-4 h-4" aria-hidden /> : <Link2 className="w-4 h-4" aria-hidden />} <span aria-live="polite">{copiado ? "Link copiado" : "Copiar o link"}</span>
                </button>
              </div>
            </article>
            {outras.length > 0 && (
              <aside aria-labelledby="titulo-outras" className="lg:sticky lg:top-24 self-start bg-card border border-border rounded-2xl p-4">
                <h2 id="titulo-outras" className="font-display font-bold text-foreground">Outras notícias</h2>
                <ul className="divide-y divide-border mt-2">
                  {outras.map((o) => (
                    <li key={o.id} className="py-3">
                      <Link to="/noticias/$slug" params={{ slug: o.slug }} className="text-sm font-semibold text-foreground leading-snug hover:underline underline-offset-2">{o.titulo}</Link>
                      {o.publicado_em && <p className="text-xs text-muted-foreground mt-0.5">{new Date(o.publicado_em).toLocaleDateString("pt-BR")}</p>}
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        )}
      </div>
    </>
  );
}
