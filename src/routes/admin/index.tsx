import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
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
  Bell, 
  UserCircle,
  Menu,
  X,
  Search,
  ChevronRight,
  Database,
  History,
  Lock
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin/")({
  component: AdminLayout,
});

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin", roles: ["all"] },
  { label: "Vereadores", icon: Users, path: "/admin/vereadores", roles: ["admin", "presidente", "legislativo"] },
  { label: "Processo Legislativo", icon: Gavel, path: "/admin/projetos", roles: ["admin", "legislativo"] },
  { label: "Sessões", icon: Calendar, path: "/admin/sessoes", roles: ["admin", "legislativo"] },
  { label: "Notícias e Banners", icon: Newspaper, path: "/admin/comunicacao", roles: ["admin", "comunicacao"] },
  { label: "Transparência", icon: ShieldCheck, path: "/admin/transparencia", roles: ["admin", "transparencia", "controle"] },
  { label: "Documentos e Atas", icon: FileText, path: "/admin/documentos", roles: ["admin", "legislativo"] },
  { label: "Logs e Histórico", icon: History, path: "/admin/logs", roles: ["admin", "controle"] },
  { label: "Configurações", icon: Settings, path: "/admin/config", roles: ["admin"] },
];

function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Mock User Role
  const user = {
    name: "Dr. Ricardo Oliveira",
    role: "Administrador Geral",
    roleKey: "admin",
    avatar: null
  };

  const logout = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-primary-deep text-white shrink-0">
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
              <ShieldCheck className="text-primary-deep w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-none">PAINEL</h1>
              <span className="text-[10px] uppercase tracking-widest text-white/50">Legislativo Municipal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 text-white/70 hover:text-white group [&.active]:bg-gold [&.active]:text-primary-deep"
              activeProps={{ className: "active" }}
            >
              <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
              <span className="font-medium">{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-gold/50">
                <AvatarFallback className="bg-primary text-white font-bold">RO</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{user.name}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-tighter">{user.role}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="w-full bg-transparent border-white/10 text-white hover:bg-white/10 transition-all gap-2"
            >
              <LogOut className="w-4 h-4" /> Sair do Painel
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <Database className="w-4 h-4" />
              <span>Banco de Dados: <span className="font-bold text-emerald-600">Conectado</span></span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden sm:flex relative w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Buscar no sistema..." className="pl-10 h-10 bg-slate-100 border-none focus:bg-white" />
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
              
              <div className="h-8 w-px bg-slate-200" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 h-auto flex items-center gap-2 hover:bg-slate-100 rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary-deep text-white text-xs">RO</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block font-bold text-sm text-slate-700">{user.name.split(' ')[1]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 h-4 w-4" /> Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Lock className="mr-2 h-4 w-4" /> Segurança
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-primary-deep/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-80 bg-primary-deep text-white p-8 flex flex-col animate-[slide-in-left_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                  <ShieldCheck className="text-primary-deep w-5 h-5" />
                </div>
                <h1 className="font-display font-bold text-lg">PAINEL</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-white/70 hover:bg-white/5 active:bg-gold active:text-primary-deep"
                >
                  <item.icon className="w-6 h-6" />
                  <span className="font-bold">{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
