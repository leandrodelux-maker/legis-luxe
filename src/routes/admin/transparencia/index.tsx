import { createFileRoute } from "@tanstack/react-router";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  BarChart, 
  Download, 
  Eye, 
  Edit, 
  MoreVertical,
  ArrowUpRight,
  TrendingUp,
  FileText
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/transparencia/")({
  component: AdminTransparencia,
});

const mockPublicacoes = [
  { id: 1, titulo: "Relatório de Gestão Fiscal - 1º Quadrimestre", categoria: "RGF", data: "05/06/2026", status: "Publicado" },
  { id: 2, titulo: "Folha de Pagamento - Maio 2026", categoria: "Pessoal", data: "01/06/2026", status: "Publicado" },
  { id: 3, titulo: "Edital de Licitação 012/2026", categoria: "Licitação", data: "28/05/2026", status: "Publicado" },
  { id: 4, titulo: "Balancete Mensal - Abril 2026", categoria: "Contas", data: "20/05/2026", status: "Publicado" },
];

function AdminTransparencia() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-[fade-up_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Transparência Ativa</h2>
          <p className="text-slate-500">Gestão de publicações legais e dados abertos.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <BarChart className="w-4 h-4 mr-2" /> Analíticos
          </Button>
          <Button className="bg-primary-deep text-white hover:bg-primary-deep/90">
            <Plus className="w-4 h-4 mr-2" /> Nova Publicação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Publicações Mês", value: "24", trend: "+15%", color: "text-blue-600" },
          { label: "Acessos Portal", value: "12.4k", trend: "+8%", color: "text-emerald-600" },
          { label: "Solicitações LAI", value: "08", trend: "-5%", color: "text-purple-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-3xl font-display font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <Badge className="bg-slate-50 text-slate-500">
                <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.trend}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="publicacoes" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-12 border border-slate-200">
          <TabsTrigger value="publicacoes" className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Publicações</TabsTrigger>
          <TabsTrigger value="lai" className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Pedidos LAI (SIC)</TabsTrigger>
          <TabsTrigger value="config" className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="publicacoes">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Buscar publicação..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" /> Download Lote
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Título da Publicação</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPublicacoes.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-bold text-slate-900">{p.titulo}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold text-[10px]">{p.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{p.data}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100">
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
