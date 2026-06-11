-- Remover políticas excessivamente permissivas
DROP POLICY IF EXISTS "Acesso Público Upload Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Acesso Público Update Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Acesso Público Delete Vereadores" ON storage.objects;

-- Criar novas políticas restritas apenas para usuários autenticados (Admin)
CREATE POLICY "Upload Protegido Vereadores"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vereadores');

CREATE POLICY "Update Protegido Vereadores"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vereadores');

CREATE POLICY "Delete Protegido Vereadores"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vereadores');

-- Manter a visualização pública
-- (Já criada na migração anterior como "Acesso Público Visualização Vereadores")
