import { createFileRoute } from "@tanstack/react-router";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Clock,
  PlayCircle as YoutubeIcon,
  FileText,
  Radio,
  Share2,
  Video
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

export const Route = createFileRoute("/admin/sessoes/")({
  component: AdminSessoes,
});

const mockSessoes = [
  { id: 1, data: "16/06/2026", tipo: "Ordinária", local: "Plenário", status: "Agendada", pauta: 7 },
  { id: 2, data: "18/06/2026", tipo: "Audiência", local: "Auditório", status: "Agendada", pauta: 3 },
  { id: 3, data: "09/06/2026", tipo: "Ordinária", local: "Plenário", status: "Realizada", pauta: 12 },
  { id: 4, data: "02/06/2026", tipo: "Ordinária", local: "Plenário", status: "Realizada", pauta: 8 },
];

function AdminSessoes() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-[fade-up_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Gestão de Sessões</h2>
          <p className="text-slate-500">Agendamento, pautas, atas e transmissões ao vivo.</p>
        </div>
        <Button className="bg-primary-deep text-white hover:bg-primary-deep/90">
          <Plus className="w-4 h-4 mr-2" /> Nova Sessão
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar sessão..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            Calendário Anual
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Data / Hora</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Matérias</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSessoes.map((s) => (
              <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="font-bold text-slate-900">{s.data}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 14:00
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase">{s.tipo}</Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-600">{s.local}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100">{s.pauta} matérias</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={s.status === 'Realizada' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {s.status === 'Agendada' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 animate-pulse" title="Iniciar Transmissão">
                        <Radio className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" title="Configurar Vídeo">
                      <Video className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" /> Editar Sessão
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" /> Links de Transmissão
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" /> Gerar Pauta
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" /> Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Cancelar
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
