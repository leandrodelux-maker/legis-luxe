import { createFileRoute } from "@tanstack/react-router";
import { CaixaAtendimento, type Situacao } from "@/components/admin/painel/CaixaAtendimento";

export const Route = createFileRoute("/admin/cms/ouvidoria")({
  component: AdminOuvidoria,
});

const SITUACOES: Situacao[] = [
  { valor: "aberto", rotulo: "Aberto", cor: "#A8540F", aberta: true },
  { valor: "em_andamento", rotulo: "Em andamento", cor: "#1F5FBF", aberta: true },
  { valor: "respondido", rotulo: "Respondido", cor: "#0B7A4B", aberta: false },
  { valor: "encerrado", rotulo: "Encerrado", cor: "#6B7280", aberta: false },
];
const TIPOS = [
  { valor: "denuncia", rotulo: "Denúncia" },
  { valor: "reclamacao", rotulo: "Reclamação" },
  { valor: "solicitacao", rotulo: "Solicitação" },
  { valor: "sugestao", rotulo: "Sugestão" },
  { valor: "elogio", rotulo: "Elogio" },
];
const abertas = SITUACOES.filter((s) => s.aberta).map((s) => s.valor);

function AdminOuvidoria() {
  return (
    <CaixaAtendimento
      tabela="ouvidoria_protocolos"
      situacoes={SITUACOES}
      respondido="respondido"
      campoTexto="mensagem"
      assunto={(r) => String(r.assunto ?? "Sem assunto")}
      tipos={TIPOS}
      vazio="Nenhuma manifestação recebida"
      detalhes={(r) => [{ rotulo: "Tipo", valor: TIPOS.find((t) => t.valor === r.tipo)?.rotulo ?? r.tipo }]}
      indicadores={(ls) => [
        { rotulo: "Manifestações", valor: ls.length },
        { rotulo: "Em aberto", valor: ls.filter((l) => abertas.includes(l.status)).length, cor: "#A8540F" },
        { rotulo: "Denúncias", valor: ls.filter((l) => l.tipo === "denuncia").length, cor: "#B42318" },
        { rotulo: "Respondidas", valor: ls.filter((l) => l.status === "respondido").length, cor: "#0B7A4B" },
      ]}
    />
  );
}
