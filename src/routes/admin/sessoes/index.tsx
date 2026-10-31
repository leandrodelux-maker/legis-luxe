import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, CheckCheck, FileText, Loader2, UserCheck, Vote, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import { CrudPage } from "@/components/admin/crud-page";
import { Selo } from "@/components/admin/painel/PaginaModulo";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/sessoes/")({
  component: AdminSessoes,
});

type Sessao = {
  id: string;
  titulo: string;
  tipo: string | null;
  data_sessao: string;
  local: string | null;
  status: string;
  qtd_pautas: number;
  qtd_presencas: number;
  qtd_votacoes: number;
  ata_publicada: boolean;
  ata_url: string | null;
};
type Vereador = { id: string; nome: string };

const SITUACOES = [
  { label: "Agendada", value: "agendada" },
  { label: "Realizada", value: "realizada" },
  { label: "Cancelada", value: "cancelada" },
];
const CORES: Record<string, string> = { agendada: "#1F5FBF", realizada: "#0B7A4B", cancelada: "#B42318" };
const TIPOS = ["Sessão Ordinária", "Sessão Extraordinária", "Sessão Solene", "Audiência Pública"];
const rotuloSituacao = (s: string) => SITUACOES.find((x) => x.value === s)?.label ?? s;

function DataSessao({ data, cor }: { data: string; cor: string }) {
  const d = new Date(data);
  return (
    <div className="w-14 rounded-xl text-center text-white py-1.5" style={{ backgroundColor: cor }} aria-hidden>
      <p className="text-[10px] font-bold uppercase tracking-wider">{d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</p>
      <p className="font-display text-xl font-bold leading-none">{d.getDate()}</p>
      <p className="text-[10px] opacity-90">{d.getFullYear()}</p>
    </div>
  );
}

function Presencas({ sessao, vereadores, onClose }: { sessao: Sessao; vereadores: Vereador[]; onClose: () => void }) {
  const [presencas, setPresencas] = useState<Record<string, boolean>>({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase.from("sessoes_presencas").select("*").eq("sessao_id", sessao.id).then(({ data }) => {
      setPresencas(Object.fromEntries((data ?? []).map((p: any) => [p.vereador_id, p.presente])));
      setCarregando(false);
    });
  }, [sessao.id]);

  const marcar = async (ids: string[], presente: boolean) => {
    const { error } = await supabase.from("sessoes_presencas").upsert(
      ids.map((vereador_id) => ({ sessao_id: sessao.id, vereador_id, presente })),
      { onConflict: "sessao_id,vereador_id" },
    );
    if (error) return toast.error("Não foi possível salvar a presença.");
    setPresencas((p) => ({ ...p, ...Object.fromEntries(ids.map((i) => [i, presente])) }));
  };
  const presentes = Object.values(presencas).filter(Boolean).length;

  return (
    <Dialog open onOpenChange={(a) => !a && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Lista de presença</DialogTitle>
          <DialogDescription>{sessao.titulo} · {presentes} de {vereadores.length} presentes. Cada marcação é salva na hora.</DialogDescription>
        </DialogHeader>
        <Button type="button" variant="outline" onClick={() => marcar(vereadores.map((v) => v.id), true)}><CheckCheck className="w-4 h-4 mr-2" aria-hidden /> Marcar todos como presentes</Button>
        {carregando ? <Loader2 className="w-6 h-6 mx-auto animate-spin text-muted-foreground" /> : (
          <ul className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
            {vereadores.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2">
                <span className="font-medium text-sm text-foreground">{v.nome}</span>
                <div role="group" aria-label={`Presença de ${v.nome}`} className="flex gap-1.5">
                  <Button type="button" size="sm" aria-pressed={presencas[v.id] === true} className={presencas[v.id] === true ? "bg-emerald-700 hover:bg-emerald-700 text-white" : ""} variant={presencas[v.id] === true ? "default" : "outline"} onClick={() => marcar([v.id], true)}><Check className="w-4 h-4 mr-1" aria-hidden /> Presente</Button>
                  <Button type="button" size="sm" aria-pressed={presencas[v.id] === false} variant={presencas[v.id] === false ? "destructive" : "outline"} onClick={() => marcar([v.id], false)}><XIcon className="w-4 h-4 mr-1" aria-hidden /> Ausente</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

const VOTOS = [
  { valor: "sim", rotulo: "Sim", cor: "#0B7A4B" },
  { valor: "nao", rotulo: "Não", cor: "#B42318" },
  { valor: "abstencao", rotulo: "Abstenção", cor: "#475569" },
];

function Votos({ sessao, vereadores, onClose }: { sessao: Sessao; vereadores: Vereador[]; onClose: () => void }) {
  const [votos, setVotos] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("sessoes_votacoes").select("*").eq("sessao_id", sessao.id).then(({ data }) => {
      setVotos(Object.fromEntries((data ?? []).map((v: any) => [v.vereador_id, v.voto])));
    });
  }, [sessao.id]);

  const votar = async (vereador_id: string, voto: string) => {
    // Sem matéria vinculada, a regra de unicidade do banco não impede repetição: troca o voto anterior.
    const { error: erroLimpeza } = await supabase.from("sessoes_votacoes").delete().eq("sessao_id", sessao.id).eq("vereador_id", vereador_id).is("materia_id", null);
    if (erroLimpeza) return toast.error("Não foi possível salvar o voto.");
    const { error } = await supabase.from("sessoes_votacoes").insert({ sessao_id: sessao.id, vereador_id, voto });
    if (error) return toast.error("Não foi possível salvar o voto.");
    setVotos((p) => ({ ...p, [vereador_id]: voto }));
  };
  const placar = VOTOS.map((v) => `${v.rotulo}: ${Object.values(votos).filter((x) => x === v.valor).length}`).join(" · ");

  return (
    <Dialog open onOpenChange={(a) => !a && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Resumo dos votos</DialogTitle>
          <DialogDescription>{sessao.titulo} · {placar}. Cada voto é salvo na hora.</DialogDescription>
        </DialogHeader>
        <ul className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
          {vereadores.map((v) => (
            <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3 py-2">
              <span className="font-medium text-sm text-foreground">{v.nome}</span>
              <div role="radiogroup" aria-label={`Voto de ${v.nome}`} className="flex gap-1">
                {VOTOS.map((o) => {
                  const ativo = votos[v.id] === o.valor;
                  return (
                    <button key={o.valor} type="button" role="radio" aria-checked={ativo} onClick={() => votar(v.id, o.valor)} className="min-h-9 px-3 rounded-full text-xs font-bold border transition focus-visible:outline-2 focus-visible:outline-offset-2" style={ativo ? { backgroundColor: o.cor, borderColor: o.cor, color: "white" } : { color: `color-mix(in srgb, ${o.cor} 72%, var(--foreground))`, borderColor: `color-mix(in srgb, ${o.cor} 35%, transparent)` }}>
                      {o.rotulo}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

function AdminSessoes() {
  const [vereadores, setVereadores] = useState<Vereador[]>([]);
  const [presenca, setPresenca] = useState<Sessao | null>(null);
  const [voto, setVoto] = useState<Sessao | null>(null);

  useEffect(() => {
    supabase.from("vereadores").select("id, nome").eq("ativo", true).order("nome").then(({ data }) => setVereadores(data ?? []));
  }, []);

  const quando = (r: Sessao) => new Date(r.data_sessao).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <CrudPage<Sessao>
        title="Sessões"
        table="sessoes"
        singular="sessão"
        feminino
        vazio="Nenhuma sessão cadastrada"
        orderBy={{ column: "data_sessao", ascending: false }}
        defaultValues={{ status: "agendada", tipo: "Sessão Ordinária", local: "Plenário da Câmara Municipal" }}
        buscaEm={["titulo", "tipo", "local", "pauta"]}
        indicadores={(ls) => {
          const agora = Date.now();
          return [
            { rotulo: "Sessões", valor: ls.length },
            { rotulo: "Próximas", valor: ls.filter((l) => l.status === "agendada" && new Date(l.data_sessao).getTime() >= agora).length, cor: CORES.agendada },
            { rotulo: "Realizadas", valor: ls.filter((l) => l.status === "realizada").length, cor: CORES.realizada },
            { rotulo: "Sem ata publicada", valor: ls.filter((l) => l.status === "realizada" && !l.ata_publicada).length, detalhe: "Entre as realizadas", cor: "#A8540F" },
          ];
        }}
        filtros={[
          { campo: "status", rotulo: "Situação", opcoes: SITUACOES },
          { campo: "tipo", rotulo: "Tipo" },
          { campo: "ano", rotulo: "Ano", valor: (r) => String(new Date(r.data_sessao).getFullYear()) },
          { campo: "ata", rotulo: "Ata", valor: (r) => (r.ata_publicada ? "Publicada" : "Não publicada") },
        ]}
        cartao={{
          imagem: (r) => <DataSessao data={r.data_sessao} cor={CORES[r.status] ?? "#475569"} />,
          titulo: (r) => r.titulo,
          subtitulo: (r) => `${r.tipo ?? "Sessão"} · ${quando(r)}`,
          selo: (r) => <Selo cor={CORES[r.status]}>{rotuloSituacao(r.status)}</Selo>,
          texto: (r) => r.local,
          rodape: (r) => (r.ata_publicada ? <span className="inline-flex items-center gap-1"><FileText className="w-3.5 h-3.5" aria-hidden /> Ata publicada</span> : "Sem ata"),
        }}
        acoesCartao={(r) => (
          <>
            <Button type="button" size="icon" variant="ghost" aria-label={`Lista de presença de ${r.titulo}`} title="Lista de presença" onClick={() => setPresenca(r)}><UserCheck className="w-4 h-4" /></Button>
            <Button type="button" size="icon" variant="ghost" aria-label={`Votos de ${r.titulo}`} title="Votos" onClick={() => setVoto(r)}><Vote className="w-4 h-4" /></Button>
          </>
        )}
        columns={[
          { key: "titulo", label: "Título" },
          { key: "tipo", label: "Tipo" },
          { key: "data_sessao", label: "Data", render: quando },
          { key: "status", label: "Situação", render: (r) => <Selo cor={CORES[r.status]}>{rotuloSituacao(r.status)}</Selo> },
          { key: "ata_publicada", label: "Ata", render: (r) => (r.ata_publicada ? "Publicada" : "Não publicada") },
        ]}
        secoes={[
          { titulo: "Sessão", campos: ["titulo", "tipo", "status", "data_sessao", "local"] },
          { titulo: "Pauta", campos: ["qtd_pautas", "pauta"] },
          { titulo: "Depois da sessão", descricao: "Ata e gravação publicadas no site.", campos: ["ata_url", "ata_publicada", "video_url"] },
        ]}
        fields={[
          { name: "titulo", label: "Título", required: true, largo: true, placeholder: "Ex.: 12ª Sessão Ordinária" },
          { name: "tipo", label: "Tipo", type: "select", options: TIPOS.map((t) => ({ label: t, value: t })), placeholder: "Sem tipo" },
          { name: "status", label: "Situação", type: "select", options: SITUACOES, required: true },
          { name: "data_sessao", label: "Data e hora", type: "datetime-local", required: true },
          { name: "local", label: "Local" },
          { name: "qtd_pautas", label: "Quantidade de itens na pauta", type: "number" },
          { name: "pauta", label: "Pauta", type: "textarea", placeholder: "Matérias previstas para a sessão" },
          { name: "ata_url", label: "Arquivo da ata", type: "file", arquivo: "pdf" },
          { name: "ata_publicada", label: "Ata publicada", type: "checkbox", placeholder: "Mostrar a ata como publicada" },
          { name: "video_url", label: "Gravação no YouTube", type: "url", placeholder: "https://youtube.com/..." },
        ]}
      />
      {presenca && <Presencas sessao={presenca} vereadores={vereadores} onClose={() => setPresenca(null)} />}
      {voto && <Votos sessao={voto} vereadores={vereadores} onClose={() => setVoto(null)} />}
    </>
  );
}
