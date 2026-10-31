import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";

export type Numero = { rotulo: string; valor: ReactNode };

/** Cabeçalho das páginas do site, no mesmo modelo do Portal da Transparência. */
export function CabecalhoPagina({
  titulo,
  descricao,
  icone: Icone,
  trilha = [],
  numeros,
  lateral,
  children,
}: {
  titulo: string;
  descricao: string;
  icone?: LucideIcon;
  trilha?: { rotulo: string; to?: string }[];
  numeros?: Numero[];
  lateral?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden text-white" style={{ background: "linear-gradient(120deg, var(--primary-deep) 0%, var(--primary-deep) 40%, var(--primary) 100%)" }}>
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none" aria-hidden style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "22px 22px" }} />
      {Icone && !lateral && <Icone className="absolute right-6 -bottom-10 h-56 w-56 opacity-10 hidden md:block pointer-events-none" aria-hidden />}
      <div className="container-page relative py-8 md:py-10">
        <nav aria-label="Você está aqui" className="flex flex-wrap items-center gap-1 text-xs text-white/85">
          <Link to="/" className="hover:underline underline-offset-2">Início</Link>
          {trilha.map((t) => (
            <span key={t.rotulo} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 opacity-70" aria-hidden />
              {t.to ? <a href={t.to} className="hover:underline underline-offset-2">{t.rotulo}</a> : <span>{t.rotulo}</span>}
            </span>
          ))}
          <ChevronRight className="h-3 w-3 opacity-70" aria-hidden />
          <span className="font-semibold text-white">{titulo}</span>
        </nav>
        <div className={`mt-3 grid gap-6 ${lateral ? "lg:grid-cols-[1fr_380px] lg:items-center" : ""}`}>
          <div className="min-w-0">
            <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">{titulo}</h1>
            <p className="text-white/90 mt-2 max-w-2xl leading-relaxed">{descricao}</p>
            {children}
            {numeros && (
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-3xl">
                {numeros.map((n) => (
                  <div key={n.rotulo} className="rounded-xl bg-white/10 px-4 py-3">
                    <dt className="text-xs text-white/85">{n.rotulo}</dt>
                    <dd className="font-display text-2xl font-bold tabular-nums">{n.valor}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          {lateral}
        </div>
      </div>
    </header>
  );
}
