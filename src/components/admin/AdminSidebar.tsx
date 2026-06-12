import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Gavel,
  Calendar,
  ShieldCheck,
  FileText,
  Settings,
  LogOut,
  Globe,
  BarChart3,
  Palette,
  Home as HomeIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Cookie,
  ChevronDown,
  Building2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth, signOut } from "@/hooks/use-supabase-auth";

type Item = { label: string; path: string; icon: any };
type Group = { label: string; items: Item[] };

const groups: Group[] = [
  {
    label: "Visão Geral",
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Painel Executivo", path: "/admin/executivo", icon: BarChart3 },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      { label: "Vereadores", path: "/admin/vereadores", icon: Users },
      { label: "Mandatos", path: "/admin/vereadores/mandatos", icon: Users },
      { label: "Galeria", path: "/admin/vereadores/galeria", icon: Users },
      { label: "Projetos", path: "/admin/projetos", icon: Gavel },
      { label: "Sessões", path: "/admin/sessoes", icon: Calendar },
      { label: "Notícias", path: "/admin/comunicacao", icon: Newspaper },
      { label: "Acesso Rápido", path: "/admin/acesso-rapido", icon: Globe },
      { label: "Transparência", path: "/admin/transparencia", icon: ShieldCheck },
    ],
  },
];

const configSub: Item[] = [
  { label: "Geral", path: "/admin/configuracoes/geral", icon: Building2 },
  { label: "Identidade Visual", path: "/admin/configuracoes/identidade", icon: Palette },
  { label: "Home Page", path: "/admin/configuracoes/home", icon: HomeIcon },
  { label: "Menu do Site", path: "/admin/configuracoes/menu", icon: MenuIcon },
  { label: "SEO", path: "/admin/configuracoes/seo", icon: SearchIcon },
  { label: "LGPD", path: "/admin/configuracoes/lgpd", icon: Cookie },
  { label: "Hero & Mídia", path: "/admin/configuracoes-site", icon: FileText },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  const displayName = user?.user_metadata?.full_name || user?.email || "Administrador";
  const initials = displayName.split(" ").map((p: string) => p[0]).slice(0, 2).join("").toUpperCase();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");
  const configOpenDefault = configSub.some((i) => isActive(i.path));

  const logout = async () => {
    await signOut();
    navigate({ to: "/auth" });
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 bg-primary-deep">
        <Link to="/" className="flex items-center gap-3 px-2 py-3">
          <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center shrink-0">
            <ShieldCheck className="text-primary-deep w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-display font-bold text-sm leading-none text-white truncate">PAINEL</h1>
              <span className="text-[9px] uppercase tracking-widest text-white/50">Câmara Municipal</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.label}>
                      <Link to={item.path}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen={configOpenDefault} className="group/coll">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Configurações" isActive={configOpenDefault}>
                      <Settings className="w-4 h-4" />
                      <span>Configurações</span>
                      <ChevronDown className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/coll:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {configSub.map((sub) => (
                        <SidebarMenuSubItem key={sub.path}>
                          <SidebarMenuSubButton asChild isActive={isActive(sub.path)}>
                            <Link to={sub.path}>
                              <sub.icon className="w-3.5 h-3.5" />
                              <span>{sub.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200">
        <div className={`flex items-center gap-3 p-2 ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="bg-primary-deep text-white text-xs">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-500">Administrador</p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 shrink-0" title="Sair">
              <LogOut className="w-4 h-4 text-slate-600" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
