CREATE OR REPLACE FUNCTION public.sync_sessao_counters(_sessao_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.sessoes s
  SET qtd_presencas = (
        SELECT count(*) FROM public.sessoes_presencas p
        WHERE p.sessao_id = s.id AND p.presente IS TRUE
      ),
      qtd_votacoes = (
        SELECT count(*) FROM public.sessoes_votacoes v
        WHERE v.sessao_id = s.id AND v.voto IS NOT NULL
      )
  WHERE s.id = _sessao_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_sync_sessao_counters()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.sync_sessao_counters(OLD.sessao_id);
    RETURN OLD;
  END IF;
  PERFORM public.sync_sessao_counters(NEW.sessao_id);
  IF TG_OP = 'UPDATE' AND OLD.sessao_id IS DISTINCT FROM NEW.sessao_id THEN
    PERFORM public.sync_sessao_counters(OLD.sessao_id);
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_sessao_counters(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.trg_sync_sessao_counters() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS sync_counters_presencas ON public.sessoes_presencas;
CREATE TRIGGER sync_counters_presencas
AFTER INSERT OR UPDATE OR DELETE ON public.sessoes_presencas
FOR EACH ROW EXECUTE FUNCTION public.trg_sync_sessao_counters();

DROP TRIGGER IF EXISTS sync_counters_votacoes ON public.sessoes_votacoes;
CREATE TRIGGER sync_counters_votacoes
AFTER INSERT OR UPDATE OR DELETE ON public.sessoes_votacoes
FOR EACH ROW EXECUTE FUNCTION public.trg_sync_sessao_counters();

UPDATE public.sessoes s
SET qtd_presencas = (
      SELECT count(*) FROM public.sessoes_presencas p
      WHERE p.sessao_id = s.id AND p.presente IS TRUE
    ),
    qtd_votacoes = (
      SELECT count(*) FROM public.sessoes_votacoes v
      WHERE v.sessao_id = s.id AND v.voto IS NOT NULL
    );

ALTER TABLE public.sessoes ALTER COLUMN qtd_presencas SET DEFAULT 0;
ALTER TABLE public.sessoes ALTER COLUMN qtd_votacoes SET DEFAULT 0;