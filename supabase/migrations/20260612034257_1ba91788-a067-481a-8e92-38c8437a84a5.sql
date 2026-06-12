
-- ============ NOTICIAS: agendamento + categorias ============
CREATE TABLE public.noticias_categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  slug text NOT NULL UNIQUE,
  cor text DEFAULT '#3b82f6',
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.noticias_categorias TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.noticias_categorias TO authenticated;
GRANT ALL ON public.noticias_categorias TO service_role;
ALTER TABLE public.noticias_categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "noticias_categorias_public_read" ON public.noticias_categorias FOR SELECT USING (true);
CREATE POLICY "noticias_categorias_admin_write" ON public.noticias_categorias FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.noticias_categorias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.noticias
  ADD COLUMN IF NOT EXISTS agendado_para timestamptz,
  ADD COLUMN IF NOT EXISTS categoria_id uuid REFERENCES public.noticias_categorias(id) ON DELETE SET NULL;

-- ============ PAGINAS (editor visual) ============
CREATE TABLE public.paginas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  slug text NOT NULL UNIQUE,
  template text NOT NULL DEFAULT 'default',
  meta_descricao text,
  publicado boolean NOT NULL DEFAULT false,
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.paginas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.paginas TO authenticated;
GRANT ALL ON public.paginas TO service_role;
ALTER TABLE public.paginas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "paginas_public_read" ON public.paginas FOR SELECT USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "paginas_admin_write" ON public.paginas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.paginas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.paginas_blocos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pagina_id uuid NOT NULL REFERENCES public.paginas(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  conteudo jsonb NOT NULL DEFAULT '{}'::jsonb,
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_paginas_blocos_pagina ON public.paginas_blocos(pagina_id, ordem);
GRANT SELECT ON public.paginas_blocos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.paginas_blocos TO authenticated;
GRANT ALL ON public.paginas_blocos TO service_role;
ALTER TABLE public.paginas_blocos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "paginas_blocos_public_read" ON public.paginas_blocos FOR SELECT USING (true);
CREATE POLICY "paginas_blocos_admin_write" ON public.paginas_blocos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.paginas_blocos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ TRANSPARENCIA: módulos especializados ============
CREATE TABLE public.transparencia_licitacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  modalidade text NOT NULL,
  objeto text NOT NULL,
  valor_estimado numeric(14,2),
  data_abertura timestamptz,
  status text NOT NULL DEFAULT 'aberta',
  edital_url text,
  publicado boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.transparencia_licitacoes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparencia_licitacoes TO authenticated;
GRANT ALL ON public.transparencia_licitacoes TO service_role;
ALTER TABLE public.transparencia_licitacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lic_read" ON public.transparencia_licitacoes FOR SELECT USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "lic_write" ON public.transparencia_licitacoes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.transparencia_licitacoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.transparencia_contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  contratado text NOT NULL,
  objeto text NOT NULL,
  valor numeric(14,2),
  data_assinatura date,
  data_vigencia_fim date,
  documento_url text,
  publicado boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.transparencia_contratos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparencia_contratos TO authenticated;
GRANT ALL ON public.transparencia_contratos TO service_role;
ALTER TABLE public.transparencia_contratos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "con_read" ON public.transparencia_contratos FOR SELECT USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "con_write" ON public.transparencia_contratos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.transparencia_contratos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.transparencia_folha (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  servidor text NOT NULL,
  cargo text NOT NULL,
  vinculo text,
  mes_referencia date NOT NULL,
  remuneracao_bruta numeric(12,2),
  descontos numeric(12,2),
  remuneracao_liquida numeric(12,2),
  publicado boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.transparencia_folha TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparencia_folha TO authenticated;
GRANT ALL ON public.transparencia_folha TO service_role;
ALTER TABLE public.transparencia_folha ENABLE ROW LEVEL SECURITY;
CREATE POLICY "folha_read" ON public.transparencia_folha FOR SELECT USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "folha_write" ON public.transparencia_folha FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.transparencia_folha FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.transparencia_prestacao_contas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  periodo text NOT NULL,
  exercicio int,
  descricao text,
  documento_url text,
  publicado boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.transparencia_prestacao_contas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparencia_prestacao_contas TO authenticated;
GRANT ALL ON public.transparencia_prestacao_contas TO service_role;
ALTER TABLE public.transparencia_prestacao_contas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pc_read" ON public.transparencia_prestacao_contas FOR SELECT USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "pc_write" ON public.transparencia_prestacao_contas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.transparencia_prestacao_contas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ OUVIDORIA ============
CREATE TABLE public.ouvidoria_protocolos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo text NOT NULL UNIQUE DEFAULT 'OUV-' || to_char(now(),'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6)),
  nome text NOT NULL,
  email text,
  telefone text,
  tipo text NOT NULL DEFAULT 'solicitacao',
  assunto text NOT NULL,
  mensagem text NOT NULL,
  status text NOT NULL DEFAULT 'aberto',
  resposta text,
  respondido_em timestamptz,
  respondido_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.ouvidoria_protocolos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ouvidoria_protocolos TO authenticated;
GRANT ALL ON public.ouvidoria_protocolos TO service_role;
ALTER TABLE public.ouvidoria_protocolos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ouv_public_insert" ON public.ouvidoria_protocolos FOR INSERT WITH CHECK (true);
CREATE POLICY "ouv_admin_read" ON public.ouvidoria_protocolos FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "ouv_admin_update" ON public.ouvidoria_protocolos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "ouv_admin_delete" ON public.ouvidoria_protocolos FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ouvidoria_protocolos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ E-SIC ============
CREATE TABLE public.esic_solicitacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo text NOT NULL UNIQUE DEFAULT 'ESIC-' || to_char(now(),'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6)),
  nome text NOT NULL,
  cpf text,
  email text NOT NULL,
  telefone text,
  pedido text NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  resposta text,
  respondido_em timestamptz,
  respondido_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  prazo_resposta date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '20 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.esic_solicitacoes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.esic_solicitacoes TO authenticated;
GRANT ALL ON public.esic_solicitacoes TO service_role;
ALTER TABLE public.esic_solicitacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "esic_public_insert" ON public.esic_solicitacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "esic_admin_read" ON public.esic_solicitacoes FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "esic_admin_update" ON public.esic_solicitacoes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "esic_admin_delete" ON public.esic_solicitacoes FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.esic_solicitacoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ DIARIO OFICIAL ============
CREATE TABLE public.diario_oficial (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_edicao text NOT NULL,
  data_publicacao date NOT NULL,
  titulo text NOT NULL,
  resumo text,
  conteudo text,
  pdf_url text,
  publicado boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_diario_data ON public.diario_oficial(data_publicacao DESC);
CREATE INDEX idx_diario_search ON public.diario_oficial USING gin (to_tsvector('portuguese', coalesce(titulo,'') || ' ' || coalesce(resumo,'') || ' ' || coalesce(conteudo,'')));
GRANT SELECT ON public.diario_oficial TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diario_oficial TO authenticated;
GRANT ALL ON public.diario_oficial TO service_role;
ALTER TABLE public.diario_oficial ENABLE ROW LEVEL SECURITY;
CREATE POLICY "diario_read" ON public.diario_oficial FOR SELECT USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "diario_write" ON public.diario_oficial FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.diario_oficial FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ BANNERS ============
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  subtitulo text,
  imagem_url text NOT NULL,
  link_url text,
  ordem int NOT NULL DEFAULT 0,
  inicio_em timestamptz,
  fim_em timestamptz,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners_read" ON public.banners FOR SELECT USING (
  ativo AND (inicio_em IS NULL OR inicio_em <= now()) AND (fim_em IS NULL OR fim_em >= now())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')
);
CREATE POLICY "banners_write" ON public.banners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ POPUPS ============
CREATE TABLE public.popups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  mensagem text,
  imagem_url text,
  link_url text,
  tipo text NOT NULL DEFAULT 'aviso',
  inicio_em timestamptz,
  fim_em timestamptz,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.popups TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.popups TO authenticated;
GRANT ALL ON public.popups TO service_role;
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "popups_read" ON public.popups FOR SELECT USING (
  ativo AND (inicio_em IS NULL OR inicio_em <= now()) AND (fim_em IS NULL OR fim_em >= now())
  OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')
);
CREATE POLICY "popups_write" ON public.popups FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.popups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ GALERIA ============
CREATE TABLE public.galeria_albuns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  evento_data date,
  capa_url text,
  publicado boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.galeria_albuns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_albuns TO authenticated;
GRANT ALL ON public.galeria_albuns TO service_role;
ALTER TABLE public.galeria_albuns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gal_alb_read" ON public.galeria_albuns FOR SELECT USING (publicado OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "gal_alb_write" ON public.galeria_albuns FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.galeria_albuns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.galeria_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES public.galeria_albuns(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'foto',
  url text NOT NULL,
  thumbnail_url text,
  legenda text,
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_galeria_itens_album ON public.galeria_itens(album_id, ordem);
GRANT SELECT ON public.galeria_itens TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_itens TO authenticated;
GRANT ALL ON public.galeria_itens TO service_role;
ALTER TABLE public.galeria_itens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gal_itens_read" ON public.galeria_itens FOR SELECT USING (true);
CREATE POLICY "gal_itens_write" ON public.galeria_itens FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
