import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Clock, FileSearch, Scale, Send, ShieldCheck, Sparkles } from "lucide-react";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { CanaisDiretos, Comprovante, EscolhaCanal, campo, novoProtocolo } from "@/components/atendimento-publico";
import { supabase } from "@/integrations/supabase/client";
import { PRAZO_DIAS } from "@/lib/atendimento";
import { ROUTES } from "@/lib/site-links";
import { TODOS_ITENS, itemHref } from "@/data/transparenciaCatalogo";

export const Route = createFileRoute("/e-sic")({
  head: () => ({
    meta: [
      { title: "e-SIC — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content: "Solicite informações públicas à Câmara Municipal pelo e-SIC, com base na Lei de Acesso à Informação (Lei nº 12.527/2011).",
      },
      { property: "og:title", content: "e-SIC — Câmara Municipal de Adelândia" },
      { property: "og:description", content: "Registre pedidos de acesso à informação com base na LAI." },
    ],
  }),
  component: ESicPage,
});

const MODELOS = [
  { rotulo: "Cópia de documento", texto: "Solicito cópia do seguinte documento da Câmara Municipal: " },
  { rotulo: "Gastos da Câmara", texto: "Solicito informações sobre os gastos da Câmara Municipal com " },
  { rotulo: "Andamento de projeto", texto: "Solicito informações sobre o andamento do seguinte projeto: " },
];
const FORMATOS = ["E-mail", "Arquivo digital", "Consulta presencial", "Cópia física"];
const ETAPAS = [
  { titulo: "Você envia o pedido", texto: "O site gera um protocolo na hora." },
  { titulo: "A Câmara analisa", texto: "A resposta sai em até 20 dias, com mais 10 se houver justificativa." },
  { titulo: "Você recebe a resposta", texto: "O retorno é enviado pelo contato informado." },
  { titulo: "Se discordar, recorra", texto: "A lei garante recurso em até 10 dias, contados da resposta ou da negativa." },
];
const PUBLICADOS = TODOS_ITENS.filter((i) => i.popular);

function ESicPage() {
  const [pedido, setPedido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(false);
  const [protocolo, setProtocolo] = useState("");
  const [publicado, setPublicado] = useState("");
  const destino = PUBLICADOS.find((i) => i.slug === publicado);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setErro(false);
    const d = new FormData(e.currentTarget);
    const novo = novoProtocolo("SIC");
    const prazo = new Date(Date.now() + PRAZO_DIAS.sic * 864e5);
    const { error } = await supabase.from("esic_solicitacoes").insert({
      protocolo: novo,
      nome: String(d.get("nome")).trim(),
      cpf: String(d.get("cpf")).trim(),
      email: String(d.get("email")).trim(),
      telefone: String(d.get("telefone")).trim(),
      pedido: `${pedido.trim()}\n\nFormato de recebimento: ${d.get("formato")}`,
      prazo_resposta: prazo.toISOString().slice(0, 10),
      status: "pendente",
    });
    setEnviando(false);
    if (error) return setErro(true);
    setPedido("");
    setProtocolo(novo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <CabecalhoPagina
        titulo="e-SIC"
        trilha={[{ rotulo: "Acesso à Informação" }]}
        icone={FileSearch}
        descricao="Peça qualquer informação pública à Câmara Municipal. É um direito garantido pela Lei de Acesso à Informação (Lei nº 12.527/2011)."
        numeros={[{ rotulo: "Prazo de resposta", valor: "20 dias" }, { rotulo: "Prorrogação", valor: "+10 dias" }, { rotulo: "Prazo de recurso", valor: "10 dias" }]}
      />

      <div className="container-page py-8 md:py-10 space-y-8">
        {protocolo ? (
          <Comprovante protocolo={protocolo} titulo="Pedido registrado" prazoDias={PRAZO_DIAS.sic} resumo="A resposta será enviada pelo contato informado. Para falar sobre este pedido, tenha o número do protocolo em mãos." onNovo={() => setProtocolo("")} />
        ) : (
          <>
            <EscolhaCanal atual={ROUTES.esic} />

            <section aria-labelledby="titulo-publicado" className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end rounded-2xl text-white p-5" style={{ background: "linear-gradient(120deg, var(--primary-deep), var(--primary))" }}>
              <div>
                <h2 id="titulo-publicado" className="font-display font-bold text-xl">Talvez a resposta já esteja publicada</h2>
                <label htmlFor="ja-publicado" className="block text-sm text-white/90 mt-0.5">Procure no Portal da Transparência antes de abrir o pedido:</label>
                <select id="ja-publicado" value={publicado} onChange={(e) => setPublicado(e.target.value)} className="mt-2 h-11 w-full rounded-xl bg-white px-3 text-sm font-semibold text-slate-900">
                  <option value="">Escolha um assunto</option>
                  {PUBLICADOS.map((i) => <option key={i.slug} value={i.slug}>{i.label}</option>)}
                </select>
              </div>
              {destino ? (
                <a href={itemHref(destino)} className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-white/90 transition">Ver {destino.label} <ArrowRight className="w-4 h-4" aria-hidden /></a>
              ) : (
                <Link to={ROUTES.transparencia} className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl border border-white/50 text-sm font-semibold hover:bg-white/10 transition">Abrir o portal <ArrowRight className="w-4 h-4" aria-hidden /></Link>
              )}
            </section>

            <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
              <form onSubmit={enviar} aria-labelledby="titulo-pedido" className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4 min-w-0">
                <div>
                  <h2 id="titulo-pedido" className="font-display font-bold text-xl text-foreground">Novo pedido de informação</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Campos com * são obrigatórios. Você não precisa explicar o motivo do pedido.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label htmlFor="nome" className="text-sm font-semibold text-foreground">Nome completo ou razão social *</label><input id="nome" name="nome" required minLength={2} maxLength={180} autoComplete="name" className={`${campo} h-11 mt-1`} /></div>
                  <div><label htmlFor="cpf" className="text-sm font-semibold text-foreground">CPF ou CNPJ</label><input id="cpf" name="cpf" inputMode="numeric" className={`${campo} h-11 mt-1`} /></div>
                  <div><label htmlFor="email" className="text-sm font-semibold text-foreground">E-mail *</label><input id="email" name="email" type="email" required autoComplete="email" className={`${campo} h-11 mt-1`} /></div>
                  <div><label htmlFor="telefone" className="text-sm font-semibold text-foreground">Telefone</label><input id="telefone" name="telefone" type="tel" autoComplete="tel" className={`${campo} h-11 mt-1`} /></div>
                </div>
                <div>
                  <label htmlFor="pedido" className="text-sm font-semibold text-foreground">O que você quer saber? *</label>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Sparkles className="w-3.5 h-3.5" aria-hidden /> Comece por um modelo:</span>
                    {MODELOS.map((m) => <button key={m.rotulo} type="button" onClick={() => setPedido(m.texto)} className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition">{m.rotulo}</button>)}
                  </div>
                  <textarea id="pedido" name="pedido" required minLength={10} maxLength={5000} rows={6} value={pedido} onChange={(e) => setPedido(e.target.value)} className={`${campo} py-2.5 mt-2`} />
                </div>
                <div className="sm:w-1/2">
                  <label htmlFor="formato" className="text-sm font-semibold text-foreground">Como prefere receber?</label>
                  <select id="formato" name="formato" className={`${campo} h-11 mt-1`}>{FORMATOS.map((f) => <option key={f}>{f}</option>)}</select>
                </div>
                {erro && <p role="alert" className="text-sm font-medium text-destructive">Não foi possível registrar o pedido. O texto continua no formulário: tente de novo em instantes.</p>}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border">
                  <p className="inline-flex items-start gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="w-4 h-4 text-primary shrink-0" aria-hidden /> <span>Seus dados são usados para responder ao pedido. <Link to={ROUTES.lgpd} className="underline underline-offset-2">Saiba mais</Link>.</span></p>
                  <button type="submit" disabled={enviando} className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 shrink-0"><Send className="w-4 h-4" aria-hidden /> {enviando ? "Enviando…" : "Enviar pedido"}</button>
                </div>
              </form>

              <div className="space-y-5">
                <section aria-labelledby="titulo-etapas" className="bg-card border border-border rounded-2xl p-5">
                  <h2 id="titulo-etapas" className="flex items-center gap-2 font-display font-bold text-lg text-foreground"><Clock className="w-5 h-5 text-primary" aria-hidden /> Como funciona</h2>
                  <ol className="space-y-3 mt-3">
                    {ETAPAS.map((e, i) => (
                      <li key={e.titulo} className="flex gap-3">
                        <span className="w-7 h-7 shrink-0 rounded-lg grid place-items-center bg-primary/10 text-primary font-display text-sm font-bold">{i + 1}</span>
                        <span className="text-sm"><strong className="block text-foreground">{e.titulo}</strong><span className="text-muted-foreground">{e.texto}</span></span>
                      </li>
                    ))}
                  </ol>
                </section>
                <CanaisDiretos />
                <p className="flex gap-2 text-xs text-muted-foreground leading-relaxed"><Scale className="w-4 h-4 text-primary shrink-0" aria-hidden /> Base legal: Lei nº 12.527/2011, arts. 10, 11 e 15.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
