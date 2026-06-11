-- Remover políticas antigas para evitar duplicidade ou conflitos
-- Nota: em storage, as políticas são aplicadas à tabela storage.objects
DO $$
BEGIN
    -- 1. Política de Visualização Pública
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Acesso Público Visualização Vereadores'
    ) THEN
        CREATE POLICY "Acesso Público Visualização Vereadores"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'vereadores');
    END IF;

    -- 2. Política de Inserção (Upload)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Permitir Upload Vereadores'
    ) THEN
        CREATE POLICY "Permitir Upload Vereadores"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'vereadores');
    END IF;

    -- 3. Política de Atualização
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Permitir Update Vereadores'
    ) THEN
        CREATE POLICY "Permitir Update Vereadores"
        ON storage.objects FOR UPDATE
        USING (bucket_id = 'vereadores');
    END IF;

    -- 4. Política de Deleção
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Permitir Delete Vereadores'
    ) THEN
        CREATE POLICY "Permitir Delete Vereadores"
        ON storage.objects FOR DELETE
        USING (bucket_id = 'vereadores');
    END IF;
END $$;
