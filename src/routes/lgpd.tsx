import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Database, Eye, Lock, Mail, ShieldCheck, UserCheck } from "lucide-react";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { EscolhaCanal, campo } from "@/components/atendimento-publico";
import { useContactInfo } from "@/hooks/use-contact-info";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/lgpd")({
  head: () => ({
    meta: [
      { title: "LGPD — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content: "Como a Câmara Municipal de Adelândia trata dados pessoais, quais são os seus direitos pela Lei nº 13.709/2018 e como exercê-los.",
      },
      { property: "og:title", content: "LGPD — Câmara Municipal de Adelândia" },
      { property: "og:description", content: "Direitos do titular, encarregado e canais de atendimento." },
    ],
  }),
  component: LgpdPage,
});

const PRINCIPIOS = [
  { icone: Eye, titulo: "Transparência", texto: "Informações claras sobre o tratamento de dados pessoais." },
  { icone: Lock, titulo: "Segurança", texto: "Medidas técnicas e administrativas para proteger os dados." },
  { icone: UserCheck, titulo: "Finalidade", texto: "Uso dos dados apenas para propósitos legítimos e informados." },
  { icone: Database, titulo: "Necessidade", texto: "Coleta limitada ao necessário para prestar o serviço." },
];

const DIREITOS = [
  "Confirmar se a Câmara trata meus dados",
  "Acessar meus dados pessoais",
  "Corrigir dados incompletos, inexatos ou desatualizados",
  "Anonimizar, bloquear ou eliminar dados desnecessários",
  "Levar meus dados a outro fornecedor (portabilidade)",
  "Eliminar dados tratados com meu consentimento",
  "Saber com quem meus dados foram compartilhados",
  "Saber o que acontece se eu não der consentimento",
  "Revogar meu consentimento",
];

const DADOS_NO_SITE = [
  { canal: "e-SIC", dados: "Nome, e-mail, pedido e, se informados, CPF ou CNPJ e telefone", uso: "Registrar e responder ao pedido de informação", to: ROUTES.esic },
  { canal: "Ouvidoria", dados: "Assunto, relato e, se informados, nome, e-mail e telefone", uso: "Registrar e responder à manifestação", to: ROUTES.contato },
];

function LgpdPage() {
  const contato = useContactInfo();
  const [direito, setDireito] = useState(DIREITOS[1]);
  const corpo = `Olá.\n\nCom base no art. 18 da Lei nº 13.709/2018, solicito: ${direito}.\n\nNome completo:\nDocumento de identificação:\nDetalhes do pedido:\n`;
  const pedido = `mailto:${contato.email}?subject=${encodeURIComponent("Pedido LGPD - direitos do titular")}&body=${encodeURIComponent(corpo)}`;

  return (
    <>
      <CabecalhoPagina
        titulo="LGPD"
        trilha={[{ rotulo: "Acesso à Informação" }]}
        icone={ShieldCheck}
        descricao="Como a Câmara cuida dos seus dados pessoais e como você exerce os seus direitos pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
        numeros={[{ rotulo: "Direitos do titular", valor: DIREITOS.length }, { rotulo: "Formulários do site com dados", valor: DADOS_NO_SITE.length }]}
      />

      <div className="container-page py-8 md:py-10 space-y-10">
        <section aria-labelledby="titulo-exercer" className="grid gap-5 lg:grid-cols-2 lg:items-center rounded-2xl text-white p-5 md:p-7" style={{ background: "linear-gradient(120deg, var(--primary-deep), var(--primary))" }}>
          <div>
            <h2 id="titulo-exercer" className="font-display font-bold text-2xl">Exerça seu direito em um minuto</h2>
            <p className="text-white/90 mt-1">Escolha o que você quer e prepararemos o e-mail para a Câmara. É só completar seus dados e enviar.</p>
          </div>
          <div className="rounded-2xl bg-white text-slate-900 p-4">
            <label htmlFor="direito" className="text-sm font-semibold">Eu quero…</label>
            <select id="direito" value={direito} onChange={(e) => setDireito(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900">
              {DIREITOS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <a href={pedido} className="inline-flex w-full items-center justify-center gap-1.5 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold mt-3 hover:opacity-90 transition"><Mail className="w-4 h-4" aria-hidden /> Preparar o e-mail</a>
          </div>
        </section>

        <section aria-labelledby="titulo-dados">
          <h2 id="titulo-dados" className="font-display font-bold text-2xl text-foreground">Quais dados os formulários do site recebem</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Só o que é preenchido nos atendimentos abaixo.</p>
          <ul className="grid gap-4 md:grid-cols-2 mt-4">
            {DADOS_NO_SITE.map((d) => (
              <li key={d.canal} className="flex flex-col bg-card border border-border rounded-2xl p-5">
                <h3 className="font-display font-bold text-foreground">{d.canal}</h3>
                <dl className="text-sm mt-2 space-y-2 flex-1">
                  <div><dt className="font-semibold text-foreground">Dados</dt><dd className="text-muted-foreground">{d.dados}</dd></div>
                  <div><dt className="font-semibold text-foreground">Para quê</dt><dd className="text-muted-foreground">{d.uso}</dd></div>
                </dl>
                <Link to={d.to} className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-3 hover:underline underline-offset-2">Abrir {d.canal} <ArrowRight className="w-4 h-4" aria-hidden /></Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="titulo-principios">
          <h2 id="titulo-principios" className="font-display font-bold text-2xl text-foreground">Princípios que orientam o tratamento</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {PRINCIPIOS.map((p) => (
              <li key={p.titulo} className="bg-card border border-border rounded-2xl p-5">
                <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary text-primary-foreground"><p.icone className="w-5 h-5" aria-hidden /></span>
                <h3 className="font-display font-bold text-foreground mt-3">{p.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{p.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <section aria-labelledby="titulo-direitos" className="bg-card border border-border rounded-2xl p-5 md:p-6">
            <h2 id="titulo-direitos" className="font-display font-bold text-xl text-foreground">Seus direitos (art. 18)</h2>
            <ul className="grid gap-2 mt-3 text-sm">
              {DIREITOS.map((d) => <li key={d} className="flex items-start gap-2 text-foreground"><ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden /> {d}</li>)}
            </ul>
          </section>
          <section aria-labelledby="titulo-encarregado" className="bg-card border border-border rounded-2xl p-5 md:p-6">
            <h2 id="titulo-encarregado" className="flex items-center gap-2 font-display font-bold text-xl text-foreground"><UserCheck className="w-5 h-5 text-primary" aria-hidden /> Encarregado de Dados</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">É o canal de comunicação entre a Câmara, os titulares e a Autoridade Nacional de Proteção de Dados (ANPD).</p>
            <dl className="text-sm mt-3 divide-y divide-border">
              <div className="flex justify-between gap-4 py-2"><dt className="text-muted-foreground">Nome</dt><dd className="font-semibold text-foreground text-right">A definir por portaria</dd></div>
              <div className="flex justify-between gap-4 py-2"><dt className="text-muted-foreground">E-mail</dt><dd className="font-semibold text-right min-w-0"><a href={`mailto:${contato.email}`} className="text-foreground underline underline-offset-2 break-all">{contato.email}</a></dd></div>
            </dl>
          </section>
        </div>

        <EscolhaCanal atual={ROUTES.lgpd} />
      </div>
    </>
  );
}
