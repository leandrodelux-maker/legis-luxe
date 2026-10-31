import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar, ChevronRight, Crown, Scale, Search, User, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VereadorAvatar } from "@/components/vereador-avatar";

export const Route = createFileRoute("/vereadores/")({
  head: () => ({
    meta: [
      { title: "Vereadores — Câmara Municipal" },
      {
        name: "description",
        content: "Conheça os vereadores da Câmara Municipal, sua composição por partido e seus perfis.",
      },
    ],
  }),
  component: VereadoresPage,
});

type Vereador = { id: string; nome: string; partido: string | null; cargo: string | null; foto_url: string | null; slug: string | null; mandato_atual: string | null };

// Cores das bancadas, com contraste suficiente para o texto branco da legenda.
const CORES_PARTIDO = ["#14505F", "#1F5FBF", "#A8540F", "#0B7A4B", "#5B45B0", "#B42318", "#7A5C00", "#0B6B8A"];

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const daMesa = (v: Vereador) => Boolean(v.cargo) && !/^vereador/i.test(v.cargo ?? "");
const seletor = "h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground min-w-0";

function Cartao({ v }: { v: Vereador }) {
  return (
    <li className="group relative flex gap-4 bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition">
      <VereadorAvatar nome={v.nome} foto={v.foto_url} partido={v.partido} fill rounded="xl" fit="cover" showLabelOnError className="w-24 h-[7.5rem] shrink-0" />
      <div className="min-w-0 flex-1 flex flex-col">
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: daMesa(v) ? "#8A5A00" : "var(--muted-foreground)" }}>{v.cargo || "Vereador"}</p>
        <h3 className="font-display font-bold text-foreground leading-snug mt-0.5">
          <Link to="/vereadores/$slug" params={{ slug: v.slug || v.id }} className="after:absolute after:inset-0 after:rounded-2xl group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">
            {v.nome}
          </Link>
        </h3>
        {v.partido && <p className="text-sm text-muted-foreground mt-0.5">{v.partido}</p>}
        <p className="mt-auto pt-2.5 flex items-center gap-1 text-xs font-semibold text-primary">Ver perfil <ChevronRight className="w-3.5 h-3.5" aria-hidden /></p>
      </div>
    </li>
  );
}

function VereadoresPage() {
  const [vereadores, setVereadores] = useState<Vereador[]>([]);
  const [sessoes, setSessoes] = useState<number | null>(null);
  const [plenario, setPlenario] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [busca, setBusca] = useState("");
  const [partido, setPartido] = useState("");
  const [cargo, setCargo] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await (supabase as any).from("vereadores").select("id, nome, partido, cargo, foto_url, slug, mandato_atual").eq("ativo", true).order("ordem", { ascending: true });
      if (error) setErro(true);
      setVereadores((data as Vereador[]) ?? []);
      setCarregando(false);
    })();
    supabase.from("sessoes").select("id", { count: "exact", head: true }).eq("status", "realizada").then(({ count }) => setSessoes(count ?? 0));
    supabase.from("site_settings").select("plenario_image_url").limit(1).maybeSingle().then(({ data }) => setPlenario((data as any)?.plenario_image_url ?? null));
  }, []);

  const bancadas = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of vereadores) if (v.partido) m.set(v.partido, (m.get(v.partido) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR")).map(([nome, n], i) => ({ nome, n, cor: CORES_PARTIDO[i % CORES_PARTIDO.length] }));
  }, [vereadores]);

  const cargos = useMemo(() => [...new Set(vereadores.map((v) => v.cargo || "Vereador"))], [vereadores]);

  const filtrados = useMemo(() => {
    const q = normalizar(busca.trim());
    return vereadores.filter((v) => (!partido || v.partido === partido) && (!cargo || (v.cargo || "Vereador") === cargo) && (!q || normalizar(`${v.nome} ${v.partido ?? ""} ${v.cargo ?? ""}`).includes(q)));
  }, [vereadores, busca, partido, cargo]);

  const temFiltro = Boolean(busca || partido || cargo);
  const limpar = () => { setBusca(""); setPartido(""); setCargo(""); };
  const mesa = filtrados.filter(daMesa);
  const demais = filtrados.filter((v) => !daMesa(v));
  const mandato = vereadores.find((v) => v.mandato_atual)?.mandato_atual ?? "2025–2028";

  return (
    <>
      <header className="relative overflow-hidden text-white" style={{ background: "linear-gradient(120deg, var(--primary-deep) 0%, var(--primary-deep) 40%, var(--primary) 100%)" }}>
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none" aria-hidden style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "22px 22px" }} />
        <Users className="absolute right-6 -bottom-10 h-56 w-56 opacity-10 hidden md:block pointer-events-none" aria-hidden />
        <div className="container-page relative py-8 md:py-10">
          <nav aria-label="Você está aqui" className="flex items-center gap-1 text-xs text-white/85">
            <Link to="/" className="hover:underline underline-offset-2">Início</Link>
            <ChevronRight className="h-3 w-3 opacity-70" aria-hidden />
            <span className="font-semibold text-white">Vereadores</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight mt-3">Vereadores</h1>
          <p className="text-white/90 mt-2 max-w-2xl leading-relaxed">Quem representa a população de Adelândia na Câmara Municipal, na legislatura {mandato}.</p>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-3xl">
            {[
              { r: "Vereadores", v: carregando ? "–" : vereadores.length },
              { r: "Partidos", v: carregando ? "–" : bancadas.length },
              { r: "Sessões realizadas", v: sessoes ?? "–" },
              { r: "Mesa Diretora", v: carregando ? "–" : vereadores.filter(daMesa).length },
            ].map((n) => (
              <div key={n.r} className="rounded-xl bg-white/10 px-4 py-3">
                <dt className="text-xs text-white/85">{n.r}</dt>
                <dd className="font-display text-2xl font-bold tabular-nums">{n.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="container-page py-8 md:py-10 space-y-8">
        {bancadas.length > 0 && (
          <section aria-labelledby="titulo-bancadas" className="bg-card border border-border rounded-2xl p-5">
            <h2 id="titulo-bancadas" className="font-display font-bold text-lg text-foreground">Composição da Casa</h2>
            <p className="text-sm text-muted-foreground">Toque em um partido para ver seus vereadores.</p>
            <div className="flex h-3 rounded-full overflow-hidden bg-muted mt-3" aria-hidden>
              {bancadas.map((b) => <span key={b.nome} style={{ width: `${(b.n / vereadores.length) * 100}%`, backgroundColor: b.cor, opacity: partido && partido !== b.nome ? 0.25 : 1 }} />)}
            </div>
            <ul className="flex flex-wrap gap-2 mt-3">
              {bancadas.map((b) => (
                <li key={b.nome}>
                  <button type="button" aria-pressed={partido === b.nome} onClick={() => setPartido(partido === b.nome ? "" : b.nome)} className={`inline-flex items-center gap-2 min-h-10 px-3 rounded-xl border text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${partido === b.nome ? "bg-muted border-foreground/40" : "border-border hover:bg-muted/60"} text-foreground`}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.cor }} aria-hidden /> {b.nome} <span className="text-muted-foreground tabular-nums">{b.n}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label="Filtros" className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-2xl p-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden />
            <input aria-label="Buscar vereador" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, partido ou cargo..." className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-3 text-sm text-foreground" />
          </div>
          <select aria-label="Filtrar por partido" value={partido} onChange={(e) => setPartido(e.target.value)} className={seletor}>
            <option value="">Todos os partidos</option>
            {bancadas.map((b) => <option key={b.nome} value={b.nome}>{b.nome} ({b.n})</option>)}
          </select>
          <select aria-label="Filtrar por cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} className={seletor}>
            <option value="">Todos os cargos</option>
            {cargos.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {temFiltro && <button type="button" onClick={limpar} className="inline-flex items-center gap-1 h-11 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted"><X className="w-4 h-4" aria-hidden /> Limpar</button>}
          <p className="w-full text-sm text-muted-foreground px-1" aria-live="polite">{carregando ? "Carregando..." : `${filtrados.length} de ${vereadores.length} vereadores`}</p>
        </section>

        {carregando ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden>{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />)}</div>
        ) : erro ? (
          <div role="alert" className="bg-card border border-destructive/40 rounded-2xl p-10 text-center font-semibold text-foreground">Não foi possível carregar os vereadores agora. Tente de novo em instantes.</div>
        ) : filtrados.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
            <User className="w-10 h-10 mx-auto text-muted-foreground" aria-hidden />
            <p className="font-display font-bold text-lg text-foreground mt-3">Nenhum vereador encontrado</p>
            <button type="button" onClick={limpar} className="mt-3 text-sm font-semibold underline underline-offset-2 text-foreground">Limpar filtros</button>
          </div>
        ) : (
          <>
            {mesa.length > 0 && (
              <section aria-labelledby="titulo-mesa">
                <h2 id="titulo-mesa" className="flex items-center gap-2 font-display font-bold text-xl text-foreground mb-4"><Crown className="w-5 h-5 text-gold" aria-hidden /> Mesa Diretora</h2>
                <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{mesa.map((v) => <Cartao key={v.id} v={v} />)}</ul>
              </section>
            )}
            {demais.length > 0 && (
              <section aria-labelledby="titulo-demais">
                <h2 id="titulo-demais" className="flex items-center gap-2 font-display font-bold text-xl text-foreground mb-4"><Users className="w-5 h-5 text-primary" aria-hidden /> {mesa.length ? "Demais vereadores" : "Vereadores"}</h2>
                <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{demais.map((v) => <Cartao key={v.id} v={v} />)}</ul>
              </section>
            )}
          </>
        )}

        <section aria-labelledby="titulo-mais" className="grid gap-6 lg:grid-cols-[1fr_1.2fr] items-center bg-card border border-border rounded-2xl p-5 md:p-6">
          <div>
            <h2 id="titulo-mais" className="font-display font-bold text-xl text-foreground">Acompanhe o trabalho da Câmara</h2>
            <p className="text-sm text-muted-foreground mt-1">Os vereadores legislam sobre assuntos de interesse local e fiscalizam o Poder Executivo.</p>
            <ul className="mt-4 space-y-2">
              {[
                { to: "/sessoes" as const, rotulo: "Sessões, pautas e atas", icone: Calendar },
                { to: "/a-camara/comissoes" as const, rotulo: "Comissões permanentes", icone: Scale },
                { to: "/a-camara/mesa-diretora" as const, rotulo: "Mesa Diretora", icone: Crown },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="group flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/50 transition focus-visible:outline-2 focus-visible:outline-offset-2">
                    <l.icone className="w-5 h-5 text-primary" aria-hidden />
                    <span className="flex-1 text-sm font-semibold text-foreground">{l.rotulo}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {plenario && <img src={plenario} alt="Plenário da Câmara Municipal" className="w-full aspect-video object-cover rounded-xl" />}
        </section>
      </div>
    </>
  );
}
