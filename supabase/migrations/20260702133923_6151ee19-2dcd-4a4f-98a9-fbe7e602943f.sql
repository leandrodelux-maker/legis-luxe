
ALTER TABLE public.site_settings ALTER COLUMN header_logo_height SET DEFAULT 106;
UPDATE public.site_settings SET header_logo_height = 106 WHERE header_logo_height IS NULL OR header_logo_height = 56;
