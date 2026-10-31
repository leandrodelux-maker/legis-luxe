import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, type FieldDef } from "@/components/admin/crud-page";
import { Selo } from "@/components/admin/painel/PaginaModulo";
import { COMMITTEE_ICON_NAMES, getCommitteeIcon } from "@/lib/committee-icons";

export const Route = createFileRoute("/admin/comissoes")({
  component: AdminComissoes,
});

type ComissaoRow = {
  id: string;
  nome: string;
  sigla: string;
  icone: string | null;
  competencia: string | null;
  ordem: number;
  ativo: boolean;
};

const fields: FieldDef[] = [
  { name: "nome", label: "Nome da comissão", required: true, largo: true },
  { name: "sigla", label: "Sigla", required: true, placeholder: "Ex.: CCJR" },
  { name: "ordem", label: "Ordem de exibição", type: "number" },
  {
    name: "icone",
    label: "Ícone",
    type: "custom",
    renderCustom: (_row, form, setForm) => (
      <div role="radiogroup" aria-label="Ícone da comissão" className="flex flex-wrap gap-2">
        {COMMITTEE_ICON_NAMES.map((n) => {
          const Icone = getCommitteeIcon(n);
          const ativo = form.icone === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={ativo}
              aria-label={n}
              title={n}
              onClick={() => setForm({ ...form, icone: n })}
              className={`w-11 h-11 rounded-xl grid place-items-center border transition focus-visible:outline-2 focus-visible:outline-offset-2 ${ativo ? "text-white border-transparent" : "text-muted-foreground border-border hover:bg-muted"}`}
              style={ativo ? { backgroundColor: "var(--tema)" } : undefined}
            >
              <Icone className="w-5 h-5" aria-hidden />
            </button>
          );
        })}
      </div>
    ),
  },
  { name: "competencia", label: "Competência", type: "textarea", placeholder: "O que esta comissão analisa", ajuda: "Aparece na página de comissões do site." },
  { name: "ativo", label: "Situação", type: "checkbox", placeholder: "Mostrar esta comissão no site", largo: true },
];

const situacao = (r: ComissaoRow) => <Selo cor={r.ativo ? "#0B7A4B" : "#6B7280"}>{r.ativo ? "Ativa" : "Inativa"}</Selo>;

function AdminComissoes() {
  return (
    <CrudPage<ComissaoRow>
      title="Comissões"
      table="comissoes"
      singular="comissão"
      feminino
      vazio="Nenhuma comissão cadastrada"
      fields={fields}
      orderBy={{ column: "ordem", ascending: true }}
      defaultValues={{ ativo: true, ordem: 1, icone: "Scale" } as Partial<ComissaoRow>}
      buscaEm={["nome", "sigla", "competencia"]}
      filtros={[{ campo: "situacao", rotulo: "Situação", valor: (r) => (r.ativo ? "Ativa" : "Inativa") }]}
      cartao={{
        imagem: (r) => {
          const Icone = getCommitteeIcon(r.icone);
          return <span className="w-12 h-12 rounded-xl grid place-items-center text-white" style={{ backgroundColor: "var(--tema)" }}><Icone className="w-6 h-6" aria-hidden /></span>;
        },
        titulo: (r) => r.nome,
        subtitulo: (r) => r.sigla,
        selo: situacao,
        texto: (r) => r.competencia,
        rodape: (r) => `Ordem ${r.ordem}`,
      }}
      columns={[
        { key: "sigla", label: "Sigla" },
        { key: "nome", label: "Comissão" },
        { key: "ordem", label: "Ordem" },
        { key: "ativo", label: "Situação", render: situacao },
      ]}
    />
  );
}
