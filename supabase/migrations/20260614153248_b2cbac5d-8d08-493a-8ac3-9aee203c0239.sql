
-- ============================================================
-- Security hardening migration
-- ============================================================

-- 1) STORAGE: documentos bucket — remove public/any-authenticated writes
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access" ON storage.objects;

CREATE POLICY "documentos admin/editor insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documentos'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "documentos admin/editor update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documentos'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  )
  WITH CHECK (
    bucket_id = 'documentos'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "documentos admin/editor delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'documentos'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

-- 2) STORAGE: vereadores bucket — remove all anonymous write policies
DROP POLICY IF EXISTS "Public Insert vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Public Update vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Upload_Publico_Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Update_Publico_Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Delete_Publico_Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Permitir Upload Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Permitir Update Vereadores" ON storage.objects;
DROP POLICY IF EXISTS "Permitir Delete Vereadores" ON storage.objects;

CREATE POLICY "vereadores admin/editor insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'vereadores'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "vereadores admin/editor update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'vereadores'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  )
  WITH CHECK (
    bucket_id = 'vereadores'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "vereadores admin/editor delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'vereadores'
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

-- 3) mesa_diretora — restrict writes to admin/editor
DROP POLICY IF EXISTS "Authenticated users can manage Mesa Diretora" ON public.mesa_diretora;

CREATE POLICY "Admin/editor manage mesa_diretora" ON public.mesa_diretora
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 4) sessoes_presencas & sessoes_votacoes — restrict writes to admin/editor
DROP POLICY IF EXISTS "Enable all for authenticated sessoes_presencas" ON public.sessoes_presencas;
DROP POLICY IF EXISTS "Enable all for authenticated sessoes_votacoes" ON public.sessoes_votacoes;

CREATE POLICY "Admin/editor manage sessoes_presencas" ON public.sessoes_presencas
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin/editor manage sessoes_votacoes" ON public.sessoes_votacoes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 5) Revoke EXECUTE on SECURITY DEFINER helper functions from anon/authenticated.
--    They are invoked internally by RLS policies and triggers; revoking direct
--    client EXECUTE does not affect that evaluation.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
