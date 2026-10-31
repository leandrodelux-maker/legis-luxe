import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, ChevronRight, Crown, FileSignature, Landmark, UserCheck, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VereadorAvatar } from "@/components/vereador-avatar";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/a-camara/mesa-diretora")({
  head: () => ({
    meta: [
      { title: "Mesa Diretora — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content: "Composição da Mesa Diretora da Câmara Municipal: presidente, vice-presidente e secretários.",
      },
      { property: "og:title", content: "Mesa Diretora — Câmara Municipal de Adelândia" },
      { property: "og:description", content: "Conheça os parlamentares que compõem a Mesa Diretora do Legislativo municipal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MesaDiretoraPage,
});

type Membro = {
  id: string;
  cargo: string | null;
  ordem: number | null;
  vereadores: { id: string; slug: string | null; nome: string; partido: string | null; foto_url: string | null; cargo: string | null } | null;
};

const ATRIBUICOES = [
  { cargo: "Presidente", icone: Crown, texto: "Representa a Câmara, dirige os trabalhos do plenário, promulga resoluções e decretos legislativos e zela pelo cumprimento do Regimento Interno." },
  { cargo: "Vice-Presidente", icone: UserCheck, texto: "Substitui o Presidente em suas ausências e impedimentos, assumindo a direção das sessões e dos atos administrativos." },
  { cargo: "1ª Secretaria", icone: FileSignature, texto: "Faz a leitura das proposituras e da correspondência oficial, lavra as atas e responde pela guarda dos documentos da Casa." },
  { cargo: "2ª Secretaria", icone: Users, texto: "Auxilia e substitui a 1ª Secretaria, verifica a presença dos vereadores e apoia a apuração das votações." },
];

function Cartao({ m }: { m: Membro }) {
  const v = m.vereadores;
  if (!v) return null;
  return (
    <li className="group relative flex gap-4 bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition">
      <VereadorAvatar nome={v.nome} foto={v.foto_url} partido={v.partido} fill rounded="xl" fit="cover" showLabelOnError className="w-24 h-[7.5rem] shrink-0" />
      <div className="min-w-0 flex-1 flex flex-col">
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#8A5A00" }}>{m.cargo || v.cargo || "Membro"}</p>
        <h3 className="font-display font-bold text-foreground leading-snug mt-0.5">
          <Link to="/vereadores/$slug" params={{ slug: v.slug || v.id }} className="after:absolute after:inset-0 after:rounded-2xl group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">{v.nome}</Link>
        </h3>
        {v.partido && <p className="text-sm text-muted-foreground mt-0.5">{v.partido}</p>}
        <p className="mt-auto pt-2.5 flex items-center gap-1 text-xs font-semibold text-primary">Ver perfil <ChevronRight className="w-3.5 h-3.5" aria-hidden /></p>
      </div>
    </li>
  );
}

function MesaDiretoraPage() {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase
      .from("mesa_diretora")
      .select("id, cargo, ordem, vereadores(id, slug, nome, partido, foto_url, cargo)")
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .then(({ data }) => {
        setMembros(((data as unknown as Membro[]) ?? []).filter((m) => m.vereadores));
        setCarregando(false);
      });
  }, []);

  const eVice = (c: string) => /vice/i.test(c);
  const presidente = membros.find((m) => /presidente/i.test(m.cargo ?? "") && !eVice(m.cargo ?? ""));
  const demais = membros.filter((m) => m !== presidente);
  const partidos = new Set(membros.map((m) => m.vereadores?.partido).filter(Boolean)).size;

  return (
    <>
      <CabecalhoPagina
        titulo="Mesa Diretora"
        trilha={[{ rotulo: "A Câmara" }]}
        icone={Crown}
        descricao="O órgão de direção da Câmara Municipal, eleito entre os vereadores para conduzir os trabalhos legislativos e a administração da Casa."
        numeros={carregando ? undefined : [{ rotulo: "Integrantes", valor: membros.length }, { rotulo: "Partidos", valor: partidos }]}
      />

      <div className="container-page py-8 md:py-10 space-y-10">
        {carregando ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden>{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />)}</div>
        ) : membros.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center font-semibold text-foreground">A composição da Mesa Diretora será divulgada em breve.</div>
        ) : (
          <section aria-label="Composição da Mesa Diretora" className="space-y-4">
            {presidente?.vereadores && (
              <article className="group relative flex flex-col sm:flex-row sm:items-center gap-5 bg-card border border-border rounded-2xl p-5 overflow-hidden hover:shadow-md transition">
                <span className="absolute inset-y-0 left-0 w-1 bg-gold" aria-hidden />
                <VereadorAvatar nome={presidente.vereadores.nome} foto={presidente.vereadores.foto_url} partido={presidente.vereadores.partido} fill rounded="xl" fit="cover" showLabelOnError className="w-28 h-36 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "#8A5A00" }}><Crown className="h-4 w-4 text-gold" aria-hidden /> {presidente.cargo || "Presidente"}</p>
                  <h2 className="font-display text-2xl font-bold text-foreground leading-snug mt-0.5">
                    <Link to="/vereadores/$slug" params={{ slug: presidente.vereadores.slug || presidente.vereadores.id }} className="after:absolute after:inset-0 group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">{presidente.vereadores.nome}</Link>
                  </h2>
                  {presidente.vereadores.partido && <p className="text-muted-foreground mt-0.5">{presidente.vereadores.partido}</p>}
                  <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">Preside as sessões plenárias, representa a Câmara Municipal em juízo e fora dele e responde pela administração da Casa Legislativa.</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary pr-2">Ver perfil <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" aria-hidden /></span>
              </article>
            )}
            <ul className="grid gap-4 md:grid-cols-2">{demais.map((m) => <Cartao key={m.id} m={m} />)}</ul>
          </section>
        )}

        <section aria-labelledby="titulo-atribuicoes">
          <h2 id="titulo-atribuicoes" className="flex items-center gap-2 font-display font-bold text-xl text-foreground"><BookOpen className="w-5 h-5 text-primary" aria-hidden /> Atribuições dos cargos</h2>
          <p className="text-sm text-muted-foreground mt-1">Competências de cada integrante da Mesa Diretora.</p>
          <ul className="grid gap-4 md:grid-cols-2 mt-4">
            {ATRIBUICOES.map((a) => (
              <li key={a.cargo} className="flex gap-3 bg-card border border-border rounded-2xl p-5">
                <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary text-primary-foreground shrink-0"><a.icone className="w-5 h-5" aria-hidden /></span>
                <div>
                  <h3 className="font-display font-bold text-foreground">{a.cargo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{a.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <nav aria-label="Continue navegando" className="grid gap-3 sm:grid-cols-3">
          {[
            { to: ROUTES.comissoes, rotulo: "Comissões permanentes", icone: Landmark },
            { to: ROUTES.roteiroSessoes, rotulo: "Roteiro das sessões", icone: BookOpen },
            { to: "/vereadores", rotulo: "Todos os vereadores", icone: Users },
          ].map((l) => (
            <Link key={l.rotulo} to={l.to} className="group flex items-center gap-3 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition focus-visible:outline-2 focus-visible:outline-offset-2">
              <l.icone className="w-5 h-5 text-primary" aria-hidden />
              <span className="flex-1 text-sm font-semibold text-foreground">{l.rotulo}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
