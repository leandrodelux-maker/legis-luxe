CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_media_url TEXT,
  hero_media_type TEXT NOT NULL DEFAULT 'image' CHECK (hero_media_type IN ('image', 'video')),
  hero_title TEXT NOT NULL DEFAULT 'Câmara Municipal',
  hero_subtitle TEXT NOT NULL DEFAULT 'Transparência, serviços e informação ao alcance do cidadão',
  hero_eyebrow TEXT NOT NULL DEFAULT 'Portal Oficial do Município',
  contact_phone TEXT,
  contact_email TEXT,
  contact_hours TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (hero_eyebrow, hero_title, hero_subtitle, contact_phone, contact_email, contact_hours)
VALUES (
  'Portal Oficial do Município',
  'Câmara Municipal',
  'Transparência, serviços e informação ao alcance do cidadão',
  '(64) 9482-1176',
  'contato@camaramunicipal.gov.br',
  'Seg a Sex, 8h às 17h'
);
