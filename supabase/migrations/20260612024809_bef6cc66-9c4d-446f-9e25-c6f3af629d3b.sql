-- Políticas para o bucket 'vereadores'
DO $$
BEGIN
    -- Permitir leitura pública (mesmo se o bucket for privado, o RLS permite se definido aqui)
    DROP POLICY IF EXISTS "vereadores_public_read" ON storage.objects;
    CREATE POLICY "vereadores_public_read" ON storage.objects
      FOR SELECT TO public USING (bucket_id = 'vereadores');
    
    -- Permitir gerenciamento total para usuários autenticados
    DROP POLICY IF EXISTS "vereadores_auth_all" ON storage.objects;
    CREATE POLICY "vereadores_auth_all" ON storage.objects
      FOR ALL TO authenticated USING (bucket_id = 'vereadores');
END $$;

-- Políticas para o bucket 'site-media'
DO $$
BEGIN
    -- Permitir leitura pública
    DROP POLICY IF EXISTS "site_media_public_read" ON storage.objects;
    CREATE POLICY "site_media_public_read" ON storage.objects
      FOR SELECT TO public USING (bucket_id = 'site-media');
    
    -- Permitir gerenciamento total para usuários autenticados
    DROP POLICY IF EXISTS "site_media_auth_all" ON storage.objects;
    CREATE POLICY "site_media_auth_all" ON storage.objects
      FOR ALL TO authenticated USING (bucket_id = 'site-media');
END $$;