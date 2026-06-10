import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";
import { Badge } from "@/components/ui/badge";

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
};

function AdminSessoes() {
  return (
    <CrudPage<Sessao>
      title="Sessões"
      description="Agenda e histórico das sessões plenárias."
      table="sessoes"
      orderBy={{ column: "data_sessao", ascending: false }}
      defaultValues={{ status: "agendada" }}
      columns={[
        { key: "titulo", label: "Título" },
        { key: "tipo", label: "Tipo" },
        {
          key: "data_sessao",
          label: "Data",
          render: (r) => new Date(r.data_sessao).toLocaleString("pt-BR"),
        },
        { key: "local", label: "Local" },
        {
          key: "status",
          label: "Status",
          render: (r) => <Badge>{r.status}</Badge>,
        },
      ]}
      fields={[
        { name: "titulo", label: "Título", required: true },
        { name: "tipo", label: "Tipo", placeholder: "Ordinária, Extraordinária, Solene, Audiência" },
        { name: "data_sessao", label: "Data e hora", type: "datetime-local", required: true },
        { name: "local", label: "Local" },
        { name: "status", label: "Status", placeholder: "agendada | realizada | cancelada" },
        { name: "pauta", label: "Pauta", type: "textarea" },
        { name: "ata_url", label: "URL da ata", type: "url" },
        { name: "video_url", label: "URL do vídeo (YouTube)", type: "url" },
      ]}
    />
  );
}
