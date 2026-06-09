
-- Roles enum + user_roles + has_role function
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_self_select" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ NOTICIAS ============
CREATE TABLE public.noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  resumo TEXT,
  conteudo TEXT NOT NULL,
  imagem_url TEXT,
  categoria TEXT,
  autor TEXT,
  publicado BOOLEAN NOT NULL DEFAULT false,
  destaque BOOLEAN NOT NULL DEFAULT false,
  publicado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.noticias TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.noticias TO authenticated;
GRANT ALL ON public.noticias TO service_role;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "noticias_public_read" ON public.noticias FOR SELECT USING (publicado = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "noticias_admin_all" ON public.noticias FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.noticias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ VEREADORES ============
CREATE TABLE public.vereadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  partido TEXT,
  cargo TEXT,
  foto_url TEXT,
  biografia TEXT,
  email TEXT,
  telefone TEXT,
  gabinete TEXT,
  mandato_inicio DATE,
  mandato_fim DATE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vereadores TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.vereadores TO authenticated;
GRANT ALL ON public.vereadores TO service_role;
ALTER TABLE public.vereadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vereadores_public_read" ON public.vereadores FOR SELECT USING (true);
CREATE POLICY "vereadores_admin_all" ON public.vereadores FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.vereadores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SESSOES ============
CREATE TABLE public.sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo TEXT,
  data_sessao TIMESTAMPTZ NOT NULL,
  local TEXT,
  status TEXT NOT NULL DEFAULT 'agendada',
  pauta TEXT,
  ata_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sessoes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sessoes TO authenticated;
GRANT ALL ON public.sessoes TO service_role;
ALTER TABLE public.sessoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessoes_public_read" ON public.sessoes FOR SELECT USING (true);
CREATE POLICY "sessoes_admin_all" ON public.sessoes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.sessoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PROJETOS LEGISLATIVOS ============
CREATE TABLE public.projetos_legislativos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  ano INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  ementa TEXT NOT NULL,
  autor TEXT,
  status TEXT NOT NULL DEFAULT 'em_tramitacao',
  data_apresentacao DATE,
  documento_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projetos_legislativos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projetos_legislativos TO authenticated;
GRANT ALL ON public.projetos_legislativos TO service_role;
ALTER TABLE public.projetos_legislativos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projetos_public_read" ON public.projetos_legislativos FOR SELECT USING (true);
CREATE POLICY "projetos_admin_all" ON public.projetos_legislativos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projetos_legislativos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ TRANSPARENCIA ============
CREATE TABLE public.transparencia_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  arquivo_url TEXT,
  ano INTEGER,
  mes INTEGER,
  publicado BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.transparencia_documentos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.transparencia_documentos TO authenticated;
GRANT ALL ON public.transparencia_documentos TO service_role;
ALTER TABLE public.transparencia_documentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transp_public_read" ON public.transparencia_documentos FOR SELECT USING (publicado = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "transp_admin_all" ON public.transparencia_documentos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.transparencia_documentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ ACESSO RAPIDO ============
CREATE TABLE public.acesso_rapido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Link',
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.acesso_rapido TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.acesso_rapido TO authenticated;
GRANT ALL ON public.acesso_rapido TO service_role;
ALTER TABLE public.acesso_rapido ENABLE ROW LEVEL SECURITY;
CREATE POLICY "acesso_public_read" ON public.acesso_rapido FOR SELECT USING (true);
CREATE POLICY "acesso_admin_all" ON public.acesso_rapido FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.acesso_rapido FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed Acesso Rápido defaults
INSERT INTO public.acesso_rapido (label, url, icon, ordem) VALUES
  ('Vereadores', '/vereadores', 'Users', 1),
  ('Sessões', '/sessoes', 'Calendar', 2),
  ('Notícias', '/noticias', 'Newspaper', 3),
  ('Transparência', '/transparencia', 'ShieldCheck', 4),
  ('Contato', '/contato', 'Mail', 5);
