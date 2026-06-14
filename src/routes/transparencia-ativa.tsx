import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeading } from "@/components/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { ArrowRight, Search, ExternalLink, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/transparencia-ativa")({
  head: () => ({
    meta: [
      { title: "Transparência Ativa — Câmara Municipal" },
      { name: "description", content: "Central de acesso aos dados públicos da Câmara Municipal." },
    ],
  }),
  component: TransparenciaAtivaPage,
});

type Modulo = {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: string | null;
  icone: string | null;
  url: string;
  ordem: number;
  ativo: boolean;
};

type Settings = {
  transparencia_ativa_enabled: boolean | null;
  transparencia_ativa_intro: string | null;
  transparencia_portal_url: string | null;
  transparencia_portal_button_label: string | null;
};

const DEFAULT_INTRO =
  "Acesse de forma rápida, organizada e transparente as informações públicas da Câmara Municipal. Consulte despesas, contratos, folha de pagamento, licitações e muito mais.";

function getIcon(name: string | null) {
  const Comp = (name && (Icons as any)[name]) || Icons.FileText;
  return Comp as React.ComponentType<{ className?: string }>;
}

function TransparenciaAtivaPage() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const [mods, sett] = await Promise.all([
        (supabase as any)
          .from("transparencia_modulos")
          .select("*")
          .eq("ativo", true)
          .order("ordem", { ascending: true }),
        (supabase as any)
          .from("site_settings")
          .select("transparencia_ativa_enabled, transparencia_ativa_intro, transparencia_portal_url, transparencia_portal_button_label")
          .limit(1)
          .maybeSingle(),
      ]);
      setModulos((mods.data as Modulo[]) || []);
      setSettings((sett.data as Settings) || null);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return modulos;
    return modulos.filter(
      (m) =>
        m.nome.toLowerCase().includes(term) ||
        (m.descricao || "").toLowerCase().includes(term) ||
        (m.categoria || "").toLowerCase().includes(term),
    );
  }, [q, modulos]);

  const grouped = useMemo(() => {
    const map = new Map<string, Modulo[]>();
    filtered.forEach((m) => {
      const k = m.categoria || "Outros";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(m);
    });
    return Array.from(map.entries());
  }, [filtered]);

  if (settings && settings.transparencia_ativa_enabled === false) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Página indisponível</h1>
        <p className="mt-4 text-muted-foreground">A página de Transparência Ativa está temporariamente desativada.</p>
      </div>
    );
  }

  const portalUrl = settings?.transparencia_portal_url || "https://camaraadelandia.megasofttransparencia.com.br/";
  const portalLabel = settings?.transparencia_portal_button_label || "Acessar Portal da Transparência Completo";

  return (
    <div className="bg-gradient-to-b from-background to-muted/30">
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 text-primary">
              <ShieldCheck className="w-3.5 h-3.5" /> Portal Cidadão
            </Badge>
            <SectionHeading
              eyebrow="Acesso à Informação"
              title="Transparência Ativa"
              description={settings?.transparencia_ativa_intro || DEFAULT_INTRO}
            />
            <div className="mt-8 relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por módulo, categoria ou tema..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-11 h-12 bg-background"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16 space-y-12">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : grouped.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum módulo encontrado.</p>
        ) : (
          grouped.map(([cat, items]) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-5">
                <span className="gold-divider" />
                <h2 className="font-display text-xl md:text-2xl font-semibold">{cat}</h2>
                <Badge variant="secondary" className="ml-1">{items.length}</Badge>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((m) => {
                  const Icon = getIcon(m.icone);
                  return (
                    <a
                      key={m.id}
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/40">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              <Icon className="w-5 h-5" />
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                          </div>
                          <CardTitle className="mt-3 text-base font-display">{m.nome}</CardTitle>
                          {m.descricao && (
                            <CardDescription className="text-xs leading-relaxed">
                              {m.descricao}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                            Acessar <ArrowRight className="w-3 h-3" />
                          </span>
                        </CardContent>
                      </Card>
                    </a>
                  );
                })}
              </div>
            </div>
          ))
        )}

        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-10 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-semibold">Portal da Transparência completo</h3>
          <p className="mt-2 text-primary-foreground/85 max-w-2xl mx-auto">
            Consulte todas as informações no portal oficial integrado da Câmara Municipal.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <a href={portalUrl} target="_blank" rel="noopener noreferrer">
              {portalLabel} <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
