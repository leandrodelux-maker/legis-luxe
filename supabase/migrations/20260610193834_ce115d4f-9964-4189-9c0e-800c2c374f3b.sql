-- Ensure we have a consistent status set
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'legislative_status') THEN
        CREATE TYPE legislative_status AS ENUM ('protocolado', 'comissao', 'plenario', 'aprovado', 'sancionado');
    END IF;
END $$;

-- Adding columns for richer flow
ALTER TABLE public.projetos_legislativos ADD COLUMN IF NOT EXISTS autor_id UUID REFERENCES public.vereadores(id);
ALTER TABLE public.projetos_legislativos ADD COLUMN IF NOT EXISTS tramitacao TEXT;

-- We don't strictly need to force ENUM if we use text with check, simpler for migrations
ALTER TABLE public.projetos_legislativos DROP CONSTRAINT IF EXISTS check_status;
ALTER TABLE public.projetos_legislativos ADD CONSTRAINT check_status 
CHECK (status IN ('protocolado', 'comissao', 'plenario', 'aprovado', 'sancionado', 'arquivado', 'rejeitado'));

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projetos_legislativos TO authenticated;
GRANT ALL ON public.projetos_legislativos TO service_role;
GRANT SELECT ON public.projetos_legislativos TO anon;
