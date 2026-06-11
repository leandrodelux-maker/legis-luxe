-- Remover políticas existentes para garantir uma limpeza completa e evitar conflitos
DROP POLICY IF EXISTS "Acesso Público Visualização Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Permitir Upload Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Permitir Update Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Permitir Delete Vereadores" ON storage.objects;

-- Política para visualização pública (essencial para que as fotos apareçam no site e no preview do admin)
CREATE POLICY "Acesso Público Visualização Vereadores"
ON storage.objects FOR SELECT
USING (bucket_id = 'vereadores');

-- Política para inserção (permite o upload de novos arquivos)
CREATE POLICY "Permitir Upload Vereadores"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'vereadores');

-- Política para atualização (permite substituir arquivos existentes)
CREATE POLICY "Permitir Update Vereadores"
ON storage.objects FOR UPDATE
USING (bucket_id = 'vereadores');

-- Política para exclusão (permite remover arquivos)
CREATE POLICY "Permitir Delete Vereadores"
ON storage.objects FOR DELETE
USING (bucket_id = 'vereadores');
