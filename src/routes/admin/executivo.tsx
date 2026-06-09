import { createFileRoute } from "@tanstack/react-router";
import { 
  Users, 
  Gavel, 
  Calendar, 
  FileText, 
  Download,
  Filter,
  Users2,
  CheckCircle2,
  Clock3,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Award
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  ResponsiveContainer, 
  Line, 
  LineChart, 
  Tooltip,
  Cell,
  Pie,
  PieChart,
  Legend
} from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/admin/executivo")({
  component: ExecutiveDashboard,
});

const comparativeData = [
  { name: "Jan", projetos: 12, sessoes: 4, requerimentos: 25 },
  { name: "Fev", projetos: 18, sessoes: 4, requerimentos: 32 },
  { name: "Mar", projetos: 15, sessoes: 5, requerimentos: 28 },
  { name: "Abr", projetos: 22, sessoes: 4, requerimentos: 45 },
  { name: "Mai", projetos: 20, sessoes: 6, requerimentos: 38 },
  { name: "Jun", projetos: 14, sessoes: 2, requerimentos: 22 },
];

const participationData = [
  { name: "Presentes", value: 85, fill: "#1e3a8a" },
  { name: "Ausentes Justificados", value: 10, fill: "#eab308" },
  { name: "Ausentes s/ Justificativa", value: 5, fill: "#ef4444" },
];

const topVereadores = [
  { name: "Ver. João Silva", projetos: 12, presenca: "98%" },
  { name: "Ver. Maria Souza", projetos: 10, presenca: "95%" },
  { name: "Ver. Pedro Rocha", projetos: 9, presenca: "100%" },
  { name: "Ver. Ana Lima", projetos: 8, presenca: "92%" },
];

function ExecutiveDashboard() {
  const [period, setPeriod] = useState("annual");

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-[fade-up_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Painel Executivo da Presidência</h2>
          <p className="text-slate-500">Indicadores estratégicos e desempenho legislativo.</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-white border-slate-200">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="annual">Anual</SelectItem>
              <SelectItem value="mandate">Mandato</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportPDF} className="bg-primary-deep text-white hover:bg-primary-deep/90 gap-2">
            <Download className="w-4 h-4" /> Exportar Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                <Gavel className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total de Projetos</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-display font-bold text-slate-900">101</p>
                  <span className="text-emerald-500 text-xs font-bold">+15% vs período anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sessões Realizadas</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-display font-bold text-slate-900">25</p>
                  <span className="text-slate-400 text-xs font-bold">100% de execução</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-amber-50 text-amber-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Média de Presença</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-display font-bold text-slate-900">92.4%</p>
                  <span className="text-emerald-500 text-xs font-bold">Meta: 90%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Comparativo de Atividades
            </CardTitle>
            <CardDescription>Produção legislativa mensal</CardDescription>
          </CardHeader>
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="projetos" name="Projetos" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="requerimentos" name="Requerimentos" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="font-display flex items-center gap-2">
              <Users2 className="w-5 h-5 text-primary" />
              Participação Global
            </CardTitle>
            <CardDescription>Percentual de presença em plenário</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={participationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {participationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Requerimentos Totais</span>
              <span className="font-bold">190</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Indicações</span>
              <span className="font-bold">245</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 pb-6">
        <Card className="border-none shadow-sm p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="font-display flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              Liderança em Produção
            </CardTitle>
            <CardDescription>Vereadores com maior número de projetos</CardDescription>
          </CardHeader>
          <div className="mt-6 space-y-6">
            {topVereadores.map((v, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{v.name}</h4>
                    <p className="text-xs text-slate-500">{v.projetos} projetos apresentados</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{v.presenca}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Presença</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-none shadow-sm p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="font-display flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-primary" />
              Evolução das Sessões
            </CardTitle>
            <CardDescription>Regularidade das reuniões legislativas</CardDescription>
          </CardHeader>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparativeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sessoes" 
                  stroke="#1e3a8a" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1e3a8a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
