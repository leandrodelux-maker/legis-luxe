import { Link } from "@tanstack/react-router";
import {
  Mail,
  Phone,
  Clock,
  Map,
  Menu,
  X,
  ChevronDown,
  Shield,
  MessageSquare,
  Search,
  Globe,
  Landmark,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type SiteSettings = {
  contact_phone: string | null;
  contact_email: string | null;
  contact_hours: string | null;
  header_logo_url: string | null;
  header_logo_height: number;
};

const mainNav = [
  { to: "/", label: "INÍCIO" },
  { to: "/vereadores", label: "VEREADORES" },
  { to: "/sessoes", label: "SESSÕES" },
  { to: "/projetos", label: "FLUXO LEGISLATIVO" },
  { to: "/noticias", label: "NOTÍCIAS" },
  { to: "/contato", label: "CONTATO" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("contact_phone, contact_email, contact_hours, header_logo_url, header_logo_height")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setSettings(data as SiteSettings | null));
  }, []);

  const phone = settings?.contact_phone ?? "(64) 9482-1176";
  const email = settings?.contact_email ?? "contato@camaramunicipal.gov.br";
  const hours = settings?.contact_hours ?? "Seg a Sex, 8h às 17h";

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>

      {/* TOP STRIP — institutional blue */}
      <div className="bg-primary-deep text-white text-xs">
        <div className="container-page flex h-10 items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-5">
            <Link to="/contato" className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
              <Map className="h-3.5 w-3.5" /> Mapa do Site
            </Link>
            <span className="opacity-30">|</span>
            <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
              <Phone className="h-3.5 w-3.5" /> {phone}
            </a>
            <span className="opacity-30">|</span>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
              <Mail className="h-3.5 w-3.5" /> {email}
            </a>
            <span className="opacity-30">|</span>
            <span className="inline-flex items-center gap-1.5 opacity-90">
              <Clock className="h-3.5 w-3.5" /> {hours}
            </span>
          </div>
          <div className="md:hidden inline-flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" /> {phone}
          </div>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Redes sociais" className="hover:text-gold transition-colors">
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* WHITE HEADER — logo + search + CTAs */}
      <div className="bg-white border-b border-slate-100">
        <div className="container-page py-5 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            {settings?.header_logo_url ? (
              <img 
                src={settings.header_logo_url} 
                alt="Logo Câmara Municipal"
                decoding="async"
                style={{ height: `${settings.header_logo_height}px` }}
                className="w-auto object-contain"
              />
            ) : (
              <>
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-br from-primary-deep to-primary text-white shadow-md ring-1 ring-gold/30">
                  <Landmark className="h-7 w-7" />
                </div>
                <div className="leading-tight">
                  <div className="font-display font-extrabold text-xl md:text-2xl text-primary-deep tracking-tight uppercase">
                    Câmara Municipal
                  </div>
                  <div className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
                    Governo · Poder Legislativo
                  </div>
                </div>
              </>
            )}
          </Link>

          <div className="hidden lg:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Buscar serviços, notícia"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-100 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/40 transition-all"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/transparencia"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <Shield className="h-4 w-4" /> Transparência
            </Link>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <MessageSquare className="h-4 w-4" /> Ouvidoria
            </Link>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-lg text-primary-deep hover:bg-slate-100"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* BLUE NAV BAR */}
      <nav id="menu-principal" aria-label="Principal" className="hidden lg:block bg-primary-deep border-t border-white/10 sticky top-0 z-40" tabIndex={-1}>
        <div className="container-page flex items-center justify-between gap-2">
          <ul className="flex items-stretch">
            {mainNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className={cn(
                    "relative inline-flex items-center gap-1.5 px-4 py-4 text-[12px] font-semibold tracking-wide text-white/85 hover:text-white hover:bg-white/5 transition-colors uppercase whitespace-nowrap first:pl-0"
                  )}
                  activeProps={{
                    className: "text-white after:absolute after:left-4 after:right-4 after:bottom-0 after:h-[3px] after:bg-white first:after:left-0",
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1 text-white/85 shrink-0">
            <Link
              to="/transparencia"
              className="inline-flex items-center gap-1.5 px-3 py-4 text-[12px] font-semibold tracking-wide hover:bg-white/5 hover:text-white transition-colors uppercase whitespace-nowrap"
            >
              <Shield className="h-4 w-4" /> Transparência
            </Link>
            <div className="relative group">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-4 text-[12px] font-semibold tracking-wide hover:bg-white/5 hover:text-white transition-colors uppercase whitespace-nowrap"
              >
                <MessageSquare className="h-4 w-4" /> Acesso à Informação <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute right-0 top-full min-w-[220px] bg-white text-slate-700 shadow-xl rounded-md border border-slate-100 py-2 z-50">
                <Link to="/contato" className="block px-4 py-2 text-sm hover:bg-slate-50 hover:text-primary">e-SIC</Link>
                <Link to="/contato" className="block px-4 py-2 text-sm hover:bg-slate-50 hover:text-primary">Ouvidoria</Link>
                <Link to="/contato" className="block px-4 py-2 text-sm hover:bg-slate-50 hover:text-primary">Perguntas Frequentes</Link>
                <Link to="/contato" className="block px-4 py-2 text-sm hover:bg-slate-50 hover:text-primary">LGPD</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV */}
      {open && (
        <nav aria-label="Menu mobile" className="lg:hidden bg-primary-deep text-white animate-[fade-in_0.2s_ease-out]">
          <ul className="container-page py-3 flex flex-col">
            {mainNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  className="block rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-wider text-white/85 hover:bg-white/10"
                  activeProps={{ className: "text-white bg-white/10" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 mt-2 border-t border-white/10 flex gap-2">
              <Link
                to="/transparencia"
                onClick={() => setOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm"
              >
                <Shield className="h-4 w-4" /> Transparência
              </Link>
              <Link
                to="/contato"
                onClick={() => setOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-orange-500 text-white font-semibold text-sm"
              >
                <MessageSquare className="h-4 w-4" /> Ouvidoria
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
