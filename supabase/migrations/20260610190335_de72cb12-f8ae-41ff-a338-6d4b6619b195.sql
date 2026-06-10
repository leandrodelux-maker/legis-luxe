CREATE TABLE public.mesa_diretora (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    vereador_id UUID NOT NULL REFERENCES public.vereadores(id) ON DELETE CASCADE,
    cargo TEXT NOT NULL,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.mesa_diretora TO anon, authenticated;
GRANT ALL ON public.mesa_diretora TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.mesa_diretora TO authenticated;

ALTER TABLE public.mesa_diretora ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view Mesa Diretora" ON public.mesa_diretora FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage Mesa Diretora" ON public.mesa_diretora FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_mesa_diretora_updated_at BEFORE UPDATE ON public.mesa_diretora FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();