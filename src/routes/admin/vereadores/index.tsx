import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/vereadores/")({
  component: AdminVereadores,
});

type Vereador = {
  id: string;
  nome: string;
  partido: string | null;
  cargo: string | null;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
  ordem: number | null;
  data_nascimento: string | null;
  naturalidade: string | null;
  escolaridade: string | null;
  profissao: string | null;
  redes_sociais: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  stats: {
    projetos: number;
    presencas: number;
    participacoes: number;
  };
};

function AdminVereadores() {
  return (
    <CrudPage<Vereador>
      title="Vereadores"
      description="Gerencie os parlamentares exibidos no site."
      table="vereadores"
      orderBy={{ column: "ordem", ascending: true }}
      defaultValues={{ 
        ativo: true, 
        ordem: 0, 
        redes_sociais: {}, 
        stats: { projetos: 0, presencas: 0, participacoes: 0 } 
      }}
      columns={[
        { 
          key: "foto_url", 
          label: "Foto",
          render: (r) => (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              {r.foto_url ? (
                <img src={r.foto_url} alt={r.nome} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">?</div>
              )}
            </div>
          )
        },
        { key: "nome", label: "Nome" },
        { key: "partido", label: "Partido" },
        { key: "cargo", label: "Cargo" },
        {
          key: "ativo",
          label: "Status",
          render: (r) => (
            <Badge variant={r.ativo ? "default" : "secondary"}>
              {r.ativo ? "Ativo" : "Inativo"}
            </Badge>
          ),
        },
      ]}
      fields={[
        { name: "nome", label: "Nome completo", required: true },
        { name: "partido", label: "Partido" },
        { name: "cargo", label: "Cargo (ex: Presidente, Vereador)" },
        { name: "foto_url", label: "Foto do Vereador", type: "file" },
        { name: "biografia", label: "Biografia", type: "textarea" },
        { name: "email", label: "E-mail", type: "email" },
        { name: "telefone", label: "Telefone" },
        { name: "gabinete", label: "Gabinete" },
        { name: "data_nascimento", label: "Data de Nascimento", type: "date" },
        { name: "naturalidade", label: "Naturalidade" },
        { name: "escolaridade", label: "Escolaridade" },
        { name: "profissao", label: "Profissão" },
        {
          name: "redes_sociais",
          label: "Redes Sociais",
          type: "custom",
          renderCustom: (row, form, setForm) => {
            const redes = (form.redes_sociais as Vereador["redes_sociais"]) || {};
            const updateRede = (key: string, val: string) => {
              setForm({
                ...form,
                redes_sociais: { ...redes, [key]: val }
              });
            };
            return (
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Instagram</Label>
                  <Input 
                    placeholder="@perfil" 
                    value={redes.instagram || ""} 
                    onChange={(e) => updateRede("instagram", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Facebook</Label>
                  <Input 
                    placeholder="link" 
                    value={redes.facebook || ""} 
                    onChange={(e) => updateRede("facebook", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Twitter</Label>
                  <Input 
                    placeholder="link" 
                    value={redes.twitter || ""} 
                    onChange={(e) => updateRede("twitter", e.target.value)}
                  />
                </div>
              </div>
            );
          }
        },
        {
          name: "stats",
          label: "Estatísticas (Numérico)",
          type: "custom",
          renderCustom: (row, form, setForm) => {
            const stats = (form.stats as Vereador["stats"]) || { projetos: 0, presencas: 0, participacoes: 0 };
            const updateStat = (key: string, val: string) => {
              setForm({
                ...form,
                stats: { ...stats, [key]: Number(val) || 0 }
              });
            };
            return (
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Projetos</Label>
                  <Input 
                    type="number" 
                    value={stats.projetos} 
                    onChange={(e) => updateStat("projetos", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Presenças</Label>
                  <Input 
                    type="number" 
                    value={stats.presencas} 
                    onChange={(e) => updateStat("presencas", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase">Participações</Label>
                  <Input 
                    type="number" 
                    value={stats.participacoes} 
                    onChange={(e) => updateStat("participacoes", e.target.value)}
                  />
                </div>
              </div>
            );
          }
        },
        { name: "ordem", label: "Ordem de exibição", type: "number" },
        { name: "ativo", label: "Ativo", type: "checkbox", placeholder: "Mostrar no site" },
      ]}
    />
  );
}

