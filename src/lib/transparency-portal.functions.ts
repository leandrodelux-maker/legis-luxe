import { createServerFn } from "@tanstack/react-start";

type Primitive = string | number | boolean | null;

export type PortalChild = {
  titulo: string;
  descricao: string;
  icone: string | null;
  url: string;
  rota: string;
  datasetKey?: string;
};
export type PortalMenu = {
  titulo: string;
  descricao: string;
  cor: string | null;
  icone: string | null;
  rota: string;
  filhos: PortalChild[];
};
export type PortalColumn = {
  key: string;
  label: string;
  type?: "currency" | "date" | "text" | "number";
};
export type PortalDataset = {
  key: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  portalUrl: string;
  total: number;
  columns: PortalColumn[];
  rows: Record<string, Primitive>[];
  error?: string;
};
export type PortalData = {
  ok: boolean;
  error?: string;
  cidade?: string;
  uf?: string;
  tituloDoTopo?: string;
  generatedAt?: string;
  receitas?: { valor: string; descricao: string; ano: number } | null;
  despesas?: { valor: string; descricao: string; ano: number } | null;
  menus: PortalMenu[];
  datasets: PortalDataset[];
  portalUrl: string;
};

type EndpointDefinition = {
  key: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  route: string;
  endpoint: string;
  method: "GET" | "POST";
  columns: PortalColumn[];
  mapRow: (row: any) => Record<string, Primitive>;
};

const DATASETS: EndpointDefinition[] = [
  {
    key: "receitas",
    title: "Receitas",
    description: "Receitas arrecadadas por natureza, fonte e valor acumulado.",
    category: "Receitas e Despesas",
    icon: "Banknote",
    route: "receitas-e-despesas/receita",
    endpoint: "/api/receitas-e-despesas/receita/paginado",
    method: "GET",
    columns: [
      { key: "receita", label: "Receita" },
      { key: "fonte", label: "Fonte" },
      { key: "valorOrcado", label: "Orçado", type: "currency" },
      { key: "arrecadacao", label: "Arrecadado", type: "currency" },
      { key: "valorAcumulado", label: "Acumulado", type: "currency" },
    ],
    mapRow: (r) => ({
      receita: r.receita ?? r.naturezaDaReceita ?? "—",
      fonte: r.fonteDaReceita ?? r.origemDoRecurso ?? "—",
      valorOrcado: r.valorOrcado ?? null,
      arrecadacao: r.arrecadacao ?? null,
      valorAcumulado: r.valorAcumulado ?? null,
    }),
  },
  {
    key: "empenhos",
    title: "Despesas e Empenhos",
    description: "Empenhos emitidos, fornecedores, liquidações e valores.",
    category: "Receitas e Despesas",
    icon: "Receipt",
    route: "receitas-e-despesas/empenho",
    endpoint: "/api/receitas-e-despesas/empenho/paginado",
    method: "GET",
    columns: [
      { key: "data", label: "Data", type: "date" },
      { key: "numero", label: "Empenho" },
      { key: "fornecedor", label: "Fornecedor" },
      { key: "valor", label: "Valor" , type: "currency" },
      { key: "liquidado", label: "Liquidado", type: "currency" },
    ],
    mapRow: (r) => ({
      data: r.data ?? "—",
      numero: r.numeroDoTcm ?? r.numero ?? r.codigo ?? "—",
      fornecedor: r.nomeDoFornecedor ?? r.cnpjENomeDoFornecedor ?? "—",
      valor: r.valorDoEmpenho ?? null,
      liquidado: r.valorDaLiquidacao ?? null,
    }),
  },
  {
    key: "pagamentos",
    title: "Pagamentos",
    description: "Ordens de pagamento com favorecido, empenho e valor pago.",
    category: "Receitas e Despesas",
    icon: "WalletCards",
    route: "receitas-e-despesas/ordem-de-pagamento",
    endpoint: "/api/receitas-e-despesas/ordem-de-pagamento/paginado",
    method: "GET",
    columns: [
      { key: "data", label: "Data", type: "date" },
      { key: "numero", label: "Pagamento" },
      { key: "fornecedor", label: "Favorecido" },
      { key: "empenho", label: "Empenho" },
      { key: "valor", label: "Pago", type: "currency" },
    ],
    mapRow: (r) => ({
      data: r.dataPagamento ?? "—",
      numero: r.numero ?? r.codigo ?? "—",
      fornecedor: r.nomeDoFornecedor ?? "—",
      empenho: r.numeroDoEmpenho ?? "—",
      valor: r.valorPago ?? r.valorTotal ?? null,
    }),
  },
  {
    key: "licitacoes",
    title: "Licitações",
    description: "Procedimentos licitatórios, modalidade, situação e valor vencedor.",
    category: "Contratos e Licitações",
    icon: "Gavel",
    route: "contratos-convenios-e-licitacoes/procedimentos-licitatorios",
    endpoint: "/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/paginado",
    method: "POST",
    columns: [
      { key: "numero", label: "Número" },
      { key: "data", label: "Julgamento", type: "date" },
      { key: "modalidade", label: "Modalidade" },
      { key: "situacao", label: "Situação" },
      { key: "valor", label: "Valor", type: "currency" },
    ],
    mapRow: (r) => ({
      numero: r.numeroAno ?? r.numero ?? r.codigo ?? "—",
      data: r.dataDeJulgamento ?? r.data ?? "—",
      modalidade: r.modalidade ?? "—",
      situacao: r.situacao ?? "—",
      valor: r.valorVencedorTotal ?? r.valorEstimadoTotal ?? null,
    }),
  },
  {
    key: "contratos",
    title: "Contratos",
    description: "Contratos celebrados, fornecedores, vigência, objeto e valor.",
    category: "Contratos e Licitações",
    icon: "FileSignature",
    route: "contratos-convenios-e-licitacoes/contrato",
    endpoint: "/api/contratos-convenios-e-licitacoes/contrato/paginado",
    method: "POST",
    columns: [
      { key: "numero", label: "Contrato" },
      { key: "data", label: "Data", type: "date" },
      { key: "fornecedor", label: "Fornecedor" },
      { key: "vigencia", label: "Vigência" },
      { key: "valor", label: "Valor", type: "currency" },
    ],
    mapRow: (r) => ({
      numero: r.numero ?? r.codigo ?? "—",
      data: r.data ?? "—",
      fornecedor: r.nomeDoFornecedor ?? "—",
      vigencia: r.vigencia ?? "—",
      valor: r.valor ?? r.valorTotal ?? null,
      objeto: r.objeto ?? "",
    }),
  },
  {
    key: "compras",
    title: "Ordens de Fornecimento",
    description: "Compras e fornecimentos vinculados a processos de contratação.",
    category: "Contratos e Licitações",
    icon: "ShoppingCart",
    route: "contratos-convenios-e-licitacoes/ordem-de-fornecimento",
    endpoint: "/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/paginado",
    method: "POST",
    columns: [
      { key: "data", label: "Data", type: "date" },
      { key: "licitacao", label: "Licitação" },
      { key: "fornecedor", label: "Fornecedor" },
      { key: "situacao", label: "Situação" },
      { key: "valor", label: "Valor", type: "currency" },
    ],
    mapRow: (r) => ({
      data: r.data ?? "—",
      licitacao: r.licitacao ?? r.modalidade ?? "—",
      fornecedor: r.fornecedor ?? "—",
      situacao: r.situacao ?? "—",
      valor: r.valorTotalGeral ?? null,
    }),
  },
  {
    key: "diarias",
    title: "Diárias",
    description: "Diárias concedidas a servidores, destino e valores pagos.",
    category: "Órgãos e Servidores",
    icon: "Users",
    route: "orgaos-e-servidores/diaria",
    endpoint: "/api/orgaos-e-servidores/diaria/paginado",
    method: "GET",
    columns: [
      { key: "servidor", label: "Servidor" },
      { key: "cargo", label: "Cargo" },
      { key: "destino", label: "Destino" },
      { key: "saida", label: "Saída", type: "date" },
      { key: "valor", label: "Valor", type: "currency" },
    ],
    mapRow: (r) => ({
      servidor: r.nomeDoFuncionario ?? r.servidor ?? "—",
      cargo: r.cargoDoFuncionario ?? "—",
      destino: r.destino ?? "—",
      saida: r.dataDaSaida ?? "—",
      valor: r.valorTotal ?? r.valorDaDiaria ?? r.valor ?? null,
    }),
  },
];

const routeToDataset = new Map(DATASETS.map((d) => [d.route.split("/").pop(), d.key]));

function absolutePortalUrl(base: string, route: string) {
  return `${base}/${route.replace(/^\/+/, "")}`;
}

async function fetchPortalJson(url: string, token?: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json, text/plain, */*",
      "User-Agent": "Mozilla/5.0 Lovable",
      "cliente-integrado": "megasoft-portal-da-transparencia",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchDataset(base: string, token: string, year: number, definition: EndpointDefinition): Promise<PortalDataset> {
  const payload = { pagina: 1, tamanhoDaPagina: 12, ano: year };
  const query = new URLSearchParams({ pagina: "1", tamanhoDaPagina: "12", ano: String(year) });
  const url = definition.method === "GET" ? `${base}${definition.endpoint}?${query}` : `${base}${definition.endpoint}`;
  try {
    const json = await fetchPortalJson(url, token, definition.method === "POST" ? {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    } : undefined);
    const rows = Array.isArray(json?.registros) ? json.registros.map(definition.mapRow) : [];
    return {
      key: definition.key,
      title: definition.title,
      description: definition.description,
      category: definition.category,
      icon: definition.icon,
      portalUrl: absolutePortalUrl(base, definition.route),
      total: Number(json?.total ?? rows.length),
      columns: definition.columns,
      rows,
    };
  } catch (error) {
    return {
      key: definition.key,
      title: definition.title,
      description: definition.description,
      category: definition.category,
      icon: definition.icon,
      portalUrl: absolutePortalUrl(base, definition.route),
      total: 0,
      columns: definition.columns,
      rows: [],
      error: error instanceof Error ? error.message : "Falha na consulta",
    };
  }
}

export const getPortalData = createServerFn({ method: "GET" })
  .inputValidator((d: { baseUrl: string }) => {
    if (!d?.baseUrl || typeof d.baseUrl !== "string") throw new Error("baseUrl é obrigatório");
    return d;
  })
  .handler(async ({ data }): Promise<PortalData> => {
    const base = data.baseUrl.trim().replace(/\/+$/, "");
    const fallback: PortalData = { ok: false, menus: [], datasets: [], portalUrl: base + "/" };
    try {
      const json: any = await fetchPortalJson(`${base}/api/configuracao/carregamento-inicial`);
      const currentYear = Number(json.receitas?.ano || json.despesas?.ano || new Date().getFullYear());
      const menus: PortalMenu[] = (json.menus || []).map((m: any) => ({
        titulo: String(m.titulo || ""),
        descricao: String(m.descricao || ""),
        cor: m.cor || null,
        icone: m.icone || null,
        rota: String(m.rota || ""),
        filhos: (m.filhos || []).map((f: any) => ({
          titulo: String(f.tituloMaior || f.titulo || f.rota || ""),
          descricao: String(f.perguntaProativa || f.descricao || ""),
          icone: f.icone || null,
          rota: String(f.rota || ""),
          datasetKey: routeToDataset.get(String(f.rota || "")),
          url: absolutePortalUrl(base, `${m.rota}/${f.rota}`),
        })),
      }));
      const datasets = json.tokenPortal
        ? await Promise.all(DATASETS.map((definition) => fetchDataset(base, json.tokenPortal, currentYear, definition)))
        : [];
      return {
        ok: true,
        cidade: json.cidade,
        uf: json.uf,
        tituloDoTopo: json.tituloDoTopo,
        generatedAt: new Date().toISOString(),
        receitas: json.receitas || null,
        despesas: json.despesas || null,
        menus,
        datasets,
        portalUrl: base + "/",
      };
    } catch (e) {
      return { ...fallback, error: e instanceof Error ? e.message : "Falha ao ler portal" };
    }
  });
