import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, FileText, Gavel, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VereadorAvatar } from "@/components/vereador-avatar";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { ROUTES } from "@/lib/site-links";
import { getCommitteeIcon } from "@/lib/committee-icons";

export const Route = createFileRoute("/a-camara/comissoes")({
  head: () => ({
    meta: [
      { title: "Comissões Permanentes — Câmara Municipal de Adelândia" },
      { name: "description", content: "Composição e competência das comissões permanentes da Câmara Municipal." },
      { property: "og:title", content: "Comissões Permanentes — Câmara Municipal de Adelândia" },
      { property: "og:description", content: "Presidentes, vice-presidentes e relatores das comissões permanentes do Legislativo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComissoesPage,
});

type Vereador = { id: string; slug: string | null; nome: string; partido: string | null; foto_url: string | null };
type Membro = { comissao_id: string; vereador_id: string | null; nome: string; funcao: string };
type Comissao = { id: string; nome: string; sigla: string; icone: string | null; competencia: string | null; membros: Membro[] };

const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
const seletor = "h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground min-w-0";

function ComissoesPage() {
  const [vereadores, setVereadores] = useState<Vereador[]>([]);
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [filtroComissao, setFiltroComissao] = useState("");
  const [filtroMembro, setFiltroMembro] = useState("");

  useEffect(() => {
    (async () => {
      const [v, c, m] = await Promise.all([
        (supabase as any).from("vereadores").select("id, slug, nome, partido, foto_url"),
        (supabase as any).from("comissoes").select("id, nome, sigla, icone, competencia, ordem").eq("ativo", true).order("ordem", { ascending: true }),
        (supabase as any).from("comissoes_membros").select("comissao_id, vereador_id, nome, funcao, ordem").order("ordem", { ascending: true }),
      ]);
      if (c.error) setErro(true);
      setVereadores((v.data as Vereador[]) ?? []);
      setComissoes(((c.data as Omit<Comissao, "membros">[]) ?? []).map((x) => ({ ...x, membros: ((m.data as Membro[]) ?? []).filter((y) => y.comissao_id === x.id) })));
      setCarregando(false);
    })();
  }, []);

  const vereadorDe = useMemo(() => {
    const porId = new Map(vereadores.map((v) => [v.id, v]));
    const porNome = new Map(vereadores.map((v) => [normalizar(v.nome), v]));
    return (m: Membro) => (m.vereador_id ? porId.get(m.vereador_id) : undefined) ?? porNome.get(normalizar(m.nome));
  }, [vereadores]);

  const participantes = useMemo(() => {
    const conta = new Map<string, number>();
    for (const c of comissoes) for (const m of c.membros) conta.set(m.nome, (conta.get(m.nome) ?? 0) + 1);
    return [...conta.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt-BR"));
  }, [comissoes]);

  const visiveis = comissoes.filter((c) => (!filtroComissao || c.id === filtroComissao) && (!filtroMembro || c.membros.some((m) => m.nome === filtroMembro)));
  const temFiltro = Boolean(filtroComissao || filtroMembro);

  return (
    <>
      <CabecalhoPagina
        titulo="Comissões"
        trilha={[{ rotulo: "A Câmara" }]}
        icone={Gavel}
        descricao="As comissões permanentes analisam e emitem parecer sobre as proposições antes da votação em plenário, garantindo o exame técnico das matérias."
        numeros={carregando ? undefined : [{ rotulo: "Comissões", valor: comissoes.length }, { rotulo: "Vereadores participantes", valor: participantes.length }]}
      />

      <div className="container-page py-8 md:py-10 space-y-6">
        <section aria-label="Filtros" className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-2xl p-3">
          <select aria-label="Filtrar por comissão" value={filtroComissao} onChange={(e) => setFiltroComissao(e.target.value)} className={`${seletor} flex-1 min-w-[220px]`}>
            <option value="">Todas as comissões</option>
            {comissoes.map((c) => <option key={c.id} value={c.id}>{c.sigla} — {c.nome}</option>)}
          </select>
          <select aria-label="Filtrar por vereador" value={filtroMembro} onChange={(e) => setFiltroMembro(e.target.value)} className={`${seletor} flex-1 min-w-[220px]`}>
            <option value="">Todos os vereadores</option>
            {participantes.map(([nome, n]) => <option key={nome} value={nome}>{nome} ({n} {n === 1 ? "comissão" : "comissões"})</option>)}
          </select>
          {temFiltro && <button type="button" onClick={() => { setFiltroComissao(""); setFiltroMembro(""); }} className="inline-flex items-center gap-1 h-11 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted"><X className="w-4 h-4" aria-hidden /> Limpar</button>}
        </section>

        {carregando ? (
          <div className="space-y-4" aria-hidden>{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />)}</div>
        ) : erro ? (
          <div role="alert" className="bg-card border border-destructive/40 rounded-2xl p-10 text-center font-semibold text-foreground">Não foi possível carregar as comissões agora. Tente de novo em instantes.</div>
        ) : visiveis.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center font-semibold text-foreground">Nenhuma comissão encontrada.</div>
        ) : (
          visiveis.map((c) => {
            const Icone = getCommitteeIcon(c.icone);
            return (
              <article key={c.id} id={c.sigla.toLowerCase()} className="scroll-mt-28 bg-card border border-border rounded-2xl overflow-hidden">
                <header className="flex gap-4 p-5 md:p-6 border-b border-border">
                  <span className="w-12 h-12 rounded-xl grid place-items-center bg-primary text-primary-foreground shrink-0"><Icone className="w-6 h-6" aria-hidden /></span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">{c.sigla}</p>
                    <h2 className="font-display text-xl font-bold text-foreground leading-snug mt-0.5">{c.nome}</h2>
                    {c.competencia && <p className="text-sm text-muted-foreground leading-relaxed mt-1.5 max-w-3xl">{c.competencia}</p>}
                  </div>
                </header>
                {c.membros.length === 0 ? (
                  <p className="p-5 text-sm text-muted-foreground">Composição ainda não informada.</p>
                ) : (
                  <ul className="grid gap-3 md:grid-cols-3 p-5 md:p-6">
                    {c.membros.map((m) => {
                      const v = vereadorDe(m);
                      const destaque = filtroMembro === m.nome;
                      const conteudo = (
                        <>
                          <VereadorAvatar nome={m.nome} foto={v?.foto_url} partido={v?.partido} fill rounded="xl" fit="cover" className="w-16 h-20 shrink-0" />
                          <span className="min-w-0">
                            <span className="block text-xs font-bold uppercase tracking-wide" style={{ color: "#8A5A00" }}>{m.funcao}</span>
                            <span className="block font-display font-bold text-sm text-foreground leading-snug mt-0.5">{m.nome}</span>
                            {v?.partido && <span className="block text-xs text-muted-foreground mt-0.5">{v.partido}</span>}
                          </span>
                        </>
                      );
                      const classe = `flex items-center gap-3 rounded-xl border p-3 h-full transition ${destaque ? "border-primary bg-primary/5" : "border-border"}`;
                      return (
                        <li key={`${m.nome}-${m.funcao}`}>
                          {v ? <Link to="/vereadores/$slug" params={{ slug: v.slug || v.id }} className={`${classe} hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2`}>{conteudo}</Link> : <div className={classe}>{conteudo}</div>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </article>
            );
          })
        )}

        <section aria-labelledby="titulo-como" className="bg-card border border-border rounded-2xl p-5 md:p-6">
          <h2 id="titulo-como" className="font-display font-bold text-lg text-foreground">Como as comissões atuam</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">Toda proposição apresentada é distribuída às comissões competentes, que emitem parecer técnico antes da votação em plenário.</p>
          <div className="grid gap-3 sm:grid-cols-3 mt-4">
            {[
              { to: ROUTES.projetos, rotulo: "Projetos de lei", icone: FileText },
              { to: ROUTES.roteiroSessoes, rotulo: "Roteiro das sessões", icone: BookOpen },
              { to: "/vereadores", rotulo: "Todos os vereadores", icone: Users },
            ].map((l) => (
              <Link key={l.rotulo} to={l.to} className="group flex items-center gap-3 rounded-xl border border-border p-3.5 hover:bg-muted/50 transition focus-visible:outline-2 focus-visible:outline-offset-2">
                <l.icone className="w-5 h-5 text-primary" aria-hidden />
                <span className="flex-1 text-sm font-semibold text-foreground">{l.rotulo}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
