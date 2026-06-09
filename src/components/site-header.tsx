import { Link } from "@tanstack/react-router";
import { Menu, Moon, Search, Sun, X, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Início" },
  { to: "/vereadores", label: "Vereadores" },
  { to: "/noticias", label: "Notícias" },
  { to: "/sessoes", label: "Sessões" },
  { to: "/sessoes/ao-vivo", label: "Ao Vivo", isLive: true },
  { to: "/transparencia", label: "Transparência" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>

      {/* Faixa institucional superior */}
      <div className="hidden md:block bg-primary-deep text-primary-foreground/90 text-xs">
        <div className="container-page flex h-9 items-center justify-between">
          <span className="tracking-wide">Portal Oficial · Câmara Municipal</span>
          <div className="flex items-center gap-5">
            <Link to="/transparencia" className="hover:text-gold transition-colors">
              Transparência
            </Link>
            <Link to="/contato" className="hover:text-gold transition-colors">
              Ouvidoria
            </Link>
            <span className="opacity-70">Acessibilidade AA</span>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "glass-strong shadow-[0_1px_0_0_var(--color-border)]" : "bg-background border-b border-border/40"
        )}
      >
        <div className="container-page flex h-16 md:h-20 items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-primary-deep to-primary text-primary-foreground shadow-elegant ring-1 ring-gold/30">
              <Landmark className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base md:text-lg font-semibold text-foreground">
                Câmara Municipal
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Poder Legislativo
              </div>
            </div>
          </Link>

          <nav aria-label="Principal" className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent/60 flex items-center gap-2",
                  "isLive" in n && n.isLive ? "text-red-600 font-bold" : "text-foreground/80 hover:text-foreground"
                )}
                activeProps={{
                  className: cn(
                    "text-foreground",
                    !("isLive" in n && n.isLive) && "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-gold after:to-primary"
                  ),
                }}
              >
                {"isLive" in n && n.isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" aria-label="Buscar no portal" className="hidden sm:inline-flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              onClick={toggle}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav
            aria-label="Menu mobile"
            className="lg:hidden border-t border-border/60 bg-background animate-[fade-in_0.2s_ease-out]"
          >
            <ul className="container-page py-3 flex flex-col">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: n.to === "/" }}
                    className="block rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-accent"
                    activeProps={{ className: "text-primary bg-accent/60" }}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
