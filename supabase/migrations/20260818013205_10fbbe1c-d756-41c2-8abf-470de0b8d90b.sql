-- DOCUMENTOS OFICIAIS
CREATE TABLE public.documentos_oficiais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria text NOT NULL,
  titulo text NOT NULL,
  descricao text,
  data_documento text,
  download_url text NOT NULL,
  viewer_url text,
  ordem integer NOT NULL DEFAULT 0,
  publicado boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.documentos_oficiais TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documentos_oficiais TO authenticated;
GRANT ALL ON public.documentos_oficiais TO service_role;

ALTER TABLE public.documentos_oficiais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Documentos publicados visiveis a todos"
  ON public.documentos_oficiais FOR SELECT
  USING (publicado OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins e editores gerenciam documentos"
  ON public.documentos_oficiais FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.documentos_oficiais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- COMISSOES
CREATE TABLE public.comissoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  sigla text NOT NULL,
  icone text,
  competencia text,
  ordem integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.comissoes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comissoes TO authenticated;
GRANT ALL ON public.comissoes TO service_role;

ALTER TABLE public.comissoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comissoes ativas visiveis a todos"
  ON public.comissoes FOR SELECT
  USING (ativo OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins e editores gerenciam comissoes"
  ON public.comissoes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.comissoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.comissoes_membros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comissao_id uuid NOT NULL REFERENCES public.comissoes(id) ON DELETE CASCADE,
  vereador_id uuid REFERENCES public.vereadores(id) ON DELETE SET NULL,
  nome text NOT NULL,
  funcao text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.comissoes_membros TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comissoes_membros TO authenticated;
GRANT ALL ON public.comissoes_membros TO service_role;

ALTER TABLE public.comissoes_membros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Membros de comissoes visiveis a todos"
  ON public.comissoes_membros FOR SELECT USING (true);

CREATE POLICY "Admins e editores gerenciam membros de comissoes"
  ON public.comissoes_membros FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.comissoes_membros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SEED: documentos oficiais já publicados no site
INSERT INTO public.documentos_oficiais (categoria, titulo, descricao, data_documento, download_url, viewer_url, ordem) VALUES
('carta-de-servicos', 'Carta de Serviços ao Usuário', 'Serviços prestados pela Câmara, formas de acesso, requisitos e prazos.', '29/12/2022',
 'https://camaradeadelandia.go.gov.br/wp-admin/admin-ajax.php?juwpfisadmin=false&action=wpfd&task=file.download&wpfd_category_id=73&wpfd_file_id=5292&token=',
 'https://docs.google.com/viewer?url=https%3A%2F%2Fcamaradeadelandia.go.gov.br%2Fwp-admin%2Fadmin-ajax.php%3Fjuwpfisadmin%3Dfalse%26action%3Dwpfd%26task%3Dfile.download%26wpfd_category_id%3D73%26wpfd_file_id%3D5292%26token%3D%26preview%3D1&embedded=true', 1),
('lei-organica-municipal', 'Lei Orgânica do Município de Adelândia', 'Texto consolidado da Lei Orgânica Municipal.', '06/10/2023',
 'https://camaradeadelandia.go.gov.br/wp-admin/admin-ajax.php?juwpfisadmin=false&action=wpfd&task=file.download&wpfd_category_id=68&wpfd_file_id=6813&token=',
 'https://docs.google.com/viewer?url=https%3A%2F%2Fcamaradeadelandia.go.gov.br%2Fwp-admin%2Fadmin-ajax.php%3Fjuwpfisadmin%3Dfalse%26action%3Dwpfd%26task%3Dfile.download%26wpfd_category_id%3D68%26wpfd_file_id%3D6813%26token%3D%26preview%3D1&embedded=true', 1),
('regimento-interno', 'Regimento Interno — Câmara Municipal', 'Texto do Regimento Interno em vigor.', '06/10/2023',
 'https://camaradeadelandia.go.gov.br/wp-admin/admin-ajax.php?juwpfisadmin=false&action=wpfd&task=file.download&wpfd_category_id=63&wpfd_file_id=6812&token=',
 'https://docs.google.com/viewer?url=https%3A%2F%2Fcamaradeadelandia.go.gov.br%2Fwp-admin%2Fadmin-ajax.php%3Fjuwpfisadmin%3Dfalse%26action%3Dwpfd%26task%3Dfile.download%26wpfd_category_id%3D63%26wpfd_file_id%3D6812%26token%3D%26preview%3D1&embedded=true', 1);

-- SEED: comissões permanentes
INSERT INTO public.comissoes (id, nome, sigla, icone, competencia, ordem) VALUES
('11111111-1111-4111-8111-111111111111', 'Comissão de Constituição, Justiça e Redação', 'CCJR', 'Scale',
 'Analisa a constitucionalidade, a legalidade, a juridicidade e a técnica legislativa das proposições, além da redação final dos textos aprovados.', 1),
('22222222-2222-4222-8222-222222222222', 'Comissão de Finanças, Orçamento, Economia, Obras, Serviços Públicos e Urbanismo', 'CFO', 'Coins',
 'Examina matérias de natureza financeira e orçamentária, prestação de contas, obras públicas, serviços urbanos e desenvolvimento econômico do município.', 2),
('33333333-3333-4333-8333-333333333333', 'Comissão de Educação, Cultura, Saúde, Assistência Social, Lazer, Esporte e Meio Ambiente', 'CECS', 'GraduationCap',
 'Aprecia proposições relativas a educação, cultura, saúde pública, assistência social, esporte, lazer e proteção ao meio ambiente.', 3);

INSERT INTO public.comissoes_membros (comissao_id, nome, funcao, ordem, vereador_id)
SELECT m.comissao_id, m.nome, m.funcao, m.ordem,
       (SELECT v.id FROM public.vereadores v WHERE lower(v.nome) = lower(m.nome) LIMIT 1)
FROM (VALUES
  ('11111111-1111-4111-8111-111111111111'::uuid, 'Ana Glaucia Cardoso da Silva Mendonça', 'Presidente', 1),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'Ana Maria Marques de Assis', 'Vice-Presidente', 2),
  ('11111111-1111-4111-8111-111111111111'::uuid, 'Matheus Teodoro Pinheiro', 'Relator', 3),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'Rodrigo Teixeira Amaral', 'Presidente', 1),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'José Divino Pereira', 'Vice-Presidente', 2),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'Maria José Pereira de Morais Avelar', 'Relator', 3),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'João Carlos Barra', 'Presidente', 1),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'Ângela Diniz de Oliveira', 'Vice-Presidente', 2),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'José Divino Pereira', 'Relator', 3)
) AS m(comissao_id, nome, funcao, ordem);