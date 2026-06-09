import { useEffect, useState } from "react";

export type QuickAccessCategory = "cidadaos" | "servidores" | "empresas" | "legislacao";

export const CATEGORY_LABELS: Record<QuickAccessCategory, string> = {
  cidadaos: "Cidadãos",
  servidores: "Servidores",
  empresas: "Empresas",
  legislacao: "Legislação",
};

export const ICON_OPTIONS = [
  "FileText",
  "ClipboardList",
  "Monitor",
  "BookOpen",
  "Users",
  "Building2",
  "Phone",
  "Mail",
  "Gavel",
  "Scale",
  "ShieldCheck",
  "Calendar",
  "Wallet",
  "Receipt",
  "Landmark",
  "Globe",
] as const;

export type QuickAccessIcon = (typeof ICON_OPTIONS)[number];

export type QuickAccessItem = {
  id: string;
  category: QuickAccessCategory;
  label: string;
  tag?: string;
  icon: QuickAccessIcon;
  url: string;
  external: boolean;
};

const STORAGE_KEY = "cm:quick-access:v1";

const DEFAULT_ITEMS: QuickAccessItem[] = [
  { id: "1", category: "cidadaos", label: "Licitações", icon: "FileText", url: "/transparencia", external: false },
  { id: "2", category: "cidadaos", label: "Contratos", icon: "ClipboardList", url: "/transparencia", external: false },
  { id: "3", category: "cidadaos", label: "Nota Fiscal Eletrônica", tag: "NFSE", icon: "Monitor", url: "https://nfse.exemplo.gov.br", external: true },
  { id: "4", category: "cidadaos", label: "Despesas", icon: "BookOpen", url: "/transparencia", external: false },
  { id: "5", category: "cidadaos", label: "Folha de Pagamento", icon: "Users", url: "/transparencia", external: false },
  { id: "6", category: "cidadaos", label: "Diárias e Passagens", icon: "Building2", url: "/transparencia", external: false },
  { id: "7", category: "cidadaos", label: "Ouvidoria e Atendimento", icon: "Phone", url: "/contato", external: false },
  { id: "8", category: "cidadaos", label: "Emissão de Guias IPTU", tag: "IPTU", icon: "FileText", url: "https://iptu.exemplo.gov.br", external: true },
  { id: "9", category: "cidadaos", label: "Emissão de Guias ISS", tag: "GUIAS ISS", icon: "FileText", url: "https://iss.exemplo.gov.br", external: true },
  { id: "10", category: "cidadaos", label: "Lei Aldir Blanc", tag: "PNAB", icon: "BookOpen", url: "/transparencia", external: false },
  { id: "11", category: "cidadaos", label: "Ficha Funcional", tag: "FUNCIONÁRIOS", icon: "Users", url: "/transparencia", external: false },
  { id: "12", category: "cidadaos", label: "Webmail", tag: "E-MAIL", icon: "Mail", url: "https://webmail.exemplo.gov.br", external: true },
  { id: "13", category: "servidores", label: "Portal do Servidor", icon: "Users", url: "https://servidor.exemplo.gov.br", external: true },
  { id: "14", category: "servidores", label: "Holerite Online", icon: "Receipt", url: "https://holerite.exemplo.gov.br", external: true },
  { id: "15", category: "empresas", label: "Alvará Online", icon: "Building2", url: "https://alvara.exemplo.gov.br", external: true },
  { id: "16", category: "empresas", label: "NFS-e Empresa", tag: "NFSE", icon: "Monitor", url: "https://nfse.exemplo.gov.br", external: true },
  { id: "17", category: "legislacao", label: "Lei Orgânica", icon: "Scale", url: "/transparencia", external: false },
  { id: "18", category: "legislacao", label: "Regimento Interno", icon: "Gavel", url: "/transparencia", external: false },
];

function load(): QuickAccessItem[] {
  if (typeof window === "undefined") return DEFAULT_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ITEMS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_ITEMS;
    return parsed;
  } catch {
    return DEFAULT_ITEMS;
  }
}

function save(items: QuickAccessItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("quick-access:changed"));
}

export function useQuickAccess() {
  const [items, setItems] = useState<QuickAccessItem[]>(DEFAULT_ITEMS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
    const onChange = () => setItems(load());
    window.addEventListener("quick-access:changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("quick-access:changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = (item: Omit<QuickAccessItem, "id">) => {
    const next = [...items, { ...item, id: crypto.randomUUID() }];
    setItems(next);
    save(next);
  };
  const update = (id: string, patch: Partial<QuickAccessItem>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i));
    setItems(next);
    save(next);
  };
  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    save(next);
  };
  const reset = () => {
    setItems(DEFAULT_ITEMS);
    save(DEFAULT_ITEMS);
  };

  return { items, ready, add, update, remove, reset };
}
