import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  AArrowDown,
  AArrowUp,
  Moon,
  Sun,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/theme-provider";
import { supabase } from "@/integrations/supabase/client";
import { TODOS_MODULOS } from "@/components/admin/painel/modulos";

type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  path: string;
  type: string;
};

const QUICK_LINKS: SearchResult[] = [
  { id: "n1", title: "Nova notícia", path: "/admin/noticias?novo=1", type: "Criar" },
  { id: "n2", title: "Nova sessão", path: "/admin/sessoes?novo=1", type: "Criar" },
  { id: "n3", title: "Novo projeto", path: "/admin/projetos?novo=1", type: "Criar" },
  ...TODOS_MODULOS.map((m) => ({ id: m.path, title: m.label, subtitle: m.desc, path: m.path, type: m.grupo.label })),
];

const TAMANHOS = [100, 112, 125];
const lerTamanho = () => {
  try { return Number(localStorage.getItem("painel-tamanho-texto")) || 100; } catch { return 100; }
};

export function AdminTopbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dynamic, setDynamic] = useState<SearchResult[]>([]);
  const [tamanho, setTamanho] = useState(100);

  // Tamanho do texto do painel: vale só aqui, o site público não muda.
  useEffect(() => setTamanho(lerTamanho()), []);
  useEffect(() => {
    document.documentElement.style.fontSize = `${tamanho}%`;
    try { localStorage.setItem("painel-tamanho-texto", String(tamanho)); } catch { /* sem armazenamento */ }
    return () => { document.documentElement.style.fontSize = ""; };
  }, [tamanho]);
  const mudarTamanho = (passo: number) => setTamanho((a) => TAMANHOS[Math.min(TAMANHOS.length - 1, Math.max(0, TAMANHOS.indexOf(a) + passo))] ?? 100);


  // Cmd/Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Dynamic search (vereadores/noticias/projetos)
  useEffect(() => {
    if (!searchOpen || query.trim().length < 2) {
      setDynamic([]);
      return;
    }
    const q = `%${query}%`;
    let cancelled = false;
    (async () => {
      const [v, n, p] = await Promise.all([
        supabase.from("vereadores").select("id,nome,partido").ilike("nome", q).limit(5),
        supabase.from("noticias").select("id,titulo,categoria").ilike("titulo", q).limit(5),
        supabase.from("projetos_legislativos").select("id,ementa,tipo,numero,ano").or(`ementa.ilike.${q},numero.ilike.${q}`).limit(5),
      ]);
      if (cancelled) return;
      const items: SearchResult[] = [
        ...(v.data ?? []).map((r: any) => ({
          id: `v-${r.id}`, title: r.nome, subtitle: r.partido ?? "Vereador",
          path: `/admin/vereadores`, type: "Vereador",
        })),
        ...(n.data ?? []).map((r: any) => ({
          id: `n-${r.id}`, title: r.titulo, subtitle: r.categoria ?? "Notícia",
          path: `/admin/noticias`, type: "Notícia",
        })),
        ...(p.data ?? []).map((r: any) => ({
          id: `p-${r.id}`, title: `${r.tipo} ${r.numero}/${r.ano}`, subtitle: r.ementa,
          path: `/admin/projetos`, type: "Projeto",
        })),
      ];
      setDynamic(items);
    })();
    return () => { cancelled = true; };
  }, [query, searchOpen]);

  const filteredQuick = useMemo(() => {
    if (!query.trim()) return QUICK_LINKS;
    const q = query.toLowerCase();
    return QUICK_LINKS.filter((i) => i.title.toLowerCase().includes(q));
  }, [query]);

  const go = (path: string) => {
    setSearchOpen(false);
    setQuery("");
    if (path.includes("?")) window.location.assign(path);
    else navigate({ to: path });
  };

  return (
    <>
      <header className="h-16 sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border flex items-center gap-2 px-3 md:px-5">
        <SidebarTrigger />
        <div className="h-5 w-px bg-border" />

        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="group flex-1 max-w-md flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-muted/40 hover:bg-muted/70 text-muted-foreground text-sm transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left truncate">Pesquisar<span className="hidden sm:inline"> no painel...</span></span>
          <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-background/70">
            Ctrl K
          </kbd>
        </button>

        <div className="flex-1" />

        {/* Tamanho do texto */}
        <div role="group" aria-label="Tamanho do texto" className="flex items-center">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" aria-label="Diminuir o texto" title="Diminuir o texto" disabled={tamanho === TAMANHOS[0]} onClick={() => mudarTamanho(-1)}><AArrowDown className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" aria-label="Aumentar o texto" title="Aumentar o texto" disabled={tamanho === TAMANHOS[TAMANHOS.length - 1]} onClick={() => mudarTamanho(1)}><AArrowUp className="w-4 h-4" /></Button>
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-lg"
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          aria-label={theme === "dark" ? "Usar modo claro" : "Usar modo escuro"}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>


      </header>

      {/* Global Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Pesquisa global</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Pesquisar no painel"
              placeholder="Buscar páginas, vereadores, notícias, projetos..."
              className="border-0 shadow-none focus-visible:ring-0 px-0 h-9 text-base"
            />
          </div>
          <ScrollArea className="max-h-[480px]">
            <div className="p-2">
              {dynamic.length > 0 && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1">Resultados</p>
                  {dynamic.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => go(r.path)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.title}</p>
                        {r.subtitle && <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>}
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>
                    </button>
                  ))}
                </>
              )}
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-3 pb-1">
                Navegação rápida
              </p>
              {filteredQuick.length === 0 ? (
                <p className="px-3 py-6 text-sm text-muted-foreground text-center">Nenhum resultado encontrado.</p>
              ) : (
                filteredQuick.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => go(i.path)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{i.title}</p>
                      {i.subtitle && <p className="text-xs text-muted-foreground truncate">{i.subtitle}</p>}
                    </div>
                    <Badge variant="outline" className="text-[10px]">{i.type}</Badge>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="px-4 py-2 border-t border-border bg-muted/30 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Atalho: <kbd className="font-mono px-1 rounded bg-background border border-border">Ctrl K</kbd></span>
                      </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
