-- Permitir que qualquer pessoa leia objetos no bucket 'documentos'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public Access documents'
    ) THEN
        CREATE POLICY "Public Access documents" ON storage.objects FOR SELECT USING (bucket_id = 'documentos');
    END IF;
END $$;
