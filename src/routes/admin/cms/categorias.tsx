import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/admin/crud-page";

export const Route = createFileRoute("/admin/cms/categorias")({
  component: AdminCategorias,
});

type Categoria = { id: string; nome: string; slug: string; cor: string | null; ordem: number | null };

const fields: FieldDef[] = [
  { name: "nome", label: "Nome", required: true, largo: true },
  { name: "slug", label: "Endereço no site", required: true, slugDe: "nome", largo: true, ajuda: "Preenchido a partir do nome." },
  { name: "cor", label: "Cor", type: "cor" },
  { name: "ordem", label: "Ordem", type: "number" },
];

function AdminCategorias() {
  return (
    <CrudPage<Categoria>
      title="Categorias"
      table="noticias_categorias"
      singular="categoria"
      feminino
      vazio="Nenhuma categoria cadastrada"
      orderBy={{ column: "ordem", ascending: true }}
      defaultValues={{ cor: "#1F5FBF", ordem: 0 }}
      buscaEm={["nome", "slug"]}
      fields={fields}
      cartao={{
        imagem: (r) => <span className="block w-11 h-11 rounded-xl border border-border" style={{ backgroundColor: r.cor ?? "#94a3b8" }} aria-hidden />,
        titulo: (r) => r.nome,
        subtitulo: (r) => `/${r.slug}`,
        rodape: (r) => `Ordem ${r.ordem ?? 0}`,
      }}
      previa={undefined}
      columns={[
        { key: "nome", label: "Nome" },
        { key: "slug", label: "Endereço" },
        { key: "cor", label: "Cor", render: (r) => <span className="inline-flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: r.cor ?? undefined }} aria-hidden /><span className="font-mono text-xs">{r.cor}</span></span> },
        { key: "ordem", label: "Ordem" },
      ]}
    />
  );
}
