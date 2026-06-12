-- 1) Estender site_settings com novas colunas
ALTER TABLE public.site_settings
  -- Configurações gerais
  ADD COLUMN IF NOT EXISTS nome_camara text DEFAULT 'Câmara Municipal',
  ADD COLUMN IF NOT EXISTS brasao_url text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS endereco text,
  ADD COLUMN IF NOT EXISTS redes_sociais jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS footer_text text,

  -- Identidade visual
  ADD COLUMN IF NOT EXISTS cor_primaria text DEFAULT '#1e3a8a',
  ADD COLUMN IF NOT EXISTS cor_secundaria text DEFAULT '#0f172a',
  ADD COLUMN IF NOT EXISTS cor_destaque text DEFAULT '#d4af37',
  ADD COLUMN IF NOT EXISTS cor_menu text DEFAULT '#0f172a',
  ADD COLUMN IF NOT EXISTS cor_botoes text DEFAULT '#1e3a8a',
  ADD COLUMN IF NOT EXISTS cor_cards text DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS fonte_titulo text DEFAULT 'Poppins',
  ADD COLUMN IF NOT EXISTS fonte_corpo text DEFAULT 'Open Sans',
  ADD COLUMN IF NOT EXISTS favicon_url text,
  ADD COLUMN IF NOT EXISTS logo_claro_url text,
  ADD COLUMN IF NOT EXISTS logo_escuro_url text,

  -- Home page
  ADD COLUMN IF NOT EXISTS hero_botao_texto text,
  ADD COLUMN IF NOT EXISTS hero_botao_url text,
  ADD COLUMN IF NOT EXISTS ordem_blocos jsonb DEFAULT '["hero","atalhos","noticias","sessoes","vereadores"]'::jsonb,

  -- SEO
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS og_image_url text,
  ADD COLUMN IF NOT EXISTS google_analytics_id text,
  ADD COLUMN IF NOT EXISTS gtm_id text,

  -- LGPD
  ADD COLUMN IF NOT EXISTS cookies_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS cookies_text text DEFAULT 'Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de privacidade.',
  ADD COLUMN IF NOT EXISTS privacy_policy text,
  ADD COLUMN IF NOT EXISTS terms_of_use text;

-- 2) Tabela de menus do site
CREATE TABLE IF NOT EXISTS public.site_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL DEFAULT '#',
  parent_id uuid REFERENCES public.site_menus(id) ON DELETE CASCADE,
  ordem integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  abrir_nova_aba boolean NOT NULL DEFAULT false,
  icone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_menus TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_menus TO authenticated;
GRANT ALL ON public.site_menus TO service_role;

ALTER TABLE public.site_menus ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Menus visíveis publicamente" ON public.site_menus;
CREATE POLICY "Menus visíveis publicamente" ON public.site_menus
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Apenas admins gerenciam menus" ON public.site_menus;
CREATE POLICY "Apenas admins gerenciam menus" ON public.site_menus
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_site_menus_updated_at ON public.site_menus;
CREATE TRIGGER update_site_menus_updated_at
  BEFORE UPDATE ON public.site_menus
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_site_menus_parent ON public.site_menus(parent_id);
CREATE INDEX IF NOT EXISTS idx_site_menus_ordem ON public.site_menus(ordem);