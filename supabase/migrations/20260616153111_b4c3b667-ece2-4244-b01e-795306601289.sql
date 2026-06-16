CREATE TABLE public.transparency_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'ExternalLink',
  path text NOT NULL DEFAULT '',
  external_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.transparency_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparency_links TO authenticated;
GRANT ALL ON public.transparency_links TO service_role;

ALTER TABLE public.transparency_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active transparency links"
ON public.transparency_links FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert transparency links"
ON public.transparency_links FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update transparency links"
ON public.transparency_links FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete transparency links"
ON public.transparency_links FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_transparency_links_updated_at
BEFORE UPDATE ON public.transparency_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.transparency_links (title, description, icon, path, sort_order) VALUES
  ('Receitas', 'Arrecadação, repasses e demais entradas registradas no portal oficial.', 'Banknote', 'receitas-e-despesas/receita', 10),
  ('Despesas', 'Consulta sintética das despesas públicas por período e classificação.', 'Receipt', 'receitas-e-despesas/despesa-sintetica', 20),
  ('Empenhos', 'Empenhos emitidos, favorecidos, liquidações e valores vinculados.', 'WalletCards', 'receitas-e-despesas/empenho', 30),
  ('Liquidações', 'Liquidações de despesas registradas oficialmente.', 'HandCoins', 'receitas-e-despesas/liquidacao', 40),
  ('Pagamentos', 'Pagamentos efetuados a fornecedores e servidores.', 'Banknote', 'receitas-e-despesas/pagamento', 50),
  ('Restos a Pagar', 'Empenhos inscritos em restos a pagar processados e não processados.', 'FileClock', 'receitas-e-despesas/restos-a-pagar', 60),
  ('Licitações', 'Procedimentos licitatórios, modalidades, situações e documentos oficiais.', 'Gavel', 'contratos-convenios-e-licitacoes/procedimentos-licitatorios', 70),
  ('Contratos', 'Contratos celebrados, fornecedores, vigência, objeto e anexos.', 'FileSignature', 'contratos-convenios-e-licitacoes/contrato', 80),
  ('Aditivos', 'Aditamentos e informações complementares vinculadas aos contratos.', 'FileClock', 'contratos-convenios-e-licitacoes/contrato', 90),
  ('Convênios', 'Convênios celebrados pela entidade com órgãos e instituições.', 'FileSignature', 'contratos-convenios-e-licitacoes/convenio', 100),
  ('Dispensas e Inexigibilidades', 'Contratações diretas, dispensas, inexigibilidades e processos relacionados.', 'FileCheck2', 'contratos-convenios-e-licitacoes/dispensas-inexigibilidades', 110),
  ('Atas de Registro de Preços', 'Atas de registro de preços disponíveis para consulta.', 'FileText', 'contratos-convenios-e-licitacoes/ata-de-registro-de-preco', 120),
  ('Folha de Pagamento', 'Servidores, remuneração, cargos e informações de pessoal.', 'Users', 'orgaos-e-servidores/servidor', 130),
  ('Cargos e Salários', 'Estrutura de cargos, funções e salários da entidade.', 'BriefcaseBusiness', 'orgaos-e-servidores/cargo', 140),
  ('Diárias', 'Diárias concedidas, beneficiários, destinos, datas e valores.', 'BriefcaseBusiness', 'orgaos-e-servidores/diaria', 150),
  ('Viagens', 'Viagens oficiais realizadas por servidores e agentes públicos.', 'BriefcaseBusiness', 'orgaos-e-servidores/viagem', 160),
  ('Estagiários', 'Relação de estagiários vinculados à entidade.', 'Users', 'orgaos-e-servidores/estagiario', 170),
  ('Patrimônio', 'Bens patrimoniais, almoxarifado e movimentações disponíveis.', 'Building2', 'receitas-e-despesas/patrimonio-e-almoxarifado', 180),
  ('Veículos', 'Frota de veículos oficiais da entidade.', 'BriefcaseBusiness', 'receitas-e-despesas/veiculo', 190),
  ('Prestação de Contas', 'Balanços, pareceres, contas anuais e relatórios publicados.', 'ShieldCheck', 'planejamento-e-politicas-publicas/parecer-previo', 200),
  ('Relatórios Fiscais (RGF)', 'Relatórios de gestão fiscal e demonstrativos de responsabilidade fiscal.', 'Landmark', 'responsabilidade-fiscal/relatorio-de-gestao-fiscal', 210),
  ('Relatórios Resumidos (RREO)', 'Relatórios resumidos da execução orçamentária.', 'Landmark', 'responsabilidade-fiscal/relatorio-resumido-da-execucao-orcamentaria', 220),
  ('PPA, LDO e LOA', 'Plano Plurianual, Diretrizes Orçamentárias e Orçamento Anual.', 'BookOpen', 'planejamento-e-politicas-publicas/instrumentos-de-planejamento', 230),
  ('Leis e Atos', 'Legislação municipal, atos infralegais, resoluções e publicações normativas.', 'Scale', 'legislacao-e-publicacoes/leis-e-atos-infralegais', 240),
  ('Diário Oficial', 'Publicações oficiais, atos administrativos e documentos de interesse público.', 'BookOpen', 'legislacao-e-publicacoes/outras-publicacoes', 250),
  ('e-SIC', 'Serviço Eletrônico de Informação ao Cidadão.', 'ShieldCheck', 'esic', 260),
  ('Ouvidoria', 'Canal de ouvidoria para manifestações dos cidadãos.', 'Users', 'ouvidoria', 270),
  ('Perguntas Frequentes', 'Respostas às dúvidas mais comuns sobre o portal e a entidade.', 'BookOpen', 'perguntas-frequentes', 280);
