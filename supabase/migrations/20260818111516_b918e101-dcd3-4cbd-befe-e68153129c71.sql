CREATE OR REPLACE FUNCTION public.audit_site_settings_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contato_cols text[] := ARRAY['contact_phone','contact_email','contact_hours','whatsapp','endereco','nome_camara','redes_sociais'];
  lgpd_cols text[] := ARRAY['cookies_enabled','cookies_text','privacy_policy','terms_of_use'];
  col text;
  old_json jsonb := to_jsonb(OLD);
  new_json jsonb := to_jsonb(NEW);
  changes jsonb := '[]'::jsonb;
  grupos text[] := '{}';
  grupo text;
  email text;
BEGIN
  FOREACH col IN ARRAY (contato_cols || lgpd_cols) LOOP
    IF old_json->col IS DISTINCT FROM new_json->col THEN
      grupo := CASE WHEN col = ANY(lgpd_cols) THEN 'lgpd' ELSE 'contato' END;
      IF NOT (grupo = ANY(grupos)) THEN
        grupos := grupos || grupo;
      END IF;
      changes := changes || jsonb_build_object(
        'campo', col,
        'grupo', grupo,
        'de', old_json->col,
        'para', new_json->col
      );
    END IF;
  END LOOP;

  IF jsonb_array_length(changes) = 0 THEN
    RETURN NEW;
  END IF;

  SELECT u.email INTO email FROM auth.users u WHERE u.id = auth.uid();

  INSERT INTO public.admin_audit_log (user_id, user_email, action, entity_type, entity_id, metadata)
  VALUES (
    auth.uid(),
    email,
    CASE
      WHEN array_length(grupos, 1) = 2 THEN 'Atualizou contato e LGPD'
      WHEN grupos[1] = 'lgpd' THEN 'Atualizou configurações de LGPD'
      ELSE 'Atualizou dados oficiais de contato'
    END,
    'site_settings',
    NEW.id::text,
    jsonb_build_object(
      'grupos', to_jsonb(grupos),
      'campos', (SELECT jsonb_agg(c->'campo') FROM jsonb_array_elements(changes) c),
      'alteracoes', changes
    )
  );

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.audit_site_settings_changes() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS audit_site_settings ON public.site_settings;
CREATE TRIGGER audit_site_settings
AFTER UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.audit_site_settings_changes();