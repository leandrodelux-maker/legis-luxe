import { createFileRoute } from "@tanstack/react-router";
import { 
  Gavel, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  FileText, 
  History,
  MoreVertical,
  ArrowRight
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin/projetos/")({
  component: AdminProjetos,
});

const mockProjetos = [
  { id: 1, numero: "124/2026", tipo: "PL", titulo: "Programa de Incentivo à Leitura", autor: "Ver. Mariana Souza", status: "Comissão", data: "01/06/2026" },
  { id: 2, numero: "118/2026", tipo: "PL", titulo: "Prevenção à Violência Doméstica", autor: "Ver. Patrícia Ribeiro", status: "Plenário", data: "28/05/2026" },
  { id: 3, numero: "045/2026", tipo: "IND", titulo: "Manutenção na Rua das Palmeiras", autor: "Ver. Roberto Mendes", status: "Finalizado", data: "25/05/2026" },
  { id: 4, numero: "097/2026", tipo: "PL", titulo: "Hortas Comunitárias", autor: "Ver. Juliana Martins", status: "Sancionado", data: "20/05/2026" },
];

function AdminProjetos() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-[fade-up_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Processo Legislativo</h2>
          <p className="text-slate-500">Gestão de projetos, indicações e tramitações.</p>
        </div>
        <Button className="bg-primary-deep text-white hover:bg-primary-deep/90">
          <Plus className="w-4 h-4 mr-2" /> Nova Matéria
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por número ou título..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" /> Filtrar
            </Button>
            <Button variant="outline" size="sm">
              Relatórios
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nº Matéria</TableHead>
              <TableHead>Título / Ementa</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Protocolo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProjetos.map((p) => (
              <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-primary">
                  {p.numero} <Badge variant="outline" className="ml-2 text-[8px] font-sans">{p.tipo}</Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="font-bold text-slate-900 truncate">{p.titulo}</div>
                </TableCell>
                <TableCell className="text-sm text-slate-600">{p.autor}</TableCell>
                <TableCell>
                  <Badge className={
                    p.status === 'Sancionado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    p.status === 'Comissão' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-slate-100 text-slate-700'
                  }>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-500">{p.data}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary" title="Tramitar">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" /> Documentos
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History className="w-4 h-4 mr-2" /> Histórico
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Arquivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
