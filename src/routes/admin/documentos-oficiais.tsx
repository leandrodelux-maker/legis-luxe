import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, FileText } from "lucide-react";
import { CrudPage, type FieldDef } from "@/components/admin/crud-page";
import { Selo } from "@/components/admin/painel/PaginaModulo";
import { DOCUMENT_CATEGORIES } from "@/lib/official-documents";

export const Route = createFileRoute("/admin/documentos-oficiais")({
  component: AdminDocumentosOficiais,
});

type DocRow = {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string | null;
  data_documento: string | null;
  download_url: string;
  viewer_url: string | null;
  ordem: number;
  publicado: boolean;
};

const CATEGORIAS = DOCUMENT_CATEGORIES.map((c) => ({ label: c.label, value: c.value }));
const nomeCategoria = (v: string) => CATEGORIAS.find((c) => c.value === v)?.label ?? v;

const fields: FieldDef[] = [
  { name: "categoria", label: "Onde será exibido", type: "select", required: true, options: CATEGORIAS, largo: true },
  { name: "titulo", label: "Título do documento", required: true, largo: true },
  { name: "descricao", label: "Descrição", type: "textarea" },
  { name: "data_documento", label: "Data do documento", placeholder: "Ex.: 06/10/2023" },
  { name: "ordem", label: "Ordem de exibição", type: "number" },
  { name: "download_url", label: "Arquivo em PDF", type: "file", arquivo: "pdf", required: true },
  { name: "viewer_url", label: "Link do visualizador", type: "url", largo: true, placeholder: "Opcional", ajuda: "Em branco, o site gera o visualizador sozinho." },
  { name: "publicado", label: "Publicação", type: "checkbox", placeholder: "Mostrar este documento no site", largo: true },
];

const situacao = (r: DocRow) => <Selo cor={r.publicado ? "#0B7A4B" : "#A8540F"}>{r.publicado ? "Publicado" : "Rascunho"}</Selo>;

function AdminDocumentosOficiais() {
  return (
    <CrudPage<DocRow>
      title="Documentos Oficiais"
      table="documentos_oficiais"
      singular="documento"
      vazio="Nenhum documento cadastrado"
      fields={fields}
      orderBy={{ column: "ordem", ascending: true }}
      defaultValues={{ publicado: true, ordem: 1, categoria: "carta-de-servicos" } as Partial<DocRow>}
      buscaEm={["titulo", "descricao", "data_documento"]}
      filtros={[
        { campo: "categoria", rotulo: "Página", opcoes: CATEGORIAS },
        { campo: "situacao", rotulo: "Situação", valor: (r) => (r.publicado ? "Publicado" : "Rascunho") },
      ]}
      secoes={[
        { titulo: "Documento", campos: ["categoria", "titulo", "descricao", "data_documento", "ordem"] },
        { titulo: "Arquivo", campos: ["download_url", "viewer_url"] },
        { titulo: "Publicação", campos: ["publicado"] },
      ]}
      cartao={{
        imagem: () => <span className="w-12 h-12 rounded-xl grid place-items-center text-white" style={{ backgroundColor: "var(--tema)" }}><FileText className="w-6 h-6" aria-hidden /></span>,
        titulo: (r) => r.titulo,
        subtitulo: (r) => nomeCategoria(r.categoria),
        selo: situacao,
        texto: (r) => r.descricao,
        rodape: (r) => (
          <a href={r.download_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2">
            <ExternalLink className="w-3.5 h-3.5" aria-hidden /> Abrir arquivo{r.data_documento ? ` · ${r.data_documento}` : ""}
          </a>
        ),
      }}
      columns={[
        { key: "titulo", label: "Documento" },
        { key: "categoria", label: "Página", render: (r) => nomeCategoria(r.categoria) },
        { key: "data_documento", label: "Data" },
        { key: "ordem", label: "Ordem" },
        { key: "publicado", label: "Situação", render: situacao },
      ]}
    />
  );
}
