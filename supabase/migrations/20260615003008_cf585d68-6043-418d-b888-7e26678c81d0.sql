DROP POLICY IF EXISTS "esic_public_insert" ON public.esic_solicitacoes;
CREATE POLICY "esic_public_insert"
ON public.esic_solicitacoes
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(nome)) BETWEEN 2 AND 180
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND length(trim(pedido)) BETWEEN 10 AND 5000
  AND status = 'pendente'
);

DROP POLICY IF EXISTS "ouv_public_insert" ON public.ouvidoria_protocolos;
CREATE POLICY "ouv_public_insert"
ON public.ouvidoria_protocolos
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(nome)) BETWEEN 2 AND 180
  AND (email IS NULL OR email = '' OR email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
  AND length(trim(tipo)) BETWEEN 2 AND 80
  AND length(trim(assunto)) BETWEEN 3 AND 180
  AND length(trim(mensagem)) BETWEEN 10 AND 5000
  AND status = 'aberto'
);