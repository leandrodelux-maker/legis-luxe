import TransparenciaBusca from "@/components/transparency/TransparenciaBusca";
import { Link } from "@tanstack/react-router";
import { CONTACT_FALLBACK } from "@/hooks/use-contact-info";

import {
  Mail,
  Phone,
  Clock,

  Map,
  Menu,
  X,
  ChevronDown,
  Shield,
  Info,
  MessageSquare,
  Search,
  Globe,
  Landmark,
  Home,
  
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import radarLogo from "@/assets/radar-transparencia.png.asset.json";
import logoHeader from "@/assets/logo-header.png";
import { ROUTES, INFO_ACCESS_LINKS, CAMARA_LINKS, ATOS_LEGISLATIVOS_LINKS } from "@/lib/site-links";

type SiteSettings = {
  contact_phone: string | null;
  contact_email: string | null;
  contact_hours: string | null;
  header_logo_url: string | null;
  header_logo_height: number;
};

const mainNav = [
  { to: ROUTES.home, label: "Início" },
  { to: ROUTES.historia, label: "A Câmara", children: CAMARA_LINKS },
  { to: ROUTES.vereadores, label: "Vereadores" },
  { to: ROUTES.sessoes, label: "Sessões" },
  { to: ROUTES.projetos, label: "Atos Legislativos", children: ATOS_LEGISLATIVOS_LINKS },
  { to: ROUTES.noticias, label: "Notícias" },
  { to: ROUTES.contato, label: "Contato" },
] as const;

const navCls =
  "inline-flex items-center gap-1 rounded-lg px-1.5 py-2 text-[13px] font-semibold text-white hover:bg-white/15 xl:gap-1.5 xl:px-2 xl:text-sm min-[1360px]:px-3 min-[1360px]:text-base hover:text-white transition-colors whitespace-nowrap";
const navActive = "!bg-white !text-primary-deep shadow-sm";

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

  const phone = settings?.contact_phone ?? CONTACT_FALLBACK.telefone;
  const email = settings?.contact_email ?? CONTACT_FALLBACK.email;
  const hours = settings?.contact_hours ?? CONTACT_FALLBACK.horario;
  const headerLogoSrc = logoHeader;

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>

      <header className="relative z-50 bg-hero text-white">
        {/* TOP STRIP */}
        <div className="bg-primary-deep/70 text-xs">
          <div className="container-page flex h-9 items-center justify-between gap-4">
            <div className="font-semibold truncate">Câmara Municipal de Adelândia <span className="font-normal text-white/60">· Goiás</span></div>
            <div className="hidden md:flex items-center gap-5 text-white/85">
              <Link to={ROUTES.mapaDoSite} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
                <Map className="h-3.5 w-3.5" /> Mapa do Site
              </Link>
              <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
                <Phone className="h-3.5 w-3.5" /> {phone}
              </a>
              <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
                <Mail className="h-3.5 w-3.5" /> {email}
              </a>
              <span className="hidden xl:inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {hours}</span>
            </div>
          </div>
        </div>

        <div className="container-page">
        <div className="w-fit min-w-full">
        {/* LOGO + SEARCH + CTAs */}
        <div className="py-5 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0 min-w-0">
            <img
              src={headerLogoSrc}
              alt="Logo Câmara Municipal de Adelândia"
              decoding="async"
              style={{
                maxHeight: "145px",
                maxWidth: "60vw",
              }}
              className="h-28 md:h-36 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex flex-col items-end gap-3 ml-auto">
            <div className="flex items-center gap-3">
              <div className="w-[300px] xl:w-[400px]">
                <TransparenciaBusca placeholder="Buscar no portal..." />
              </div>
              <Link
                to="/transparencia/$"
                params={{ _splat: "atricon" }}
                className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-white text-primary-deep font-semibold text-sm shadow-sm hover:shadow-md transition-shadow whitespace-nowrap"
                aria-label="Radar da Transparência: abrir a Matriz Atricon"
              >
                <img src={radarLogo.url} alt="" className="h-7 w-auto" />
                <span className="hidden xl:inline">Radar da Transparência</span>
              </Link>
            </div>
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* PILL NAV */}
        <nav id="menu-principal" aria-label="Principal" className="hidden lg:block pb-5" tabIndex={-1}>
          <div className="flex items-center justify-between gap-4">
            <ul className="flex flex-1 items-center justify-between gap-0.5 rounded-xl border border-white/25 bg-white/10 p-1.5 backdrop-blur-sm">
              {mainNav.map((item) =>
                "children" in item && item.children ? (
                  <li key={item.to} className="relative group">
                    <Link
                      to={item.to}
                      className={navCls}
                      activeProps={{ className: navActive }}
                    >
                      {item.label} <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    </Link>
                    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute left-0 top-full pt-2 z-50">
                      <div className="min-w-[260px] bg-card text-card-foreground shadow-xl rounded-2xl border border-border p-2">
                        {item.children.map((c) => (
                          <Link
                            key={c.to}
                            to={c.to}
                            className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-primary"
                            activeProps={{ className: "bg-accent text-primary" }}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      activeOptions={{ exact: item.to === "/" }}
                      className={navCls}
                      activeProps={{ className: navActive }}
                    >
                      {item.to === "/" && <Home className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
              <li className="relative group">
                <button type="button" className={navCls}>
                  <MessageSquare className="h-4 w-4" /> Acesso à Informação <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute right-0 top-full pt-2 z-50">
                  <div className="min-w-[220px] bg-card text-card-foreground shadow-xl rounded-2xl border border-border p-2">
                    {INFO_ACCESS_LINKS.map((l) => (
                      <Link key={l.to} to={l.to} className="block rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-primary">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            </ul>

            <Link
              to={ROUTES.transparencia}
              className="inline-flex items-center gap-2 h-12 px-3 xl:px-4 min-[1360px]:px-7 rounded-xl bg-gold text-gold-foreground font-bold text-sm uppercase tracking-wide shadow-gold hover:brightness-105 transition-all whitespace-nowrap"
            >
              <Shield className="h-4 w-4" /> Transparência
            </Link>
          </div>
        </nav>
        </div>
        </div>
      </header>

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
                {"children" in item && item.children && (
                  <ul className="mb-1 ml-3 border-l border-white/15 pl-3">
                    {item.children.map((c) => (
                      <li key={c.to}>
                        <Link
                          to={c.to}
                          onClick={() => setOpen(false)}
                          className="block rounded-md px-3 py-2 text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white"
                          activeProps={{ className: "text-white bg-white/10" }}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="pt-3 mt-2 border-t border-white/10 flex gap-2">
              <Link
                to={ROUTES.transparencia}
                onClick={() => setOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-[52px] px-4 rounded-xl bg-gold text-gold-foreground font-semibold text-sm"
              >
                <Info className="h-4 w-4" /> Acesso a Transparência
              </Link>
              <Link
                to="/transparencia/$"
                params={{ _splat: "atricon" }}
                onClick={() => setOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-[52px] px-4 rounded-xl bg-white text-primary-deep font-semibold text-sm ring-1 ring-white/20"
              >
                <img src={radarLogo.url} alt="" className="h-7 w-auto" /> Radar
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
