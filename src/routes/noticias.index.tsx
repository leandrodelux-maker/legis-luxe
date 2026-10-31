import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Newspaper, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/noticias/")({
  head: () => ({
    meta: [
      { title: "Notícias — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content: "Cobertura das sessões, audiências públicas e ações do legislativo municipal.",
      },
      { property: "og:title", content: "Notícias — Câmara Municipal de Adelândia" },
      { property: "og:description", content: "Últimas notícias da Câmara Municipal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/noticias" },
    ],
    links: [{ rel: "canonical", href: "/noticias" }],
  }),
  component: NoticiasPage,
});

type DbNoticia = {
  id: string;
  titulo: string;
  slug: string;
  resumo: string | null;
  categoria: string | null;
  destaque: boolean;
  publicado_em: string | null;
  created_at: string;
  imagem_url: string | null;
};

const POR_PAGINA = 9;
const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const seletor = "h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground min-w-0";
const dataDe = (n: DbNoticia) => n.publicado_em ?? n.created_at;
const anoDe = (n: DbNoticia) => String(new Date(dataDe(n)).getFullYear());
const dataLonga = (n: DbNoticia) => new Date(dataDe(n)).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

function Capa({ n, className }: { n: DbNoticia; className: string }) {
  return n.imagem_url ? (
    <img src={n.imagem_url} alt="" loading="lazy" decoding="async" className={`${className} object-cover`} />
  ) : (
    <span className={`${className} grid place-items-center bg-muted`}><Newspaper className="w-9 h-9 text-muted-foreground" aria-hidden /></span>
  );
}

function Linha({ n }: { n: DbNoticia }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" aria-hidden /> {dataLonga(n)}</span>
      {n.categoria && <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary">{n.categoria}</span>}
    </p>
  );
}

function NoticiasPage() {
  const [noticias, setNoticias] = useState<DbNoticia[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ano, setAno] = useState("");
  const [limite, setLimite] = useState(POR_PAGINA);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase
        .from("noticias")
        .select("id, titulo, slug, resumo, categoria, destaque, publicado_em, created_at, imagem_url")
        .eq("publicado", true)
        .order("publicado_em", { ascending: false, nullsFirst: false }),
      supabase.from("noticias_categorias").select("nome").order("ordem"),
    ]).then(([{ data, error }, { data: cats }]) => {
      if (error) setErro(true);
      setNoticias((data as DbNoticia[]) ?? []);
      setCategorias((cats ?? []).map((c: any) => c.nome as string));
      setCarregando(false);
    });
  }, []);

  useEffect(() => setLimite(POR_PAGINA), [busca, categoria, ano]);

  const anos = useMemo(() => [...new Set(noticias.map(anoDe))].sort().reverse(), [noticias]);
  const nomesCategoria = useMemo(() => [...new Set([...categorias, ...(noticias.map((n) => n.categoria).filter(Boolean) as string[])])], [categorias, noticias]);
  const q = normalizar(busca.trim());
  const filtradas = noticias.filter((n) => (!categoria || n.categoria === categoria) && (!ano || anoDe(n) === ano) && (!q || normalizar(`${n.titulo} ${n.resumo ?? ""} ${n.categoria ?? ""}`).includes(q)));
  const temFiltro = Boolean(busca || categoria || ano);
  const principal = temFiltro ? undefined : noticias.find((n) => n.destaque) ?? noticias[0];
  const lista = filtradas.filter((n) => n !== principal);

  return (
    <>
      <CabecalhoPagina
        titulo="Notícias"
        icone={Newspaper}
        descricao="As sessões, audiências públicas e atividades do Legislativo municipal contadas pela Câmara."
        numeros={carregando || noticias.length === 0 ? undefined : [{ rotulo: "Publicações", valor: noticias.length }, { rotulo: "Última publicação", valor: <span className="text-lg">{new Date(dataDe(noticias[0])).toLocaleDateString("pt-BR")}</span> }]}
      />

      <div className="container-page py-8 md:py-10 space-y-6">
        {carregando ? (
          <div className="grid gap-4 md:grid-cols-3" aria-hidden>{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />)}</div>
        ) : erro ? (
          <div role="alert" className="bg-card border border-destructive/40 rounded-2xl p-10 text-center font-semibold text-foreground">Não foi possível carregar as notícias agora. Tente de novo em instantes.</div>
        ) : noticias.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-8 md:p-10 text-center">
            <Newspaper className="w-9 h-9 text-primary mx-auto" aria-hidden />
            <h2 className="font-display font-bold text-xl text-foreground mt-3">Nenhuma notícia publicada ainda</h2>
            <p className="text-muted-foreground mt-1.5 max-w-xl mx-auto">As publicações da Câmara aparecerão aqui. Enquanto isso, acompanhe o trabalho do plenário pelas sessões.</p>
            <Link to={ROUTES.sessoes} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold mt-5 hover:opacity-90 transition">Ver as sessões <ArrowRight className="w-4 h-4" aria-hidden /></Link>
          </div>
        ) : (
          <>
            <section aria-label="Filtros" className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-2xl p-3">
              <input type="search" aria-label="Buscar notícia" placeholder="Buscar notícia" value={busca} onChange={(e) => setBusca(e.target.value)} className={`${seletor} flex-[2] min-w-[220px]`} />
              {nomesCategoria.length > 0 && (
                <select aria-label="Filtrar por categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} className={`${seletor} flex-1 min-w-[170px]`}>
                  <option value="">Todas as categorias</option>
                  {nomesCategoria.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
              <select aria-label="Filtrar por ano" value={ano} onChange={(e) => setAno(e.target.value)} className={seletor}>
                <option value="">Todos os anos</option>
                {anos.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              {temFiltro && <button type="button" onClick={() => { setBusca(""); setCategoria(""); setAno(""); }} className="inline-flex items-center gap-1 h-11 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted"><X className="w-4 h-4" aria-hidden /> Limpar</button>}
            </section>

            <p className="text-sm text-muted-foreground" aria-live="polite">{filtradas.length} de {noticias.length} notícias</p>

            {principal && (
              <article className="group relative grid md:grid-cols-2 bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition">
                <Capa n={principal} className="w-full h-full min-h-56 aspect-video md:aspect-auto" />
                <div className="p-5 md:p-7 self-center">
                  <Linha n={principal} />
                  <h2 className="font-display font-bold text-2xl text-foreground leading-snug mt-2"><Link to="/noticias/$slug" params={{ slug: principal.slug }} className="after:absolute after:inset-0 group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">{principal.titulo}</Link></h2>
                  {principal.resumo && <p className="text-muted-foreground leading-relaxed mt-2 line-clamp-3">{principal.resumo}</p>}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-3">Ler a notícia <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" aria-hidden /></span>
                </div>
              </article>
            )}

            {filtradas.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center font-semibold text-foreground">Nenhuma notícia encontrada com esses filtros.</div>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lista.slice(0, limite).map((n) => (
                  <li key={n.id} className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition">
                    <Capa n={n} className="w-full aspect-video" />
                    <div className="p-4">
                      <Linha n={n} />
                      <h3 className="font-display font-bold text-foreground leading-snug mt-2"><Link to="/noticias/$slug" params={{ slug: n.slug }} className="after:absolute after:inset-0 group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">{n.titulo}</Link></h3>
                      {n.resumo && <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2">{n.resumo}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {lista.length > limite && (
              <div className="text-center"><button type="button" onClick={() => setLimite((l) => l + POR_PAGINA)} className="h-11 px-5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition">Mostrar mais</button></div>
            )}
          </>
        )}
      </div>
    </>
  );
}
