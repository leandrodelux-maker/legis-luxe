import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { CrudPage } from "@/components/admin/crud-page";
import { Selo } from "@/components/admin/painel/PaginaModulo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/projetos/")({
  component: AdminProjetos,
});

type Projeto = {
  id: string;
  numero: string;
  ano: number;
  tipo: string;
  ementa: string;
  autor: string | null;
  autor_id: string | null;
  status: string;
  data_apresentacao: string | null;
  documento_url: string | null;
  tramitacao: string | null;
};

const ETAPAS = [
  { label: "Protocolado", value: "protocolado" },
  { label: "Em comissão", value: "comissao" },
  { label: "Em plenário", value: "plenario" },
  { label: "Aprovado", value: "aprovado" },
  { label: "Sancionado", value: "sancionado" },
  { label: "Arquivado", value: "arquivado" },
  { label: "Rejeitado", value: "rejeitado" },
];
const CORES: Record<string, string> = {
  protocolado: "#475569",
  comissao: "#A8540F",
  plenario: "#1F5FBF",
  aprovado: "#0B7A4B",
  sancionado: "#0B6B5F",
  arquivado: "#6B7280",
  rejeitado: "#B42318",
};
const rotuloEtapa = (s: string) => ETAPAS.find((e) => e.value === s)?.label ?? s;
const EM_ANDAMENTO = ["protocolado", "comissao", "plenario"];
const TIPOS = ["Projeto de Lei", "Projeto de Lei Complementar", "Indicação", "Requerimento", "Moção", "Projeto de Decreto Legislativo", "Emenda"];

function AdminProjetos() {
  const [vereadores, setVereadores] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    supabase.from("vereadores").select("id, nome").order("nome").then(({ data }) => setVereadores((data ?? []).map((v) => ({ label: v.nome, value: v.id }))));
  }, []);
  const autorDe = (r: Pick<Projeto, "autor_id" | "autor">) => vereadores.find((v) => v.value === r.autor_id)?.label ?? r.autor ?? "Autor não informado";
  const identificacao = (r: Pick<Projeto, "tipo" | "numero" | "ano">) => `${r.tipo} ${r.numero}/${r.ano}`;

  return (
    <CrudPage<Projeto>
      title="Projetos"
      table="projetos_legislativos"
      singular="projeto"
      nomeDe={identificacao}
      vazio="Nenhum projeto cadastrado"
      orderBy={{ column: "data_apresentacao", ascending: false }}
      defaultValues={{ status: "protocolado", ano: new Date().getFullYear() }}
      buscaEm={["numero", "ementa", "autor", "tipo"]}
      indicadores={(ls) => [
        { rotulo: "Projetos", valor: ls.length },
        { rotulo: "Em tramitação", valor: ls.filter((l) => EM_ANDAMENTO.includes(l.status)).length, cor: CORES.plenario },
        { rotulo: "Aprovados e sancionados", valor: ls.filter((l) => ["aprovado", "sancionado"].includes(l.status)).length, cor: CORES.aprovado },
        { rotulo: "Deste ano", valor: ls.filter((l) => l.ano === new Date().getFullYear()).length, cor: CORES.comissao },
      ]}
      filtros={[
        { campo: "status", rotulo: "Etapa", opcoes: ETAPAS },
        { campo: "tipo", rotulo: "Tipo" },
        { campo: "ano", rotulo: "Ano", valor: (r) => String(r.ano) },
      ]}
      cartao={{
        titulo: identificacao,
        selo: (r) => <Selo cor={CORES[r.status]}>{rotuloEtapa(r.status)}</Selo>,
        subtitulo: autorDe,
        texto: (r) => r.ementa,
        rodape: (r) => (r.documento_url ? <span className="inline-flex items-center gap-1"><FileText className="w-3.5 h-3.5" aria-hidden /> PDF anexado</span> : "Sem PDF"),
      }}
      columns={[
        { key: "numero", label: "Identificação", render: identificacao },
        { key: "ementa", label: "Ementa", render: (r) => <span className="line-clamp-2 max-w-md">{r.ementa}</span> },
        { key: "autor", label: "Autor", render: autorDe },
        { key: "status", label: "Etapa", render: (r) => <Selo cor={CORES[r.status]}>{rotuloEtapa(r.status)}</Selo> },
      ]}
      secoes={[
        { titulo: "Identificação", descricao: "Como a proposição é conhecida.", campos: ["tipo", "numero", "ano", "data_apresentacao"] },
        { titulo: "Conteúdo", campos: ["ementa", "documento_url"] },
        { titulo: "Autoria", descricao: "Escolha um vereador ou informe outro autor, como o Executivo ou uma comissão.", campos: ["autor_id", "autor"] },
        { titulo: "Tramitação", descricao: "Em que etapa o projeto está agora.", campos: ["status", "tramitacao", "observacoes"] },
      ]}
      fields={[
        { name: "tipo", label: "Tipo de documento", type: "select", options: TIPOS.map((t) => ({ label: t, value: t })), required: true, largo: true },
        { name: "numero", label: "Número", required: true, placeholder: "Ex.: 012" },
        { name: "ano", label: "Ano", type: "number", required: true },
        { name: "data_apresentacao", label: "Data de protocolo", type: "date" },
        { name: "ementa", label: "Ementa", type: "textarea", required: true, placeholder: "Resumo do que o projeto propõe", ajuda: "Aparece na lista de projetos do site." },
        { name: "documento_url", label: "Arquivo do projeto", type: "file", arquivo: "pdf" },
        { name: "autor_id", label: "Vereador autor", type: "select", options: vereadores, placeholder: "Nenhum vereador" },
        { name: "autor", label: "Outro autor", placeholder: "Ex.: Poder Executivo" },
        { name: "status", label: "Etapa atual", type: "etapas", options: ETAPAS, cores: CORES, required: true },
        { name: "tramitacao", label: "Histórico de tramitação", type: "textarea", placeholder: "Ex.: 10/03 — encaminhado à CCJR" },
        { name: "observacoes", label: "Observações internas", type: "textarea", ajuda: "Uso interno da Câmara." },
      ]}
    />
  );
}
