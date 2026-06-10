CREATE TABLE IF NOT EXISTS public.sessoes_presencas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sessao_id UUID NOT NULL REFERENCES public.sessoes(id) ON DELETE CASCADE,
    vereador_id UUID NOT NULL REFERENCES public.vereadores(id) ON DELETE CASCADE,
    presente BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(sessao_id, vereador_id)
);

CREATE TABLE IF NOT EXISTS public.sessoes_votacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sessao_id UUID NOT NULL REFERENCES public.sessoes(id) ON DELETE CASCADE,
    vereador_id UUID NOT NULL REFERENCES public.vereadores(id) ON DELETE CASCADE,
    materia_id UUID REFERENCES public.projetos_legislativos(id) ON DELETE SET NULL,
    voto TEXT CHECK (voto IN ('sim', 'nao', 'abstencao')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(sessao_id, vereador_id, materia_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessoes_presencas TO authenticated;
GRANT ALL ON public.sessoes_presencas TO service_role;
GRANT SELECT ON public.sessoes_presencas TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessoes_votacoes TO authenticated;
GRANT ALL ON public.sessoes_votacoes TO service_role;
GRANT SELECT ON public.sessoes_votacoes TO anon;

ALTER TABLE public.sessoes_presencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessoes_votacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated sessoes_presencas" ON public.sessoes_presencas FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable read for public sessoes_presencas" ON public.sessoes_presencas FOR SELECT USING (true);

CREATE POLICY "Enable all for authenticated sessoes_votacoes" ON public.sessoes_votacoes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable read for public sessoes_votacoes" ON public.sessoes_votacoes FOR SELECT USING (true);
