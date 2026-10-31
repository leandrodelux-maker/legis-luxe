import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Eye, FileSearch, Gavel, HelpCircle, Landmark, Lock, Megaphone, X, type LucideIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { ROUTES } from "@/lib/site-links";

type Faq = { q: string; a: string; cat: string; to?: string; acao?: string };

const FAQS: Faq[] = [
  { cat: "Institucional", q: "O que faz a Câmara Municipal?", a: "A Câmara Municipal é o Poder Legislativo do município. Cabe a ela elaborar leis, fiscalizar os atos do Poder Executivo, votar o orçamento e representar a população.", to: ROUTES.historia, acao: "Conhecer o município" },
  { cat: "Institucional", q: "Quantos vereadores compõem a Câmara?", a: "O limite de vereadores é definido pela Constituição Federal com base na população do município. A página de Vereadores mostra a composição atual.", to: ROUTES.vereadores, acao: "Ver os vereadores" },
  { cat: "Sessões", q: "Como acompanhar as sessões da Câmara?", a: "As sessões são abertas ao público. Na página de Sessões você consulta o calendário e, quando publicados, as atas, as presenças e os votos.", to: ROUTES.sessoes, acao: "Ver as sessões" },
  { cat: "Sessões", q: "Posso participar de uma sessão presencialmente?", a: "Sim. As sessões plenárias são públicas. Consulte a agenda e compareça ao plenário no dia e horário divulgados.", to: ROUTES.roteiroSessoes, acao: "Entender o roteiro da sessão" },
  { cat: "Transparência", q: "Onde encontro os dados de receitas, despesas e contratos?", a: "No Portal da Transparência, com informações sobre orçamento, licitações, contratos, folha de pagamento e prestação de contas.", to: ROUTES.transparencia, acao: "Abrir o portal" },
  { cat: "Transparência", q: "Com que frequência os dados são atualizados?", a: "Os dados financeiros são atualizados conforme a legislação vigente (LC nº 131/2009 e Lei nº 12.527/2011), normalmente em periodicidade diária ou mensal, dependendo da informação." },
  { cat: "e-SIC", q: "Como faço um pedido de acesso à informação?", a: "Pelo e-SIC, preenchendo o formulário com seus dados e a descrição do pedido. Um número de protocolo é gerado para acompanhamento.", to: ROUTES.esic, acao: "Abrir o e-SIC" },
  { cat: "e-SIC", q: "Qual o prazo para receber a resposta?", a: "O prazo legal é de até 20 dias corridos, prorrogáveis por mais 10 mediante justificativa, conforme a Lei nº 12.527/2011." },
  { cat: "LGPD", q: "Como a Câmara trata meus dados pessoais?", a: "Os dados são tratados conforme a Lei nº 13.709/2018 (LGPD), com finalidade específica, transparência e medidas de segurança.", to: ROUTES.lgpd, acao: "Ver a página da LGPD" },
  { cat: "LGPD", q: "Quem é o Encarregado de Dados (DPO)?", a: "O Encarregado de Dados é designado por portaria. As solicitações sobre proteção de dados podem ser enviadas pela página da LGPD.", to: ROUTES.lgpd, acao: "Exercer meus direitos" },
  { cat: "Ouvidoria", q: "Qual a diferença entre Ouvidoria e e-SIC?", a: "A Ouvidoria recebe reclamações, sugestões, elogios e denúncias sobre os serviços da Câmara. O e-SIC é destinado especificamente a pedidos de acesso à informação previstos na LAI.", to: ROUTES.contato, acao: "Falar com a Ouvidoria" },
];

const CATEGORIAS: { nome: string; icone: LucideIcon }[] = [
  { nome: "Institucional", icone: Landmark },
  { nome: "Sessões", icone: Gavel },
  { nome: "Transparência", icone: Eye },
  { nome: "e-SIC", icone: FileSearch },
  { nome: "LGPD", icone: Lock },
  { nome: "Ouvidoria", icone: Megaphone },
];

const DADOS_ESTRUTURADOS = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const Route = createFileRoute("/perguntas-frequentes")({
  head: () => ({
    meta: [
      { title: "Perguntas Frequentes — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content:
          "Respostas para as dúvidas mais comuns sobre a Câmara Municipal, transparência, e-SIC, LGPD e serviços ao cidadão.",
      },
      { property: "og:title", content: "Perguntas Frequentes — Câmara Municipal de Adelândia" },
      { property: "og:description", content: "Perguntas frequentes sobre o Legislativo municipal." },
    ],
    scripts: [{ type: "application/ld+json", children: DADOS_ESTRUTURADOS }],
  }),
  component: FaqPage,
});

const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const seletor = "h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground min-w-0";

function FaqPage() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");

  const q = normalizar(busca.trim());
  const visiveis = FAQS.filter((f) => (!categoria || f.cat === categoria) && (!q || normalizar(`${f.q} ${f.a}`).includes(q)));
  const grupos = CATEGORIAS.map((c) => ({ ...c, itens: visiveis.filter((f) => f.cat === c.nome) })).filter((c) => c.itens.length > 0);

  return (
    <>
      <CabecalhoPagina
        titulo="Perguntas Frequentes"
        icone={HelpCircle}
        descricao="Respostas rápidas sobre a Câmara, seus serviços e o acesso às informações públicas."
        numeros={[{ rotulo: "Perguntas", valor: FAQS.length }, { rotulo: "Temas", valor: CATEGORIAS.length }]}
      />

      <div className="container-page py-8 md:py-10 space-y-6">
        <section aria-label="Escolha um tema">
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIAS.map((c) => (
              <li key={c.nome}>
                <button type="button" aria-pressed={categoria === c.nome} onClick={() => setCategoria(categoria === c.nome ? "" : c.nome)} className={`w-full h-full text-left rounded-2xl border p-3.5 transition hover:shadow-md ${categoria === c.nome ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <c.icone className="w-5 h-5 text-primary" aria-hidden />
                  <span className="block font-display font-bold text-sm text-foreground mt-2">{c.nome}</span>
                  <span className="block text-xs text-muted-foreground">{FAQS.filter((f) => f.cat === c.nome).length} perguntas</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Filtros" className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-2xl p-3">
          <input type="search" aria-label="Buscar nas perguntas" placeholder="Buscar nas perguntas" value={busca} onChange={(e) => setBusca(e.target.value)} className={`${seletor} flex-[2] min-w-[220px]`} />
          <select aria-label="Filtrar por tema" value={categoria} onChange={(e) => setCategoria(e.target.value)} className={`${seletor} flex-1 min-w-[170px]`}>
            <option value="">Todos os temas</option>
            {CATEGORIAS.map((c) => <option key={c.nome} value={c.nome}>{c.nome}</option>)}
          </select>
          {(busca || categoria) && <button type="button" onClick={() => { setBusca(""); setCategoria(""); }} className="inline-flex items-center gap-1 h-11 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted"><X className="w-4 h-4" aria-hidden /> Limpar</button>}
        </section>

        <p className="text-sm text-muted-foreground" aria-live="polite">{visiveis.length} de {FAQS.length} perguntas</p>

        {grupos.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center font-semibold text-foreground">Nenhuma pergunta encontrada com esses filtros.</div>
        ) : (
          <div className="space-y-6">
            {grupos.map((g) => (
              <section key={g.nome} aria-labelledby={`tema-${g.nome}`}>
                <h2 id={`tema-${g.nome}`} className="flex items-center gap-2 font-display font-bold text-lg text-foreground"><g.icone className="w-5 h-5 text-primary" aria-hidden /> {g.nome}</h2>
                <Accordion type="multiple" className="space-y-2 mt-2">
                  {g.itens.map((f) => (
                    <AccordionItem key={f.q} value={f.q} className="rounded-xl border border-border bg-card px-4">
                      <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                        {f.to && <Link to={f.to} className="flex w-fit items-center gap-1 font-semibold text-primary mt-2 hover:underline underline-offset-2">{f.acao} <ArrowRight className="w-4 h-4" aria-hidden /></Link>}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        )}

        <section aria-labelledby="titulo-ajuda" className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl text-white p-5 md:p-6" style={{ background: "linear-gradient(120deg, var(--primary-deep), var(--primary))" }}>
          <div>
            <h2 id="titulo-ajuda" className="font-display font-bold text-xl">Não encontrou o que procurava?</h2>
            <p className="text-white/90 text-sm mt-0.5">Peça uma informação pública ou fale diretamente com a Câmara.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={ROUTES.esic} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-white/90 transition"><FileSearch className="w-4 h-4" aria-hidden /> Abrir o e-SIC</Link>
            <Link to={ROUTES.contato} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl border border-white/50 text-sm font-semibold hover:bg-white/10 transition"><Megaphone className="w-4 h-4" aria-hidden /> Falar com a Ouvidoria</Link>
          </div>
        </section>
      </div>
    </>
  );
}
