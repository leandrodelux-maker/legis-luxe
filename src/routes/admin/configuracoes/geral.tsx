import { createFileRoute } from "@tanstack/react-router";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

import { PaginaModulo } from "@/components/admin/painel/PaginaModulo";

export const Route = createFileRoute("/admin/configuracoes/geral")({
  component: GeralPage,
});

function GeralPage() {
  const { settings, loading, saving, save, update } = useSiteSettings();

  if (loading || !settings) {
    return <div className="p-12 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  const redes = settings.redes_sociais || {};
  const setRede = (k: string, v: string) => update({ redes_sociais: { ...redes, [k]: v } });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save({
      nome_camara: settings.nome_camara,
      contact_phone: settings.contact_phone,
      whatsapp: settings.whatsapp,
      contact_email: settings.contact_email,
      endereco: settings.endereco,
      contact_hours: settings.contact_hours,
      redes_sociais: settings.redes_sociais,
      plenario_image_url: settings.plenario_image_url,
    });
  };

  return (
    <PaginaModulo>
    <form onSubmit={submit} className="space-y-6 max-w-4xl">

      <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Identificação</h2>
        <div className="grid md:grid-cols-[1fr_auto] gap-6">
          <div className="space-y-3">
            <div>
              <Label htmlFor="geral-1">Nome da Câmara</Label>
              <Input id="geral-1" value={settings.nome_camara ?? ""} onChange={(e) => update({ nome_camara: e.target.value })} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Contato</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label htmlFor="geral-2">Telefone</Label><Input id="geral-2" value={settings.contact_phone ?? ""} onChange={(e) => update({ contact_phone: e.target.value })} /></div>
          <div><Label htmlFor="geral-3">WhatsApp</Label><Input id="geral-3" value={settings.whatsapp ?? ""} onChange={(e) => update({ whatsapp: e.target.value })} placeholder="5511999999999" /></div>
          <div><Label htmlFor="geral-4">E-mail</Label><Input id="geral-4" type="email" value={settings.contact_email ?? ""} onChange={(e) => update({ contact_email: e.target.value })} /></div>
          <div><Label htmlFor="geral-5">Horário de Funcionamento</Label><Input id="geral-5" value={settings.contact_hours ?? ""} onChange={(e) => update({ contact_hours: e.target.value })} /></div>
          <div className="md:col-span-2"><Label htmlFor="geral-6">Endereço</Label><Textarea id="geral-6" rows={2} value={settings.endereco ?? ""} onChange={(e) => update({ endereco: e.target.value })} /></div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Redes Sociais</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label htmlFor="geral-7">Facebook</Label><Input id="geral-7" value={redes.facebook ?? ""} onChange={(e) => setRede("facebook", e.target.value)} placeholder="https://facebook.com/..." /></div>
          <div><Label htmlFor="geral-8">Instagram</Label><Input id="geral-8" value={redes.instagram ?? ""} onChange={(e) => setRede("instagram", e.target.value)} placeholder="https://instagram.com/..." /></div>
          <div><Label htmlFor="geral-9">YouTube</Label><Input id="geral-9" value={redes.youtube ?? ""} onChange={(e) => setRede("youtube", e.target.value)} placeholder="https://youtube.com/..." /></div>
          <div><Label htmlFor="geral-10">Twitter / X</Label><Input id="geral-10" value={redes.twitter ?? ""} onChange={(e) => setRede("twitter", e.target.value)} placeholder="https://x.com/..." /></div>
          <div><Label htmlFor="geral-11">LinkedIn</Label><Input id="geral-11" value={redes.linkedin ?? ""} onChange={(e) => setRede("linkedin", e.target.value)} /></div>
          <div><Label htmlFor="geral-12">TikTok</Label><Input id="geral-12" value={redes.tiktok ?? ""} onChange={(e) => setRede("tiktok", e.target.value)} /></div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Imagem do Plenário</h2>
        <p className="text-xs text-muted-foreground">Exibida na seção institucional da página de Vereadores.</p>
        <div className="max-w-md">
          <ImageUploader
            value={settings.plenario_image_url}
            onChange={(u) => update({ plenario_image_url: u })}
            folder="plenario"
            label="Foto do Plenário"
            height={200}
          />
        </div>
      </section>

      <div className="sticky bottom-0 flex justify-end bg-background/90 backdrop-blur py-3 border-t border-border">
        <Button type="submit" disabled={saving} className="text-white hover:opacity-90" style={{ backgroundColor: "var(--tema)" }}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Salvar alterações
        </Button>
      </div>
    </form>
    </PaginaModulo>
  );
}
