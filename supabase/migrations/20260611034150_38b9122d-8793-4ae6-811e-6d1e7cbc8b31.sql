-- Remover políticas que possam estar restringindo o acesso
DROP POLICY IF EXISTS "Public Access documents" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;

-- Criar uma política simples e direta de leitura para TODOS (anon e authenticated)
CREATE POLICY "Public_Read_Objects" ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'documentos');

-- Dar permissão de visualização para o role anon e authenticated explicitamente
GRANT SELECT ON storage.objects TO anon, authenticated;
