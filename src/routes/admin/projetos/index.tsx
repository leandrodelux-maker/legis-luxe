import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";
import { Badge } from "@/components/ui/badge";

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
  status: string;
};

function AdminProjetos() {
  return (
    <CrudPage<Projeto>
      title="Processo Legislativo"
      description="Projetos de lei, indicações e requerimentos."
      table="projetos_legislativos"
      orderBy={{ column: "data_apresentacao", ascending: false }}
      defaultValues={{ status: "em_tramitacao", ano: new Date().getFullYear() }}
      columns={[
        {
          key: "numero",
          label: "Número",
          render: (r) => `${r.tipo} ${r.numero}/${r.ano}`,
        },
        { key: "ementa", label: "Ementa" },
        { key: "autor", label: "Autor" },
        { key: "status", label: "Status", render: (r) => <Badge>{r.status}</Badge> },
      ]}
      fields={[
        { name: "tipo", label: "Tipo (PL, PLC, IND, REQ)", required: true },
        { name: "numero", label: "Número", required: true },
        { name: "ano", label: "Ano", type: "number", required: true },
        { name: "ementa", label: "Ementa", type: "textarea", required: true },
        { name: "autor", label: "Autor" },
        { name: "status", label: "Status", placeholder: "em_tramitacao | aprovado | arquivado" },
        { name: "data_apresentacao", label: "Data de apresentação", type: "date" },
        { name: "documento_url", label: "URL do documento", type: "url" },
        { name: "observacoes", label: "Observações", type: "textarea" },
      ]}
    />
  );
}
