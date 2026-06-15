
ALTER TABLE public.vereadores
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS legislatura text,
  ADD COLUMN IF NOT EXISTS comissoes text;

UPDATE public.vereadores
SET slug = lower(regexp_replace(
  translate(nome,
    'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇáàâãäéèêëíìîïóòôõöúùûüç',
    'AAAAAEEEEIIIIOOOOOUUUUCaaaaaeeeeiiiiooooouuuuc'),
  '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

UPDATE public.vereadores SET slug = trim(both '-' from slug);

CREATE UNIQUE INDEX IF NOT EXISTS idx_vereadores_slug_unique ON public.vereadores(slug);
