import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Building2, FileText, Globe, Map as MapIcon, Shield, Users, X, type LucideIcon } from "lucide-react";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { SITE_SECTIONS } from "@/lib/site-links";
import { TEMAS, itemHref } from "@/data/transparenciaCatalogo";

export const Route = createFileRoute("/mapa-do-site")({
  head: () => ({
    meta: [
      { title: "Mapa do Site — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content: "Índice com todas as páginas, serviços e canais oficiais do portal da Câmara Municipal de Adelândia.",
      },
      { property: "og:title", content: "Mapa do Site — Câmara Municipal de Adelândia" },
      { property: "og:description", content: "Todas as páginas e links deste portal em um único lugar." },
    ],
  }),
  component: MapaDoSitePage,
});

type Pagina = { to: string; rotulo: string; descricao?: string };
type Grupo = { titulo: string; icone: LucideIcon; origem: "Site" | "Portal da Transparência"; paginas: Pagina[] };

const ICONES: Record<string, LucideIcon> = { "Atos Legislativos": FileText, "A Câmara": Building2, Institucional: Globe, Transparência: Shield, "Serviços ao Cidadão": Users, "Privacidade e Navegação": MapIcon };

const GRUPOS: Grupo[] = [
  ...SITE_SECTIONS.map((s): Grupo => ({ titulo: s.title, icone: ICONES[s.title] ?? Globe, origem: "Site", paginas: s.links.map((l) => ({ to: l.to, rotulo: l.label, descricao: l.description })) })),
  ...TEMAS.map((t): Grupo => ({ titulo: t.label, icone: t.icon, origem: "Portal da Transparência", paginas: t.items.map((i) => ({ to: itemHref(i), rotulo: i.label, descricao: i.desc })) })),
];
const TOTAL = GRUPOS.reduce((n, g) => n + g.paginas.length, 0);

const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const seletor = "h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground min-w-0";

function MapaDoSitePage() {
  const [busca, setBusca] = useState("");
  const [area, setArea] = useState("");
  const q = normalizar(busca.trim());
  const grupos = GRUPOS.filter((g) => !area || g.titulo === area)
    .map((g) => ({ ...g, paginas: g.paginas.filter((p) => !q || normalizar(`${p.rotulo} ${p.descricao ?? ""} ${g.titulo}`).includes(q)) }))
    .filter((g) => g.paginas.length > 0);
  const achadas = grupos.reduce((n, g) => n + g.paginas.length, 0);

  const secao = (origem: Grupo["origem"]) => {
    const lista = grupos.filter((g) => g.origem === origem);
    if (lista.length === 0) return null;
    return (
      <section aria-label={origem} className="space-y-3">
        <h2 className="font-display font-bold text-2xl text-foreground">{origem === "Site" ? "Páginas do site" : origem}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          {lista.map((g) => (
            <article key={g.titulo} className="bg-card border border-border rounded-2xl overflow-hidden">
              <header className="flex items-center gap-2.5 p-4 border-b border-border">
                <span className="w-9 h-9 rounded-lg grid place-items-center bg-primary text-primary-foreground shrink-0"><g.icone className="w-4 h-4" aria-hidden /></span>
                <h3 className="font-display font-bold text-foreground leading-snug flex-1">{g.titulo}</h3>
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">{g.paginas.length}</span>
              </header>
              <ul className="divide-y divide-border">
                {g.paginas.map((p) => (
                  <li key={`${g.titulo}-${p.rotulo}`}>
                    <Link to={p.to} className="group flex items-start gap-2 px-4 py-2.5 hover:bg-muted/50 transition focus-visible:outline-2 focus-visible:-outline-offset-2">
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground group-hover:underline underline-offset-2">{p.rotulo}</span>
                        {p.descricao && <span className="block text-xs text-muted-foreground leading-relaxed line-clamp-2">{p.descricao}</span>}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <CabecalhoPagina
        titulo="Mapa do Site"
        icone={MapIcon}
        descricao="Tudo o que existe no portal, em um só lugar. Digite o que procura e a lista se ajusta na hora."
        numeros={[{ rotulo: "Páginas e serviços", valor: TOTAL }, { rotulo: "Áreas", valor: GRUPOS.length }]}
      />

      <div className="container-page py-8 md:py-10 space-y-6">
        <section aria-label="Filtros" className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-2xl p-3">
          <input type="search" aria-label="Buscar página" placeholder="O que você procura?" value={busca} onChange={(e) => setBusca(e.target.value)} className={`${seletor} flex-[2] min-w-[220px]`} />
          <select aria-label="Filtrar por área" value={area} onChange={(e) => setArea(e.target.value)} className={`${seletor} flex-1 min-w-[200px]`}>
            <option value="">Todas as áreas</option>
            {GRUPOS.map((g) => <option key={g.titulo} value={g.titulo}>{g.titulo}</option>)}
          </select>
          {(busca || area) && <button type="button" onClick={() => { setBusca(""); setArea(""); }} className="inline-flex items-center gap-1 h-11 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted"><X className="w-4 h-4" aria-hidden /> Limpar</button>}
        </section>
        <p className="text-sm text-muted-foreground" aria-live="polite">{achadas} de {TOTAL} páginas</p>
        {achadas === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center font-semibold text-foreground">Nenhuma página encontrada com esses filtros.</div>
        ) : (
          <>
            {secao("Site")}
            {secao("Portal da Transparência")}
          </>
        )}
      </div>
    </>
  );
}
