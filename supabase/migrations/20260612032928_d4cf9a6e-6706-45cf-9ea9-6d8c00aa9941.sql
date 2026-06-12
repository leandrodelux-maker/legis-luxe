
-- Vereadores: add missing fields
ALTER TABLE public.vereadores
  ADD COLUMN IF NOT EXISTS data_posse date,
  ADD COLUMN IF NOT EXISTS mandato_atual text;

-- Histórico de mandatos
CREATE TABLE IF NOT EXISTS public.vereadores_mandatos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vereador_id uuid NOT NULL REFERENCES public.vereadores(id) ON DELETE CASCADE,
  mandato text NOT NULL,
  cargo_mesa text,
  partido text,
  data_inicio date,
  data_fim date,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vereadores_mandatos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vereadores_mandatos TO authenticated;
GRANT ALL ON public.vereadores_mandatos TO service_role;
ALTER TABLE public.vereadores_mandatos ENABLE ROW LEVEL SECURITY;
CREATE POLICY mandatos_public_read ON public.vereadores_mandatos FOR SELECT USING (true);
CREATE POLICY mandatos_admin_all ON public.vereadores_mandatos FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'editor'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.vereadores_mandatos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Galeria de imagens
CREATE TABLE IF NOT EXISTS public.vereadores_galeria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vereador_id uuid NOT NULL REFERENCES public.vereadores(id) ON DELETE CASCADE,
  url text NOT NULL,
  legenda text,
  ordem integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vereadores_galeria TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vereadores_galeria TO authenticated;
GRANT ALL ON public.vereadores_galeria TO service_role;
ALTER TABLE public.vereadores_galeria ENABLE ROW LEVEL SECURITY;
CREATE POLICY galeria_public_read ON public.vereadores_galeria FOR SELECT USING (true);
CREATE POLICY galeria_admin_all ON public.vereadores_galeria FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'editor'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'editor'));

-- Storage RLS: permitir leitura pública e gravação por admin/editor no bucket vereadores
DROP POLICY IF EXISTS vereadores_storage_read ON storage.objects;
CREATE POLICY vereadores_storage_read ON storage.objects FOR SELECT
  USING (bucket_id = 'vereadores');
DROP POLICY IF EXISTS vereadores_storage_write ON storage.objects;
CREATE POLICY vereadores_storage_write ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'vereadores' AND (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'editor')))
  WITH CHECK (bucket_id = 'vereadores' AND (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'editor')));

-- Ranking automático (view)
CREATE OR REPLACE VIEW public.vereadores_ranking AS
WITH proj AS (
  SELECT autor_id,
    COUNT(*) FILTER (WHERE tipo IN ('projeto_lei','projeto','projeto_lei_complementar','pl','plc'))::int AS total_projetos,
    COUNT(*) FILTER (WHERE tipo IN ('indicacao'))::int AS total_indicacoes,
    COUNT(*) FILTER (WHERE tipo IN ('requerimento'))::int AS total_requerimentos
  FROM public.projetos_legislativos
  WHERE autor_id IS NOT NULL
  GROUP BY autor_id
),
pres AS (
  SELECT vereador_id,
    COUNT(*) FILTER (WHERE presente = true)::int AS presencas,
    COUNT(*)::int AS total_sessoes
  FROM public.sessoes_presencas
  GROUP BY vereador_id
)
SELECT
  v.id, v.nome, v.partido, v.foto_url, v.cargo,
  COALESCE(proj.total_projetos,0) AS total_projetos,
  COALESCE(proj.total_indicacoes,0) AS total_indicacoes,
  COALESCE(proj.total_requerimentos,0) AS total_requerimentos,
  COALESCE(pres.presencas,0) AS presencas,
  COALESCE(pres.total_sessoes,0) AS total_sessoes,
  CASE WHEN COALESCE(pres.total_sessoes,0)>0
       THEN ROUND((pres.presencas::numeric / pres.total_sessoes) * 100, 1)
       ELSE 0 END AS percentual_presenca,
  (COALESCE(proj.total_projetos,0) + COALESCE(proj.total_indicacoes,0)
   + COALESCE(proj.total_requerimentos,0) + COALESCE(pres.presencas,0)) AS pontuacao_total
FROM public.vereadores v
LEFT JOIN proj ON proj.autor_id = v.id
LEFT JOIN pres ON pres.vereador_id = v.id
WHERE v.ativo = true;

GRANT SELECT ON public.vereadores_ranking TO anon, authenticated;
