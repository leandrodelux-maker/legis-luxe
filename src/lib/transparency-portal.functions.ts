import { createServerFn } from "@tanstack/react-start";

export type PortalChild = {
  titulo: string;
  descricao: string;
  icone: string | null;
  url: string;
};
export type PortalMenu = {
  titulo: string;
  descricao: string;
  cor: string | null;
  icone: string | null;
  filhos: PortalChild[];
};
export type PortalData = {
  ok: boolean;
  error?: string;
  cidade?: string;
  uf?: string;
  tituloDoTopo?: string;
  receitas?: { valor: string; descricao: string; ano: number } | null;
  despesas?: { valor: string; descricao: string; ano: number } | null;
  menus: PortalMenu[];
  portalUrl: string;
};

export const getPortalData = createServerFn({ method: "GET" })
  .inputValidator((d: { baseUrl: string }) => {
    if (!d?.baseUrl || typeof d.baseUrl !== "string") throw new Error("baseUrl é obrigatório");
    return d;
  })
  .handler(async ({ data }): Promise<PortalData> => {
    const base = data.baseUrl.trim().replace(/\/+$/, "");
    const fallback: PortalData = { ok: false, menus: [], portalUrl: base + "/" };
    try {
      const res = await fetch(`${base}/api/configuracao/carregamento-inicial`, {
        headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 Lovable" },
      });
      if (!res.ok) return { ...fallback, error: `Portal respondeu ${res.status}` };
      const json: any = await res.json();
      const menus: PortalMenu[] = (json.menus || []).map((m: any) => ({
        titulo: String(m.titulo || ""),
        descricao: String(m.descricao || ""),
        cor: m.cor || null,
        icone: m.icone || null,
        filhos: (m.filhos || []).map((f: any) => ({
          titulo: String(f.tituloMaior || f.titulo || f.rota || ""),
          descricao: String(f.perguntaProativa || f.descricao || ""),
          icone: f.icone || null,
          url: `${base}/${m.rota}/${f.rota}`,
        })),
      }));
      return {
        ok: true,
        cidade: json.cidade,
        uf: json.uf,
        tituloDoTopo: json.tituloDoTopo,
        receitas: json.receitas || null,
        despesas: json.despesas || null,
        menus,
        portalUrl: base + "/",
      };
    } catch (e) {
      return { ...fallback, error: e instanceof Error ? e.message : "Falha ao ler portal" };
    }
  });
