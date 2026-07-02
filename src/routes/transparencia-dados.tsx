import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getPortalData, type PortalData, type PortalDataset } from "@/lib/transparency-portal.functions";
import { getTransparencyUrl } from "./transparencia-ativa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  ArrowUpDown,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Gavel,
  Info,
  Loader2,
  MessageCircle,
  PieChart,
  RefreshCw,
  Scale,
  Search,
  ShieldCheck,
  TrendingDown,
  Users,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/transparencia-dados")({
  head: () => ({
    meta: [
      { title: "Consulta Pública — Portal da Transparência" },
      {
        name: "description",
        content:
          "Consulte receitas, despesas, empenhos, pagamentos, licitações, contratos, ordens de fornecimento e diárias diretamente do Portal Megasoft.",
      },
    ],
  }),
  component: TransparenciaDadosPage,
});

type CategoryDef = {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  datasetKeys: string[];
};

const CATEGORIES: CategoryDef[] = [
  { key: "receitas", label: "Receitas e Despesas", icon: TrendingDown, color: "bg-rose-400", datasetKeys: ["receitas", "empenhos", "pagamentos"] },
  { key: "contratos", label: "Contratos, Convênios e Licitações", icon: Gavel, color: "bg-orange-500", datasetKeys: ["licitacoes", "contratos", "compras"] },
  { key: "orgaos", label: "Órgãos e Servidores", icon: Users, color: "bg-amber-400", datasetKeys: ["diarias"] },
  { key: "planejamento", label: "Planejamento e Políticas", icon: PieChart, color: "bg-emerald-700", datasetKeys: [] },
  { key: "fiscal", label: "Responsabilidade Fiscal", icon: Scale, color: "bg-emerald-500", datasetKeys: [] },
  { key: "legislacao", label: "Legislação e Dados", icon: BookOpen, color: "bg-teal-600", datasetKeys: [] },
  { key: "ouvidoria", label: "Ouvidoria e e-SIC", icon: MessageCircle, color: "bg-emerald-600", datasetKeys: [] },
];

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatCell(value: any, type?: string) {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "currency") {
    const n = typeof value === "number" ? value : Number(String(value).replace(/[^\d,.-]/g, "").replace(",", "."));
    if (Number.isFinite(n)) return BRL.format(n);
    return String(value);
  }
  if (type === "date") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString("pt-BR");
    return String(value);
  }
  return String(value);
}

function TransparenciaDadosPage() {
  const call = useServerFn(getPortalData);
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [portalName, setPortalName] = useState<string>("Portal da Transparência");
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCat, setActiveCat] = useState<string>("receitas");
  const [activeDs, setActiveDs] = useState<string>("receitas");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<{ ds: PortalDataset; row: Record<string, any> } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: s } = await (supabase as any)
        .from("transparency_settings")
        .select("portal_url, portal_base_url, portal_name, entity_name")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const url = (s?.portal_url || s?.portal_base_url || "").trim();
      if (!mounted) return;
      setPortalName(s?.portal_name || s?.entity_name || "Portal da Transparência");
      if (!url) {
        setLoading(false);
        return;
      }
      setBaseUrl(url);
      try {
        const res = await call({ data: { baseUrl: url } });
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setData({ ok: false, menus: [], datasets: [], portalUrl: url, error: String(e) });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [call]);

  const refresh = async () => {
    if (!baseUrl) return;
    setRefreshing(true);
    try {
      const res = await call({ data: { baseUrl } });
      setData(res);
    } finally {
      setRefreshing(false);
    }
  };

  const datasetsByKey = useMemo(() => {
    const m = new Map<string, PortalDataset>();
    (data?.datasets || []).forEach((d) => m.set(d.key, d));
    return m;
  }, [data]);

  const currentCategory = CATEGORIES.find((c) => c.key === activeCat)!;
  const availableDs = currentCategory.datasetKeys.map((k) => datasetsByKey.get(k)).filter(Boolean) as PortalDataset[];
  const currentDataset = availableDs.find((d) => d.key === activeDs) || availableDs[0] || null;

  const filteredRows = useMemo(() => {
    if (!currentDataset) return [];
    if (!q.trim()) return currentDataset.rows;
    const s = q.toLowerCase();
    return currentDataset.rows.filter((r) =>
      Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(s)),
    );
  }, [currentDataset, q]);

  const downloadCsv = () => {
    if (!currentDataset) return;
    const headers = currentDataset.columns.map((c) => c.label);
    const lines = [headers.join(";")];
    for (const row of filteredRows) {
      lines.push(currentDataset.columns.map((c) => `"${String(row[c.key] ?? "").replace(/"/g, '""')}"`).join(";"));
    }
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentDataset.key}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary-deep via-primary to-primary-deep text-primary-foreground">
        <div className="container-page relative py-5 md:py-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold">
            <ShieldCheck className="h-3.5 w-3.5" /> Consulta Pública ao vivo
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold md:text-3xl">Portal da Transparência</h1>
          <p className="mt-1 max-w-2xl text-sm text-primary-foreground/85">
            Dados oficiais consumidos em tempo real do {portalName}.
            {data?.generatedAt && (
              <span className="ml-2 text-xs text-primary-foreground/70">
                · Atualizado em {new Date(data.generatedAt).toLocaleString("pt-BR")}
              </span>
            )}
          </p>
        </div>
      </section>

      {/* CATEGORY ICONS */}
      <section className="border-b border-border bg-card">
        <div className="container-page py-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = activeCat === c.key;
              const count = c.datasetKeys.reduce((sum, k) => sum + (datasetsByKey.get(k)?.total || 0), 0);
              return (
                <button
                  key={c.key}
                  onClick={() => {
                    setActiveCat(c.key);
                    setActiveDs(c.datasetKeys[0] || "");
                    setQ("");
                  }}
                  className={`group flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all ${
                    active ? "border-primary bg-primary/5 shadow-sm" : "border-transparent hover:border-border hover:bg-secondary/40"
                  }`}
                >
                  <div className={`grid h-16 w-16 place-items-center rounded-full text-white shadow-md transition-transform group-hover:scale-105 ${c.color}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-semibold leading-tight text-foreground">{c.label}</span>
                  {c.datasetKeys.length > 0 && (
                    <span className="text-[10px] text-muted-foreground">{count.toLocaleString("pt-BR")} registros</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-5">
          <div className="mx-auto flex max-w-3xl overflow-hidden rounded-full border border-border bg-white shadow-sm">
            <div className="hidden bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground sm:block">
              Pesquisar
            </div>
            <div className="relative flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filtrar registros exibidos..."
                className="h-full w-full bg-transparent px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container-page py-10">
        {loading ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Consultando Portal Megasoft...
          </div>
        ) : !baseUrl ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              O link do Portal Megasoft ainda não foi configurado no painel administrativo (Configurações → Transparência).
            </AlertDescription>
          </Alert>
        ) : !data?.ok ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível consultar o portal: {data?.error || "erro desconhecido"}.
            </AlertDescription>
          </Alert>
        ) : availableDs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <Info className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
            <p className="text-muted-foreground">
              Esta categoria ainda não possui consultas integradas. Acesse o portal oficial para mais informações.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <a href={data.portalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Abrir Portal Megasoft
              </a>
            </Button>
          </div>
        ) : currentDataset ? (
          <div className="space-y-6">
            {/* Sub-tabs (datasets within category) */}
            {availableDs.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {availableDs.map((ds) => (
                  <button
                    key={ds.key}
                    onClick={() => {
                      setActiveDs(ds.key);
                      setQ("");
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      activeDs === ds.key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {ds.title}
                  </button>
                ))}
              </div>
            )}

            {/* Dataset header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Consulta de {currentDataset.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredRows.length} registro{filteredRows.length !== 1 ? "s" : ""} exibido{filteredRows.length !== 1 ? "s" : ""} · Fonte: {portalName}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Atualizar
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={currentDataset.portalUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Portal Megasoft
                  </a>
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCsv} disabled={!filteredRows.length}>
                  <Download className="mr-2 h-4 w-4" /> CSV
                </Button>
              </div>
            </div>

            {currentDataset.error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Falha ao consultar {currentDataset.title}: {currentDataset.error}</AlertDescription>
              </Alert>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      {currentDataset.columns.map((c) => (
                        <th key={c.key} className="px-4 py-3 text-left font-semibold">
                          <span className="inline-flex items-center gap-1">
                            {c.label} <ArrowUpDown className="h-3 w-3 opacity-50" />
                          </span>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={currentDataset.columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">
                          Nenhum registro encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((row, i) => (
                        <tr key={i} className="transition-colors hover:bg-secondary/30">
                          {currentDataset.columns.map((c) => (
                            <td key={c.key} className="px-4 py-3 align-top text-foreground">
                              {formatCell(row[c.key], c.type)}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" variant="outline" onClick={() => setDetail({ ds: currentDataset, row })}>
                              <Info className="mr-1 h-3.5 w-3.5" /> Detalhes
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/30 p-4 text-xs text-muted-foreground">
              Exibindo até 12 registros mais recentes por consulta. Para dados completos, filtros avançados e exportações
              detalhadas, acesse o Portal Megasoft oficial pelo botão acima.
            </div>
          </div>
        ) : null}

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <InfoCard icon={FileText} title="Lei de Acesso à Informação" text="Lei nº 12.527/2011 — garante o acesso a informações públicas." />
          <InfoCard icon={ShieldCheck} title="Dados oficiais" text={`Todos os dados provêm do ${portalName}, sem intermediação.`} />
          <InfoCard icon={MessageCircle} title="Ouvidoria e e-SIC" text="Solicite informações ou registre manifestações." action={{ label: "Acessar e-SIC", href: "/ouvidoria" }} />
        </div>
      </section>

      {/* DETAILS MODAL */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes — {detail?.ds.title}</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {detail.ds.columns.map((c) => (
                  <div key={c.key} className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</div>
                    <div className="mt-1 text-sm text-foreground">{formatCell(detail.row[c.key], c.type)}</div>
                  </div>
                ))}
              </div>
              {Object.entries(detail.row)
                .filter(([k]) => !detail.ds.columns.some((c) => c.key === k))
                .filter(([, v]) => v !== null && v !== "" && v !== undefined)
                .map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{k}</div>
                    <div className="mt-1 whitespace-pre-wrap text-sm text-foreground">{String(v)}</div>
                  </div>
                ))}
              <div className="rounded-lg bg-primary/5 p-4 text-sm">
                Para informações completas, acesse:
                <Button asChild className="mt-3 w-full sm:w-auto">
                  <a href={detail.ds.portalUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Ver detalhes completos no Portal Megasoft
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      {action && (
        <Button asChild variant="outline" size="sm" className="mt-4">
          <a href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {action.label} <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </a>
        </Button>
      )}
    </div>
  );
}
