import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ExternalLink, Landmark, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth, signOut } from "@/hooks/use-supabase-auth";
import { supabase } from "@/integrations/supabase/client";
import { GRUPOS, moduloDaRota } from "@/components/admin/painel/modulos";

const FUNDO = "bg-[oklch(0.24_0.05_225)]";

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, isAdmin } = useSupabaseAuth();
  const [pendentes, setPendentes] = useState<Record<string, number>>({});

  const displayName = user?.user_metadata?.full_name || user?.email || "Administrador";
  const initials = displayName.split(" ").map((p: string) => p[0]).slice(0, 2).join("").toUpperCase();
  const ativo = moduloDaRota(pathname)?.path;

  // Pedidos em aberto aparecem no próprio menu.
  useEffect(() => {
    const contar = (tabela: string, situacoes: string[]) =>
      (supabase as any).from(tabela).select("id", { count: "exact", head: true }).in("status", situacoes).then((r: any) => (r.count as number | null) ?? 0);
    Promise.all([contar("ouvidoria_protocolos", ["aberto", "em_andamento"]), contar("esic_solicitacoes", ["pendente", "analise", "prorrogado"])]).then(([o, e]) =>
      setPendentes({ "/admin/cms/ouvidoria": o, "/admin/cms/esic": e }),
    );
  }, [pathname]);

  const logout = async () => {
    await signOut();
    navigate({ to: "/auth" });
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 [&>div[data-sidebar=sidebar]]:bg-[oklch(0.24_0.05_225)] [&>div[data-sidebar=sidebar]]:text-white">
      <SidebarHeader className={`border-b border-white/10 ${FUNDO}`}>
        <Link to="/admin/dashboard" className="flex items-center gap-3 px-1 py-2 rounded-lg focus-visible:outline-2 focus-visible:outline-white">
          <span className="w-9 h-9 rounded-xl bg-gold grid place-items-center shrink-0">
            <Landmark className="w-5 h-5 text-gold-foreground" aria-hidden />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block font-display font-bold text-sm leading-tight text-white truncate">Câmara de Adelândia</span>
              <span className="block text-xs text-white/70">Painel de gestão</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className={FUNDO}>
        {GRUPOS.map((g) => (
          <SidebarGroup key={g.id} className="py-1">
            {g.id !== "geral" && <SidebarGroupLabel className="text-white/70 text-xs font-semibold">{g.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {g.itens.map((item) => {
                  const atual = ativo === item.path;
                  const n = pendentes[item.path] ?? 0;
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={atual}
                        tooltip={item.label}
                        className="h-9 text-white/90 hover:bg-white/10 hover:text-white active:bg-white/15 active:text-white data-[active=true]:bg-white data-[active=true]:font-semibold data-[active=true]:text-[oklch(0.24_0.05_225)]"
                      >
                        <Link to={item.path} aria-current={atual ? "page" : undefined}>
                          <span className="w-6 h-6 rounded-md grid place-items-center shrink-0 -ml-1" style={{ backgroundColor: g.cor }}>
                            <item.icone className="w-3.5 h-3.5 text-white" aria-hidden />
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      {n > 0 && (
                        <SidebarMenuBadge className="bg-gold text-gold-foreground font-bold rounded-full peer-data-[active=true]/menu-button:text-gold-foreground peer-hover/menu-button:text-gold-foreground">
                          {n}
                          <span className="sr-only"> em aberto</span>
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className={`border-t border-white/10 ${FUNDO}`}>
        {!collapsed && (
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white/90 hover:bg-white/10">
            <ExternalLink className="w-4 h-4" aria-hidden /> Ver o site
          </a>
        )}
        <div className={`flex items-center gap-2.5 p-1 ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="bg-white/15 text-white text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                <p className="text-xs text-white/70">{isAdmin ? "Equipe da Câmara" : "Acesso"}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Sair do painel" title="Sair" className="text-white/90 hover:bg-white/10 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
