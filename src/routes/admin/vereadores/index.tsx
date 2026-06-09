import { createFileRoute } from "@tanstack/react-router";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Mail,
  Phone
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin/vereadores/")({
  component: AdminVereadores,
});

const mockVereadores = [
  { id: 1, nome: "Ana Beatriz Almeida", partido: "PSD", cargo: "Presidente", status: "Ativo", email: "ana@camara.gov.br" },
  { id: 2, nome: "Carlos Eduardo Lima", partido: "MDB", cargo: "Vice-Presidente", status: "Ativo", email: "carlos@camara.gov.br" },
  { id: 3, nome: "Mariana Souza", partido: "PT", cargo: "1ª Secretária", status: "Ativo", email: "mariana@camara.gov.br" },
  { id: 4, nome: "João Pereira", partido: "PL", cargo: "Vereador", status: "Ativo", email: "joao@camara.gov.br" },
  { id: 5, nome: "Fernanda Costa", partido: "PSDB", cargo: "Vereadora", status: "Licenciado", email: "fernanda@camara.gov.br" },
];

function AdminVereadores() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-[fade-up_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Gerenciar Vereadores</h2>
          <p className="text-slate-500">Cadastre, edite e acompanhe os parlamentares.</p>
        </div>
        <Button className="bg-primary-deep text-white hover:bg-primary-deep/90">
          <Plus className="w-4 h-4 mr-2" /> Novo Vereador
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nome ou partido..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" /> Filtros
            </Button>
            <Button variant="outline" size="sm">
              Exportar
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Partido</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVereadores.map((v) => (
              <TableRow key={v.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white text-[10px] font-bold">
                      {v.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-900">{v.nome}</div>
                  <div className="text-xs text-slate-500">{v.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">{v.partido}</Badge>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-600">{v.cargo}</TableCell>
                <TableCell>
                  <Badge className={v.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}>
                    {v.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" /> Ver Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" /> Enviar E-mail
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500">Mostrando 5 de 21 vereadores</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm">Próximo</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
