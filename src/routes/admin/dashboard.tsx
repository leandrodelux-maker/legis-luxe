import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, ArrowRight, Calendar, CheckCircle2, Clock, ExternalLink, FileText, Gavel, Mail, MessageSquare, Newspaper, Plus, UserCircle, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { GRUPOS } from "@/components/admin/painel/modulos";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

const COR = { legislativo: "#1F5FBF", comunicacao: "#A8540F", atendimento: "#0B7A4B", alerta: "#B42318" };

type Dados = {
  vereadores: number;
  noticias: number;
  sessoes: number;
  documentos: number;
  projetos: number;
  esicAbertos: number;
  esicVencidos: number;
  esicVencendo: number;
  ouvidoriaAbertos: number;
  rascunhos: number;
  semAta: number;
  semFoto: number;
  proxima: { titulo: string; tipo: string | null; data_sessao: string; local: string | null } | null;
  ultimas: { id: string; titulo: string; categoria: string | null; publicado: boolean; created_at: string }[];
  grafico: { mes: string; noticias: number; sessoes: number }[];
};

const conta = (q: any) => q.then((r: any) => (r.count as number | null) ?? 0);
const base = (t: string) => (supabase as any).from(t).select("id", { count: "exact", head: true });

async function carregar(): Promise<Dados> {
  const hoje = new Date();
  const hojeIso = hoje.toISOString().slice(0, 10);
  const em5 = new Date(hoje.getTime() + 5 * 864e5).toISOString().slice(0, 10);
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1).toISOString();
  const ABERTOS = ["pendente", "analise", "prorrogado"];

  const [vereadores, noticias, sessoes, documentos, projetos, esicAbertos, esicVencidos, esicVencendo, ouvidoriaAbertos, rascunhos, semAta, semFoto, proxima, ultimas, serieN, serieS] = await Promise.all([
    conta(base("vereadores")),
    conta(base("noticias")),
    conta(base("sessoes")),
    conta(base("documentos_oficiais")),
    conta(base("projetos_legislativos")),
    conta(base("esic_solicitacoes").in("status", ABERTOS)),
    conta(base("esic_solicitacoes").in("status", ABERTOS).lt("prazo_resposta", hojeIso)),
    conta(base("esic_solicitacoes").in("status", ABERTOS).gte("prazo_resposta", hojeIso).lte("prazo_resposta", em5)),
    conta(base("ouvidoria_protocolos").in("status", ["aberto", "em_andamento"])),
    conta(base("noticias").eq("publicado", false)),
    conta(base("sessoes").eq("status", "realizada").eq("ata_publicada", false)),
    conta(base("vereadores").eq("ativo", true).is("foto_url", null)),
    supabase.from("sessoes").select("titulo,tipo,data_sessao,local").eq("status", "agendada").gte("data_sessao", hoje.toISOString()).order("data_sessao").limit(1).maybeSingle(),
    supabase.from("noticias").select("id,titulo,categoria,publicado,created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("noticias").select("created_at").gte("created_at", inicio),
    supabase.from("sessoes").select("data_sessao").gte("data_sessao", inicio).lte("data_sessao", hoje.toISOString()),
  ]);

  const meses = Array.from({ length: 6 }, (_, i) => new Date(hoje.getFullYear(), hoje.getMonth() - 5 + i, 1));
  const chave = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
  const grafico = meses.map((m) => ({
    mes: m.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
    noticias: (serieN.data ?? []).filter((r: any) => chave(new Date(r.created_at)) === chave(m)).length,
    sessoes: (serieS.data ?? []).filter((r: any) => chave(new Date(r.data_sessao)) === chave(m)).length,
  }));

  return { vereadores, noticias, sessoes, documentos, projetos, esicAbertos, esicVencidos, esicVencendo, ouvidoriaAbertos, rascunhos, semAta, semFoto, proxima: proxima.data as Dados["proxima"], ultimas: (ultimas.data as Dados["ultimas"]) ?? [], grafico };
}

function Cartao({ titulo, icone, acao, children }: { titulo: string; icone?: ReactNode; acao?: ReactNode; children: ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">{icone} {titulo}</h2>
        {acao}
      </div>
      {children}
    </section>
  );
}

function Dashboard() {
  const { user } = useSupabaseAuth();
  const [d, setD] = useState<Dados | null>(null);

  useEffect(() => {
    carregar().then(setD);
  }, []);

  const agora = new Date();
  const h = agora.getHours();
  const saudacao = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  const nome = String(user?.user_metadata?.full_name ?? "").split(" ")[0];

  const pendencias = d
    ? [
        { n: d.esicVencidos, texto: (n: number) => `${n} ${n === 1 ? "pedido" : "pedidos"} do e-SIC com prazo vencido`, to: "/admin/cms/esic", cor: COR.alerta, icone: AlertTriangle, urgente: true },
        { n: d.esicVencendo, texto: (n: number) => `${n} ${n === 1 ? "pedido vence" : "pedidos vencem"} em até 5 dias`, to: "/admin/cms/esic", cor: COR.comunicacao, icone: Clock },
        { n: d.ouvidoriaAbertos, texto: (n: number) => `${n} ${n === 1 ? "manifestação" : "manifestações"} da Ouvidoria em aberto`, to: "/admin/cms/ouvidoria", cor: COR.atendimento, icone: MessageSquare },
        { n: Math.max(d.esicAbertos - d.esicVencidos - d.esicVencendo, 0), texto: (n: number) => `${n} ${n === 1 ? "pedido" : "pedidos"} do e-SIC dentro do prazo`, to: "/admin/cms/esic", cor: COR.atendimento, icone: Mail },
        { n: d.semAta, texto: (n: number) => `${n} ${n === 1 ? "sessão realizada" : "sessões realizadas"} sem ata publicada`, to: "/admin/sessoes", cor: COR.legislativo, icone: FileText },
        { n: d.rascunhos, texto: (n: number) => `${n} ${n === 1 ? "notícia" : "notícias"} em rascunho`, to: "/admin/noticias", cor: COR.comunicacao, icone: Newspaper },
        { n: d.semFoto, texto: (n: number) => `${n} ${n === 1 ? "vereador" : "vereadores"} sem foto`, to: "/admin/vereadores", cor: COR.legislativo, icone: UserCircle },
      ].filter((p) => p.n > 0)
    : [];

  const numeros = d
    ? [
        { rotulo: "Vereadores", valor: d.vereadores, to: "/admin/vereadores", icone: Users, cor: COR.legislativo },
        { rotulo: "Sessões", valor: d.sessoes, to: "/admin/sessoes", icone: Calendar, cor: COR.legislativo },
        { rotulo: "Projetos", valor: d.projetos, to: "/admin/projetos", icone: Gavel, cor: COR.legislativo },
        { rotulo: "Documentos", valor: d.documentos, to: "/admin/documentos-oficiais", icone: FileText, cor: COR.legislativo },
        { rotulo: "Notícias", valor: d.noticias, to: "/admin/noticias", icone: Newspaper, cor: COR.comunicacao },
      ]
    : [];

  const criar = [
    { rotulo: "Nova notícia", href: "/admin/noticias?novo=1", icone: Newspaper, cor: COR.comunicacao },
    { rotulo: "Nova sessão", href: "/admin/sessoes?novo=1", icone: Calendar, cor: COR.legislativo },
    { rotulo: "Novo projeto", href: "/admin/projetos?novo=1", icone: Gavel, cor: COR.legislativo },
    { rotulo: "Novo documento", href: "/admin/documentos-oficiais?novo=1", icone: FileText, cor: COR.legislativo },
  ];

  return (
    <div className="min-h-full" style={{ "--tema": GRUPOS[0].cor } as React.CSSProperties}>
      <header className="relative overflow-hidden text-white" style={{ background: "linear-gradient(120deg, #14505F 0%, #14505F 40%, #0B7A6E 100%)" }}>
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none" aria-hidden style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "22px 22px" }} />
        <div className="relative px-4 md:px-8 py-7 md:py-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm text-white/85 first-letter:uppercase">{agora.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">{saudacao}{nome ? `, ${nome}` : ""}!</h1>
            <p className="text-white/90 mt-1.5">
              {!d ? "Conferindo o que precisa de você..." : pendencias.length ? `Há ${pendencias.length} ${pendencias.length === 1 ? "assunto" : "assuntos"} esperando sua atenção.` : "Está tudo em dia."}
            </p>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-sm font-semibold bg-white/15 hover:bg-white/25 transition">
            <ExternalLink className="h-4 w-4" aria-hidden /> Ver o site
          </a>
        </div>
      </header>

      <div className="px-4 md:px-8 py-6 space-y-6">
        <nav aria-label="Criar conteúdo" className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {criar.map((c) => (
            <a key={c.href} href={c.href} className="group flex items-center gap-3 bg-card border border-border rounded-2xl p-3.5 hover:shadow-md transition focus-visible:outline-2 focus-visible:outline-offset-2">
              <span className="w-10 h-10 rounded-xl grid place-items-center text-white shrink-0" style={{ backgroundColor: c.cor }}><c.icone className="w-5 h-5" aria-hidden /></span>
              <span className="font-semibold text-sm text-foreground flex-1">{c.rotulo}</span>
              <Plus className="w-4 h-4 text-muted-foreground transition group-hover:rotate-90" aria-hidden />
            </a>
          ))}
        </nav>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Cartao titulo="Precisa da sua atenção">
              {!d ? (
                <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>
              ) : pendencias.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-10 h-10 mx-auto" style={{ color: COR.atendimento }} aria-hidden />
                  <p className="font-semibold text-foreground mt-2">Nenhuma pendência no momento</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {pendencias.map((p) => (
                    <li key={p.to + p.cor + p.n}>
                      <Link to={p.to} className="group flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/50 transition focus-visible:outline-2 focus-visible:outline-offset-2" style={p.urgente ? { backgroundColor: `color-mix(in srgb, ${p.cor} 8%, transparent)`, borderColor: `color-mix(in srgb, ${p.cor} 35%, transparent)` } : undefined}>
                        <span className="w-9 h-9 rounded-lg grid place-items-center text-white shrink-0" style={{ backgroundColor: p.cor }}><p.icone className="w-4 h-4" aria-hidden /></span>
                        <span className="flex-1 text-sm font-medium text-foreground">{p.texto(p.n)}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Cartao>
          </div>

          <Cartao titulo="Próxima sessão" icone={<Calendar className="w-5 h-5 text-muted-foreground" aria-hidden />}>
            {!d ? <Skeleton className="h-28 w-full rounded-xl" /> : d.proxima ? (
              <div className="flex gap-3">
                <div className="w-16 rounded-xl text-center text-white py-2 shrink-0 self-start" style={{ backgroundColor: COR.legislativo }}>
                  <p className="text-[11px] font-bold uppercase">{new Date(d.proxima.data_sessao).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</p>
                  <p className="font-display text-2xl font-bold leading-none">{new Date(d.proxima.data_sessao).getDate()}</p>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground leading-snug">{d.proxima.titulo}</p>
                  <p className="text-sm text-muted-foreground mt-1">{new Date(d.proxima.data_sessao).toLocaleString("pt-BR", { weekday: "long", hour: "2-digit", minute: "2-digit" })}</p>
                  {d.proxima.local && <p className="text-sm text-muted-foreground">{d.proxima.local}</p>}
                  <Link to="/admin/sessoes" className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 mt-2 text-foreground">Abrir sessões</Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-sm text-muted-foreground">Nenhuma sessão agendada.</p>
                <a href="/admin/sessoes?novo=1" className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 mt-2 text-foreground"><Plus className="w-4 h-4" aria-hidden /> Agendar sessão</a>
              </div>
            )}
          </Cartao>
        </div>

        <ul className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {!d ? Array.from({ length: 5 }).map((_, i) => <li key={i}><Skeleton className="h-24 rounded-2xl" /></li>) : numeros.map((n) => (
            <li key={n.to}>
            <Link to={n.to} className="block relative overflow-hidden bg-card border border-border rounded-2xl p-4 hover:shadow-md transition focus-visible:outline-2 focus-visible:outline-offset-2">
              <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: n.cor }} aria-hidden />
              <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">{n.rotulo}<n.icone className="w-4 h-4" style={{ color: n.cor }} aria-hidden /></span>
              <span className="block font-display text-3xl font-bold text-foreground tabular-nums mt-1">{n.valor.toLocaleString("pt-BR")}</span>
            </Link>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Cartao titulo="Atividade nos últimos 6 meses">
              {!d ? <Skeleton className="h-64 w-full rounded-xl" /> : (
                <>
                  <div className="h-64" role="img" aria-label={`Sessões e notícias por mês: ${d.grafico.map((g) => `${g.mes}, ${g.sessoes} sessões e ${g.noticias} notícias`).join("; ")}`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={d.grafico} margin={{ left: -20, right: 8, top: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }} />
                        <Area type="monotone" dataKey="sessoes" name="Sessões" stroke={COR.legislativo} fill={COR.legislativo} fillOpacity={0.14} strokeWidth={2} />
                        <Area type="monotone" dataKey="noticias" name="Notícias" stroke={COR.comunicacao} fill={COR.comunicacao} fillOpacity={0.14} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="flex gap-4 text-xs text-muted-foreground mt-2" aria-hidden>
                    <li className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COR.legislativo }} /> Sessões</li>
                    <li className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COR.comunicacao }} /> Notícias</li>
                  </ul>
                </>
              )}
            </Cartao>
          </div>

          <Cartao titulo="Últimas notícias" acao={<Link to="/admin/noticias" className="text-sm font-semibold underline underline-offset-2 text-foreground">Ver todas</Link>}>
            {!d ? <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div> : d.ultimas.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-sm text-muted-foreground">Nenhuma notícia ainda.</p>
                <a href="/admin/noticias?novo=1" className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 mt-2 text-foreground"><Plus className="w-4 h-4" aria-hidden /> Escrever a primeira</a>
              </div>
            ) : (
              <ul className="space-y-3">
                {d.ultimas.map((n) => (
                  <li key={n.id} className="border-l-2 pl-3" style={{ borderColor: COR.comunicacao }}>
                    <p className="text-sm font-medium text-foreground line-clamp-2">{n.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.publicado ? "Publicada" : "Rascunho"} · {n.categoria ?? "Sem categoria"} · {new Date(n.created_at).toLocaleDateString("pt-BR")}</p>
                  </li>
                ))}
              </ul>
            )}
          </Cartao>
        </div>
      </div>
    </div>
  );
}
