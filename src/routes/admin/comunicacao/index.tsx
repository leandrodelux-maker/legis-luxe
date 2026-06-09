import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { 
  Newspaper, 
  Plus, 
  Search, 
  Image as ImageIcon, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Tag
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/comunicacao/")({
  component: AdminComunicacao,
});

const mockNoticias = [
  { id: 1, titulo: "Inauguração da Praça Central", categoria: "Eventos", data: "09/06/2026", status: "Publicado" },
  { id: 2, titulo: "Câmara aprova novo plano diretor", categoria: "Legislativo", data: "08/06/2026", status: "Rascunho" },
  { id: 3, titulo: "Audiência Pública sobre Meio Ambiente", categoria: "Audiências", data: "05/06/2026", status: "Publicado" },
];

function AdminComunicacao() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-[fade-up_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Comunicação</h2>
          <p className="text-slate-500">Gestão de notícias, banners e conteúdo institucional.</p>
        </div>
        <Button 
          className="bg-primary-deep text-white hover:bg-primary-deep/90"
          onClick={() => navigate({ to: "/admin/comunicacao/novo" })}
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Notícia
        </Button>
      </div>

      <Tabs defaultValue="noticias" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-12 border border-slate-200">
          <TabsTrigger value="noticias" className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Notícias</TabsTrigger>
          <TabsTrigger value="banners" className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Banners Hero</TabsTrigger>
          <TabsTrigger value="categorias" className="px-8 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="noticias">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Buscar notícia..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockNoticias.map((n) => (
                  <TableRow key={n.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-bold text-slate-900 max-w-sm truncate">{n.titulo}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold text-[10px]">{n.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {n.data}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={n.status === 'Publicado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400'}>
                        {n.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="banners">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all cursor-pointer bg-white">
              <Plus className="w-10 h-10 mb-2" />
              <span className="font-bold">Novo Banner</span>
            </div>
            {[1, 2].map(i => (
              <div key={i} className="group relative aspect-video rounded-2xl bg-slate-200 overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1">Slide {i}</p>
                  <h4 className="font-bold truncate">Chamada do Banner Principal {i}</h4>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90"><Edit className="w-4 h-4 text-slate-700" /></Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
