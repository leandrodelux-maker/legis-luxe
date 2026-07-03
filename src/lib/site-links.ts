// Central registry of public site sections. New pages should be added here
// so that they appear automatically no Mapa do Site, no sitemap.xml e no rodapé.

export type SiteLink = {
  to: string;
  label: string;
  description?: string;
  external?: boolean;
};

export type SiteSection = {
  title: string;
  links: SiteLink[];
};

export const SITE_SECTIONS: SiteSection[] = [
  {
    title: "Institucional",
    links: [
      { to: "/", label: "Página Inicial", description: "Portal oficial da Câmara Municipal." },
      { to: "/vereadores", label: "Vereadores", description: "Conheça os parlamentares em exercício." },
      { to: "/vereadores/ranking", label: "Ranking de Vereadores", description: "Presença, projetos e participação." },
      { to: "/sessoes", label: "Sessões e Pautas", description: "Ordem do dia, atas e transmissões." },
      { to: "/sessoes/ao-vivo", label: "Sessões ao Vivo", description: "Transmissão em tempo real das sessões." },
      { to: "/noticias", label: "Notícias", description: "Últimas notícias e comunicados oficiais." },
      { to: "/projetos", label: "Projetos de Lei", description: "Proposições em tramitação e aprovadas." },
    ],
  },
  {
    title: "Transparência",
    links: [
      { to: "/transparencia-portal", label: "Portal da Transparência", description: "Receitas, despesas, contratos e servidores." },
    ],
  },
  {
    title: "Serviços ao Cidadão",
    links: [
      { to: "/contato", label: "Contato e Ouvidoria", description: "Canais oficiais de atendimento." },
      { to: "/e-sic", label: "e-SIC", description: "Serviço de Informação ao Cidadão (Lei nº 12.527/2011)." },
      { to: "/perguntas-frequentes", label: "Perguntas Frequentes", description: "Dúvidas mais comuns sobre a Câmara e serviços." },
    ],
  },
  {
    title: "Privacidade e Acessibilidade",
    links: [
      { to: "/lgpd", label: "LGPD", description: "Lei Geral de Proteção de Dados Pessoais." },
      { to: "/mapa-do-site", label: "Mapa do Site", description: "Todas as páginas e serviços deste portal." },
    ],
  },
];

// Achatado (útil para sitemap.xml e buscas).
export const ALL_SITE_LINKS: SiteLink[] = SITE_SECTIONS.flatMap((s) => s.links);
