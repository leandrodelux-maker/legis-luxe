import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Clock, ExternalLink, FileText, Gavel, LayoutList, MapPin, Play, Radio, Search, Stamp, Users2, Vote, X } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/sessoes/")({
  head: () => ({
    meta: [
      { title: "Sessões e Processo Legislativo — Câmara Municipal" },
      { name: "description", content: "Agenda das sessões, pautas, atas, presença e votações da Câmara Municipal, e como um projeto vira lei." },
    ],
  }),
  component: SessoesPage,
});

type Sessao = {
  id: string;
  titulo: string;
  tipo: string | null;
  data_sessao: string;
  local: string | null;
  status: string;
  video_url: string | null;
  pauta: string | null;
  ata_url: string | null;
  ata_publicada: boolean | null;
  lista_presenca_url: string | null;
  resumo_votos_url: string | null;
};
type Pessoa = { nome: string; valor: string; cor: string };

const SITUACOES: Record<string, { rotulo: string; cor: string }> = {
  agendada: { rotulo: "Agendada", cor: "#1F5FBF" },
  realizada: { rotulo: "Realizada", cor: "#0B7A4B" },
  cancelada: { rotulo: "Cancelada", cor: "#B42318" },
};
const VOTOS: Record<string, { rotulo: string; cor: string }> = {
  sim: { rotulo: "Sim", cor: "#0B7A4B" },
  nao: { rotulo: "Não", cor: "#B42318" },
  abstencao: { rotulo: "Abstenção", cor: "#475569" },
};
const FASES = [
  { chave: "protocolado", rotulo: "Protocolado", desc: "O projeto é apresentado e recebe número.", icone: FileText },
  { chave: "comissao", rotulo: "Comissão", desc: "As comissões analisam e dão parecer.", icone: Users2 },
  { chave: "plenario", rotulo: "Plenário", desc: "Os vereadores debatem e votam.", icone: Gavel },
  { chave: "aprovado", rotulo: "Aprovado", desc: "O texto aprovado segue para sanção.", icone: CheckCircle2 },
  { chave: "sancionado", rotulo: "Sancionado", desc: "O projeto vira lei.", icone: Stamp },
];
const POR_PAGINA = 12;

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const seletor = "h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground min-w-0";
const data = (d: string) => new Date(d);
const dataLonga = (d: string) => data(d).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const hora = (d: string) => data(d).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
/** Títulos gravados em maiúsculas ficam mais fáceis de ler assim. */
const titulo = (t: string) => {
  if (t !== t.toUpperCase()) return t;
  const menores = new Set(["de", "da", "do", "das", "dos", "e", "a", "o"]);
  return t.toLowerCase().replace(/\S+/g, (p, i) => (i && menores.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)));
};
const idYoutube = (u: string | null) => /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/.exec(u ?? "")?.[1] ?? null;

function Selo({ s }: { s: Sessao }) {
  const c = SITUACOES[s.status] ?? { rotulo: s.status, cor: "#475569" };
  return <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap" style={{ color: `color-mix(in srgb, ${c.cor} 75%, var(--foreground))`, borderColor: `color-mix(in srgb, ${c.cor} 35%, transparent)`, backgroundColor: `color-mix(in srgb, ${c.cor} 9%, transparent)` }}>{c.rotulo}</span>;
}

function DataBloco({ d, cor }: { d: string; cor: string }) {
  const x = data(d);
  return (
    <div className="w-14 rounded-xl text-center text-white py-1.5 shrink-0 self-start" style={{ backgroundColor: cor }} aria-hidden>
      <p className="text-[10px] font-bold uppercase tracking-wider">{x.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</p>
      <p className="font-display text-xl font-bold leading-none">{x.getDate()}</p>
      <p className="text-[10px] opacity-90">{x.getFullYear()}</p>
    </div>
  );
}

function ListaPessoas({ itens, vazio }: { itens: Pessoa[]; vazio: string }) {
  if (!itens.length) return <p className="text-sm text-muted-foreground">{vazio}</p>;
  return (
    <ul className="grid gap-1.5">
      {itens.map((p) => (
        <li key={p.nome} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-2.5">
          <span className="text-sm font-semibold text-foreground">{p.nome}</span>
          <span className="text-xs font-bold text-white rounded-full px-2.5 py-1" style={{ backgroundColor: p.cor }}>{p.valor}</span>
        </li>
      ))}
    </ul>
  );
}

function PainelSessao({ sessao, onClose }: { sessao: Sessao; onClose: () => void }) {
  const [aba, setAba] = useState("resumo");
  const [presencas, setPresencas] = useState<Pessoa[] | null>(null);
  const [votos, setVotos] = useState<Pessoa[] | null>(null);
  const video = idYoutube(sessao.video_url);

  useEffect(() => {
    (async () => {
      const [vs, ps, vt] = await Promise.all([
        (supabase as any).from("vereadores").select("id, nome, mandato_inicio"),
        supabase.from("sessoes_presencas").select("vereador_id, presente").eq("sessao_id", sessao.id),
        supabase.from("sessoes_votacoes").select("vereador_id, voto, created_at").eq("sessao_id", sessao.id).order("created_at"),
      ]);
      const quem = new Map<string, { nome: string; mandato_inicio: string | null }>(((vs.data as any[]) ?? []).map((v) => [v.id, v]));
      const dia = sessao.data_sessao.slice(0, 10);
      const ordena = (a: Pessoa, b: Pessoa) => a.nome.localeCompare(b.nome, "pt-BR");
      // Antes do início do mandato a pessoa não era vereadora: isso não é ausência.
      setPresencas(((ps.data as any[]) ?? []).filter((p) => { const v = quem.get(p.vereador_id); return v && (!v.mandato_inicio || dia >= v.mandato_inicio); }).map((p) => ({ nome: quem.get(p.vereador_id)!.nome, valor: p.presente ? "Presente" : "Ausente", cor: p.presente ? "#0B7A4B" : "#B42318" })).sort(ordena));
      // Vale o voto mais recente de cada vereador.
      const ultimo = new Map<string, string>(((vt.data as any[]) ?? []).map((v) => [v.vereador_id, v.voto]));
      setVotos([...ultimo.entries()].filter(([id]) => quem.has(id)).map(([id, v]) => ({ nome: quem.get(id)!.nome, valor: VOTOS[v]?.rotulo ?? v, cor: VOTOS[v]?.cor ?? "#475569" })).sort(ordena));
    })();
  }, [sessao]);

  const abas = [
    { id: "resumo", rotulo: "Resumo" },
    { id: "presenca", rotulo: "Presença", n: presencas?.length },
    { id: "votos", rotulo: "Votos", n: votos?.length },
  ];

  return (
    <Sheet open onOpenChange={(a) => !a && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 gap-0 flex flex-col [&>button]:text-white [&>button]:opacity-100">
        <div className="relative overflow-hidden px-6 py-5 text-white shrink-0" style={{ background: "linear-gradient(120deg, var(--primary-deep), var(--primary))" }}>
          <p className="text-xs font-bold uppercase tracking-wide text-white/85">{sessao.tipo || "Sessão"}</p>
          <SheetTitle className="text-white font-display text-xl font-bold leading-snug mt-1 pr-8">{titulo(sessao.titulo)}</SheetTitle>
          <SheetDescription className="text-white/90 text-sm mt-1.5 first-letter:uppercase">{dataLonga(sessao.data_sessao)}, às {hora(sessao.data_sessao)}</SheetDescription>
        </div>
        <div role="tablist" aria-label="Informações da sessão" className="flex gap-1 border-b border-border px-4 shrink-0">
          {abas.map((a) => (
            <button key={a.id} type="button" role="tab" aria-selected={aba === a.id} onClick={() => setAba(a.id)} className={`px-3 py-3 text-sm font-semibold border-b-2 -mb-px transition ${aba === a.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {a.rotulo}{a.n ? ` (${a.n})` : ""}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5" role="tabpanel">
          {aba === "resumo" && (
            <>
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                <div><dt className="text-xs font-semibold text-muted-foreground">Situação</dt><dd className="mt-1"><Selo s={sessao} /></dd></div>
                {sessao.local && <div><dt className="text-xs font-semibold text-muted-foreground">Local</dt><dd className="font-medium text-foreground mt-1">{sessao.local}</dd></div>}
              </dl>
              {sessao.pauta && sessao.pauta.trim().toLowerCase() !== sessao.titulo.trim().toLowerCase() && (
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">Pauta</h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground rounded-xl border border-border p-4">{sessao.pauta}</p>
                </div>
              )}
              {video && (
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe src={`https://www.youtube-nocookie.com/embed/${video}`} title={`Gravação de ${titulo(sessao.titulo)}`} loading="lazy" allowFullScreen className="w-full h-full" />
                </div>
              )}
              <div className="grid gap-2">
                {[
                  { url: sessao.ata_publicada ? sessao.ata_url : null, rotulo: "Ata da sessão", icone: FileText },
                  { url: sessao.lista_presenca_url, rotulo: "Lista de presença assinada", icone: Users2 },
                  { url: sessao.resumo_votos_url, rotulo: "Resumo dos votos", icone: Vote },
                  { url: !video ? sessao.video_url : null, rotulo: "Gravação da sessão", icone: Play },
                ].filter((d) => d.url).map((d) => (
                  <a key={d.rotulo} href={d.url!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-border p-3.5 hover:bg-muted/50 transition focus-visible:outline-2 focus-visible:outline-offset-2">
                    <d.icone className="w-5 h-5 text-primary" aria-hidden />
                    <span className="flex-1 text-sm font-semibold text-foreground">{d.rotulo}</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" aria-hidden />
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                ))}
              </div>
            </>
          )}
          {aba === "presenca" && (presencas === null ? <p className="text-sm text-muted-foreground">Carregando...</p> : <ListaPessoas itens={presencas} vazio="Presença não registrada para esta sessão." />)}
          {aba === "votos" && (votos === null ? <p className="text-sm text-muted-foreground">Carregando...</p> : <ListaPessoas itens={votos} vazio="Nenhum voto registrado para esta sessão." />)}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SessoesPage() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [aoVivo, setAoVivo] = useState<string | null>(null);
  const [fases, setFases] = useState<Record<string, number>>({});
  const [busca, setBusca] = useState("");
  const [ano, setAno] = useState("");
  const [tipo, setTipo] = useState("");
  const [situacao, setSituacao] = useState("");
  const [dia, setDia] = useState<Date | undefined>();
  const [visao, setVisao] = useState<"lista" | "calendario">("lista");
  const [mes, setMes] = useState<Date | undefined>();
  const [pagina, setPagina] = useState(1);
  const [aberta, setAberta] = useState<Sessao | null>(null);

  useEffect(() => {
    supabase.from("sessoes").select("id, titulo, tipo, data_sessao, local, status, video_url, pauta, ata_url, ata_publicada, lista_presenca_url, resumo_votos_url").order("data_sessao", { ascending: false }).then(({ data: d, error }) => {
      if (error) setErro(true);
      setSessoes((d as Sessao[]) ?? []);
      setCarregando(false);
    });
    supabase.from("site_settings").select("live_broadcast_url").limit(1).maybeSingle().then(({ data: d }) => setAoVivo((d as any)?.live_broadcast_url ?? null));
    supabase.from("projetos_legislativos").select("status").then(({ data: d }) => {
      const c: Record<string, number> = {};
      for (const p of (d as { status: string }[]) ?? []) c[p.status] = (c[p.status] ?? 0) + 1;
      setFases(c);
    });
  }, []);

  const agora = Date.now();
  const proxima = useMemo(() => [...sessoes].filter((s) => s.status === "agendada" && data(s.data_sessao).getTime() >= agora).sort((a, b) => a.data_sessao.localeCompare(b.data_sessao))[0], [sessoes, agora]);
  const anoDe = (s: Sessao) => String(data(s.data_sessao).getFullYear());
  const porAno = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of sessoes) m.set(anoDe(s), (m.get(anoDe(s)) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [sessoes]);
  const tipos = useMemo(() => [...new Set(sessoes.map((s) => s.tipo).filter(Boolean) as string[])].sort(), [sessoes]);
  const maiorAno = Math.max(1, ...porAno.map(([, n]) => n));
  const realizadas = sessoes.filter((s) => s.status === "realizada").length;
  const comAta = sessoes.filter((s) => s.ata_publicada && s.ata_url).length;

  const mesmoDia = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const filtradas = useMemo(() => {
    const q = normalizar(busca.trim());
    return sessoes.filter((s) => (!ano || anoDe(s) === ano) && (!tipo || s.tipo === tipo) && (!situacao || s.status === situacao) && (!dia || mesmoDia(data(s.data_sessao), dia)) && (!q || normalizar(`${s.titulo} ${s.tipo ?? ""} ${s.local ?? ""} ${s.pauta ?? ""}`).includes(q)));
  }, [sessoes, busca, ano, tipo, situacao, dia]);
  useEffect(() => setPagina(1), [busca, ano, tipo, situacao, dia]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const atual = Math.min(pagina, totalPaginas);
  const visiveis = filtradas.slice((atual - 1) * POR_PAGINA, atual * POR_PAGINA);
  const temFiltro = Boolean(busca || ano || tipo || situacao || dia);
  const limpar = () => { setBusca(""); setAno(""); setTipo(""); setSituacao(""); setDia(undefined); };
  const diasComSessao = useMemo(() => sessoes.map((s) => data(s.data_sessao)), [sessoes]);

  return (
    <>
      <CabecalhoPagina
        titulo="Sessões e Processo"
        descricao="Agenda das sessões, pautas, atas, presença e votações da Câmara Municipal, e o caminho de um projeto até virar lei."
        numeros={carregando ? undefined : [{ rotulo: "Sessões", valor: sessoes.length }, { rotulo: "Realizadas", valor: realizadas }, { rotulo: "Atas publicadas", valor: comAta }, { rotulo: "Anos", valor: porAno.length }]}
        lateral={
          <section aria-labelledby="titulo-proxima" className="bg-card text-foreground rounded-3xl shadow-2xl p-5 md:p-6">
            <h2 id="titulo-proxima" className="font-display font-bold">Próxima sessão</h2>
            {carregando ? (
              <div className="h-24 mt-3 rounded-xl bg-muted animate-pulse" aria-hidden />
            ) : proxima ? (
              <button type="button" onClick={() => setAberta(proxima)} className="flex gap-3 text-left mt-3 w-full rounded-xl hover:bg-muted/50 transition focus-visible:outline-2 focus-visible:outline-offset-2">
                <DataBloco d={proxima.data_sessao} cor="#1F5FBF" />
                <span className="min-w-0">
                  <span className="block font-bold leading-snug">{titulo(proxima.titulo)}</span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1"><Clock className="w-4 h-4 shrink-0" aria-hidden /> {hora(proxima.data_sessao)}</span>
                  {proxima.local && <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="w-4 h-4 shrink-0" aria-hidden /> {proxima.local}</span>}
                </span>
              </button>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">Nenhuma sessão agendada no momento.</p>
            )}
            {aoVivo && (
              <a href={aoVivo} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl text-sm font-bold text-white bg-red-700 hover:bg-red-800 transition focus-visible:outline-2 focus-visible:outline-offset-2">
                <Radio className="w-4 h-4" aria-hidden /> Assistir à transmissão
              </a>
            )}
          </section>
        }
      />

      <div className="container-page py-8 md:py-10 space-y-6">
        {porAno.length > 0 && (
          <section aria-labelledby="titulo-anos" className="bg-card border border-border rounded-2xl p-5">
            <h2 id="titulo-anos" className="font-display font-bold text-lg text-foreground">Sessões por ano</h2>
            <p className="text-sm text-muted-foreground">Toque em um ano para ver as sessões dele.</p>
            <ul className="grid gap-2 mt-3">
              {porAno.map(([a, n]) => (
                <li key={a}>
                  <button type="button" aria-pressed={ano === a} onClick={() => setAno(ano === a ? "" : a)} className={`w-full flex items-center gap-3 rounded-lg px-2 py-1.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 ${ano === a ? "bg-muted" : "hover:bg-muted/60"}`}>
                    <span className="w-12 text-left text-sm font-bold text-foreground tabular-nums">{a}</span>
                    <span className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden" aria-hidden><span className="block h-full rounded-full bg-primary" style={{ width: `${(n / maiorAno) * 100}%` }} /></span>
                    <span className="w-24 text-right text-sm text-muted-foreground tabular-nums">{n} {n === 1 ? "sessão" : "sessões"}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label="Filtros" className="bg-card border border-border rounded-2xl p-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden />
              <input aria-label="Buscar sessão" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por título, tipo ou pauta..." className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-3 text-sm text-foreground" />
            </div>
            <select aria-label="Filtrar por ano" value={ano} onChange={(e) => setAno(e.target.value)} className={seletor}>
              <option value="">Todos os anos</option>
              {porAno.map(([a, n]) => <option key={a} value={a}>{a} ({n})</option>)}
            </select>
            <select aria-label="Filtrar por tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className={seletor}>
              <option value="">Todos os tipos</option>
              {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select aria-label="Filtrar por situação" value={situacao} onChange={(e) => setSituacao(e.target.value)} className={seletor}>
              <option value="">Todas as situações</option>
              {Object.entries(SITUACOES).map(([k, v]) => <option key={k} value={k}>{v.rotulo}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <p className="text-sm text-muted-foreground" aria-live="polite">{carregando ? "Carregando..." : `${filtradas.length} de ${sessoes.length} sessões`}{dia ? ` em ${dia.toLocaleDateString("pt-BR")}` : ""}</p>
            <div className="flex items-center gap-2">
              {temFiltro && <button type="button" onClick={limpar} className="inline-flex items-center gap-1 h-9 px-3 rounded-lg text-sm font-semibold text-foreground hover:bg-muted"><X className="w-4 h-4" aria-hidden /> Limpar</button>}
              <div role="group" aria-label="Forma de exibição" className="flex rounded-lg bg-muted/60 p-0.5">
                <button type="button" aria-pressed={visao === "lista"} onClick={() => setVisao("lista")} className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-semibold text-foreground ${visao === "lista" ? "bg-card shadow-sm" : ""}`}><LayoutList className="w-4 h-4" aria-hidden /> Lista</button>
                <button type="button" aria-pressed={visao === "calendario"} onClick={() => { setVisao("calendario"); if (!mes && sessoes[0]) setMes(proxima ? data(proxima.data_sessao) : data(sessoes[0].data_sessao)); }} className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-semibold text-foreground ${visao === "calendario" ? "bg-card shadow-sm" : ""}`}><CalendarIcon className="w-4 h-4" aria-hidden /> Calendário</button>
              </div>
            </div>
          </div>
        </section>

        <div className={visao === "calendario" ? "grid gap-4 lg:grid-cols-[auto_1fr] items-start" : ""}>
          {visao === "calendario" && (
            <div className="bg-card border border-border rounded-2xl p-3 justify-self-center">
              <Calendar locale={ptBR} mode="single" selected={dia} onSelect={setDia} month={mes} onMonthChange={setMes} modifiers={{ sessao: diasComSessao }} modifiersClassNames={{ sessao: "font-bold underline decoration-2 underline-offset-4 decoration-primary" }} />
              <p className="text-xs text-muted-foreground px-2 pb-1">Dias sublinhados têm sessão.</p>
            </div>
          )}
          <div>
            {carregando ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden>{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />)}</div>
            ) : erro ? (
              <div role="alert" className="bg-card border border-destructive/40 rounded-2xl p-10 text-center font-semibold text-foreground">Não foi possível carregar as sessões agora. Tente de novo em instantes.</div>
            ) : filtradas.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
                <p className="font-display font-bold text-lg text-foreground">Nenhuma sessão encontrada</p>
                {temFiltro && <button type="button" onClick={limpar} className="mt-3 text-sm font-semibold underline underline-offset-2 text-foreground">Limpar filtros</button>}
              </div>
            ) : (
              <ul className={`grid gap-4 ${visao === "calendario" ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
                {visiveis.map((s) => (
                  <li key={s.id} className="group relative flex flex-col bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition">
                    <div className="flex gap-3 flex-1">
                      <DataBloco d={s.data_sessao} cor={SITUACOES[s.status]?.cor ?? "#475569"} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-muted-foreground">{s.tipo || "Sessão"}</p>
                          <Selo s={s} />
                        </div>
                        <h3 className="font-display font-bold text-foreground leading-snug mt-1">
                          <button type="button" onClick={() => setAberta(s)} className="text-left after:absolute after:inset-0 after:rounded-2xl group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">{titulo(s.titulo)}</button>
                        </h3>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1"><Clock className="w-3.5 h-3.5 shrink-0" aria-hidden /> {hora(s.data_sessao)}{s.local ? ` · ${s.local}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border mt-3 pt-2.5 text-xs font-semibold text-muted-foreground">
                      {s.ata_publicada && s.ata_url && <span className="inline-flex items-center gap-1"><FileText className="w-3.5 h-3.5" aria-hidden /> Ata</span>}
                      {s.pauta && <span className="inline-flex items-center gap-1"><Gavel className="w-3.5 h-3.5" aria-hidden /> Pauta</span>}
                      {s.video_url && <span className="inline-flex items-center gap-1"><Play className="w-3.5 h-3.5" aria-hidden /> Vídeo</span>}
                      <span className="ml-auto inline-flex items-center gap-0.5 text-primary">Ver detalhes <ChevronRight className="w-3.5 h-3.5" aria-hidden /></span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {totalPaginas > 1 && (
              <nav aria-label="Páginas" className="flex items-center justify-center gap-3 mt-5">
                <button type="button" aria-label="Página anterior" disabled={atual === 1} onClick={() => setPagina(atual - 1)} className="w-10 h-10 grid place-items-center rounded-xl border border-border text-foreground disabled:opacity-40 hover:bg-muted"><ChevronLeft className="w-4 h-4" aria-hidden /></button>
                <span className="text-sm text-muted-foreground tabular-nums">Página {atual} de {totalPaginas}</span>
                <button type="button" aria-label="Próxima página" disabled={atual === totalPaginas} onClick={() => setPagina(atual + 1)} className="w-10 h-10 grid place-items-center rounded-xl border border-border text-foreground disabled:opacity-40 hover:bg-muted"><ChevronRight className="w-4 h-4" aria-hidden /></button>
              </nav>
            )}
          </div>
        </div>

        <section aria-labelledby="titulo-processo" className="bg-card border border-border rounded-2xl p-5 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="titulo-processo" className="font-display font-bold text-xl text-foreground">Como um projeto vira lei</h2>
              <p className="text-sm text-muted-foreground mt-0.5">As etapas da tramitação, com quantos projetos estão em cada uma.</p>
            </div>
            <Link to={ROUTES.projetos} className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition">Ver projetos <ArrowRight className="w-4 h-4" aria-hidden /></Link>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mt-5">
            {FASES.map((f, i) => (
              <li key={f.chave} className="relative rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary text-primary-foreground"><f.icone className="w-5 h-5" aria-hidden /></span>
                  <span className="font-display text-2xl font-bold text-foreground tabular-nums" aria-label={`${fases[f.chave] ?? 0} projetos nesta etapa`}>{fases[f.chave] ?? 0}</span>
                </div>
                <p className="font-bold text-sm text-foreground mt-3"><span className="text-muted-foreground">{i + 1}.</span> {f.rotulo}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {aberta && <PainelSessao key={aberta.id} sessao={aberta} onClose={() => setAberta(null)} />}
    </>
  );
}
