import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/vereadores/")({
  component: AdminVereadores,
});

type Vereador = {
  id: string;
  nome: string;
  partido: string | null;
  cargo: string | null;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
  ordem: number | null;
};

function AdminVereadores() {
  return (
    <CrudPage<Vereador>
      title="Vereadores"
      description="Gerencie os parlamentares exibidos no site."
      table="vereadores"
      orderBy={{ column: "ordem", ascending: true }}
      defaultValues={{ ativo: true, ordem: 0 }}
      columns={[
        { key: "nome", label: "Nome" },
        { key: "partido", label: "Partido" },
        { key: "cargo", label: "Cargo" },
        { key: "email", label: "E-mail" },
        {
          key: "ativo",
          label: "Status",
          render: (r) => (
            <Badge variant={r.ativo ? "default" : "secondary"}>
              {r.ativo ? "Ativo" : "Inativo"}
            </Badge>
          ),
        },
      ]}
      fields={[
        { name: "nome", label: "Nome completo", required: true },
        { name: "partido", label: "Partido" },
        { name: "cargo", label: "Cargo (ex: Presidente, Vereador)" },
        { name: "foto_url", label: "URL da foto", type: "url" },
        { name: "biografia", label: "Biografia", type: "textarea" },
        { name: "email", label: "E-mail", type: "email" },
        { name: "telefone", label: "Telefone" },
        { name: "gabinete", label: "Gabinete" },
        { name: "mandato_inicio", label: "Início do mandato", type: "date" },
        { name: "mandato_fim", label: "Fim do mandato", type: "date" },
        { name: "ordem", label: "Ordem de exibição", type: "number" },
        { name: "ativo", label: "Ativo", type: "checkbox", placeholder: "Mostrar no site" },
      ]}
    />
  );
}
