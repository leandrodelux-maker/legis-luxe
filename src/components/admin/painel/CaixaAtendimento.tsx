import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, Clock, Inbox, Loader2, Mail, Phone, Search, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Indicadores, PaginaModulo, Selo, type Indicador } from "./PaginaModulo";

export type Situacao = { valor: string; rotulo: string; cor: string; aberta: boolean };

type Registro = Record<string, any> & { id: string; protocolo: string; nome: string; status: string; created_at: string };

type Props = {
  tabela: string;
  situacoes: Situacao[];
  /** Situação usada ao responder. */
  respondido: string;
  campoTexto: string;
  assunto: (r: Registro) => string;
  tipos?: { valor: string; rotulo: string }[];
  /** e-SIC: campo do prazo legal e botão de prorrogação. */
  prazo?: { campo: string; situacaoProrrogada: string };
  vazio: string;
  indicadores: (ls: Registro[], ctx: { diasRestantes: (r: Registro) => number | null }) => Indicador[];
  detalhes?: (r: Registro) => { rotulo: string; valor: string | null | undefined }[];
};

const DIA = 24 * 60 * 60 * 1000;
const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const dataHora = (d: string) => new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** Caixa de entrada de pedidos do cidadão: lista à esquerda e o pedido com a resposta à direita. */
export function CaixaAtendimento({ tabela, situacoes, respondido, campoTexto, assunto, tipos, prazo, vazio, indicadores, detalhes }: Props) {
  const { user } = useSupabaseAuth();
  const [linhas, setLinhas] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [fSituacao, setFSituacao] = useState("abertos");
  const [fTipo, setFTipo] = useState("todos");
  const [atualId, setAtualId] = useState<string | null>(null);
  const [resposta, setResposta] = useState("");
  const [situacao, setSituacao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [excluir, setExcluir] = useState(false);

  const carregar = async () => {
    const { data, error } = await (supabase as any).from(tabela).select("*").order("created_at", { ascending: false });
    if (error) setErro(`Não foi possível carregar: ${error.message}`);
    else {
      setErro("");
      setLinhas((data as Registro[]) ?? []);
    }
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [tabela]);

  const sit = (v: string) => situacoes.find((s) => s.valor === v) ?? { valor: v, rotulo: v, cor: "#475569", aberta: true };
  const diasRestantes = (r: Registro) => (prazo && r[prazo.campo] ? Math.ceil((new Date(`${r[prazo.campo]}T23:59:59`).getTime() - Date.now()) / DIA) : null);

  const filtradas = useMemo(() => {
    const q = normalizar(busca.trim());
    return linhas
      .filter((r) => {
        if (fSituacao === "abertos" && !sit(r.status).aberta) return false;
        if (fSituacao !== "abertos" && fSituacao !== "todos" && r.status !== fSituacao) return false;
        if (fTipo !== "todos" && r.tipo !== fTipo) return false;
        return !q || [r.protocolo, r.nome, r.email, assunto(r), r[campoTexto]].some((v) => normalizar(String(v ?? "")).includes(q));
      })
      // Com prazo legal, os mais urgentes vêm primeiro entre os abertos.
      .sort((a, b) => {
        const da = sit(a.status).aberta ? diasRestantes(a) : null;
        const db = sit(b.status).aberta ? diasRestantes(b) : null;
        if (da !== null && db !== null) return da - db;
        if (da !== null) return -1;
        if (db !== null) return 1;
        return 0;
      });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [linhas, busca, fSituacao, fTipo]);

  const atual = linhas.find((l) => l.id === atualId) ?? null;

  const abrir = (r: Registro) => {
    setAtualId(r.id);
    setResposta(r.resposta ?? "");
    setSituacao(r.status);
  };

  const gravar = async (mudancas: Record<string, unknown>, aviso: string) => {
    if (!atual) return;
    setSalvando(true);
    const { error } = await (supabase as any).from(tabela).update(mudancas).eq("id", atual.id);
    setSalvando(false);
    if (error) return toast.error(`Não foi possível salvar: ${error.message}`);
    toast.success(aviso);
    await carregar();
  };

  const salvarResposta = () => {
    if (!resposta.trim()) return toast.error("Escreva a resposta antes de enviar.");
    setSituacao(respondido);
    gravar({ resposta: resposta.trim(), status: respondido, respondido_em: new Date().toISOString(), respondido_por: user?.id ?? null }, "Resposta registrada.");
  };

  const prorrogar = () => {
    if (!prazo || !atual) return;
    const base = new Date(`${atual[prazo.campo]}T12:00:00`);
    base.setDate(base.getDate() + 10);
    setSituacao(prazo.situacaoProrrogada);
    gravar({ [prazo.campo]: base.toISOString().slice(0, 10), status: prazo.situacaoProrrogada }, "Prazo prorrogado em 10 dias.");
  };

  const confirmarExclusao = async () => {
    if (!atual) return;
    setExcluir(false);
    const { error } = await (supabase as any).from(tabela).delete().eq("id", atual.id);
    if (error) return toast.error(`Não foi possível excluir: ${error.message}`);
    setAtualId(null);
    toast.success("Registro excluído.");
    carregar();
  };

  const seloPrazo = (r: Registro) => {
    const d = diasRestantes(r);
    if (d === null || !sit(r.status).aberta) return null;
    if (d < 0) return <Selo cor="#B42318"><AlertTriangle className="w-3 h-3" aria-hidden /> Vencido há {Math.abs(d)} {Math.abs(d) === 1 ? "dia" : "dias"}</Selo>;
    return <Selo cor={d <= 5 ? "#A8540F" : "#475569"}><Clock className="w-3 h-3" aria-hidden /> {d === 0 ? "Vence hoje" : `${d} ${d === 1 ? "dia" : "dias"}`}</Selo>;
  };

  return (
    <PaginaModulo>
      {!carregando && <Indicadores itens={indicadores(linhas, { diasRestantes })} />}

      {erro ? (
        <div role="alert" className="bg-card border border-destructive/40 rounded-2xl p-8 text-center font-semibold text-foreground">{erro}</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(320px,420px)_1fr] items-start">
          <section aria-label="Lista de pedidos" className={`bg-card border border-border rounded-2xl overflow-hidden ${atual ? "hidden lg:block" : ""}`}>
            <div className="p-3 space-y-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden />
                <Input aria-label="Buscar pedido" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Protocolo, nome, assunto..." className="pl-9 h-10" />
              </div>
              <div className="flex gap-2">
                <Select value={fSituacao} onValueChange={setFSituacao}>
                  <SelectTrigger aria-label="Filtrar por situação" className="h-10 flex-1 min-w-0"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abertos">Em aberto</SelectItem>
                    <SelectItem value="todos">Todas as situações</SelectItem>
                    {situacoes.map((s) => <SelectItem key={s.valor} value={s.valor}>{s.rotulo}</SelectItem>)}
                  </SelectContent>
                </Select>
                {tipos && (
                  <Select value={fTipo} onValueChange={setFTipo}>
                    <SelectTrigger aria-label="Filtrar por tipo" className="h-10 flex-1 min-w-0"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      {tipos.map((t) => <SelectItem key={t.valor} value={t.valor}>{t.rotulo}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            {carregando ? (
              <div className="p-10 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-label="Carregando" /></div>
            ) : filtradas.length === 0 ? (
              <div className="p-10 text-center">
                <Inbox className="w-9 h-9 mx-auto text-muted-foreground" aria-hidden />
                <p className="font-semibold text-foreground mt-2">{linhas.length ? "Nada nesta seleção" : vazio}</p>
                {linhas.length > 0 && fSituacao === "abertos" && <p className="text-sm text-muted-foreground mt-1">Tudo respondido. Bom trabalho!</p>}
              </div>
            ) : (
              <ul className="divide-y divide-border max-h-[68vh] overflow-y-auto">
                {filtradas.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => abrir(r)}
                      aria-current={atualId === r.id || undefined}
                      className="w-full text-left p-3.5 hover:bg-muted/50 transition focus-visible:outline-2 focus-visible:-outline-offset-2"
                      style={atualId === r.id ? { backgroundColor: "color-mix(in srgb, var(--tema) 9%, transparent)", boxShadow: "inset 3px 0 0 var(--tema)" } : undefined}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-muted-foreground truncate">{r.protocolo}</span>
                        <Selo cor={sit(r.status).cor}>{sit(r.status).rotulo}</Selo>
                      </div>
                      <p className="font-semibold text-sm text-foreground mt-1.5 line-clamp-1">{assunto(r)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.nome} · {dataHora(r.created_at)}</p>
                      {seloPrazo(r) && <div className="mt-1.5">{seloPrazo(r)}</div>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label="Pedido selecionado" className={`bg-card border border-border rounded-2xl overflow-hidden ${atual ? "" : "hidden lg:block"}`}>
            {!atual ? (
              <div className="p-16 text-center">
                <Mail className="w-10 h-10 mx-auto text-muted-foreground" aria-hidden />
                <p className="font-display font-bold text-lg text-foreground mt-3">Escolha um pedido na lista</p>
                <p className="text-sm text-muted-foreground mt-1">Aqui você lê a mensagem e registra a resposta.</p>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-border">
                  <Button type="button" variant="ghost" size="sm" className="lg:hidden mb-2 -ml-2" onClick={() => setAtualId(null)}><ArrowLeft className="w-4 h-4 mr-1" aria-hidden /> Voltar à lista</Button>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{atual.protocolo}</span>
                    <Selo cor={sit(atual.status).cor}>{sit(atual.status).rotulo}</Selo>
                    {seloPrazo(atual)}
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground mt-2 leading-snug">{assunto(atual)}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Recebido em {dataHora(atual.created_at)}</p>
                </div>

                <div className="p-5 space-y-5">
                  <dl className="grid gap-3 sm:grid-cols-2 rounded-xl bg-muted/40 p-4 text-sm">
                    <div><dt className="text-xs font-semibold text-muted-foreground">Cidadão</dt><dd className="font-medium text-foreground">{atual.nome}</dd></div>
                    {atual.email && <div><dt className="text-xs font-semibold text-muted-foreground">E-mail</dt><dd><a className="inline-flex items-center gap-1 underline underline-offset-2 text-foreground break-all" href={`mailto:${atual.email}`}><Mail className="w-3.5 h-3.5 shrink-0" aria-hidden /> {atual.email}</a></dd></div>}
                    {atual.telefone && <div><dt className="text-xs font-semibold text-muted-foreground">Telefone</dt><dd className="inline-flex items-center gap-1 text-foreground"><Phone className="w-3.5 h-3.5" aria-hidden /> {atual.telefone}</dd></div>}
                    {detalhes?.(atual).filter((d) => d.valor).map((d) => <div key={d.rotulo}><dt className="text-xs font-semibold text-muted-foreground">{d.rotulo}</dt><dd className="font-medium text-foreground">{d.valor}</dd></div>)}
                  </dl>

                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1.5">Mensagem do cidadão</h3>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground rounded-xl border border-border p-4">{atual[campoTexto]}</p>
                  </div>

                  <div>
                    <label htmlFor="resposta" className="block text-sm font-bold text-foreground mb-1.5">Resposta</label>
                    <Textarea id="resposta" rows={7} value={resposta} onChange={(e) => setResposta(e.target.value)} placeholder="Escreva a resposta da Câmara" />
                    <p className="text-xs text-muted-foreground mt-1">O site ainda não envia e-mail. Depois de registrar, use "Enviar por e-mail" para mandar a resposta ao cidadão.{atual.respondido_em ? ` Última resposta em ${dataHora(atual.respondido_em)}.` : ""}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" disabled={salvando} className="text-white hover:opacity-90" style={{ backgroundColor: "var(--tema)" }} onClick={salvarResposta}>
                      {salvando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" aria-hidden />} Registrar resposta
                    </Button>
                    {atual.email && resposta.trim() && (
                      <Button type="button" variant="outline" asChild>
                        <a href={`mailto:${atual.email}?subject=${encodeURIComponent(`Resposta ao protocolo ${atual.protocolo}`)}&body=${encodeURIComponent(resposta)}`}><Mail className="w-4 h-4 mr-2" aria-hidden /> Enviar por e-mail</a>
                      </Button>
                    )}
                    {prazo && sit(atual.status).aberta && atual.status !== prazo.situacaoProrrogada && <Button type="button" variant="outline" disabled={salvando} onClick={prorrogar}>Prorrogar 10 dias</Button>}
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
                    <div className="min-w-[220px]">
                      <label htmlFor="situacao" className="block text-sm font-bold text-foreground mb-1.5">Situação</label>
                      <Select value={situacao} onValueChange={(v) => { setSituacao(v); gravar({ status: v }, "Situação atualizada."); }}>
                        <SelectTrigger id="situacao" className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>{situacoes.map((s) => <SelectItem key={s.valor} value={s.valor}>{s.rotulo}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setExcluir(true)}><Trash2 className="w-4 h-4 mr-1.5" aria-hidden /> Excluir</Button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      <AlertDialog open={excluir} onOpenChange={setExcluir}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir o protocolo {atual?.protocolo}?</AlertDialogTitle>
            <AlertDialogDescription>Pedidos do cidadão fazem parte do registro público de atendimento. Exclua só registros de teste ou duplicados. Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Manter</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={confirmarExclusao}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PaginaModulo>
  );
}
