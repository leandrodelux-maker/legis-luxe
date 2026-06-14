import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/transparencia-ativa")({
  component: AdminTransparenciaAtiva,
});

type Modulo = {
  id: string;
  nome: string;
  categoria: string | null;
  ordem: number;
  ativo: boolean;
  url: string;
};

function AdminTransparenciaAtiva() {
  const { settings, loading, saving, save, update } = useSiteSettings();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">Transparência Ativa</h1>
        <p className="text-slate-500">Configurações da página pública e dos módulos do Portal Megasoft.</p>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 max-w-4xl">
        <h2 className="font-display font-bold text-lg">Configurações da página</h2>
        {loading || !settings ? (
          <div className="py-6 grid place-items-center"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await save({
                transparencia_ativa_enabled: settings.transparencia_ativa_enabled,
                transparencia_ativa_intro: settings.transparencia_ativa_intro,
                transparencia_portal_url: settings.transparencia_portal_url,
                transparencia_portal_button_label: settings.transparencia_portal_button_label,
              });
            }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <input
                id="enabled"
                type="checkbox"
                checked={Boolean(settings.transparencia_ativa_enabled)}
                onChange={(e) => update({ transparencia_ativa_enabled: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="enabled">Página de Transparência Ativa publicada</Label>
            </div>
            <div>
              <Label>Texto de apresentação</Label>
              <Textarea
                rows={3}
                value={settings.transparencia_ativa_intro ?? ""}
                onChange={(e) => update({ transparencia_ativa_intro: e.target.value })}
                placeholder="Acesse de forma rápida e transparente as informações públicas..."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>URL base do Portal Megasoft</Label>
                <Input
                  type="url"
                  value={settings.transparencia_portal_url ?? ""}
                  onChange={(e) => update({ transparencia_portal_url: e.target.value })}
                  placeholder="https://camaraadelandia.megasofttransparencia.com.br/"
                />
              </div>
              <div>
                <Label>Texto do botão do portal completo</Label>
                <Input
                  value={settings.transparencia_portal_button_label ?? ""}
                  onChange={(e) => update({ transparencia_portal_button_label: e.target.value })}
                  placeholder="Acessar Portal da Transparência Completo"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="bg-primary-deep">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Salvar configurações
              </Button>
            </div>
          </form>
        )}
      </section>

      <CrudPage<Modulo>
        title="Módulos de Transparência"
        description="Cards exibidos na página pública. Use o campo Ícone com nomes da biblioteca lucide-react (ex.: Banknote, Gavel, FileText)."
        table="transparencia_modulos"
        orderBy={{ column: "ordem", ascending: true }}
        defaultValues={{ ativo: true, ordem: 0 }}
        columns={[
          { key: "ordem", label: "#" },
          { key: "nome", label: "Nome" },
          { key: "categoria", label: "Categoria" },
          {
            key: "ativo",
            label: "Status",
            render: (r) => (
              <Badge variant={r.ativo ? "default" : "secondary"}>{r.ativo ? "Ativo" : "Inativo"}</Badge>
            ),
          },
        ]}
        fields={[
          { name: "nome", label: "Nome", required: true },
          { name: "descricao", label: "Descrição", type: "textarea" },
          { name: "categoria", label: "Categoria", placeholder: "Financeiro, Contratações, Pessoal..." },
          { name: "icone", label: "Ícone (lucide-react)", placeholder: "Banknote" },
          { name: "url", label: "Link (URL)", type: "url", required: true, placeholder: "https://..." },
          { name: "ordem", label: "Ordem", type: "number" },
          { name: "ativo", label: "Ativo", type: "checkbox" },
        ]}
      />
    </div>
  );
}
