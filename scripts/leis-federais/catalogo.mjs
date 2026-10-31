// Leis federais exibidas em Legislação Federal: as que o Portal da Transparência (Megasoft) lista
// (noPortal: true) e as demais que regem a transparência, as finanças e o controle do município.
// O texto oficial é copiado do Portal da Legislação do Planalto por gerar.mjs.

export const CATEGORIAS = [
  { id: "transparencia", nome: "Transparência e acesso à informação" },
  { id: "financas", nome: "Finanças públicas e responsabilidade fiscal" },
  { id: "compras", nome: "Compras, contratos e convênios" },
  { id: "controle", nome: "Controle, integridade e direitos do cidadão" },
];

const P = "https://www.planalto.gov.br/ccivil_03/";

export const LEIS = [
  {
    slug: "constituicao-federal", tipo: "Constituição", categoria: "transparencia", noPortal: true,
    titulo: "Constituição da República Federativa do Brasil de 1988", apelido: "Constituição Federal",
    resumo: "Princípios da administração pública (art. 37), servidores (arts. 38 a 41) e finanças públicas (art. 163). Base de toda a transparência.",
    url: P + "constituicao/constituicao.htm", artigos: [37, 38, 39, 40, 41, 163],
  },
  {
    slug: "lei-12527-2011", tipo: "Lei", categoria: "transparencia", noPortal: true,
    titulo: "Lei nº 12.527, de 18 de novembro de 2011", apelido: "Lei de Acesso à Informação (LAI)",
    resumo: "Garante a qualquer pessoa o direito de pedir e receber informações públicas, e obriga a divulgação ativa na internet.",
    url: P + "_ato2011-2014/2011/lei/l12527.htm",
  },
  {
    slug: "decreto-7724-2012", tipo: "Decreto", categoria: "transparencia", noPortal: true,
    titulo: "Decreto nº 7.724, de 16 de maio de 2012", apelido: "Regulamento da LAI",
    resumo: "Regulamenta a Lei de Acesso à Informação: prazos, recursos e o que deve estar publicado nos sites oficiais.",
    url: P + "_ato2011-2014/2012/decreto/d7724.htm",
  },
  {
    slug: "lc-131-2009", tipo: "Lei Complementar", categoria: "transparencia", noPortal: true,
    titulo: "Lei Complementar nº 131, de 27 de maio de 2009", apelido: "Lei da Transparência",
    resumo: "Obriga a divulgação, em tempo real e na internet, das receitas e despesas de União, estados e municípios.",
    url: P + "leis/lcp/lcp131.htm",
  },
  {
    slug: "decreto-7185-2010", tipo: "Decreto", categoria: "transparencia", noPortal: true,
    titulo: "Decreto nº 7.185, de 27 de maio de 2010", apelido: "Padrão de qualidade da informação",
    resumo: "Define o padrão mínimo do sistema de administração financeira e de controle para a transparência em tempo real.",
    url: P + "_ato2007-2010/2010/decreto/d7185.htm",
  },
  {
    slug: "portaria-mf-548-2010", tipo: "Portaria", categoria: "transparencia", noPortal: true,
    titulo: "Portaria MF nº 548, de 22 de novembro de 2010", apelido: "Requisitos do sistema de transparência",
    resumo: "Estabelece os requisitos mínimos de segurança e contábeis dos sistemas que alimentam os portais de transparência.",
    url: "http://www.leidatransparencia.cnm.org.br/img/download/Portaria_MF_n_548_2010.pdf", pdf: true,
  },
  {
    slug: "lei-14129-2021", tipo: "Lei", categoria: "transparencia", noPortal: true,
    titulo: "Lei nº 14.129, de 29 de março de 2021", apelido: "Lei do Governo Digital",
    resumo: "Princípios e regras para o governo digital: serviços públicos pela internet, dados abertos e eficiência.",
    url: P + "_ato2019-2022/2021/lei/l14129.htm",
  },
  {
    slug: "lei-9755-1998", tipo: "Lei", categoria: "transparencia",
    titulo: "Lei nº 9.755, de 16 de dezembro de 1998", apelido: "Contas públicas na internet",
    resumo: "Cria a página do Tribunal de Contas da União na internet com os dados das contas públicas de todos os entes.",
    url: P + "leis/l9755.htm",
  },
  {
    slug: "lc-101-2000", tipo: "Lei Complementar", categoria: "financas", noPortal: true,
    titulo: "Lei Complementar nº 101, de 4 de maio de 2000", apelido: "Lei de Responsabilidade Fiscal (LRF)",
    resumo: "Normas de finanças públicas: limites de gastos com pessoal e dívida, metas fiscais e os relatórios RREO e RGF.",
    url: P + "leis/lcp/lcp101.htm",
  },
  {
    slug: "lei-4320-1964", tipo: "Lei", categoria: "financas",
    titulo: "Lei nº 4.320, de 17 de março de 1964", apelido: "Lei do Orçamento Público",
    resumo: "Normas gerais de direito financeiro para elaborar e controlar orçamentos e balanços públicos.",
    url: P + "leis/l4320.htm",
  },
  {
    slug: "decreto-10540-2020", tipo: "Decreto", categoria: "financas",
    titulo: "Decreto nº 10.540, de 5 de novembro de 2020", apelido: "SIAFIC",
    resumo: "Padrão mínimo de qualidade do sistema único e integrado de execução orçamentária, financeira e contábil.",
    url: P + "_ato2019-2022/2020/decreto/d10540.htm",
  },
  {
    slug: "lei-10028-2000", tipo: "Lei", categoria: "financas",
    titulo: "Lei nº 10.028, de 19 de outubro de 2000", apelido: "Crimes contra as finanças públicas",
    resumo: "Define os crimes e infrações contra as finanças públicas, complementando a Lei de Responsabilidade Fiscal.",
    url: P + "leis/l10028.htm",
  },
  {
    slug: "lei-14133-2021", tipo: "Lei", categoria: "compras",
    titulo: "Lei nº 14.133, de 1º de abril de 2021", apelido: "Nova Lei de Licitações e Contratos",
    resumo: "Regras de licitações e contratos, com publicação obrigatória no Portal Nacional de Contratações Públicas (PNCP).",
    url: P + "_ato2019-2022/2021/lei/l14133.htm",
  },
  {
    slug: "decreto-6170-2007", tipo: "Decreto", categoria: "compras", noPortal: true,
    titulo: "Decreto nº 6.170, de 25 de julho de 2007", apelido: "Convênios e transferências",
    resumo: "Normas sobre transferências de recursos da União por meio de convênios e contratos de repasse.",
    url: P + "_ato2007-2010/2007/decreto/d6170.htm",
  },
  {
    slug: "decreto-7592-2011", tipo: "Decreto", categoria: "compras", noPortal: true,
    titulo: "Decreto nº 7.592, de 28 de outubro de 2011", apelido: "Convênios com entidades privadas",
    resumo: "Avaliação da regularidade dos convênios firmados com entidades privadas sem fins lucrativos.",
    url: P + "_ato2011-2014/2011/decreto/d7592.htm",
  },
  {
    slug: "decreto-5482-2005", tipo: "Decreto", categoria: "transparencia", noPortal: true,
    titulo: "Decreto nº 5.482, de 30 de junho de 2005", apelido: "Portal da Transparência federal",
    resumo: "Dispõe sobre a divulgação de dados e informações pelos órgãos federais por meio da internet.",
    url: P + "_ato2004-2006/2005/decreto/d5482.htm",
  },
  {
    slug: "lei-13709-2018", tipo: "Lei", categoria: "controle",
    titulo: "Lei nº 13.709, de 14 de agosto de 2018", apelido: "Lei Geral de Proteção de Dados (LGPD)",
    resumo: "Regras para o tratamento de dados pessoais, inclusive pelo poder público, com respeito à privacidade.",
    url: P + "_ato2015-2018/2018/lei/l13709.htm",
  },
  {
    slug: "lei-13460-2017", tipo: "Lei", categoria: "controle",
    titulo: "Lei nº 13.460, de 26 de junho de 2017", apelido: "Código de Defesa do Usuário do Serviço Público",
    resumo: "Direitos de quem usa serviços públicos, ouvidorias e a Carta de Serviços ao Usuário.",
    url: P + "_ato2015-2018/2017/lei/l13460.htm",
  },
  {
    slug: "lei-8429-1992", tipo: "Lei", categoria: "controle",
    titulo: "Lei nº 8.429, de 2 de junho de 1992", apelido: "Lei de Improbidade Administrativa",
    resumo: "Sanções a agentes públicos e terceiros por atos de improbidade que causem dano ao patrimônio público.",
    url: P + "leis/l8429.htm",
  },
  {
    slug: "lei-12846-2013", tipo: "Lei", categoria: "controle",
    titulo: "Lei nº 12.846, de 1º de agosto de 2013", apelido: "Lei Anticorrupção",
    resumo: "Responsabiliza empresas por atos contra a administração pública, nacional ou estrangeira.",
    url: P + "_ato2011-2014/2013/lei/l12846.htm",
  },
];
