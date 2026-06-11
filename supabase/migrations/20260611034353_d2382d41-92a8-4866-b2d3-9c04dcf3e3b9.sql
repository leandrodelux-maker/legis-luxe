-- Configurar políticas para o bucket 'vereadores' (caso o bucket já tenha sido criado via tool)
CREATE POLICY "Acesso_Publico_Vereadores" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vereadores');

CREATE POLICY "Upload_Publico_Vereadores" ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vereadores');

CREATE POLICY "Update_Publico_Vereadores" ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'vereadores');

CREATE POLICY "Delete_Publico_Vereadores" ON storage.objects 
FOR DELETE 
USING (bucket_id = 'vereadores');

-- Garantir que as tabelas de storage são acessíveis
GRANT SELECT ON storage.objects TO anon, authenticated;
GRANT SELECT ON storage.buckets TO anon, authenticated;
