import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SiteSettings = Record<string, any> & { id: string };

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    if (error) toast.error(error.message);
    else setSettings(data as SiteSettings | null);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (patch: Partial<SiteSettings>) => {
    if (!settings) return;
    setSaving(true);
    const { error } = await (supabase as any).from("site_settings").update(patch).eq("id", settings.id);
    setSaving(false);
    if (error) { toast.error(error.message); return false; }
    setSettings({ ...settings, ...patch });
    toast.success("Configurações salvas");
    return true;
  };

  const update = (patch: Partial<SiteSettings>) => {
    if (settings) setSettings({ ...settings, ...patch });
  };

  return { settings, loading, saving, save, update };
}

export async function uploadToSiteMedia(file: File, folder: string): Promise<string | null> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl: "3600", upsert: true, contentType: file.type,
  });
  if (error) { toast.error(error.message); return null; }
  const { data } = await supabase.storage.from("site-media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (!data?.signedUrl) { toast.error("Falha ao gerar URL"); return null; }
  return data.signedUrl;
}
