import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Coins, Download, ExternalLink, Flag, GraduationCap, HeartPulse, Landmark, Leaf, Sprout, Users } from "lucide-react";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { ROUTES } from "@/lib/site-links";
import banner from "@/assets/adelandia-banner.webp";
import feijao from "@/assets/adelandia-feijao.webp";
import bandeira from "@/assets/bandeira-adelandia.png";

export const Route = createFileRoute("/a-camara/historia")({
  head: () => ({
    meta: [
      { title: "História de Adelândia — Câmara Municipal" },
      {
        name: "description",
        content:
          "Conheça a história do município de Adelândia (GO): emancipação em 1987, a Capital do Feijão, a bandeira municipal, economia, população e indicadores oficiais.",
      },
      { property: "og:title", content: "História de Adelândia — Câmara Municipal" },
      {
        property: "og:description",
        content: "Origem do município, emancipação em 1987, economia agropecuária e indicadores sociais de Adelândia (GO).",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoriaPage,
});

const FONTE_IBGE = "https://www.ibge.gov.br/cidades-e-estados/go/adelandia.html";

const INDICADORES: { titulo: string; icone: typeof Users; linhas: [string, string][] }[] = [
  {
    titulo: "População",
    icone: Users,
    linhas: [
      ["População estimada (2026)", "2.268"],
      ["População no Censo de 2022", "2.297"],
      ["População no Censo de 2010", "2.477"],
      ["Densidade demográfica (2022)", "19,91 hab/km²"],
    ],
  },
  {
    titulo: "Economia",
    icone: Landmark,
    linhas: [
      ["PIB per capita (2023)", "R$ 25.897,08"],
      ["Receitas brutas realizadas (2025)", "R$ 36.079.950,33"],
      ["Despesas brutas empenhadas (2025)", "R$ 29.934.341,86"],
      ["IDHM (2010)", "0,702"],
    ],
  },
  {
    titulo: "Trabalho e rendimento",
    icone: Coins,
    linhas: [
      ["Salário médio mensal (2020)", "1,5 salário mínimo"],
      ["Pessoal ocupado (2020)", "508 pessoas"],
      ["População ocupada (2020)", "20,2%"],
      ["Rendimento até ½ salário mínimo (2010)", "34,7%"],
    ],
  },
  {
    titulo: "Educação",
    icone: GraduationCap,
    linhas: [
      ["Escolarização de 6 a 14 anos (2022)", "100%"],
      ["IDEB anos iniciais (2021)", "5,1"],
      ["IDEB anos finais (2021)", "4,8"],
      ["Matrículas no ensino fundamental (2021)", "256"],
      ["Matrículas no ensino médio (2021)", "96"],
    ],
  },
  {
    titulo: "Saúde",
    icone: HeartPulse,
    linhas: [["Estabelecimentos de saúde SUS (2009)", "1"]],
  },
  {
    titulo: "Meio ambiente e território",
    icone: Leaf,
    linhas: [
      ["Área territorial (2025)", "115,385 km²"],
      ["Bioma (2019)", "Cerrado"],
      ["Área urbanizada (2019)", "0,86 km²"],
      ["Arborização de vias públicas (2010)", "98,3%"],
      ["Esgotamento sanitário adequado (2010)", "22,4%"],
    ],
  },
];

const LINHA_DO_TEMPO = [
  {
    ano: "Década de 1950",
    texto: "Erguida a capela em louvor a São Sebastião e, em seguida, uma pequena escola que atendia os moradores das fazendas da região de Mossâmedes, próxima ao Rio Turvo.",
  },
  {
    ano: "1962",
    texto: "Surge Adelândia, nome em homenagem a dona Adélia, esposa do fazendeiro Domingos Alves Sobrinho, que doou as terras onde se formou o núcleo populacional. No mesmo ano, o povoado é elevado a distrito de Mossâmedes.",
  },
  {
    ano: "Década de 1980",
    texto: "A fertilidade das terras e a grande produção de feijão rendem ao lugar o título de “Capital do Feijão”, marca histórica presente na bandeira municipal.",
  },
  {
    ano: "30 de dezembro de 1987",
    texto: "Com a Lei nº 10.396, Adelândia é emancipada e torna-se município. O hino municipal foi escolhido por concurso público, vencido pela professora Waldir da Silva Avelar.",
  },
  {
    ano: "A partir de 1988",
    texto: "Na primeira eleição direta foram eleitos Lourival Lobó (prefeito) e Francisco Quintiliano de Avelar Filho (vice). Seguiram-se Antonio dos Reis Pereira, André Gomes Duarte, Maurício Martins de Freitas, Victor Leonardo de Lima Soares (dois mandatos), Joaquim dos Reis e Edson Vieira de Paula.",
  },
];

const FICHA: [string, string][] = [
  ["Gentílico", "Adelandense"],
  ["Aniversário", "1º de junho"],
  ["Microrregião", "Anicuns"],
  ["Região intermediária", "Goiânia"],
  ["Bioma", "Cerrado"],
];

function HistoriaPage() {
  const [tema, setTema] = useState("");
  const visiveis = INDICADORES.filter((b) => !tema || b.titulo === tema);

  return (
    <>
      <CabecalhoPagina
        titulo="História de Adelândia"
        trilha={[{ rotulo: "A Câmara" }]}
        icone={Landmark}
        descricao="Da capela de São Sebastião à emancipação em 1987: a trajetória da Capital do Feijão e os números que retratam o município hoje."
        numeros={[
          { rotulo: "Emancipação", valor: "1987" },
          { rotulo: "População (Censo 2022)", valor: "2.297" },
          { rotulo: "Área", valor: "115,39 km²" },
          { rotulo: "Título histórico", valor: <span className="text-lg leading-tight block">Capital do Feijão</span> },
        ]}
      />

      <div className="container-page py-8 md:py-10 space-y-10 md:space-y-12">
        <figure>
          <img src={banner} width={1800} height={600} alt="Ilustração com a bandeira de Adelândia, sacas e vagens de feijão em primeiro plano e a vista de uma pequena cidade ao fundo." className="w-full h-auto rounded-2xl border border-border" />
          <figcaption className="text-xs text-muted-foreground mt-2">Ilustração artística. A paisagem não é uma fotografia da cidade.</figcaption>
        </figure>

        <section aria-labelledby="titulo-origem" className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <h2 id="titulo-origem" className="font-display font-bold text-2xl text-foreground">A cidade e sua origem</h2>
            <div className="mt-3 space-y-4 text-foreground/85 leading-relaxed">
              <p>Adelândia é um município do interior de Goiás, na Região Centro-Oeste, integrante da microrregião de Anicuns. A população, formada originalmente por trabalhadores rurais, mantém forte vínculo com o campo.</p>
              <p>O nome homenageia dona Adélia, esposa do fazendeiro Domingos Alves Sobrinho, que doou as terras onde o povoado se formou ao redor da capela de São Sebastião.</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
            <h3 className="font-display font-bold text-lg text-foreground">Linha do tempo</h3>
            <ol className="relative mt-4 space-y-5 border-l-2 border-border pl-5">
              {LINHA_DO_TEMPO.map((t) => (
                <li key={t.ano} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/15" aria-hidden />
                  <p className="text-sm font-bold text-primary">{t.ano}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="titulo-feijao" className="grid md:grid-cols-2 overflow-hidden rounded-2xl bg-card border border-border">
          <img src={feijao} width={1100} height={733} loading="lazy" alt="Ilustração com a bandeira de Adelândia ao fundo, sacas de feijão, vagens e folhas em primeiro plano." className="w-full h-full object-cover min-h-64" />
          <div className="p-6 md:p-8 self-center">
            <p className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "#8A5A00" }}><Sprout className="w-4 h-4" aria-hidden /> A vocação do campo</p>
            <h2 id="titulo-feijao" className="font-display font-bold text-2xl text-foreground mt-1">A Capital do Feijão</h2>
            <div className="mt-3 space-y-3 text-foreground/85 leading-relaxed">
              <p>A terra fértil e a grande produção de feijão deram a Adelândia o título que ainda hoje identifica o município e que está estampado na sua bandeira.</p>
              <p>A economia segue ligada ao campo e às pequenas empresas, com destaque para a bacia leiteira, o cultivo de bananas e a produção cerâmica. A grande concentração de pequenas propriedades rurais sustenta, direta e indiretamente, centenas de empregos. Há também potencial em confecções e facções.</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="titulo-bandeira" className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid sm:grid-cols-[minmax(0,300px)_1fr] gap-5 items-center bg-card border border-border rounded-2xl p-5 md:p-6">
            <img src={bandeira} width={675} height={454} loading="lazy" alt="Bandeira de Adelândia: faixas verticais vermelha, branca e azul, com uma vagem de feijão, folhas e grãos ao centro." className="w-full h-auto rounded-lg border border-border" />
            <div>
              <h2 id="titulo-bandeira" className="flex items-center gap-2 font-display font-bold text-xl text-foreground"><Flag className="w-5 h-5 text-primary" aria-hidden /> A bandeira municipal</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">Três faixas verticais, em vermelho, branco e azul. Ao centro, sobre o branco, a vagem aberta com folhas e grãos lembra a produção que deu fama ao município.</p>
              <a href={bandeira} download="bandeira-de-adelandia.png" className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition mt-4"><Download className="w-4 h-4" aria-hidden /> Baixar a bandeira</a>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
            <h2 className="font-display font-bold text-xl text-foreground">Ficha do município</h2>
            <dl className="mt-3 divide-y divide-border text-sm">
              {FICHA.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-semibold text-foreground text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="titulo-numeros" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="titulo-numeros" className="font-display font-bold text-2xl text-foreground">Adelândia em números</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Cada dado traz o ano a que se refere.</p>
            </div>
            <select aria-label="Filtrar por tema" value={tema} onChange={(e) => setTema(e.target.value)} className="h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground">
              <option value="">Todos os temas</option>
              {INDICADORES.map((b) => <option key={b.titulo} value={b.titulo}>{b.titulo}</option>)}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visiveis.map((b) => (
              <article key={b.titulo} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><b.icone className="h-4 w-4" aria-hidden /></span>
                  <h3 className="font-display font-bold text-foreground">{b.titulo}</h3>
                </div>
                <dl className="mt-3 divide-y divide-border text-sm">
                  {b.linhas.map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-4 py-2">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-semibold text-foreground text-right whitespace-nowrap">{v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <a href={FONTE_IBGE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-2">Fonte: IBGE, Cidades e Estados <ExternalLink className="w-3.5 h-3.5" aria-hidden /></a>
        </section>

        <nav aria-label="Continue navegando" className="grid gap-3 sm:grid-cols-3">
          {[
            { to: ROUTES.mesaDiretora, rotulo: "Mesa Diretora" },
            { to: ROUTES.comissoes, rotulo: "Comissões" },
            { to: ROUTES.leiOrganica, rotulo: "Lei Orgânica Municipal" },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="group flex items-center gap-3 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition focus-visible:outline-2 focus-visible:outline-offset-2">
              <span className="flex-1 text-sm font-semibold text-foreground">{l.rotulo}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
