import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Banknote,
  Building2,
  FileText,
  Gavel,
  Receipt,
  ScrollText,
  ShieldCheck,
  Users,
  Search,
  Filter,
  Download,
  FileDown,
  Table as TableIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp,
  Car,
  HardHat,
  Briefcase,
  GraduationCap,
  Scale,
  Calendar,
  DollarSign,
  Package,
  Plane,
  PlusCircle,
  Clock
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, ResponsiveContainer, Line, LineChart, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/transparencia")({
  head: () => ({
    meta: [
      { title: "Portal da Transparência — Câmara Municipal" },
      {
        name: "description",
        content:
          "Consulte despesas, contratos, salários, licitações, obras e atos legislativos em tempo real.",
      },
    ],
  }),
  component: TransparenciaPage,
});

const menuItems = [
  { group: "Financeiro", items: [
    { icon: Banknote, title: "Receitas", desc: "Arrecadação municipal e repasses." },
    { icon: Receipt, title: "Despesas", desc: "Gastos, empenhos e liquidações." },
    { icon: Users, title: "Folha de Pagamento", desc: "Remuneração de servidores e agentes políticos." },
    { icon: Plane, title: "Diárias e Passagens", desc: "Gastos com deslocamentos oficiais." },
  ]},
  { group: "Contratações", items: [
    { icon: Gavel, title: "Licitações", desc: "Processos de compra e editais." },
    { icon: FileCheck, title: "Contratos", desc: "Instrumentos jurídicos e vigências." },
    { icon: PlusCircle, title: "Aditivos", desc: "Alterações em contratos vigentes." },
    { icon: HardHat, title: "Obras", desc: "Acompanhamento de obras públicas." },
  ]},
  { group: "Administrativo", items: [
    { icon: Package, title: "Patrimônio", desc: "Bens móveis e imóveis da Câmara." },
    { icon: Car, title: "Veículos", desc: "Frota oficial e consumo de combustível." },
    { icon: Briefcase, title: "Convênios", desc: "Acordos e parcerias firmadas." },
    { icon: GraduationCap, title: "Concursos", desc: "Editais e processos seletivos." },
  ]},
  { group: "Planejamento e Contas", items: [
    { icon: ScrollText, title: "PPA / LDO / LOA", desc: "Leis de planejamento orçamentário." },
    { icon: Scale, title: "RREO / RGF", desc: "Relatórios de gestão fiscal." },
    { icon: TableIcon, title: "Balancetes", desc: "Demonstrativos mensais de contas." },
    { icon: ShieldCheck, title: "Prestação de Contas", desc: "Relatórios anuais enviados ao TCE." },
  ]}
];

const indicadores = [
  { label: "Orçamento 2026", value: "R$ 24,5M", icon: Banknote, color: "text-blue-600" },
  { label: "Total Empenhado", value: "R$ 18,7M", icon: Receipt, color: "text-emerald-600" },
  { label: "Contratos Ativos", value: "42", icon: FileText, color: "text-amber-600" },
  { label: "Processos Licitatórios", value: "15", icon: Gavel, color: "text-purple-600" },
];

const chartData = [
  { name: "Jan", despesa: 1.2, receita: 2.1 },
  { name: "Fev", despesa: 1.5, receita: 1.9 },
  { name: "Mar", despesa: 1.8, receita: 2.4 },
  { name: "Abr", despesa: 2.1, receita: 2.2 },
  { name: "Mai", despesa: 1.9, receita: 2.8 },
  { name: "Jun", despesa: 2.3, receita: 2.5 },
];

const pizzaData = [
  { name: "Pessoal", value: 45, color: "#1e3a8a" },
  { name: "Serviços", value: 25, color: "#3b82f6" },
  { name: "Investimentos", value: 15, color: "#eab308" },
  { name: "Outros", value: 15, color: "#94a3b8" },
];

function TransparenciaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-deep via-primary to-primary-deep text-primary-foreground">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 skew-x-12 translate-x-1/2" />
        <div className="container-page relative py-16 md:py-24">
          <div className="text-xs uppercase tracking-[0.2em] text-gold flex items-center gap-3">
            <span className="gold-divider" /> Portal da Transparência · LAI
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold leading-tight">
            Transparência <span className="text-gold">Ativa</span>
          </h1>
          <p className="mt-6 max-w-2xl text-primary-foreground/85 text-lg">
            Acesso livre a todos os dados financeiros, administrativos e de gestão da Câmara Municipal em tempo real.
          </p>

          <div className="mt-12 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 h-5 w-5" />
              <Input 
                placeholder="Busca global (ex: licitação, folha, fornecedor...)" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 pl-12 rounded-xl focus:bg-white/15"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-14 px-8 bg-gold text-primary-deep hover:bg-gold/90 font-bold">
              Pesquisar
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page -mt-10 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indicadores.map((ind, i) => (
            <Card key={i} className="card-premium border-none shadow-xl animate-[fade-up_0.5s_ease-out_both]" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-secondary ${ind.color}`}>
                    <ind.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">{ind.label}</p>
                    <p className="text-2xl font-display font-bold text-foreground mt-1">{ind.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="dashboard" className="mt-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <TabsList className="bg-secondary/50 p-1 rounded-xl h-14 border border-border">
              <TabsTrigger value="dashboard" className="px-8 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full font-bold">
                <TrendingUp className="mr-2 h-4 w-4" /> Dashboards
              </TabsTrigger>
              <TabsTrigger value="menu" className="px-8 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full font-bold">
                <TableIcon className="mr-2 h-4 w-4" /> Módulos
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground mr-2">EXPORTAR:</span>
              <Button variant="outline" size="sm" className="h-9 px-4 gap-2">
                <FileDown className="h-4 w-4 text-red-500" /> PDF
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-4 gap-2">
                <FileText className="h-4 w-4 text-emerald-600" /> Excel
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-4 gap-2">
                <TableIcon className="h-4 w-4 text-blue-600" /> CSV
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-6 animate-[fade-up_0.5s_ease-out]">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 card-premium p-6">
                <CardHeader className="px-0 pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="font-display text-xl">Execução Orçamentária</CardTitle>
                      <CardDescription>Receita vs Despesa (Milhões R$)</CardDescription>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <div className="w-3 h-3 rounded-full bg-blue-600" /> Receita
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" /> Despesa
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f1f5f9' }}
                      />
                      <Bar dataKey="receita" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="despesa" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="card-premium p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="font-display text-xl">Gastos por Categoria</CardTitle>
                  <CardDescription>Distribuição percentual</CardDescription>
                </CardHeader>
                <div className="h-[300px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pizzaData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pizzaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <p className="text-2xl font-bold">100%</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Total</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {pizzaData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-premium p-6 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg text-white">
                    <Filter className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-700">FILTRAR</Badge>
                </div>
                <h4 className="font-bold text-sm mb-2">Exercício</h4>
                <select className="w-full bg-background border border-border rounded-md h-9 text-sm px-2 outline-none">
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                </select>
              </div>

              <div className="card-premium p-6 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-600 rounded-lg text-white">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-700">MENSAL</Badge>
                </div>
                <h4 className="font-bold text-sm mb-2">Período</h4>
                <select className="w-full bg-background border border-border rounded-md h-9 text-sm px-2 outline-none">
                  <option>Janeiro a Junho</option>
                  <option>Janeiro a Dezembro</option>
                </select>
              </div>

              <div className="card-premium p-6 bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-600 rounded-lg text-white">
                    <Users className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-700">ENTIDADE</Badge>
                </div>
                <h4 className="font-bold text-sm mb-2">Unidade</h4>
                <select className="w-full bg-background border border-border rounded-md h-9 text-sm px-2 outline-none">
                  <option>Câmara Municipal</option>
                  <option>Prefeitura (Link)</option>
                </select>
              </div>

              <div className="card-premium p-6 bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-600 rounded-lg text-white">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-purple-200 text-purple-700">RANGES</Badge>
                </div>
                <h4 className="font-bold text-sm mb-2">Valor Mínimo</h4>
                <Input placeholder="R$ 0,00" className="h-9 text-sm" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="animate-[fade-up_0.5s_ease-out]">
            <div className="space-y-12">
              {menuItems.map((group, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="font-display text-2xl font-bold">{group.group}</h3>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {group.items.map((item, i) => (
                      <a
                        key={item.title}
                        href="#"
                        className="card-premium card-premium-hover group p-6 border-border/60"
                      >
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <item.icon className="h-6 w-6" />
                        </div>
                        <h4 className="mt-5 font-display text-lg font-bold text-foreground">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {item.desc}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                          Acessar Dados <ArrowRight className="h-4 w-4" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="bg-primary-deep text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="container-page relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-gold text-primary-deep font-bold mb-4">IMPORTANTE</Badge>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Ajude a fiscalizar</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                A transparência é um direito do cidadão e um dever do Estado. Se você não encontrar a informação que procura, pode solicitar via LAI (Lei de Acesso à Informação).
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-primary-deep hover:bg-white/90 font-bold px-8">
                  Solicitar Informação <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 font-bold px-8">
                  Guia do Usuário
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Atualização", value: "Em tempo real", icon: Clock },
                { label: "Auditado por", value: "TCE / MPC", icon: ShieldCheck },
                { label: "Conformidade", value: "100% LAI", icon: FileCheck },
                { label: "Acessibilidade", value: "WCAG 2.1", icon: Users },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <item.icon className="h-6 w-6 text-gold mb-4" />
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{item.label}</p>
                  <p className="text-lg font-bold text-white mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FileCheck(props: any) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}
