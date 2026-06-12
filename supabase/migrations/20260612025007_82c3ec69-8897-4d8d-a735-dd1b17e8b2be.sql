-- Apenas garantir que as políticas estão atualizadas e permitir cache
DROP POLICY IF EXISTS "site_media_public_read" ON storage.objects;
CREATE POLICY "site_media_public_read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "vereadores_public_read" ON storage.objects;
CREATE POLICY "vereadores_public_read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'vereadores');