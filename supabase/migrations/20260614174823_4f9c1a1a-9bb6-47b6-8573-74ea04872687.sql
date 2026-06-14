GRANT SELECT ON public.transparency_modules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparency_modules TO authenticated;
GRANT ALL ON public.transparency_modules TO service_role;

GRANT SELECT ON public.transparency_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparency_settings TO authenticated;
GRANT ALL ON public.transparency_settings TO service_role;