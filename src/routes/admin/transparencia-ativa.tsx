import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CrudPage } from "@/components/admin/crud-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/transparencia-ativa")({
  component: AdminTransparenciaAtiva,
});

const CATEGORIES = [
  "Financeiro",
  "Licitações e Contratos",
  "Pessoal",
  "Planejamento e Orçamento",
  "Contabilidade",
  "Controle Social",
  "Acesso à Informação",
];

type Settings = {
  id: string;
  entity_name: string;
  portal_base_url: string;
  intro_text: string | null;
  is_active: boolean;
};

type Module = {
  id: string;
  title: string;
  category: string;
  display_order: number;
  is_active: boolean;
  link_url: string;
};

function AdminTransparenciaAtiva() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("transparency_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      setSettings(data as Settings | null);
      setLoading(false);
    })();
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const { error } = await (supabase as any)
      .from("transparency_settings")
      .update({
        entity_name: settings.entity_name,
        portal_base_url: settings.portal_base_url,
        intro_text: settings.intro_text,
        is_active: settings.is_active,
      })
      .eq("id", settings.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Configurações salvas");
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">Transparência Ativa</h1>
        <p className="text-slate-500">
          Configurações da página pública e dos módulos do Portal Megasoft. Para reutilizar em outro município,
          basta trocar a URL base do portal e os links de cada módulo.
        </p>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 max-w-4xl">
        <h2 className="font-display font-bold text-lg">Configurações da página</h2>
        {loading || !settings ? (
          <div className="py-6 grid place-items-center"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
        ) : (
          <form onSubmit={saveSettings} className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                id="enabled"
                type="checkbox"
                checked={settings.is_active}
                onChange={(e) => setSettings({ ...settings, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="enabled">Página de Transparência Ativa publicada</Label>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Nome da entidade</Label>
                <Input
                  value={settings.entity_name ?? ""}
                  onChange={(e) => setSettings({ ...settings, entity_name: e.target.value })}
                  placeholder="Câmara Municipal de ..."
                />
              </div>
              <div>
                <Label>URL base do Portal Megasoft</Label>
                <Input
                  type="url"
                  value={settings.portal_base_url ?? ""}
                  onChange={(e) => setSettings({ ...settings, portal_base_url: e.target.value })}
                  placeholder="https://camara{municipio}.megasofttransparencia.com.br/"
                />
              </div>
            </div>
            <div>
              <Label>Texto de apresentação</Label>
              <Textarea
                rows={3}
                value={settings.intro_text ?? ""}
                onChange={(e) => setSettings({ ...settings, intro_text: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="bg-primary-deep">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Salvar configurações
              </Button>
            </div>
          </form>
        )}
      </section>

      <CrudPage<Module>
        title="Módulos de Transparência"
        description="Cards exibidos na página pública. Ícone usa nomes da biblioteca lucide-react (ex.: Banknote, Gavel, FileText)."
        table="transparency_modules"
        orderBy={{ column: "display_order", ascending: true }}
        defaultValues={{ is_active: true, display_order: 0, category: CATEGORIES[0] }}
        columns={[
          { key: "display_order", label: "#" },
          { key: "title", label: "Título" },
          { key: "category", label: "Categoria" },
          {
            key: "is_active",
            label: "Status",
            render: (r) => (
              <Badge variant={r.is_active ? "default" : "secondary"}>{r.is_active ? "Ativo" : "Inativo"}</Badge>
            ),
          },
        ]}
        fields={[
          { name: "title", label: "Título", required: true },
          { name: "description", label: "Descrição", type: "textarea" },
          {
            name: "category",
            label: "Categoria",
            type: "select",
            required: true,
            options: CATEGORIES.map((c) => ({ label: c, value: c })),
          },
          { name: "icon", label: "Ícone (lucide-react)", placeholder: "Banknote" },
          { name: "link_url", label: "Link (URL)", type: "url", required: true, placeholder: "https://..." },
          { name: "display_order", label: "Ordem", type: "number" },
          { name: "is_active", label: "Ativo", type: "checkbox" },
        ]}
      />
    </div>
  );
}
