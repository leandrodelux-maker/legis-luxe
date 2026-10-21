import { Link } from "@tanstack/react-router";
import { Landmark, Mail, MapPin, Phone, Clock, MessageSquare as FacebookIcon, Camera as InstagramIcon, PlayCircle as YoutubeIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FOOTER_COLUMNS, FOOTER_LEGAL_LINKS } from "@/lib/site-links";
import { useContactInfo } from "@/hooks/use-contact-info";



type SiteSettings = {
  footer_logo_url: string | null;
  footer_logo_height: number;
};

/** Pontos de quebra naturais (após @ e .) para o e-mail nunca partir no meio de uma palavra. */
function withEmailBreaks(value: string) {
  return value.replace(/([@.])/g, "$1\u200B");
}

export function SiteFooter() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const contact = useContactInfo();


  useEffect(() => {
    supabase
      .from("site_settings")
      .select("footer_logo_url, footer_logo_height")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setSettings(data as SiteSettings | null));
  }, []);

  return (
    <footer className="mt-24 bg-primary-deep text-primary-foreground">
      <div className="bg-band">
        <div className="container-page py-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: Phone, label: "Telefone", value: contact.telefone, href: contact.telefoneHref },
            { icon: Mail, label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
            { icon: Clock, label: "Atendimento", value: contact.horario },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm hover:bg-white/15 transition-colors min-w-0"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold text-gold-foreground">
                <c.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-white/75">{c.label}</span>
                <span className="block font-display text-[15px] leading-snug font-semibold break-words md:text-sm">
                  {withEmailBreaks(c.value)}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="container-page py-14 grid gap-10 md:grid-cols-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            {settings?.footer_logo_url ? (
              <img 
                src={settings.footer_logo_url} 
                alt="Logo Câmara Municipal"
                loading="lazy"
                decoding="async"
                style={{
                  maxHeight: `${settings.footer_logo_height}px`,
                  maxWidth: "100%",
                  filter: "brightness(1.08) saturate(1.15) drop-shadow(0 0 1px rgba(255,255,255,0.3))",
                }}
                className="w-auto h-auto object-contain"
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
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-gold-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="group inline-flex items-start gap-1.5 hover:text-gold transition-colors">
                    <span className="text-gold/80">›</span>{l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
            Contato
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />
              <span>{contact.endereco}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-gold shrink-0" />
              <a href={contact.telefoneHref} className="hover:text-gold">{contact.telefone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-gold shrink-0" />
              <a href={`mailto:${contact.email}`} className="min-w-0 break-words hover:text-gold">
                {withEmailBreaks(contact.email)}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 mt-0.5 text-gold shrink-0" />
              <span>{contact.horario}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-white/10 bg-primary-deep/60">
        <div className="container-page py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/70">
          <p>© {new Date().getFullYear()} Câmara Municipal · Todos os direitos reservados</p>
          <div className="flex items-center gap-5">
            {FOOTER_LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-gold">
                {l.label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
