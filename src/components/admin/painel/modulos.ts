import {
  BookOpen,
  Building2,
  Calendar,
  Crown,
  FileEdit,
  Gavel,
  Globe,
  Image as ImageIcon,
  Landmark,
  LayoutDashboard,
  Library,
  Mail,
  Megaphone,
  MessageSquare,
  Newspaper,
  Palette,
  Radar,
  Scale,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

// Mapa do painel, como os temas da Transparência: cada grupo tem cor e ícone próprios,
// usados no menu, no cabeçalho das páginas, nos formulários e na busca.
// As cores têm contraste de pelo menos 4,5:1 com texto branco.

export type Modulo = { label: string; path: string; icone: LucideIcon; desc: string; site?: string };
export type GrupoModulos = { id: string; label: string; cor: string; icone: LucideIcon; itens: Modulo[] };

export const GRUPOS: GrupoModulos[] = [
  {
    id: "geral",
    label: "Visão Geral",
    cor: "#14505F",
    icone: LayoutDashboard,
    itens: [{ label: "Início", path: "/admin/dashboard", icone: LayoutDashboard, desc: "O que precisa da sua atenção hoje.", site: "/" }],
  },
  {
    id: "legislativo",
    label: "Legislativo",
    cor: "#1F5FBF",
    icone: Landmark,
    itens: [
      { label: "Projetos", path: "/admin/projetos", icone: Gavel, desc: "Projetos de lei, indicações e demais proposições, do protocolo à sanção.", site: "/projetos" },
      { label: "Sessões", path: "/admin/sessoes", icone: Calendar, desc: "Agenda, pauta, presença, votos e ata de cada sessão plenária.", site: "/sessoes" },
      { label: "Vereadores", path: "/admin/vereadores", icone: Users, desc: "Dados, foto, contato e mandato de cada parlamentar.", site: "/vereadores" },
      { label: "Mandatos", path: "/admin/vereadores/mandatos", icone: ScrollText, desc: "Histórico de mandatos exibido no perfil de cada vereador." },
      { label: "Galeria dos Vereadores", path: "/admin/vereadores/galeria", icone: ImageIcon, desc: "Imagens exibidas no perfil de cada vereador." },
      { label: "Mesa Diretora", path: "/admin/mesa-diretora", icone: Crown, desc: "Membros da Mesa exibidos em A Câmara e na página inicial.", site: "/a-camara/mesa-diretora" },
      { label: "Comissões", path: "/admin/comissoes", icone: Scale, desc: "Comissões permanentes e suas competências.", site: "/a-camara/comissoes" },
      { label: "Membros das Comissões", path: "/admin/comissoes-membros", icone: UsersRound, desc: "Quem compõe cada comissão e em qual função.", site: "/a-camara/comissoes" },
      { label: "Publicações", path: "/admin/publicacoes", icone: Library, desc: "Legislação, atos, pautas de comissões e publicações exibidas na Transparência.", site: "/transparencia/tema/legislacao" },
      { label: "Matriz Atricon", path: "/admin/matriz-atricon", icone: Radar, desc: "Critérios da avaliação de transparência e o link de cada informação no site.", site: "/transparencia/atricon" },
      { label: "Documentos Oficiais", path: "/admin/documentos-oficiais", icone: BookOpen, desc: "Carta de Serviços, Lei Orgânica e Regimento Interno." },
    ],
  },
  {
    id: "comunicacao",
    label: "Comunicação",
    cor: "#A8540F",
    icone: Megaphone,
    itens: [
      { label: "Notícias", path: "/admin/noticias", icone: Newspaper, desc: "Escreva, publique e destaque as notícias do site.", site: "/noticias" },
      { label: "Categorias", path: "/admin/cms/categorias", icone: FileEdit, desc: "Assuntos usados para organizar as notícias.", site: "/noticias" },
      { label: "Acesso Rápido", path: "/admin/acesso-rapido", icone: Globe, desc: "Atalhos da seção Acesso Rápido da página inicial.", site: "/" },
    ],
  },
  {
    id: "atendimento",
    label: "Atendimento",
    cor: "#0B7A4B",
    icone: MessageSquare,
    itens: [
      { label: "Ouvidoria", path: "/admin/cms/ouvidoria", icone: MessageSquare, desc: "Denúncias, reclamações, sugestões, elogios e solicitações do cidadão.", site: "/contato" },
      { label: "e-SIC", path: "/admin/cms/esic", icone: Mail, desc: "Pedidos de acesso à informação, com o prazo legal da LAI.", site: "/e-sic" },
    ],
  },
  {
    id: "sistema",
    label: "Sistema",
    cor: "#5B45B0",
    icone: Settings,
    itens: [
      { label: "Dados da Câmara", path: "/admin/configuracoes/geral", icone: Building2, desc: "Nome, contatos e redes sociais usados em todo o site." },
      { label: "Página Inicial e Logotipos", path: "/admin/configuracoes-site", icone: Palette, desc: "Abertura do site, logotipos e transmissão ao vivo.", site: "/" },
      { label: "Usuários e Permissões", path: "/admin/usuarios", icone: ShieldCheck, desc: "Quem acessa o painel e o que cada pessoa pode fazer." },
    ],
  },
];

const TODOS = GRUPOS.flatMap((g) => g.itens.map((m) => ({ ...m, grupo: g })));

/** O módulo da rota: vence o caminho mais longo, pois Mandatos fica dentro de Vereadores. */
export function moduloDaRota(pathname: string) {
  return TODOS.filter((m) => pathname === m.path || pathname.startsWith(`${m.path}/`)).sort((a, b) => b.path.length - a.path.length)[0];
}

export const TODOS_MODULOS = TODOS;
