
CREATE TABLE IF NOT EXISTS public.transparency_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name TEXT NOT NULL DEFAULT 'Câmara Municipal',
  portal_base_url TEXT NOT NULL DEFAULT 'https://camaraadelandia.megasofttransparencia.com.br/',
  intro_text TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.transparency_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparency_settings TO authenticated;
GRANT ALL ON public.transparency_settings TO service_role;

ALTER TABLE public.transparency_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read transparency settings" ON public.transparency_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins insert transparency settings" ON public.transparency_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update transparency settings" ON public.transparency_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete transparency settings" ON public.transparency_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_transparency_settings_updated_at
  BEFORE UPDATE ON public.transparency_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.transparency_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  link_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.transparency_modules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparency_modules TO authenticated;
GRANT ALL ON public.transparency_modules TO service_role;

ALTER TABLE public.transparency_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read transparency modules" ON public.transparency_modules
  FOR SELECT USING (true);
CREATE POLICY "Admins insert transparency modules" ON public.transparency_modules
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update transparency modules" ON public.transparency_modules
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete transparency modules" ON public.transparency_modules
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_transparency_modules_updated_at
  BEFORE UPDATE ON public.transparency_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed settings (single row)
INSERT INTO public.transparency_settings (entity_name, portal_base_url, intro_text)
SELECT 'Câmara Municipal de Adelândia',
       'https://camaraadelandia.megasofttransparencia.com.br/',
       'Acesse de forma rápida, organizada e transparente as informações públicas da Câmara Municipal. Consulte receitas, despesas, contratos, folha de pagamento, licitações e muito mais.'
WHERE NOT EXISTS (SELECT 1 FROM public.transparency_settings);

-- Seed modules
INSERT INTO public.transparency_modules (title, description, category, icon, link_url, display_order) VALUES
  ('Receitas', 'Arrecadação e repasses recebidos.', 'Financeiro', 'Banknote', 'https://camaraadelandia.megasofttransparencia.com.br/Receitas', 1),
  ('Despesas', 'Gastos por órgão e categoria.', 'Financeiro', 'Receipt', 'https://camaraadelandia.megasofttransparencia.com.br/Despesas', 2),
  ('Empenhos', 'Empenhos emitidos.', 'Financeiro', 'FileText', 'https://camaraadelandia.megasofttransparencia.com.br/Empenhos', 3),
  ('Pagamentos', 'Pagamentos realizados.', 'Financeiro', 'DollarSign', 'https://camaraadelandia.megasofttransparencia.com.br/Pagamentos', 4),
  ('Licitações', 'Processos licitatórios e editais.', 'Licitações e Contratos', 'Gavel', 'https://camaraadelandia.megasofttransparencia.com.br/Licitacoes', 5),
  ('Contratos', 'Contratos firmados pela Câmara.', 'Licitações e Contratos', 'FileCheck', 'https://camaraadelandia.megasofttransparencia.com.br/Contratos', 6),
  ('Folha de Pagamento', 'Remuneração de servidores.', 'Pessoal', 'Wallet', 'https://camaraadelandia.megasofttransparencia.com.br/Folha', 7),
  ('Servidores', 'Quadro de servidores ativos.', 'Pessoal', 'Users', 'https://camaraadelandia.megasofttransparencia.com.br/Servidores', 8),
  ('Diárias', 'Diárias e ressarcimentos.', 'Pessoal', 'Plane', 'https://camaraadelandia.megasofttransparencia.com.br/Diarias', 9),
  ('Orçamento', 'Lei orçamentária e execução.', 'Planejamento e Orçamento', 'PieChart', 'https://camaraadelandia.megasofttransparencia.com.br/Orcamento', 10),
  ('Patrimônio', 'Bens patrimoniais.', 'Planejamento e Orçamento', 'Package', 'https://camaraadelandia.megasofttransparencia.com.br/Patrimonio', 11),
  ('Balancetes', 'Balancetes contábeis.', 'Contabilidade', 'BarChart3', 'https://camaraadelandia.megasofttransparencia.com.br/Balancetes', 12),
  ('RGF', 'Relatório de Gestão Fiscal.', 'Contabilidade', 'ScrollText', 'https://camaraadelandia.megasofttransparencia.com.br/RGF', 13),
  ('RREO', 'Relatório Resumido da Execução Orçamentária.', 'Contabilidade', 'FileBarChart', 'https://camaraadelandia.megasofttransparencia.com.br/RREO', 14),
  ('Ouvidoria', 'Canal de manifestações do cidadão.', 'Controle Social', 'MessageSquare', 'https://camaraadelandia.megasofttransparencia.com.br/Ouvidoria', 15),
  ('e-SIC', 'Sistema Eletrônico de Informação ao Cidadão.', 'Acesso à Informação', 'Mail', 'https://camaraadelandia.megasofttransparencia.com.br/eSIC', 16),
  ('LAI', 'Lei de Acesso à Informação.', 'Acesso à Informação', 'BookOpen', 'https://camaraadelandia.megasofttransparencia.com.br/LAI', 17)
ON CONFLICT DO NOTHING;
