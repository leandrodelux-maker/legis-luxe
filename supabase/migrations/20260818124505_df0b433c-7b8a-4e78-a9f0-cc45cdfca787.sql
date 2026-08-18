DROP POLICY IF EXISTS "site_media_auth_all" ON storage.objects;
DROP POLICY IF EXISTS "vereadores_auth_all" ON storage.objects;
DROP POLICY IF EXISTS "Upload Protegido Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Update Protegido Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Delete Protegido Vereadores" ON storage.objects;

REVOKE SELECT ON public.vereadores FROM anon;
GRANT SELECT (id, nome, partido, cargo, foto_url, biografia, gabinete, mandato_inicio, mandato_fim, ativo, ordem, created_at, updated_at, data_nascimento, naturalidade, escolaridade, profissao, redes_sociais, stats, data_posse, mandato_atual, slug, legislatura, comissoes) ON public.vereadores TO anon;