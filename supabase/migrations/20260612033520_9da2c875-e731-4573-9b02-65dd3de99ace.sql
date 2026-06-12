DROP POLICY IF EXISTS documentos_public_read ON storage.objects;
CREATE POLICY documentos_public_read ON storage.objects FOR SELECT
  USING (bucket_id = 'documentos');