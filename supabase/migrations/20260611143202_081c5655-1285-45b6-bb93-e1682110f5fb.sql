-- Remover políticas antigas se existirem para evitar conflitos
DROP POLICY IF EXISTS "Acesso Público Visualização Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Acesso Público Upload Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Acesso Público Update Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Acesso Público Delete Vereadores" ON storage.objects;

-- Criar política de visualização pública para o bucket vereadores
-- Mesmo se o bucket não for marcado como "public" na tabela buckets, 
-- a política de SELECT para 'anon' permite o acesso via URL pública.
CREATE POLICY "Acesso Público Visualização Vereadores"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vereadores');

-- Criar política de inserção para permitir uploads do painel
CREATE POLICY "Acesso Público Upload Vereadores"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'vereadores');

-- Criar política de atualização
CREATE POLICY "Acesso Público Update Vereadores"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'vereadores');

-- Criar política de exclusão
CREATE POLICY "Acesso Público Delete Vereadores"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'vereadores');

-- Garantir permissões de banco de dados
GRANT ALL ON storage.objects TO anon, authenticated, service_role;
