import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Clock, FileSearch, Gavel, Handshake, HelpCircle, Lock, Mail, MapPin, MessageSquare, Phone, ShieldCheck, Users2 } from "lucide-react";
import { useContactInfo } from "@/hooks/use-contact-info";
import { WPFD_DOWNLOAD, WPFD_PREVIEW, buildGoogleViewer } from "@/lib/legal-documents";
import type { LegalDocument } from "@/components/document-library";
import { PaginaDocumentoOficial, type TemaDocumento } from "@/components/pagina-documento-oficial";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/atos-legislativos/carta-de-servicos")({
  head: () => ({
    meta: [
      { title: "Carta de Serviços — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content:
          "Consulte e baixe a Carta de Serviços ao Usuário da Câmara Municipal de Adelândia, com os serviços oferecidos, requisitos e prazos de atendimento.",
      },
      { property: "og:title", content: "Carta de Serviços — Câmara Municipal de Adelândia" },
      {
        property: "og:description",
        content: "Documento oficial com os serviços prestados pelo Legislativo municipal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartaDeServicosPage,
});

const FALLBACK_DOCS: LegalDocument[] = [
  {
    title: "Carta de Serviços ao Usuário",
    date: "29/12/2022",
    description: "Serviços prestados pela Câmara, formas de acesso, requisitos e prazos.",
    downloadUrl: WPFD_DOWNLOAD(73, 5292),
    viewerUrl: buildGoogleViewer(WPFD_PREVIEW(73, 5292)),
  },
];

const TEMAS: TemaDocumento[] = [
  { icone: ClipboardList, titulo: "Serviços descritos", texto: "A finalidade de cada serviço, como solicitar e quais documentos apresentar.", to: ROUTES.esic, rotulo: "Pedir uma informação" },
  { icone: Clock, titulo: "Prazos e horários", texto: "Os prazos de resposta e os horários de atendimento ao cidadão.", to: ROUTES.contato, rotulo: "Falar com a Câmara" },
  { icone: Users2, titulo: "Canais de atendimento", texto: "Como chegar à Câmara por Ouvidoria, e-SIC, telefone, e-mail ou presencialmente.", to: ROUTES.faq, rotulo: "Ver as perguntas frequentes" },
];

const SERVICOS = [
  { to: ROUTES.esic, icone: FileSearch, titulo: "e-SIC", texto: "Peça informações públicas com base na Lei de Acesso à Informação." },
  { to: ROUTES.contato, icone: MessageSquare, titulo: "Ouvidoria", texto: "Envie reclamações, denúncias, sugestões e elogios." },
  { to: ROUTES.sessoes, icone: Gavel, titulo: "Sessões e atas", texto: "Consulte as sessões, atas, presenças e votações." },
  { to: ROUTES.transparencia, icone: ShieldCheck, titulo: "Portal da Transparência", texto: "Acompanhe receitas, despesas, contratos e servidores." },
  { to: ROUTES.lgpd, icone: Lock, titulo: "Proteção de dados", texto: "Saiba como a Câmara trata seus dados pessoais." },
  { to: ROUTES.faq, icone: HelpCircle, titulo: "Perguntas frequentes", texto: "Encontre respostas rápidas sobre o trabalho da Câmara." },
];

function CartaDeServicosPage() {
  const contato = useContactInfo();
  return (
    <PaginaDocumentoOficial
      rota={ROUTES.cartaServicos}
      categoria="carta-de-servicos"
      reserva={FALLBACK_DOCS}
      titulo="Carta de Serviços"
      icone={Handshake}
      descricao="O que a Câmara oferece ao cidadão, como solicitar e como acompanhar cada atendimento, conforme a Lei nº 13.460/2017."
      tituloTemas="O que a Carta apresenta"
      temas={TEMAS}
    >
      <section aria-labelledby="titulo-servicos">
        <h2 id="titulo-servicos" className="font-display font-bold text-xl text-foreground">Serviços disponíveis no site</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Vá direto ao que você precisa.</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {SERVICOS.map((s) => (
            <li key={s.titulo}>
              <Link to={s.to} className="group flex h-full gap-3 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition focus-visible:outline-2 focus-visible:outline-offset-2">
                <s.icone className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-bold text-foreground">{s.titulo}</span>
                  <span className="block text-sm text-muted-foreground leading-relaxed mt-0.5">{s.texto}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 transition group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="titulo-atendimento" className="bg-card border border-border rounded-2xl p-5 md:p-6">
        <h2 id="titulo-atendimento" className="font-display font-bold text-xl text-foreground">Atendimento na Câmara</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4 text-sm">
          <li className="flex gap-2.5"><MapPin className="w-5 h-5 text-primary shrink-0" aria-hidden /><span><strong className="block text-foreground">Endereço</strong><span className="text-muted-foreground">{contato.endereco}</span></span></li>
          <li className="flex gap-2.5"><Clock className="w-5 h-5 text-primary shrink-0" aria-hidden /><span><strong className="block text-foreground">Horário</strong><span className="text-muted-foreground">{contato.horario}</span></span></li>
          <li className="flex gap-2.5"><Phone className="w-5 h-5 text-primary shrink-0" aria-hidden /><span><strong className="block text-foreground">Telefone</strong><a href={contato.telefoneHref} className="text-muted-foreground underline underline-offset-2">{contato.telefone}</a></span></li>
          <li className="flex gap-2.5 min-w-0"><Mail className="w-5 h-5 text-primary shrink-0" aria-hidden /><span className="min-w-0"><strong className="block text-foreground">E-mail</strong><a href={`mailto:${contato.email}`} className="text-muted-foreground underline underline-offset-2 break-all">{contato.email}</a></span></li>
        </ul>
      </section>
    </PaginaDocumentoOficial>
  );
}
