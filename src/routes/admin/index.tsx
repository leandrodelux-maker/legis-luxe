import { createFileRoute } from "@tanstack/react-router";
import { 
  Users, 
  Newspaper, 
  Gavel, 
  Calendar, 
  FileText, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MessageSquare,
  Globe,
  Plus
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Line, LineChart, Tooltip } from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const stats = [
  { label: "Projetos em Tramitação", value: "124", trend: "+12%", icon: Gavel, color: "text-blue-600", bg: "bg-blue-600/10" },
  { label: "Sessões Realizadas", value: "48", trend: "+5%", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-600/10" },
  { label: "Novas Notícias", value: "12", trend: "Nesta semana", icon: Newspaper, color: "text-amber-600", bg: "bg-amber-600/10" },
  { label: "Protocolos Ouvidoria", value: "342", trend: "-8%", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-600/10" },
];

const activityData = [
  { name: "Seg", acessos: 450, protocolos: 12 },
  { name: "Ter", acessos: 520, protocolos: 18 },
  { name: "Qua", acessos: 480, protocolos: 15 },
  { name: "Qui", acessos: 610, protocolos: 22 },
  { name: "Sex", acessos: 550, protocolos: 14 },
  { name: "Sab", acessos: 210, protocolos: 5 },
  { name: "Dom", acessos: 150, protocolos: 2 },
];

const recentLogs = [
  { user: "Dra. Maria Clara", action: "Publicou nova notícia", target: "Inauguração da Praça Central", time: "Há 12 min", icon: Newspaper },
  { user: "Sistema", action: "Protocolo automático SIC", target: "#2026.4521", time: "Há 45 min", icon: Clock },
  { user: "João Silva", action: "Alterou status de projeto", target: "PL 124/2026", time: "Há 2 horas", icon: Gavel },
  { user: "Presidente", action: "Assinou ata de sessão", target: "Sessão Ordinária 09/06", time: "Há 4 horas", icon: FileText },
];

function AdminDashboard() {
  return (
    <div className="space-y-8 animate-[fade-up_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Bem-vindo ao sistema de gestão da Câmara Municipal.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <Globe className="w-4 h-4 mr-2" /> Ver Site
          </Button>
          <Button className="bg-primary-deep text-white hover:bg-primary-deep/90">
            <Plus className="w-4 h-4 mr-2" /> Novo Projeto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                {s.trend.startsWith('+') ? (
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold">
                    <ArrowUpRight className="w-3 h-3 mr-1" /> {s.trend}
                  </Badge>
                ) : s.trend.startsWith('-') ? (
                  <Badge className="bg-red-50 text-red-600 border-red-100 font-bold">
                    <ArrowDownRight className="w-3 h-3 mr-1" /> {s.trend}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-500">{s.trend}</Badge>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-3xl font-display font-bold text-slate-900 mt-1">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm p-6">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Audiência e Acessos</CardTitle>
              <CardDescription>Acessos ao portal nos últimos 7 dias</CardDescription>
            </div>
            <select className="text-sm bg-slate-100 border-none rounded-md px-2 h-8 outline-none font-medium">
              <option>Últimos 7 dias</option>
              <option>Último mês</option>
            </select>
          </CardHeader>
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="acessos" 
                  stroke="#1e3a8a" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1e3a8a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="font-display">Logs do Sistema</CardTitle>
            <CardDescription>Atividades recentes dos usuários</CardDescription>
          </CardHeader>
          <div className="space-y-6 mt-6">
            {recentLogs.map((log, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <log.icon className="w-5 h-5 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {log.user} <span className="font-medium text-slate-500">{log.action}</span>
                  </p>
                  <p className="text-xs text-primary font-medium mt-0.5">{log.target}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">{log.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-slate-500 hover:text-primary text-sm font-bold">
              Ver Logs Completos <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 pb-6">
        <Card className="border-none shadow-sm p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="font-display">Próximas Sessões</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {[
              { title: "Sessão Ordinária", date: "Hoje, às 14:00", status: "Confirmada", color: "bg-emerald-500" },
              { title: "Audiência Pública: LOA", date: "Quinta, às 19:00", status: "Confirmada", color: "bg-emerald-500" },
              { title: "Sessão Solene", date: "Sexta, às 19:30", status: "Aguardando", color: "bg-amber-500" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${s.color}`} />
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{s.title}</h4>
                    <p className="text-xs text-slate-500">{s.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-none shadow-sm p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="font-display">Protocolos Pendentes</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {[
              { id: "#2026.4521", type: "Ouvidoria", subject: "Reclamação: Buraco na via", time: "Há 45 min", priority: "Alta" },
              { id: "#2026.4522", type: "SIC", subject: "Pedido: Folha de Pagamento", time: "Há 2 horas", priority: "Normal" },
              { id: "#2026.4523", type: "Ouvidoria", subject: "Sugestão: Ciclovia", time: "Há 4 horas", priority: "Normal" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{p.type}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.subject}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">{p.time}</p>
                </div>
                <Badge className={p.priority === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}>
                  {p.priority}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
