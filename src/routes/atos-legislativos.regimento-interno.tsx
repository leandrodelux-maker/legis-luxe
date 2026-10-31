import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Gavel, ListOrdered, Users2 } from "lucide-react";
import { WPFD_DOWNLOAD, WPFD_PREVIEW, buildGoogleViewer } from "@/lib/legal-documents";
import type { LegalDocument } from "@/components/document-library";
import { PaginaDocumentoOficial, type TemaDocumento } from "@/components/pagina-documento-oficial";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/atos-legislativos/regimento-interno")({
  head: () => ({
    meta: [
      { title: "Regimento Interno — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content:
          "Consulte e baixe o Regimento Interno da Câmara Municipal de Adelândia: funcionamento das sessões, comissões, tramitação e ordem dos trabalhos.",
      },
      { property: "og:title", content: "Regimento Interno — Câmara Municipal de Adelândia" },
      {
        property: "og:description",
        content: "Regras de funcionamento interno do Legislativo municipal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegimentoInternoPage,
});

const FALLBACK_DOCS: LegalDocument[] = [
  {
    title: "Regimento Interno — Câmara Municipal",
    date: "06/10/2023",
    description: "Texto do Regimento Interno em vigor.",
    downloadUrl: WPFD_DOWNLOAD(63, 6812),
    viewerUrl: buildGoogleViewer(WPFD_PREVIEW(63, 6812)),
  },
];

const TEMAS: TemaDocumento[] = [
  { icone: Gavel, titulo: "Sessões plenárias", texto: "Tipos de sessão, abertura, ordem do dia, discussão, votação e uso da palavra.", to: ROUTES.sessoes, rotulo: "Ver as sessões" },
  { icone: Users2, titulo: "Mesa e comissões", texto: "Composição, eleição e atribuições da Mesa Diretora e das comissões permanentes.", to: ROUTES.comissoes, rotulo: "Ver as comissões" },
  { icone: ListOrdered, titulo: "Tramitação de matérias", texto: "Protocolo, pareceres, emendas, prazos, redação final e recursos regimentais.", to: ROUTES.projetos, rotulo: "Ver as matérias" },
];

function RegimentoInternoPage() {
  return (
    <PaginaDocumentoOficial
      rota={ROUTES.regimentoInterno}
      categoria="regimento-interno"
      reserva={FALLBACK_DOCS}
      titulo="Regimento Interno"
      icone={BookOpen}
      descricao="As regras de funcionamento da Câmara: como as sessões acontecem, como as comissões atuam e como cada proposição é discutida e votada."
      tituloTemas="O que o Regimento organiza"
      temas={TEMAS}
    />
  );
}
