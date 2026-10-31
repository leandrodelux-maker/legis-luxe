import { createFileRoute } from "@tanstack/react-router";
import { CaixaAtendimento, type Situacao } from "@/components/admin/painel/CaixaAtendimento";

export const Route = createFileRoute("/admin/cms/esic")({
  component: AdminEsic,
});

const SITUACOES: Situacao[] = [
  { valor: "pendente", rotulo: "Pendente", cor: "#A8540F", aberta: true },
  { valor: "analise", rotulo: "Em análise", cor: "#1F5FBF", aberta: true },
  { valor: "prorrogado", rotulo: "Prorrogado", cor: "#5B45B0", aberta: true },
  { valor: "respondido", rotulo: "Respondido", cor: "#0B7A4B", aberta: false },
  { valor: "negado", rotulo: "Negado", cor: "#B42318", aberta: false },
];
const abertas = SITUACOES.filter((s) => s.aberta).map((s) => s.valor);

function AdminEsic() {
  return (
    <CaixaAtendimento
      tabela="esic_solicitacoes"
      situacoes={SITUACOES}
      respondido="respondido"
      campoTexto="pedido"
      assunto={(r) => String(r.pedido ?? "").split("\n")[0].slice(0, 110)}
      prazo={{ campo: "prazo_resposta", situacaoProrrogada: "prorrogado" }}
      vazio="Nenhum pedido recebido"
      detalhes={(r) => [
        { rotulo: "CPF ou CNPJ", valor: r.cpf },
        { rotulo: "Prazo de resposta", valor: r.prazo_resposta ? new Date(`${r.prazo_resposta}T12:00:00`).toLocaleDateString("pt-BR") : null },
      ]}
      indicadores={(ls, { diasRestantes }) => {
        const ab = ls.filter((l) => abertas.includes(l.status));
        return [
          { rotulo: "Pedidos", valor: ls.length },
          { rotulo: "Em aberto", valor: ab.length, cor: "#A8540F" },
          { rotulo: "Vencidos", valor: ab.filter((l) => (diasRestantes(l) ?? 0) < 0).length, cor: "#B42318", detalhe: "Prazo legal de 20 dias" },
          { rotulo: "Respondidos", valor: ls.filter((l) => l.status === "respondido").length, cor: "#0B7A4B" },
        ];
      }}
    />
  );
}
