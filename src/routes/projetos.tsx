import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, ChevronRight, Download, FileText, Gavel, Stamp, User, Users2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { OutrosAtos } from "@/components/pagina-documento-oficial";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/projetos")({
  head: () => ({
    meta: [
      { title: "Atos Legislativos — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content: "Pesquise projetos de lei, indicações, requerimentos e moções da Câmara e acompanhe a tramitação de cada matéria.",
      },
    ],
  }),
  component: ProjetosPage,
});

type Projeto = {
  id: string;
  numero: string;
  ano: number;
  tipo: string;
  ementa: string;
  autor: string | null;
  status: string;
  documento_url: string | null;
  data_apresentacao: string | null;
  tramitacao: string | null;
  observacoes: string | null;
  vereadores?: { id: string; nome: string; slug: string | null } | null;
};

const TIPOS = [
  { nome: "Projeto de Lei", texto: "Propõe uma nova lei ou a mudança de uma lei em vigor." },
  { nome: "Projeto de Lei Complementar", texto: "Trata dos temas que a Lei Orgânica reserva à lei complementar." },
  { nome: "Projeto de Decreto Legislativo", texto: "Regula assuntos de competência exclusiva da Câmara." },
  { nome: "Indicação", texto: "Sugere ao Poder Executivo uma providência de interesse público." },
  { nome: "Requerimento", texto: "Pede informações ou providências formalmente." },
  { nome: "Moção", texto: "Manifesta apoio, aplauso, pesar ou protesto da Câmara." },
  { nome: "Emenda", texto: "Propõe alterar o texto de outra proposição." },
];

const FASES = [
  { chave: "protocolado", rotulo: "Protocolado", desc: "A matéria é apresentada e recebe número.", icone: FileText },
  { chave: "comissao", rotulo: "Comissão", desc: "As comissões analisam e dão parecer.", icone: Users2 },
  { chave: "plenario", rotulo: "Plenário", desc: "Os vereadores debatem e votam.", icone: Gavel },
  { chave: "aprovado", rotulo: "Aprovado", desc: "O texto aprovado segue para sanção.", icone: CheckCircle2 },
  { chave: "sancionado", rotulo: "Sancionado", desc: "O projeto vira lei.", icone: Stamp },
];
const SITUACOES: Record<string, { rotulo: string; cor: string }> = {
  protocolado: { rotulo: "Protocolado", cor: "#475569" },
  comissao: { rotulo: "Em comissão", cor: "#8A5A00" },
  plenario: { rotulo: "Em plenário", cor: "#1D4ED8" },
  aprovado: { rotulo: "Aprovado", cor: "#0B7A4B" },
  sancionado: { rotulo: "Sancionado", cor: "#0B7A4B" },
  arquivado: { rotulo: "Arquivado", cor: "#475569" },
  rejeitado: { rotulo: "Rejeitado", cor: "#B42318" },
};
const EM_TRAMITACAO = ["protocolado", "comissao", "plenario"];
const POR_PAGINA = 12;

const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const seletor = "h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground min-w-0";
const identificacao = (p: Projeto) => `${p.tipo} nº ${p.numero}/${p.ano}`;
const autorDe = (p: Projeto) => p.vereadores?.nome || p.autor || "Não informado";
const dataCurta = (d: string) => new Date(`${d.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR");

function Selo({ status }: { status: string }) {
  const s = SITUACOES[status] ?? { rotulo: status, cor: "#475569" };
  return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold" style={{ color: s.cor, borderColor: `${s.cor}55`, backgroundColor: `${s.cor}12` }}>{s.rotulo}</span>;
}

function Etapas({ status }: { status: string }) {
  const atual = FASES.findIndex((f) => f.chave === status);
  if (atual < 0) return <p className="text-sm text-muted-foreground">Esta matéria foi {SITUACOES[status]?.rotulo.toLowerCase() ?? status} e encerrou a tramitação.</p>;
  return (
    <ol className="space-y-3">
      {FASES.map((f, i) => {
        const feita = i <= atual;
        return (
          <li key={f.chave} className="flex gap-3" aria-current={i === atual ? "step" : undefined}>
            <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${feita ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><f.icone className="w-4 h-4" aria-hidden /></span>
            <span>
              <span className={`block text-sm font-bold ${feita ? "text-foreground" : "text-muted-foreground"}`}>{f.rotulo}{i === atual ? " (etapa atual)" : ""}</span>
              <span className="block text-xs text-muted-foreground">{f.desc}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function PainelMateria({ projeto: p, onClose }: { projeto: Projeto; onClose: () => void }) {
  return (
    <Sheet open onOpenChange={(a) => !a && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 gap-0 flex flex-col [&>button]:text-white [&>button]:opacity-100">
        <div className="p-5 text-white shrink-0" style={{ background: "linear-gradient(120deg, var(--primary-deep), var(--primary))" }}>
          <p className="text-xs font-semibold text-white/90">{p.tipo}</p>
          <SheetTitle className="text-white font-display text-xl font-bold leading-snug mt-1 pr-8">Nº {p.numero}/{p.ano}</SheetTitle>
          <SheetDescription className="text-white/90 text-sm mt-1.5">{SITUACOES[p.status]?.rotulo ?? p.status}</SheetDescription>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Ementa</h3>
            <p className="text-foreground leading-relaxed mt-1.5">{p.ementa}</p>
          </section>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-border p-3">
              <dt className="text-xs text-muted-foreground">Autoria</dt>
              <dd className="font-semibold text-foreground mt-0.5">
                {p.vereadores ? <Link to="/vereadores/$slug" params={{ slug: p.vereadores.slug || p.vereadores.id }} className="underline underline-offset-2">{p.vereadores.nome}</Link> : autorDe(p)}
              </dd>
            </div>
            <div className="rounded-xl border border-border p-3">
              <dt className="text-xs text-muted-foreground">Apresentação</dt>
              <dd className="font-semibold text-foreground mt-0.5">{p.data_apresentacao ? dataCurta(p.data_apresentacao) : "Não informada"}</dd>
            </div>
          </dl>
          {p.documento_url && (
            <a href={p.documento_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">
              <Download className="w-4 h-4" aria-hidden /> Abrir o texto da matéria
            </a>
          )}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Tramitação</h3>
            <Etapas status={p.status} />
            {p.tramitacao && <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mt-4 rounded-xl bg-muted/60 p-3">{p.tramitacao}</p>}
          </section>
          {p.observacoes && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Observações</h3>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mt-1.5">{p.observacoes}</p>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");
  const [ano, setAno] = useState("");
  const [situacao, setSituacao] = useState("");
  const [autor, setAutor] = useState("");
  const [limite, setLimite] = useState(POR_PAGINA);
  const [aberto, setAberto] = useState<Projeto | null>(null);

  useEffect(() => {
    supabase
      .from("projetos_legislativos")
      .select("id, numero, ano, tipo, ementa, autor, status, documento_url, data_apresentacao, tramitacao, observacoes, vereadores(id, nome, slug)")
      .order("ano", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setErro(true);
        setProjetos((data as unknown as Projeto[]) ?? []);
        setCarregando(false);
      });
  }, []);

  useEffect(() => setLimite(POR_PAGINA), [busca, tipo, ano, situacao, autor]);

  const contaTipo = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of projetos) c[p.tipo] = (c[p.tipo] ?? 0) + 1;
    return c;
  }, [projetos]);
  const contaFase = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of projetos) c[p.status] = (c[p.status] ?? 0) + 1;
    return c;
  }, [projetos]);
  const anos = useMemo(() => [...new Set(projetos.map((p) => p.ano))].sort((a, b) => b - a), [projetos]);
  const autores = useMemo(() => [...new Set(projetos.map(autorDe))].sort((a, b) => a.localeCompare(b, "pt-BR")), [projetos]);
  const nomesTipo = useMemo(() => [...new Set([...TIPOS.map((t) => t.nome), ...Object.keys(contaTipo)])], [contaTipo]);

  const q = normalizar(busca.trim());
  const visiveis = projetos.filter((p) =>
    (!tipo || p.tipo === tipo) && (!ano || String(p.ano) === ano) && (!situacao || p.status === situacao) && (!autor || autorDe(p) === autor) &&
    (!q || normalizar(`${p.tipo} ${p.numero}/${p.ano} ${p.ementa} ${autorDe(p)}`).includes(q)));
  const temFiltro = Boolean(busca || tipo || ano || situacao || autor);
  const limpar = () => { setBusca(""); setTipo(""); setAno(""); setSituacao(""); setAutor(""); };

  return (
    <>
      <CabecalhoPagina
        titulo="Atos Legislativos"
        icone={FileText}
        descricao="Pesquise projetos de lei, indicações, requerimentos e moções da Câmara e acompanhe em que etapa cada matéria está."
        numeros={carregando || projetos.length === 0 ? undefined : [
          { rotulo: "Matérias", valor: projetos.length },
          { rotulo: "Em tramitação", valor: projetos.filter((p) => EM_TRAMITACAO.includes(p.status)).length },
          { rotulo: "Aprovadas ou sancionadas", valor: (contaFase.aprovado ?? 0) + (contaFase.sancionado ?? 0) },
          { rotulo: "Autores", valor: autores.length },
        ]}
      />

      <div className="container-page py-8 md:py-10 space-y-8">
        {carregando ? (
          <div className="space-y-3" aria-hidden>{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />)}</div>
        ) : erro ? (
          <div role="alert" className="bg-card border border-destructive/40 rounded-2xl p-10 text-center font-semibold text-foreground">Não foi possível carregar as matérias agora. Tente de novo em instantes.</div>
        ) : projetos.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-8 md:p-10 text-center">
            <FileText className="w-9 h-9 text-primary mx-auto" aria-hidden />
            <h2 className="font-display font-bold text-xl text-foreground mt-3">Nenhuma matéria publicada ainda</h2>
            <p className="text-muted-foreground mt-1.5 max-w-xl mx-auto">As matérias aparecerão aqui assim que forem publicadas pela Câmara. Enquanto isso, as atas das sessões registram o que foi discutido e votado.</p>
            <Link to={ROUTES.sessoes} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold mt-5 hover:opacity-90 transition">Ver sessões e atas <ArrowRight className="w-4 h-4" aria-hidden /></Link>
          </div>
        ) : (
          <section aria-label="Matérias legislativas" className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-2xl p-3">
              <input type="search" aria-label="Buscar matéria" placeholder="Buscar por número, ementa ou autor" value={busca} onChange={(e) => setBusca(e.target.value)} className={`${seletor} flex-[2] min-w-[240px]`} />
              <select aria-label="Filtrar por tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className={`${seletor} flex-1 min-w-[160px]`}>
                <option value="">Todos os tipos</option>
                {nomesTipo.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select aria-label="Filtrar por ano" value={ano} onChange={(e) => setAno(e.target.value)} className={seletor}>
                <option value="">Todos os anos</option>
                {anos.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <select aria-label="Filtrar por situação" value={situacao} onChange={(e) => setSituacao(e.target.value)} className={`${seletor} flex-1 min-w-[150px]`}>
                <option value="">Todas as situações</option>
                {Object.entries(SITUACOES).map(([k, v]) => <option key={k} value={k}>{v.rotulo}</option>)}
              </select>
              <select aria-label="Filtrar por autor" value={autor} onChange={(e) => setAutor(e.target.value)} className={`${seletor} flex-1 min-w-[160px]`}>
                <option value="">Todos os autores</option>
                {autores.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              {temFiltro && <button type="button" onClick={limpar} className="inline-flex items-center gap-1 h-11 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted"><X className="w-4 h-4" aria-hidden /> Limpar</button>}
            </div>

            <p className="text-sm text-muted-foreground" aria-live="polite">{visiveis.length} de {projetos.length} matérias</p>

            {visiveis.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center font-semibold text-foreground">Nenhuma matéria encontrada com esses filtros.</div>
            ) : (
              <ul className="space-y-3">
                {visiveis.slice(0, limite).map((p) => (
                  <li key={p.id} className="group relative bg-card border border-border rounded-2xl p-4 md:p-5 hover:shadow-md transition">
                    <div className="flex flex-wrap items-center gap-2">
                      <Selo status={p.status} />
                      {p.data_apresentacao && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="w-3.5 h-3.5" aria-hidden /> {dataCurta(p.data_apresentacao)}</span>}
                    </div>
                    <h3 className="font-display font-bold text-foreground leading-snug mt-2">
                      <button type="button" onClick={() => setAberto(p)} className="text-left after:absolute after:inset-0 after:rounded-2xl group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">{identificacao(p)}</button>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2">{p.ementa}</p>
                    <div className="flex items-center justify-between gap-3 mt-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground min-w-0"><User className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden /> <span className="truncate">{autorDe(p)}</span></span>
                      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary shrink-0">Ver tramitação <ChevronRight className="w-3.5 h-3.5" aria-hidden /></span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {visiveis.length > limite && (
              <div className="text-center"><button type="button" onClick={() => setLimite((l) => l + POR_PAGINA)} className="h-11 px-5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition">Mostrar mais</button></div>
            )}
          </section>
        )}

        <section aria-labelledby="titulo-fluxo" className="bg-card border border-border rounded-2xl p-5 md:p-6">
          <h2 id="titulo-fluxo" className="font-display font-bold text-xl text-foreground">Como um projeto vira lei</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{projetos.length ? "Clique em uma etapa para ver as matérias que estão nela." : "As cinco etapas que uma matéria percorre na Câmara."}</p>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mt-5">
            {FASES.map((f, i) => {
              const conteudo = (
                <>
                  <span className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary text-primary-foreground"><f.icone className="w-5 h-5" aria-hidden /></span>
                    {projetos.length > 0 && <span className="font-display text-2xl font-bold text-foreground tabular-nums">{contaFase[f.chave] ?? 0}</span>}
                  </span>
                  <span className="block font-bold text-sm text-foreground mt-3"><span className="text-muted-foreground">{i + 1}.</span> {f.rotulo}</span>
                  <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</span>
                </>
              );
              return (
                <li key={f.chave}>
                  {projetos.length ? (
                    <button type="button" aria-pressed={situacao === f.chave} onClick={() => setSituacao(situacao === f.chave ? "" : f.chave)} className={`w-full h-full text-left rounded-xl border p-4 transition hover:bg-muted/50 ${situacao === f.chave ? "border-primary bg-primary/5" : "border-border"}`}>{conteudo}</button>
                  ) : (
                    <div className="h-full rounded-xl border border-border p-4">{conteudo}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="titulo-tipos">
          <h2 id="titulo-tipos" className="font-display font-bold text-xl text-foreground">O que é cada tipo de matéria</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {TIPOS.map((t) => (
              <li key={t.nome} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-bold text-foreground leading-snug">{t.nome}</h3>
                  {(contaTipo[t.nome] ?? 0) > 0 && <button type="button" onClick={() => setTipo(t.nome)} aria-label={`Ver ${contaTipo[t.nome]} de ${t.nome}`} className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary hover:bg-primary/20">{contaTipo[t.nome]}</button>}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{t.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <OutrosAtos atual={ROUTES.projetos} />
      </div>

      {aberto && <PainelMateria key={aberto.id} projeto={aberto} onClose={() => setAberto(null)} />}
    </>
  );
}
