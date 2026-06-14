import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  BookOpen,
  CalendarDays,
  Database,
  ExternalLink,
  FileSignature,
  FileText,
  Gavel,
  Loader2,
  MessageSquare,
  PieChart,
  Receipt,
  Search,
  ShieldCheck,
  ShoppingCart,
  Users,
  WalletCards,
} from "lucide-react";
import { getPortalData, type PortalDataset, type PortalMenu } from "@/lib/transparency-portal.functions";

export const Route = createFileRoute("/transparencia-ativa")({
  head: () => ({
    meta: [
      { title: "Transparência Ativa — Dados Municipais" },
      { name: "description", content: "Painel público com dados de receitas, despesas, licitações, contratos e servidores." },
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
  "Consulte em um só lugar os dados públicos do município lidos diretamente do Portal Oficial de Transparência.";
const DEFAULT_PORTAL = "https://camaraadelandia.megasofttransparencia.com.br/";

const iconMap = {
  Banknote,
  Receipt,
  WalletCards,
  Gavel,
  FileSignature,
  ShoppingCart,
  Users,
  FileText,
};

const formatCurrency = (value: unknown) =>
  typeof value === "number"
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
    : String(value ?? "—");

function iconFor(text: string | null) {
  const key = (text || "").toLowerCase();
  if (key.includes("receita")) return Banknote;
  if (key.includes("pagamento")) return WalletCards;
  if (key.includes("despesa") || key.includes("empenho")) return Receipt;
  if (key.includes("contrat")) return FileSignature;
  if (key.includes("licit") || key.includes("conven") || key.includes("obra")) return Gavel;
  if (key.includes("servidor") || key.includes("diária") || key.includes("diaria")) return Users;
  if (key.includes("planejamento") || key.includes("política")) return PieChart;
  if (key.includes("legisla")) return BookOpen;
  if (key.includes("sic") || key.includes("ouvidoria")) return MessageSquare;
  return FileText;
}

function datasetText(dataset: PortalDataset) {
  return [dataset.title, dataset.description, dataset.category, ...dataset.rows.flatMap((row) => Object.values(row).map(String))]
    .join(" ")
    .toLowerCase();
}

function TransparenciaAtivaPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [search, setSearch] = useState("");
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
    return () => {
      alive = false;
    };
  }, []);

  const portalUrl = (settings?.portal_base_url || DEFAULT_PORTAL).trim();
  const fetchPortal = useServerFn(getPortalData);
  const portalQuery = useQuery({
    queryKey: ["portal-transparencia-completo", portalUrl],
    queryFn: () => fetchPortal({ data: { baseUrl: portalUrl } }),
    enabled: !loadingSettings && !!portalUrl,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const portal = portalQuery.data;
  const datasets = portal?.datasets || [];
  const term = search.trim().toLowerCase();
  const filteredDatasets = useMemo(
    () => (term ? datasets.filter((dataset) => datasetText(dataset).includes(term)) : datasets),
    [datasets, term],
  );
  const filteredMenus: PortalMenu[] = useMemo(() => {
    const menus = portal?.menus || [];
    if (!term) return menus;
    return menus
      .map((menu) => ({
        ...menu,
        filhos: menu.filhos.filter((child) =>
          [menu.titulo, child.titulo, child.descricao].join(" ").toLowerCase().includes(term),
        ),
      }))
      .filter((menu) => menu.filhos.length > 0);
  }, [portal?.menus, term]);

  const totalRecords = datasets.reduce((sum, dataset) => sum + dataset.total, 0);
  const featured = filteredDatasets.slice(0, 6);
  const isLoading = loadingSettings || portalQuery.isLoading;

  if (settings && settings.is_active === false) {
    return (
      <main className="container py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Página indisponível</h1>
        <p className="mt-4 text-muted-foreground">A página de Transparência Ativa está temporariamente desativada.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,197,94,0.22),transparent_34%),linear-gradient(135deg,rgba(14,165,233,0.16),transparent_44%)]" />
        <div className="container relative py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <Badge className="mb-5 border-white/20 bg-white/10 text-white hover:bg-white/15">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Dados oficiais integrados
              </Badge>
              <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
                Painel da Transparência
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-200">
                {settings?.intro_text || DEFAULT_INTRO}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2">
                  <Database className="h-4 w-4 text-emerald-300" /> {settings?.entity_name || "Câmara Municipal"}
                </span>
                {portal?.generatedAt && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2">
                    <CalendarDays className="h-4 w-4 text-sky-300" /> Atualizado agora pelo portal
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-medium text-slate-200">Buscar nos dados de transparência</p>
              <div className="relative mt-3">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Fornecedor, empenho, contrato, licitação..."
                  className="h-12 border-white/15 bg-white text-slate-950 pl-11"
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs uppercase text-slate-300">Registros lidos</p>
                  <p className="mt-1 text-2xl font-bold">{totalRecords.toLocaleString("pt-BR")}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs uppercase text-slate-300">Bases ativas</p>
                  <p className="mt-1 text-2xl font-bold">{datasets.filter((d) => !d.error).length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container -mt-6 relative z-10">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-emerald-200 bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription>Receitas arrecadadas {portal?.receitas?.ano || ""}</CardDescription>
              <CardTitle className="text-3xl text-emerald-700">{portal?.receitas?.valor || "—"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{portal?.receitas?.descricao || "Dados lidos do portal."}</CardContent>
          </Card>
          <Card className="border-rose-200 bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription>Despesas liquidadas {portal?.despesas?.ano || ""}</CardDescription>
              <CardTitle className="text-3xl text-rose-700">{portal?.despesas?.valor || "—"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{portal?.despesas?.descricao || "Dados lidos do portal."}</CardContent>
          </Card>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-52 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : portalQuery.isError || !portal?.ok ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível carregar os dados do portal ({portal?.error || "erro desconhecido"}).
              <a className="ml-1 underline" href={portalUrl} target="_blank" rel="noopener noreferrer">Abrir portal oficial</a>
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="dados" className="space-y-8">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl bg-white p-1 shadow-sm md:w-[520px]">
              <TabsTrigger value="dados" className="rounded-xl">Dados do município</TabsTrigger>
              <TabsTrigger value="modulos" className="rounded-xl">Módulos do portal</TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="space-y-6">
              {featured.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">Nenhum dado encontrado para “{search}”.</p>
              ) : (
                featured.map((dataset) => <DatasetPanel key={dataset.key} dataset={dataset} onOpen={setViewer} />)
              )}
            </TabsContent>

            <TabsContent value="modulos" className="space-y-6">
              {filteredMenus.map((menu) => (
                <Card key={menu.titulo} className="overflow-hidden border-slate-200 bg-white">
                  <CardHeader className="border-b bg-slate-100">
                    <div className="flex items-start gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-white">
                        {(() => {
                          const Icon = iconFor(menu.titulo);
                          return <Icon className="h-5 w-5" />;
                        })()}
                      </div>
                      <div>
                        <CardTitle className="font-display text-xl">{menu.titulo}</CardTitle>
                        <CardDescription className="mt-1">{menu.descricao}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    {menu.filhos.map((child) => (
                      <button
                        key={child.url}
                        type="button"
                        onClick={() => setViewer({ url: child.url, title: child.titulo })}
                        className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-400 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold text-slate-950">{child.titulo}</p>
                          <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800" />
                        </div>
                        {child.descricao && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{child.descricao}</p>}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </section>

      <Dialog open={!!viewer} onOpenChange={(open) => !open && setViewer(null)}>
        <DialogContent className="flex h-[88vh] w-[95vw] max-w-6xl flex-col gap-0 p-0">
          <DialogHeader className="flex-row items-center justify-between gap-3 space-y-0 border-b px-5 py-3">
            <DialogTitle className="truncate text-base font-display">{viewer?.title}</DialogTitle>
            {viewer && (
              <Button asChild size="sm" variant="outline" className="mr-8">
                <a href={viewer.url} target="_blank" rel="noopener noreferrer">
                  Abrir no portal <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </DialogHeader>
          {viewer && <iframe src={viewer.url} title={viewer.title} className="w-full flex-1 border-0" />}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function DatasetPanel({ dataset, onOpen }: { dataset: PortalDataset; onOpen: (viewer: { url: string; title: string }) => void }) {
  const Icon = iconMap[dataset.icon as keyof typeof iconMap] || FileText;
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="font-display text-2xl">{dataset.title}</CardTitle>
                <Badge variant="secondary">{dataset.total.toLocaleString("pt-BR")} registros</Badge>
              </div>
              <CardDescription className="mt-1 max-w-2xl">{dataset.description}</CardDescription>
            </div>
          </div>
          <Button variant="outline" onClick={() => onOpen({ url: dataset.portalUrl, title: dataset.title })}>
            Ver consulta completa <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {dataset.error ? (
          <div className="p-5 text-sm text-amber-700">Não foi possível ler esta base agora: {dataset.error}</div>
        ) : dataset.rows.length === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">Nenhum registro retornado pelo portal.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  {dataset.columns.map((column) => (
                    <th key={column.key} className="px-5 py-3 font-semibold">{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataset.rows.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/80">
                    {dataset.columns.map((column) => (
                      <td key={column.key} className="px-5 py-4 align-top text-slate-700">
                        {column.type === "currency" ? formatCurrency(row[column.key]) : String(row[column.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}