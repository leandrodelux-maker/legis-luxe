import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeading } from "@/components/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowRight, Search, ExternalLink, ShieldCheck, AlertTriangle, Loader2,
  Banknote, Receipt, FileText, Gavel, Users, PieChart, Scale, MessageSquare, BookOpen,
} from "lucide-react";
import { getPortalData, type PortalMenu } from "@/lib/transparency-portal.functions";

export const Route = createFileRoute("/transparencia-ativa")({
  head: () => ({
    meta: [
      { title: "Transparência Ativa — Câmara Municipal" },
      { name: "description", content: "Central de acesso aos dados públicos da Câmara Municipal." },
    ],
  }),
  component: TransparenciaAtivaPage,
});

type Settings = {
  entity_name: string | null;
  portal_base_url: string | null;
  intro_text: string | null;
  is_active: boolean | null;
};

const DEFAULT_INTRO =
  "Acesse de forma rápida, organizada e transparente as informações públicas da Câmara Municipal. Os dados abaixo são lidos diretamente do Portal Oficial de Transparência.";
const DEFAULT_PORTAL = "https://camaraadelandia.megasofttransparencia.com.br/";

const COLOR_MAP: Record<string, { bar: string; tint: string; ring: string; text: string }> = {
  red:     { bar: "bg-red-600",     tint: "bg-red-50",     ring: "ring-red-200",     text: "text-red-700" },
  orange:  { bar: "bg-orange-500",  tint: "bg-orange-50",  ring: "ring-orange-200",  text: "text-orange-700" },
  yellow:  { bar: "bg-amber-500",   tint: "bg-amber-50",   ring: "ring-amber-200",   text: "text-amber-700" },
  green:   { bar: "bg-emerald-600", tint: "bg-emerald-50", ring: "ring-emerald-200", text: "text-emerald-700" },
  blue:    { bar: "bg-blue-600",    tint: "bg-blue-50",    ring: "ring-blue-200",    text: "text-blue-700" },
  purple:  { bar: "bg-violet-600",  tint: "bg-violet-50",  ring: "ring-violet-200",  text: "text-violet-700" },
  pink:    { bar: "bg-pink-600",    tint: "bg-pink-50",    ring: "ring-pink-200",    text: "text-pink-700" },
  teal:    { bar: "bg-teal-600",    tint: "bg-teal-50",    ring: "ring-teal-200",    text: "text-teal-700" },
  gray:    { bar: "bg-slate-600",   tint: "bg-slate-50",   ring: "ring-slate-200",   text: "text-slate-700" },
};
const colorFor = (c: string | null) => COLOR_MAP[(c || "blue").toLowerCase()] || COLOR_MAP.blue;

function iconForMenu(rota: string | null) {
  const key = (rota || "").toLowerCase();
  if (key.includes("receita")) return Banknote;
  if (key.includes("despesa") || key.includes("pagamento")) return Receipt;
  if (key.includes("contrat") || key.includes("licit") || key.includes("convenio")) return Gavel;
  if (key.includes("servidor") || key.includes("orgao") || key.includes("diaria")) return Users;
  if (key.includes("planejamento") || key.includes("politica")) return PieChart;
  if (key.includes("fiscal") || key.includes("responsab")) return Scale;
  if (key.includes("legisla")) return BookOpen;
  if (key.includes("ouvidoria") || key.includes("sic")) return MessageSquare;
  return FileText;
}

function TransparenciaAtivaPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [q, setQ] = useState("");
  const [viewer, setViewer] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await (supabase as any)
          .from("transparency_settings")
          .select("entity_name, portal_base_url, intro_text, is_active")
          .limit(1)
          .maybeSingle();
        if (alive) setSettings((data as Settings) || null);
      } finally {
        if (alive) setLoadingSettings(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const portalUrl = (settings?.portal_base_url || DEFAULT_PORTAL).trim();
  const fetchPortal = useServerFn(getPortalData);

  const portalQuery = useQuery({
    queryKey: ["portal-data", portalUrl],
    queryFn: () => fetchPortal({ data: { baseUrl: portalUrl } }),
    enabled: !loadingSettings && !!portalUrl,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const filteredMenus: PortalMenu[] = useMemo(() => {
    const menus = portalQuery.data?.menus || [];
    const term = q.trim().toLowerCase();
    if (!term) return menus;
    return menus
      .map((m) => ({
        ...m,
        filhos: m.filhos.filter(
          (f) =>
            f.titulo.toLowerCase().includes(term) ||
            f.descricao.toLowerCase().includes(term) ||
            m.titulo.toLowerCase().includes(term),
        ),
      }))
      .filter((m) => m.filhos.length > 0);
  }, [portalQuery.data, q]);

  if (settings && settings.is_active === false) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Página indisponível</h1>
        <p className="mt-4 text-muted-foreground">A página de Transparência Ativa está temporariamente desativada.</p>
      </div>
    );
  }

  const portal = portalQuery.data;
  const isLoading = loadingSettings || portalQuery.isLoading;

  return (
    <div className="bg-gradient-to-b from-background to-muted/30">
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 text-primary">
              <ShieldCheck className="w-3.5 h-3.5" /> Portal Cidadão
            </Badge>
            <SectionHeading
              eyebrow={settings?.entity_name || portal?.tituloDoTopo || "Acesso à Informação"}
              title="Transparência Ativa"
              description={settings?.intro_text || DEFAULT_INTRO}
            />
            <div className="mt-8 relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, descrição ou categoria..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-11 h-12 bg-background"
              />
            </div>
          </div>

          {portal?.ok && (portal.receitas || portal.despesas) && (
            <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-3xl">
              {portal.receitas && (
                <Card className="border-emerald-500/30 bg-emerald-500/5">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase tracking-wide">
                      Receitas Arrecadadas {portal.receitas.ano}
                    </CardDescription>
                    <CardTitle className="text-3xl font-display text-emerald-700 dark:text-emerald-400">
                      {portal.receitas.valor}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">{portal.receitas.descricao}</CardContent>
                </Card>
              )}
              {portal.despesas && (
                <Card className="border-rose-500/30 bg-rose-500/5">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase tracking-wide">
                      Despesas Liquidadas {portal.despesas.ano}
                    </CardDescription>
                    <CardTitle className="text-3xl font-display text-rose-700 dark:text-rose-400">
                      {portal.despesas.valor}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">{portal.despesas.descricao}</CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="container py-12 md:py-16 space-y-12">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : portalQuery.isError || !portal?.ok ? (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Não foi possível ler os dados do Portal de Transparência ({portal?.error || "erro desconhecido"}).
              Tente novamente em instantes ou acesse diretamente:{" "}
              <a className="underline" href={portalUrl} target="_blank" rel="noopener noreferrer">
                {portalUrl}
              </a>
            </AlertDescription>
          </Alert>
        ) : filteredMenus.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum item encontrado para "{q}".</p>
        ) : (
          filteredMenus.map((menu) => {
            const ParentIcon = iconForMenu(menu.titulo);
            const c = colorFor(menu.cor);
            return (
              <div key={menu.titulo} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className={`${c.bar} text-white px-6 py-5 flex items-start gap-4`}>
                  <div className="w-11 h-11 rounded-lg bg-white/15 grid place-items-center shrink-0">
                    <ParentIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-xl md:text-2xl font-semibold">{menu.titulo}</h2>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/25">
                        {menu.filhos.length}
                      </Badge>
                    </div>
                    {menu.descricao && (
                      <p className="text-sm text-white/85 mt-1 max-w-3xl">{menu.descricao}</p>
                    )}
                  </div>
                </div>
                <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {menu.filhos.map((child) => {
                    const Icon = iconForMenu(child.titulo);
                    return (
                      <button
                        key={child.url}
                        type="button"
                        onClick={() => setViewer({ url: child.url, title: child.titulo })}
                        className="text-left group"
                      >
                        <Card className={`h-full transition-all hover:-translate-y-1 hover:shadow-lg ring-1 ${c.ring} hover:ring-2`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className={`w-11 h-11 rounded-lg ${c.tint} ${c.text} grid place-items-center`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <ExternalLink className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground" />
                            </div>
                            <CardTitle className="mt-3 text-base font-display">{child.titulo}</CardTitle>
                            {child.descricao && (
                              <CardDescription className="text-xs leading-relaxed line-clamp-3">
                                {child.descricao}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="pt-0">
                            <span className={`text-xs font-semibold ${c.text} inline-flex items-center gap-1 group-hover:gap-2 transition-all`}>
                              Visualizar <ArrowRight className="w-3 h-3" />
                            </span>
                          </CardContent>
                        </Card>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {portalQuery.isFetching && !isLoading && (
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" /> Atualizando dados do portal…
          </p>
        )}

        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-10 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-semibold">Portal da Transparência completo</h3>
          <p className="mt-2 text-primary-foreground/85 max-w-2xl mx-auto">
            Consulte todas as informações no portal oficial integrado.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <a href={portal?.portalUrl || portalUrl} target="_blank" rel="noopener noreferrer">
              Acessar Portal da Transparência Completo <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      <Dialog open={!!viewer} onOpenChange={(o) => !o && setViewer(null)}>
        <DialogContent className="max-w-6xl w-[95vw] h-[88vh] p-0 gap-0 flex flex-col">
          <DialogHeader className="px-5 py-3 border-b flex-row items-center justify-between gap-3 space-y-0">
            <DialogTitle className="text-base font-display truncate">{viewer?.title}</DialogTitle>
            {viewer && (
              <Button asChild size="sm" variant="outline" className="mr-8">
                <a href={viewer.url} target="_blank" rel="noopener noreferrer">
                  Abrir em nova aba <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
                </a>
              </Button>
            )}
          </DialogHeader>
          {viewer && (
            <iframe
              src={viewer.url}
              title={viewer.title}
              className="flex-1 w-full border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
