
-- Add transparencia ativa settings to site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS transparencia_ativa_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS transparencia_ativa_intro TEXT,
  ADD COLUMN IF NOT EXISTS transparencia_portal_url TEXT DEFAULT 'https://camaraadelandia.megasofttransparencia.com.br/',
  ADD COLUMN IF NOT EXISTS transparencia_portal_button_label TEXT DEFAULT 'Acessar Portal da Transparência Completo';

-- Modules table for Transparência Ativa cards
CREATE TABLE IF NOT EXISTS public.transparencia_modulos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT,
  icone TEXT,
  url TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.transparencia_modulos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transparencia_modulos TO authenticated;
GRANT ALL ON public.transparencia_modulos TO service_role;

ALTER TABLE public.transparencia_modulos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active modules" ON public.transparencia_modulos
  FOR SELECT USING (true);

CREATE POLICY "Admins manage modules" ON public.transparencia_modulos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_transparencia_modulos_updated_at
  BEFORE UPDATE ON public.transparencia_modulos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default Megasoft modules
INSERT INTO public.transparencia_modulos (nome, descricao, categoria, icone, url, ordem) VALUES
  ('Receitas', 'Arrecadação e repasses recebidos.', 'Financeiro', 'Banknote', 'https://camaraadelandia.megasofttransparencia.com.br/Receitas', 1),
  ('Despesas', 'Gastos por órgão e categoria.', 'Financeiro', 'Receipt', 'https://camaraadelandia.megasofttransparencia.com.br/Despesas', 2),
  ('Empenhos', 'Empenhos emitidos.', 'Financeiro', 'FileText', 'https://camaraadelandia.megasofttransparencia.com.br/Empenhos', 3),
  ('Pagamentos', 'Pagamentos realizados.', 'Financeiro', 'DollarSign', 'https://camaraadelandia.megasofttransparencia.com.br/Pagamentos', 4),
  ('Licitações', 'Processos licitatórios e editais.', 'Contratações', 'Gavel', 'https://camaraadelandia.megasofttransparencia.com.br/Licitacoes', 5),
  ('Contratos', 'Contratos firmados pela Câmara.', 'Contratações', 'FileCheck', 'https://camaraadelandia.megasofttransparencia.com.br/Contratos', 6),
  ('Folha de Pagamento', 'Remuneração de servidores.', 'Pessoal', 'Wallet', 'https://camaraadelandia.megasofttransparencia.com.br/Folha', 7),
  ('Servidores', 'Quadro de servidores ativos.', 'Pessoal', 'Users', 'https://camaraadelandia.megasofttransparencia.com.br/Servidores', 8),
  ('Diárias', 'Diárias e ressarcimentos.', 'Pessoal', 'Plane', 'https://camaraadelandia.megasofttransparencia.com.br/Diarias', 9),
  ('Patrimônio', 'Bens patrimoniais.', 'Administrativo', 'Package', 'https://camaraadelandia.megasofttransparencia.com.br/Patrimonio', 10),
  ('Orçamento', 'Lei orçamentária e execução.', 'Planejamento', 'PieChart', 'https://camaraadelandia.megasofttransparencia.com.br/Orcamento', 11),
  ('Balancetes', 'Balancetes contábeis.', 'Planejamento', 'BarChart3', 'https://camaraadelandia.megasofttransparencia.com.br/Balancetes', 12),
  ('RGF', 'Relatório de Gestão Fiscal.', 'Fiscal', 'ScrollText', 'https://camaraadelandia.megasofttransparencia.com.br/RGF', 13),
  ('RREO', 'Relatório Resumido da Execução Orçamentária.', 'Fiscal', 'FileBarChart', 'https://camaraadelandia.megasofttransparencia.com.br/RREO', 14),
  ('LAI', 'Lei de Acesso à Informação.', 'Cidadão', 'BookOpen', 'https://camaraadelandia.megasofttransparencia.com.br/LAI', 15),
  ('e-SIC', 'Sistema Eletrônico de Informação ao Cidadão.', 'Cidadão', 'Mail', 'https://camaraadelandia.megasofttransparencia.com.br/eSIC', 16),
  ('Ouvidoria', 'Canal de manifestações.', 'Cidadão', 'MessageSquare', 'https://camaraadelandia.megasofttransparencia.com.br/Ouvidoria', 17)
ON CONFLICT DO NOTHING;
