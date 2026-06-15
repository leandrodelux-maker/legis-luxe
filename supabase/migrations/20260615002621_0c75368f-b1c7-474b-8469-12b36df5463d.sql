ALTER TABLE public.transparency_settings
  ADD COLUMN IF NOT EXISTS portal_url text;

ALTER TABLE public.transparency_settings
  ADD COLUMN IF NOT EXISTS portal_name text;

ALTER TABLE public.transparency_settings
  ADD COLUMN IF NOT EXISTS show_full_portal_embed boolean NOT NULL DEFAULT false;

ALTER TABLE public.transparency_settings
  ADD COLUMN IF NOT EXISTS last_sync_at timestamp with time zone;

UPDATE public.transparency_settings
SET
  portal_url = COALESCE(NULLIF(portal_url, ''), portal_base_url),
  portal_name = COALESCE(NULLIF(portal_name, ''), entity_name, 'Portal da Transparência')
WHERE portal_url IS NULL OR portal_url = '' OR portal_name IS NULL OR portal_name = '';

ALTER TABLE public.transparency_settings
  ALTER COLUMN portal_url SET NOT NULL;

ALTER TABLE public.transparency_settings
  ALTER COLUMN portal_name SET NOT NULL;

ALTER TABLE public.transparency_settings
  ALTER COLUMN portal_name SET DEFAULT 'Portal da Transparência';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'transparency_settings_portal_url_valid'
      AND conrelid = 'public.transparency_settings'::regclass
  ) THEN
    ALTER TABLE public.transparency_settings
      ADD CONSTRAINT transparency_settings_portal_url_valid CHECK (portal_url ~* '^https?://[^\s/$.?#].[^\s]*$');
  END IF;
END $$;

GRANT SELECT ON public.transparency_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparency_settings TO authenticated;
GRANT ALL ON public.transparency_settings TO service_role;

ALTER TABLE public.transparency_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active transparency settings" ON public.transparency_settings;
CREATE POLICY "Anyone can view active transparency settings"
ON public.transparency_settings
FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert transparency settings" ON public.transparency_settings;
CREATE POLICY "Admins can insert transparency settings"
ON public.transparency_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update transparency settings" ON public.transparency_settings;
CREATE POLICY "Admins can update transparency settings"
ON public.transparency_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete transparency settings" ON public.transparency_settings;
CREATE POLICY "Admins can delete transparency settings"
ON public.transparency_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_transparency_settings_updated_at ON public.transparency_settings;
CREATE TRIGGER update_transparency_settings_updated_at
BEFORE UPDATE ON public.transparency_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();