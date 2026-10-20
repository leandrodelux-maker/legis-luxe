import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, LayoutGrid } from "lucide-react";
import {
  useQuickAccess,
  CATEGORY_LABELS,
  type QuickAccessCategory,
  type QuickAccessItem,
} from "@/lib/quick-access-store";
import { QuickAccessIconRender } from "@/components/quick-access-icon";
import { Button } from "@/components/ui/button";

const CATEGORIES: QuickAccessCategory[] = ["cidadaos", "servidores", "empresas", "legislacao"];

function Card({ item }: { item: QuickAccessItem }) {
  const inner = (
    <div className="group relative h-full min-h-[170px] rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
      <ArrowRight className="absolute right-5 top-[88px] h-4 w-4 text-primary-deep transition-transform group-hover:translate-x-1" />
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary">
        <QuickAccessIconRender name={item.icon} className="h-5 w-5" />
      </div>
      <h3 className="mt-6 pr-6 font-display text-base font-semibold leading-snug text-foreground">{item.label}</h3>
      {item.tag && (
        <p className="mt-2 text-xs font-medium uppercase text-muted-foreground">
          {item.tag}
        </p>
      )}
    </div>
  );

  if (item.external) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link to={item.url}>{inner}</Link>;
}

export function QuickAccess() {
  const { items } = useQuickAccess();
  const [active, setActive] = useState<QuickAccessCategory>("cidadaos");
  const filtered = items.filter((i) => i.category === active);

  return (
    <section className="bg-background">
      <div className="container-page py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Acesso Rápido
            </h2>
            <p className="mt-2 text-muted-foreground">
              Encontre rapidamente os serviços e informações que você precisa.
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            <LayoutGrid className="mr-2 h-4 w-4" /> Todos os serviços
          </Button>
        </div>

        {/* Tabs */}
        <div className="mt-8 grid grid-cols-2 md:inline-grid md:grid-cols-4 gap-2 rounded-2xl bg-card border border-border p-2 shadow-card">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                active === c
                  ? "bg-primary-deep text-primary-foreground"
                  : "bg-accent/60 text-foreground hover:bg-accent"
              }`}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {filtered.length === 0 ? (
            <p className="col-span-full text-sm text-muted-foreground py-12 text-center">
              Nenhum serviço cadastrado nesta categoria.
            </p>
          ) : (
            filtered.map((item) => <Card key={item.id} item={item} />)
          )}
        </div>
      </div>
    </section>
  );
}
