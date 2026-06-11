ALTER TABLE public.vereadores 
ADD COLUMN IF NOT EXISTS data_nascimento DATE,
ADD COLUMN IF NOT EXISTS naturalidade TEXT,
ADD COLUMN IF NOT EXISTS escolaridade TEXT,
ADD COLUMN IF NOT EXISTS profissao TEXT,
ADD COLUMN IF NOT EXISTS redes_sociais JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{"projetos": 0, "presencas": 0, "participacoes": 0}'::jsonb;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vereadores TO authenticated;
GRANT ALL ON public.vereadores TO service_role;