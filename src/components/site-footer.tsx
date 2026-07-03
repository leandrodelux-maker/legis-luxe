import { Link } from "@tanstack/react-router";
import { Landmark, Mail, MapPin, Phone, MessageSquare as FacebookIcon, Camera as InstagramIcon, PlayCircle as YoutubeIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type SiteSettings = {
  footer_logo_url: string | null;
  footer_logo_height: number;
};

export function SiteFooter() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("footer_logo_url, footer_logo_height")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setSettings(data as SiteSettings | null));
  }, []);

  return (
    <footer className="mt-24 border-t border-border bg-primary-deep text-primary-foreground">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            {settings?.footer_logo_url ? (
              <img 
                src={settings.footer_logo_url} 
                alt="Logo Câmara Municipal"
                loading="lazy"
                decoding="async"
                style={{ height: `${settings.footer_logo_height}px` }}
                className="w-auto object-contain"
              />
            ) : (
              <>
                <div className="grid h-11 w-11 place-items-center rounded-md bg-white/10 ring-1 ring-gold/40">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">Câmara Municipal</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/70">
                    Poder Legislativo
                  </div>
                </div>
              </>
            )}
          </div>
          <p className="mt-4 text-sm text-primary-foreground/75 leading-relaxed">
            O portal oficial do legislativo municipal. Transparência, participação e cidadania.
          </p>
          <div className="mt-5 flex gap-2">
            {[FacebookIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Rede social"
                className="grid h-9 w-9 place-items-center rounded-md bg-white/5 hover:bg-gold hover:text-gold-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
            Institucional
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/vereadores" className="hover:text-gold transition-colors">Vereadores</Link></li>
            <li><Link to="/sessoes" className="hover:text-gold transition-colors">Sessões e Pautas</Link></li>
            <li><Link to="/noticias" className="hover:text-gold transition-colors">Notícias</Link></li>
            <li><Link to="/contato" className="hover:text-gold transition-colors">Ouvidoria</Link></li>
            <li><Link to="/perguntas-frequentes" className="hover:text-gold transition-colors">Perguntas Frequentes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
            Transparência
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/transparencia-portal" className="hover:text-gold transition-colors">Portal da Transparência</Link></li>
            <li><Link to="/e-sic" className="hover:text-gold transition-colors">e-SIC — Acesso à Informação</Link></li>
            <li><Link to="/lgpd" className="hover:text-gold transition-colors">LGPD</Link></li>
            <li><Link to="/mapa-do-site" className="hover:text-gold transition-colors">Mapa do Site</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
            Contato
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />
              <span>Av. Principal, 1000 — Centro<br />CEP 00000-000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-gold shrink-0" />
              <a href="tel:+5500000000000" className="hover:text-gold">(00) 0000-0000</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-gold shrink-0" />
              <a href="mailto:contato@camara.gov.br" className="hover:text-gold">contato@camara.gov.br</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/70">
          <p>© {new Date().getFullYear()} Câmara Municipal · Todos os direitos reservados</p>
          <div className="flex items-center gap-5">
            <Link to="/lgpd" className="hover:text-gold">LGPD</Link>
            <Link to="/perguntas-frequentes" className="hover:text-gold">FAQ</Link>
            <Link to="/mapa-do-site" className="hover:text-gold">Mapa do Site</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
