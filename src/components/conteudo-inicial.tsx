import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CalendarClock, ChevronRight, Compass, Crown, FileSearch, FileText, Gavel, Landmark, MapPin, Megaphone, Newspaper, Scale, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VereadorAvatar } from "@/components/vereador-avatar";
import { ROUTES } from "@/lib/site-links";
import banner from "@/assets/adelandia-banner.webp";
import bandeira from "@/assets/bandeira-adelandia.png";

type Sessao = { id: string; titulo: string; tipo: string | null; data_sessao: string; local: string | null; status: string; ata_url: string | null };
type Vereador = { id: string; slug: string | null; nome: string; partido: string | null; foto_url: string | null; cargo: string | null };
type Noticia = { id: string; slug: string; titulo: string; resumo: string | null; imagem_url: string | null; categoria: string | null; publicado_em: string | null };

const GUIA: { id: string; pergunta: string; titulo: string; texto: string; to: string; acao: string; icone: LucideIcon }[] = [
  { id: "informacao", pergunta: "Pedir uma informação pública", titulo: "e-SIC", texto: "Faça o pedido pela Lei de Acesso à Informação e acompanhe a resposta.", to: ROUTES.esic, acao: "Abrir o e-SIC", icone: FileSearch },
  { id: "ouvidoria", pergunta: "Reclamar, denunciar, sugerir ou elogiar", titulo: "Ouvidoria", texto: "Registre sua manifestação sobre os serviços e o trabalho da Câmara.", to: ROUTES.contato, acao: "Falar com a Ouvidoria", icone: Megaphone },
  { id: "votos", pergunta: "Ver o que foi discutido no plenário", titulo: "Sessões e atas", texto: "Consulte as sessões, as atas, as presenças e os votos registrados.", to: ROUTES.sessoes, acao: "Ver as sessões", icone: Gavel },
  { id: "gastos", pergunta: "Saber como o dinheiro público é usado", titulo: "Portal da Transparência", texto: "Acompanhe receitas, despesas, contratos, servidores e licitações.", to: ROUTES.transparencia, acao: "Abrir o portal", icone: ShieldCheck },
  { id: "projetos", pergunta: "Acompanhar um projeto de lei", titulo: "Atos Legislativos", texto: "Pesquise as matérias da Câmara e veja em que etapa cada uma está.", to: ROUTES.projetos, acao: "Pesquisar matérias", icone: FileText },
  { id: "vereador", pergunta: "Conhecer quem me representa", titulo: "Vereadores", texto: "Veja o perfil, as comissões e a atuação de cada parlamentar.", to: ROUTES.vereadores, acao: "Ver os vereadores", icone: Users },
  { id: "leis", pergunta: "Ler as regras do município e da Câmara", titulo: "Lei Orgânica Municipal", texto: "A lei maior de Adelândia, ao lado do Regimento Interno da Câmara.", to: ROUTES.leiOrganica, acao: "Ver a Lei Orgânica", icone: Scale },
];

const data = (d: string) => new Date(d);
const titulo = (t: string) => {
  if (t !== t.toUpperCase()) return t;
  const menores = new Set(["de", "da", "do", "das", "dos", "e", "a", "o"]);
  return t.toLowerCase().replace(/\S+/g, (p, i) => (i && menores.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)));
};

function Titulo({ id, texto, descricao, to, acao }: { id: string; texto: string; descricao: string; to?: string; acao?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id={id} className="font-display font-bold text-2xl text-foreground">{texto}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{descricao}</p>
      </div>
      {to && <Link to={to} className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition">{acao} <ArrowRight className="w-4 h-4" aria-hidden /></Link>}
    </div>
  );
}

function BlocoData({ d }: { d: string }) {
  const x = data(d);
  return (
    <span className="w-14 shrink-0 rounded-xl bg-primary text-primary-foreground text-center py-1.5">
      <span className="block font-display text-xl font-bold leading-none tabular-nums">{x.toLocaleDateString("pt-BR", { day: "2-digit" })}</span>
      <span className="block text-[11px] font-semibold uppercase mt-1">{x.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")} {x.getFullYear()}</span>
    </span>
  );
}

/** Tudo que fica abaixo do Acesso Rápido na página inicial. */
export function ConteudoInicial() {
  const [escolha, setEscolha] = useState(GUIA[0].id);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [proxima, setProxima] = useState<Sessao | null>(null);
  const [vereadores, setVereadores] = useState<Vereador[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [numeros, setNumeros] = useState({ sessoes: 0, atas: 0, comissoes: 0 });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const agora = new Date().toISOString();
    const campos = "id, titulo, tipo, data_sessao, local, status, ata_url";
    Promise.all([
      supabase.from("sessoes").select(campos).lte("data_sessao", agora).order("data_sessao", { ascending: false }).limit(4),
      supabase.from("sessoes").select(campos).eq("status", "agendada").gt("data_sessao", agora).order("data_sessao", { ascending: true }).limit(1),
      supabase.from("vereadores").select("id, slug, nome, partido, foto_url, cargo").eq("ativo", true).order("ordem", { ascending: true }),
      supabase.from("noticias").select("id, slug, titulo, resumo, imagem_url, categoria, publicado_em").eq("publicado", true).order("publicado_em", { ascending: false }).limit(3),
      supabase.from("sessoes").select("id", { count: "exact", head: true }),
      supabase.from("sessoes").select("id", { count: "exact", head: true }).not("ata_url", "is", null),
      supabase.from("comissoes").select("id", { count: "exact", head: true }).eq("ativo", true),
    ]).then(([ultimas, futura, ver, not, totalS, totalA, totalC]) => {
      setSessoes((ultimas.data as Sessao[]) ?? []);
      setProxima(((futura.data as Sessao[]) ?? [])[0] ?? null);
      setVereadores((ver.data as Vereador[]) ?? []);
      setNoticias((not.data as Noticia[]) ?? []);
      setNumeros({ sessoes: totalS.count ?? 0, atas: totalA.count ?? 0, comissoes: totalC.count ?? 0 });
      setCarregando(false);
    });
  }, []);

  const guia = GUIA.find((g) => g.id === escolha) ?? GUIA[0];
  const presidente = vereadores.find((v) => /presidente/i.test(v.cargo ?? "") && !/vice/i.test(v.cargo ?? ""));
  const demais = vereadores.filter((v) => v !== presidente);

  return (
    <div className="container-page py-10 md:py-14 space-y-12 md:space-y-16">
      <section aria-labelledby="titulo-guia" className="relative overflow-hidden rounded-2xl text-white p-6 md:p-8" style={{ background: "linear-gradient(120deg, var(--primary-deep), var(--primary))" }}>
        <Compass className="absolute -right-8 -bottom-10 h-52 w-52 opacity-10 pointer-events-none hidden md:block" aria-hidden />
        <div className="relative grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="titulo-guia" className="font-display font-bold text-2xl md:text-3xl">O que você precisa hoje?</h2>
            <p className="text-white/90 mt-1.5">Escolha uma opção e vá direto ao caminho certo.</p>
            <label htmlFor="guia-cidadao" className="block text-sm font-semibold mt-4">Eu quero…</label>
            <select id="guia-cidadao" value={escolha} onChange={(e) => setEscolha(e.target.value)} className="mt-1.5 h-12 w-full rounded-xl border-0 bg-white px-3 text-sm font-semibold text-slate-900">
              {GUIA.map((g) => <option key={g.id} value={g.id}>{g.pergunta}</option>)}
            </select>
          </div>
          <div aria-live="polite" className="flex gap-4 rounded-2xl bg-white text-slate-900 p-5 shadow-lg">
            <span className="w-12 h-12 rounded-xl grid place-items-center bg-primary text-primary-foreground shrink-0"><guia.icone className="w-6 h-6" aria-hidden /></span>
            <div className="min-w-0">
              <p className="font-display font-bold text-lg leading-snug">{guia.titulo}</p>
              <p className="text-sm text-slate-600 leading-relaxed mt-0.5">{guia.texto}</p>
              <Link to={guia.to} className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold mt-3 hover:opacity-90 transition">{guia.acao} <ArrowRight className="w-4 h-4" aria-hidden /></Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="titulo-plenario" className="space-y-5">
        <Titulo id="titulo-plenario" texto="No plenário" descricao="O que acontece nas sessões da Câmara." to={ROUTES.sessoes} acao="Ver todas as sessões" />
        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
          <div className="flex flex-col gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "#8A5A00" }}><CalendarClock className="w-4 h-4" aria-hidden /> Próxima sessão</p>
              {proxima ? (
                <>
                  <p className="font-display font-bold text-lg text-foreground leading-snug mt-2">{titulo(proxima.titulo)}</p>
                  <p className="text-sm text-foreground mt-1.5 first-letter:uppercase">{data(proxima.data_sessao).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}, às {data(proxima.data_sessao).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                  {proxima.local && <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1"><MapPin className="w-3.5 h-3.5" aria-hidden /> {proxima.local}</p>}
                </>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{carregando ? "Carregando…" : "Nenhuma sessão agendada no momento. As novas datas aparecem aqui assim que forem publicadas."}</p>
              )}
            </div>
            <dl className="grid grid-cols-3 gap-2">
              {[["Sessões", numeros.sessoes], ["Atas", numeros.atas], ["Comissões", numeros.comissoes]].map(([r, v]) => (
                <div key={r} className="bg-card border border-border rounded-xl p-3 text-center">
                  <dt className="text-xs text-muted-foreground">{r}</dt>
                  <dd className="font-display text-xl font-bold text-foreground tabular-nums">{carregando ? "–" : v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="bg-card border border-border rounded-2xl p-2 md:p-3">
            <h3 className="font-display font-bold text-foreground px-3 pt-2 pb-1">Últimas sessões</h3>
            {carregando ? (
              <div className="space-y-2 p-2" aria-hidden>{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />)}</div>
            ) : sessoes.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">Nenhuma sessão publicada.</p>
            ) : (
              <ul className="divide-y divide-border">
                {sessoes.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 p-3">
                    <BlocoData d={s.data_sessao} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{titulo(s.titulo)}</p>
                      {s.tipo && <p className="text-xs text-muted-foreground mt-0.5">{titulo(s.tipo)}</p>}
                    </div>
                    {s.ata_url && <a href={s.ata_url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir a ata: ${titulo(s.titulo)}`} className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition shrink-0"><FileText className="w-3.5 h-3.5" aria-hidden /> Ata</a>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="titulo-vereadores" className="space-y-5">
        <Titulo id="titulo-vereadores" texto="Quem representa você" descricao="Os vereadores em exercício e seus cargos na Mesa Diretora." to={ROUTES.vereadores} acao="Ver todos os perfis" />
        {carregando ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-hidden>{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {presidente && (
              <div className="group relative flex items-center gap-4 bg-card border border-border rounded-2xl p-4 overflow-hidden hover:shadow-md transition">
                <span className="absolute inset-y-0 left-0 w-1 bg-gold" aria-hidden />
                <VereadorAvatar nome={presidente.nome} foto={presidente.foto_url} partido={presidente.partido} fill rounded="xl" fit="cover" className="w-20 h-24 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "#8A5A00" }}><Crown className="w-4 h-4 text-gold" aria-hidden /> {presidente.cargo}</p>
                  <h3 className="font-display font-bold text-xl text-foreground leading-snug"><Link to="/vereadores/$slug" params={{ slug: presidente.slug || presidente.id }} className="after:absolute after:inset-0 group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">{presidente.nome}</Link></h3>
                  {presidente.partido && <p className="text-sm text-muted-foreground">{presidente.partido}</p>}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden />
              </div>
            )}
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {demais.map((v) => (
                <li key={v.id} className="group relative flex items-center gap-3 bg-card border border-border rounded-2xl p-3 hover:shadow-md transition">
                  <VereadorAvatar nome={v.nome} foto={v.foto_url} partido={v.partido} fill rounded="xl" fit="cover" className="w-14 h-[4.5rem] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold" style={{ color: "#8A5A00" }}>{v.cargo || "Vereador(a)"}</p>
                    <h3 className="font-display font-bold text-sm text-foreground leading-snug"><Link to="/vereadores/$slug" params={{ slug: v.slug || v.id }} className="after:absolute after:inset-0 after:rounded-2xl group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">{v.nome}</Link></h3>
                    {v.partido && <p className="text-xs text-muted-foreground">{v.partido}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {noticias.length > 0 && (
        <section aria-labelledby="titulo-noticias" className="space-y-5">
          <Titulo id="titulo-noticias" texto="Notícias" descricao="As publicações mais recentes da Câmara." to={ROUTES.noticias} acao="Ver todas as notícias" />
          <ul className="grid gap-4 md:grid-cols-3">
            {noticias.map((n) => (
              <li key={n.id} className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition">
                {n.imagem_url ? <img src={n.imagem_url} alt="" loading="lazy" className="w-full aspect-video object-cover" /> : <span className="w-full aspect-video grid place-items-center bg-muted"><Newspaper className="w-8 h-8 text-muted-foreground" aria-hidden /></span>}
                <div className="p-4">
                  {n.publicado_em && <p className="text-xs text-muted-foreground">{data(n.publicado_em).toLocaleDateString("pt-BR")}{n.categoria ? ` · ${n.categoria}` : ""}</p>}
                  <h3 className="font-display font-bold text-foreground leading-snug mt-1"><Link to="/noticias/$slug" params={{ slug: n.slug }} className="after:absolute after:inset-0 group-hover:underline underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary">{n.titulo}</Link></h3>
                  {n.resumo && <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2">{n.resumo}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="titulo-adelandia" className="overflow-hidden rounded-2xl bg-card border border-border">
        <img src={banner} width={1800} height={600} loading="lazy" alt="Ilustração com a bandeira de Adelândia, sacas e vagens de feijão em primeiro plano e a vista de uma pequena cidade ao fundo." className="w-full h-auto" />
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center p-5 md:p-6">
          <div className="flex gap-4 items-start">
            <img src={bandeira} width={675} height={454} loading="lazy" alt="Bandeira de Adelândia" className="w-20 h-auto rounded border border-border shrink-0" />
            <div>
              <h2 id="titulo-adelandia" className="font-display font-bold text-xl text-foreground">Adelândia, a Capital do Feijão</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1 max-w-2xl">Da capela de São Sebastião à emancipação em 1987: conheça a história, os símbolos e os números do município.</p>
              <p className="text-xs text-muted-foreground mt-1.5">Ilustração artística. A paisagem não é uma fotografia da cidade.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={ROUTES.historia} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"><Landmark className="w-4 h-4" aria-hidden /> Conhecer a história</Link>
            <Link to={ROUTES.cartaServicos} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition"><BookOpen className="w-4 h-4" aria-hidden /> Carta de Serviços</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
