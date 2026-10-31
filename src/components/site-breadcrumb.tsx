import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

import { buildBreadcrumbs, ROUTES } from "@/lib/site-links";

/** Páginas cuja trilha já aparece em CabecalhoPagina. */
const COM_TRILHA_NO_CABECALHO = new Set<string>([
  ROUTES.historia,
  ROUTES.mesaDiretora,
  ROUTES.comissoes,
  ROUTES.sessoes,
  ROUTES.projetos,
  ROUTES.cartaServicos,
  ROUTES.leiOrganica,
  ROUTES.regimentoInterno,
  ROUTES.roteiroSessoes,
  ROUTES.faq,
  ROUTES.noticias,
  ROUTES.esic,
  ROUTES.contato,
  ROUTES.lgpd,
  ROUTES.mapaDoSite,
]);

/**
 * Breadcrumb dinâmico das páginas internas, derivado de ROUTES/SITE_SECTIONS.
 * Inclui JSON-LD (BreadcrumbList) para SEO.
 */
export function SiteBreadcrumb() {
  const location = useLocation();
  const crumbs = buildBreadcrumbs(location.pathname);

  const caminho = location.pathname.replace(/\/$/, "");
  if (crumbs.length < 2 || COM_TRILHA_NO_CABECALHO.has(caminho) || caminho.startsWith(`${ROUTES.noticias}/`)) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.to,
    })),
  };

  return (
    <div className="border-t border-border/60 bg-background">
      <nav
        aria-label="Trilha de navegação"
        className="container mx-auto flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 text-sm"
      >
        <ol className="flex items-center gap-1.5 whitespace-nowrap">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={crumb.to} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground/70" />
                )}
                {isLast ? (
                  <span aria-current="page" className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.to}
                    className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
                  >
                    {index === 0 && <Home aria-hidden className="size-3.5" />}
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
