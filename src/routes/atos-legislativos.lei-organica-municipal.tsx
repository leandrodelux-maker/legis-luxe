import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Landmark, Scale } from "lucide-react";
import { WPFD_DOWNLOAD, WPFD_PREVIEW, buildGoogleViewer } from "@/lib/legal-documents";
import type { LegalDocument } from "@/components/document-library";
import { PaginaDocumentoOficial, type TemaDocumento } from "@/components/pagina-documento-oficial";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/atos-legislativos/lei-organica-municipal")({
  head: () => ({
    meta: [
      { title: "Lei Orgânica Municipal — Câmara de Adelândia" },
      {
        name: "description",
        content:
          "Leia e baixe a Lei Orgânica do Município de Adelândia, a norma máxima que organiza os poderes, competências e direitos no âmbito municipal.",
      },
      { property: "og:title", content: "Lei Orgânica Municipal — Câmara de Adelândia" },
      {
        property: "og:description",
        content: "Norma fundamental do município, disponível para consulta e download.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeiOrganicaPage,
});

const FALLBACK_DOCS: LegalDocument[] = [
  {
    title: "Lei Orgânica do Município de Adelândia",
    date: "06/10/2023",
    description: "Texto consolidado da Lei Orgânica Municipal.",
    downloadUrl: WPFD_DOWNLOAD(68, 6813),
    viewerUrl: buildGoogleViewer(WPFD_PREVIEW(68, 6813)),
  },
];

const TEMAS: TemaDocumento[] = [
  { icone: Landmark, titulo: "Organização do município", texto: "Território, símbolos, competências e a estrutura dos Poderes Legislativo e Executivo.", to: ROUTES.historia, rotulo: "Conhecer o município" },
  { icone: Scale, titulo: "Processo legislativo", texto: "Espécies normativas, quóruns, prazos de votação, vetos e promulgação.", to: ROUTES.projetos, rotulo: "Ver as matérias" },
  { icone: BookOpen, titulo: "Direitos e serviços", texto: "Administração pública, servidores, tributos, orçamento e políticas municipais.", to: ROUTES.cartaServicos, rotulo: "Ver os serviços da Câmara" },
];

function LeiOrganicaPage() {
  return (
    <PaginaDocumentoOficial
      rota={ROUTES.leiOrganica}
      categoria="lei-organica-municipal"
      reserva={FALLBACK_DOCS}
      titulo="Lei Orgânica Municipal"
      icone={Scale}
      descricao="A lei maior do município: organiza os Poderes, define as competências locais e orienta todas as demais leis de Adelândia."
      tituloTemas="O que a Lei Orgânica define"
      temas={TEMAS}
    />
  );
}
