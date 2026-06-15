import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Banknote,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ExternalLink,
  FileCheck2,
  FileClock,
  FileSignature,
  FileText,
  Gavel,
  HandCoins,
  Landmark,
  Loader2,
  Receipt,
  Scale,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

export const Route = createFileRoute("/transparencia-ativa")({
  head: () => ({
    meta: [
      { title: "Portal da Transparência — Câmara Municipal" },
      {
        name: "description",
        content:
          "Acesse receitas, despesas, contratos, licitações, folha de pagamento e demais informações públicas da Câmara Municipal.",
      },
    ],
  }),
  component: TransparenciaAtivaPage,
});

type TransparencySettings = {
  id: string;
  portal_url: string | null;
  portal_base_url?: string | null;
  portal_name: string | null;
  entity_name?: string | null;
  is_active: boolean | null;
  show_full_portal_embed: boolean | null;
};

type TransparencyModule = {
  title: string;
  description: string;
  path: string;
  icon: typeof Banknote;
};

const modules: TransparencyModule[] = [
  {
    title: "Receitas",
    description: "Arrecadação, repasses e demais entradas registradas no portal oficial.",
    path: "receitas-e-despesas/receita",
    icon: Banknote,
  },
  {
    title: "Despesas",
    description: "Consulta sintética das despesas públicas por período e classificação.",
    path: "receitas-e-despesas/despesa-sintetica",
    icon: Receipt,
  },
  {
    title: "Empenhos",
    description: "Empenhos emitidos, favorecidos, liquidações e valores vinculados.",
    path: "receitas-e-despesas/empenho",
    icon: WalletCards,
  },
  {
    title: "Licitações",
    description: "Procedimentos licitatórios, modalidades, situações e documentos oficiais.",
    path: "contratos-convenios-e-licitacoes/procedimentos-licitatorios",
    icon: Gavel,
  },
  {
    title: "Contratos",
    description: "Contratos celebrados, fornecedores, vigência, objeto e anexos.",
    path: "contratos-convenios-e-licitacoes/contrato",
    icon: FileSignature,
  },
  {
    title: "Aditivos",
    description: "Aditamentos e informações complementares vinculadas aos contratos.",
    path: "contratos-convenios-e-licitacoes/contrato",
    icon: FileClock,
  },
  {
    title: "Dispensas e Inexigibilidades",
    description: "Contratações diretas, dispensas, inexigibilidades e processos relacionados.",
    path: "contratos-convenios-e-licitacoes/dispensas-inexigibilidades",
    icon: FileCheck2,
  },
  {
    title: "Folha de Pagamento",
    description: "Servidores, remuneração, cargos e informações de pessoal.",
    path: "orgaos-e-servidores/servidor",
    icon: Users,
  },
  {
    title: "Diárias",
    description: "Diárias concedidas, beneficiários, destinos, datas e valores.",
    path: "orgaos-e-servidores/diaria",
    icon: BriefcaseBusiness,
  },
  {
    title: "Patrimônio",
    description: "Bens patrimoniais, almoxarifado e movimentações disponíveis.",
    path: "receitas-e-despesas/patrimonio-e-almoxarifado",
    icon: Building2,
  },
  {
    title: "Prestação de Contas",
    description: "Balanços, pareceres, contas anuais e relatórios publicados.",
    path: "planejamento-e-politicas-publicas/parecer-previo",
    icon: ShieldCheck,
  },
  {
    title: "Relatórios Fiscais",
    description: "Relatórios de gestão fiscal e demonstrativos de responsabilidade fiscal.",
    path: "responsabilidade-fiscal/relatorio-de-gestao-fiscal",
    icon: Landmark,
  },
  {
    title: "Leis e Atos",
    description: "Legislação municipal, atos infralegais, resoluções e publicações normativas.",
    path: "legislacao-e-publicacoes/leis-e-atos-infralegais",
    icon: Scale,
  },
  {
    title: "Diário Oficial",
    description: "Publicações oficiais, atos administrativos e documentos de interesse público.",
    path: "legislacao-e-publicacoes/outras-publicacoes",
    icon: BookOpen,
  },
];

export function getTransparencyUrl(baseUrl: string, path = "") {
  const base = new URL(baseUrl.trim());
  const cleanPath = path.trim().replace(/^\/+/, "");
  const cleanBase = base.href.replace(/\/+$/, "");
  return cleanPath ? `${cleanBase}/${cleanPath}` : `${cleanBase}/`;
}

function isValidPortalUrl(value: string | null | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function TransparenciaAtivaPage() {
  const [settings, setSettings] = useState<TransparencySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await (supabase as any)
        .from("transparency_settings")
        .select("id, portal_url, portal_base_url, portal_name, entity_name, is_active, show_full_portal_embed")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (mounted) {
        setSettings((data as TransparencySettings | null) || null);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const portalUrl = useMemo(() => {
    const configuredUrl = settings?.portal_url || settings?.portal_base_url || "";
    return isValidPortalUrl(configuredUrl) ? getTransparencyUrl(configuredUrl) : "";
  }, [settings?.portal_base_url, settings?.portal_url]);

  const portalName = settings?.portal_name || settings?.entity_name || "Portal da Transparência";

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="container-page py-20">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Carregando Portal da Transparência...
          </div>
        </section>
      </main>
    );
  }

  if (!settings || settings.is_active === false) {
    return (
      <main className="min-h-screen bg-background">
        <section className="container-page py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Portal da Transparência</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Esta área está temporariamente indisponível.</p>
        </section>
      </main>
    );
  }

  if (!portalUrl) {
    return (
      <main className="min-h-screen bg-background">
        <section className="container-page py-20">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>O link do Portal Megasoft não está configurado corretamente.</AlertDescription>
          </Alert>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-gradient-to-br from-primary-deep via-primary to-primary-deep py-14 text-primary-foreground md:py-20">
        <div className="container-page">
          <div className="max-w-4xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase text-gold">
              <ShieldCheck className="h-3.5 w-3.5" /> Dados oficiais
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight md:text-5xl">Portal da Transparência</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-primary-foreground/85 md:text-lg">
              Acompanhe receitas, despesas, contratos, licitações, folha de pagamento e demais informações públicas da Câmara Municipal.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-primary-foreground/80">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2">
                <Landmark className="h-4 w-4 text-gold" /> {portalName}
              </span>
              <a className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 transition-colors hover:border-gold hover:text-gold" href={portalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Abrir portal completo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        {settings.show_full_portal_embed ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Portal Megasoft incorporado</h2>
                <p className="mt-1 text-muted-foreground">Conteúdo oficial exibido diretamente do portal configurado.</p>
              </div>
              <Button asChild variant="outline">
                <a href={portalUrl} target="_blank" rel="noopener noreferrer">
                  Abrir em nova aba <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
              <iframe src={portalUrl} title="Portal Megasoft completo" width="100%" height="900" className="block w-full border-0" />
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="gold-divider mb-4" />
                <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Acessos rápidos</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">Escolha uma área para consultar os dados diretamente no portal oficial.</p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" /> Links gerados pela configuração salva
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => {
                const Icon = module.icon;
                const href = getTransparencyUrl(portalUrl, module.path);
                return (
                  <Card key={module.title} className="card-premium card-premium-hover flex h-full flex-col overflow-hidden rounded-lg">
                    <CardHeader className="pb-3">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="font-display text-xl text-foreground">{module.title}</CardTitle>
                      <CardDescription className="min-h-[52px] text-sm leading-6">{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-0">
                      <Button asChild className="w-full bg-primary-deep hover:bg-primary">
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          Acessar <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}