import { createFileRoute } from "@tanstack/react-router";
import { TransparenciaAtivaPage } from "./transparencia-ativa";

export const Route = createFileRoute("/transparencia")({
  head: () => ({
    meta: [
      { title: "Portal da Transparência — Câmara Municipal" },
      {
        name: "description",
        content:
          "Consulte receitas, despesas, empenhos, licitações, contratos, folha de pagamento e demais dados públicos lidos diretamente do Portal Oficial de Transparência.",
      },
    ],
  }),
  component: TransparenciaAtivaPage,
});
