-- noticias
DROP POLICY IF EXISTS "noticias_public_read" ON public.noticias;
CREATE POLICY "noticias_anon_read" ON public.noticias FOR SELECT TO anon USING (publicado = true);
CREATE POLICY "noticias_auth_read" ON public.noticias FOR SELECT TO authenticated USING (publicado = true OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- paginas
DROP POLICY IF EXISTS "paginas_public_read" ON public.paginas;
CREATE POLICY "paginas_anon_read" ON public.paginas FOR SELECT TO anon USING (publicado = true);
CREATE POLICY "paginas_auth_read" ON public.paginas FOR SELECT TO authenticated USING (publicado = true OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- banners
DROP POLICY IF EXISTS "banners_read" ON public.banners;
CREATE POLICY "banners_anon_read" ON public.banners FOR SELECT TO anon USING (ativo AND (inicio_em IS NULL OR inicio_em <= now()) AND (fim_em IS NULL OR fim_em >= now()));
CREATE POLICY "banners_auth_read" ON public.banners FOR SELECT TO authenticated USING ((ativo AND (inicio_em IS NULL OR inicio_em <= now()) AND (fim_em IS NULL OR fim_em >= now())) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- popups
DROP POLICY IF EXISTS "popups_read" ON public.popups;
CREATE POLICY "popups_anon_read" ON public.popups FOR SELECT TO anon USING (ativo AND (inicio_em IS NULL OR inicio_em <= now()) AND (fim_em IS NULL OR fim_em >= now()));
CREATE POLICY "popups_auth_read" ON public.popups FOR SELECT TO authenticated USING ((ativo AND (inicio_em IS NULL OR inicio_em <= now()) AND (fim_em IS NULL OR fim_em >= now())) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- comissoes
DROP POLICY IF EXISTS "Comissoes ativas visiveis a todos" ON public.comissoes;
CREATE POLICY "comissoes_anon_read" ON public.comissoes FOR SELECT TO anon USING (ativo);
CREATE POLICY "comissoes_auth_read" ON public.comissoes FOR SELECT TO authenticated USING (ativo OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- documentos_oficiais
DROP POLICY IF EXISTS "Documentos publicados visiveis a todos" ON public.documentos_oficiais;
CREATE POLICY "documentos_oficiais_anon_read" ON public.documentos_oficiais FOR SELECT TO anon USING (publicado);
CREATE POLICY "documentos_oficiais_auth_read" ON public.documentos_oficiais FOR SELECT TO authenticated USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- diario_oficial
DROP POLICY IF EXISTS "diario_read" ON public.diario_oficial;
CREATE POLICY "diario_anon_read" ON public.diario_oficial FOR SELECT TO anon USING (publicado);
CREATE POLICY "diario_auth_read" ON public.diario_oficial FOR SELECT TO authenticated USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- galeria_albuns
DROP POLICY IF EXISTS "gal_alb_read" ON public.galeria_albuns;
CREATE POLICY "gal_alb_anon_read" ON public.galeria_albuns FOR SELECT TO anon USING (publicado);
CREATE POLICY "gal_alb_auth_read" ON public.galeria_albuns FOR SELECT TO authenticated USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- transparencia_contratos
DROP POLICY IF EXISTS "con_read" ON public.transparencia_contratos;
CREATE POLICY "con_anon_read" ON public.transparencia_contratos FOR SELECT TO anon USING (publicado);
CREATE POLICY "con_auth_read" ON public.transparencia_contratos FOR SELECT TO authenticated USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- transparencia_documentos
DROP POLICY IF EXISTS "transp_public_read" ON public.transparencia_documentos;
CREATE POLICY "transp_anon_read" ON public.transparencia_documentos FOR SELECT TO anon USING (publicado = true);
CREATE POLICY "transp_auth_read" ON public.transparencia_documentos FOR SELECT TO authenticated USING (publicado = true OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- transparencia_folha
DROP POLICY IF EXISTS "folha_read" ON public.transparencia_folha;
CREATE POLICY "folha_anon_read" ON public.transparencia_folha FOR SELECT TO anon USING (publicado);
CREATE POLICY "folha_auth_read" ON public.transparencia_folha FOR SELECT TO authenticated USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- transparencia_licitacoes
DROP POLICY IF EXISTS "lic_read" ON public.transparencia_licitacoes;
CREATE POLICY "lic_anon_read" ON public.transparencia_licitacoes FOR SELECT TO anon USING (publicado);
CREATE POLICY "lic_auth_read" ON public.transparencia_licitacoes FOR SELECT TO authenticated USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- transparencia_prestacao_contas
DROP POLICY IF EXISTS "pc_read" ON public.transparencia_prestacao_contas;
CREATE POLICY "pc_anon_read" ON public.transparencia_prestacao_contas FOR SELECT TO anon USING (publicado);
CREATE POLICY "pc_auth_read" ON public.transparencia_prestacao_contas FOR SELECT TO authenticated USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- transparency_links
DROP POLICY IF EXISTS "Public can read active transparency links" ON public.transparency_links;
CREATE POLICY "transparency_links_anon_read" ON public.transparency_links FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "transparency_links_auth_read" ON public.transparency_links FOR SELECT TO authenticated USING (is_active = true OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));