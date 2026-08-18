-- 1. site_settings: consolidate policies (single policy per command)
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;

CREATE POLICY site_settings_public_read ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY site_settings_staff_insert ON public.site_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY site_settings_staff_update ON public.site_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY site_settings_admin_delete ON public.site_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. transparency_settings: drop all duplicates, one policy per command
DROP POLICY IF EXISTS "Anyone can view active transparency settings" ON public.transparency_settings;
DROP POLICY IF EXISTS "Public can read transparency settings" ON public.transparency_settings;
DROP POLICY IF EXISTS "Admins can insert transparency settings" ON public.transparency_settings;
DROP POLICY IF EXISTS "Admins insert transparency settings" ON public.transparency_settings;
DROP POLICY IF EXISTS "Admins can update transparency settings" ON public.transparency_settings;
DROP POLICY IF EXISTS "Admins update transparency settings" ON public.transparency_settings;
DROP POLICY IF EXISTS "Admins can delete transparency settings" ON public.transparency_settings;
DROP POLICY IF EXISTS "Admins delete transparency settings" ON public.transparency_settings;

CREATE POLICY transparency_settings_public_read ON public.transparency_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY transparency_settings_admin_insert ON public.transparency_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY transparency_settings_admin_update ON public.transparency_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY transparency_settings_admin_delete ON public.transparency_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 3. vereadores: column-level protection for personal contact data
REVOKE SELECT ON public.vereadores FROM anon;
GRANT SELECT (
  id, nome, partido, cargo, foto_url, biografia, gabinete, mandato_inicio, mandato_fim,
  ativo, ordem, created_at, updated_at, naturalidade, escolaridade, profissao,
  redes_sociais, stats, data_posse, mandato_atual, slug, legislatura, comissoes
) ON public.vereadores TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vereadores TO authenticated;
GRANT ALL ON public.vereadores TO service_role;