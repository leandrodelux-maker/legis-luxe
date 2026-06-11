-- Tentar apenas criar as políticas, já que o UPDATE no bucket pode estar restrito por segurança interna se já for gerenciado
-- Mas as políticas SELECT são fundamentais.

DO $$
BEGIN
    -- Política para vereadores
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access vereadores' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Access vereadores" ON storage.objects FOR SELECT USING (bucket_id = 'vereadores');
    END IF;

    -- Política para documentos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access documents' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Access documents" ON storage.objects FOR SELECT USING (bucket_id = 'documentos');
    END IF;
END $$;

-- Permitir uploads se necessário (INSERT/UPDATE)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert vereadores' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Insert vereadores" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vereadores');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Update vereadores' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Update vereadores" ON storage.objects FOR UPDATE USING (bucket_id = 'vereadores');
    END IF;
END $$;

-- Garantir permissões de banco para os roles
GRANT SELECT ON storage.objects TO anon, authenticated;
GRANT INSERT, UPDATE ON storage.objects TO anon, authenticated;
