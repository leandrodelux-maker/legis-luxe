import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Frown, Lightbulb, Megaphone, Send, ShieldCheck, ThumbsUp, type LucideIcon } from "lucide-react";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { CanaisDiretos, Comprovante, EscolhaCanal, campo, novoProtocolo } from "@/components/atendimento-publico";
import { supabase } from "@/integrations/supabase/client";
import { PRAZO_DIAS } from "@/lib/atendimento";
import { ROUTES } from "@/lib/site-links";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Ouvidoria e Contato — Câmara Municipal de Adelândia" },
      {
        name: "description",
        content: "Registre reclamações, denúncias, sugestões e elogios na Ouvidoria e encontre os canais de contato da Câmara Municipal de Adelândia.",
      },
    ],
  }),
  component: ContatoPage,
});

const TIPOS: { id: string; rotulo: string; icone: LucideIcon; ajuda: string; exemplo: string }[] = [
  { id: "reclamacao", rotulo: "Reclamação", icone: Frown, ajuda: "Conte o que não funcionou no atendimento ou no serviço.", exemplo: "O que aconteceu, quando e onde." },
  { id: "denuncia", rotulo: "Denúncia", icone: AlertTriangle, ajuda: "Informe uma irregularidade. Nome e e-mail são opcionais, mas sem e-mail a Câmara não consegue responder a você.", exemplo: "O fato, as pessoas envolvidas, a data, o local e as provas que existirem." },
  { id: "sugestao", rotulo: "Sugestão", icone: Lightbulb, ajuda: "Proponha uma melhoria para os serviços ou para o trabalho da Câmara.", exemplo: "O que pode melhorar e como." },
  { id: "elogio", rotulo: "Elogio", icone: ThumbsUp, ajuda: "Reconheça um bom atendimento ou serviço.", exemplo: "Quem ou o que você quer elogiar e por quê." },
];

function ContatoPage() {
  const [tipo, setTipo] = useState(TIPOS[0].id);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(false);
  const [protocolo, setProtocolo] = useState("");
  const atual = TIPOS.find((t) => t.id === tipo) ?? TIPOS[0];

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    setErro(false);
    const d = new FormData(e.currentTarget);
    const novo = novoProtocolo("OUV");
    const { error } = await supabase.from("ouvidoria_protocolos").insert({
      protocolo: novo,
      tipo,
      assunto: String(d.get("assunto")).trim(),
      nome: String(d.get("nome")).trim() || "Anônimo",
      email: String(d.get("email")).trim(),
      telefone: String(d.get("telefone")).trim(),
      mensagem: String(d.get("mensagem")).trim(),
      status: "aberto",
    });
    setEnviando(false);
    if (error) return setErro(true);
    setProtocolo(novo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <CabecalhoPagina
        titulo="Ouvidoria e Contato"
        trilha={[{ rotulo: "Acesso à Informação" }]}
        icone={Megaphone}
        descricao="Sua voz chega à Câmara por aqui. Registre uma reclamação, denúncia, sugestão ou elogio, ou fale diretamente com o atendimento."
        numeros={[{ rotulo: "Prazo legal de resposta", valor: "30 dias" }, { rotulo: "Prorrogação", valor: "+30 dias" }]}
      />

      <div className="container-page py-8 md:py-10 space-y-8">
        {protocolo ? (
          <Comprovante protocolo={protocolo} titulo="Manifestação registrada" prazoDias={PRAZO_DIAS.ouvidoria} resumo="Se você informou um contato, a resposta será enviada por ele. Para falar sobre este registro, tenha o número do protocolo em mãos." onNovo={() => setProtocolo("")} />
        ) : (
          <>
            <EscolhaCanal atual={ROUTES.contato} />

            <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
              <form onSubmit={enviar} aria-labelledby="titulo-manifestacao" className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4 min-w-0">
                <h2 id="titulo-manifestacao" className="font-display font-bold text-xl text-foreground">Nova manifestação</h2>
                <fieldset>
                  <legend className="text-sm font-semibold text-foreground">Tipo de manifestação</legend>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1.5">
                    {TIPOS.map((t) => (
                      <label key={t.id} className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center text-sm font-semibold cursor-pointer transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${tipo === t.id ? "border-primary bg-primary/5 text-foreground" : "border-border text-foreground hover:bg-muted"}`}>
                        <input type="radio" name="tipo" value={t.id} checked={tipo === t.id} onChange={() => setTipo(t.id)} className="sr-only" />
                        <t.icone className="w-5 h-5 text-primary" aria-hidden /> {t.rotulo}
                      </label>
                    ))}
                  </div>
                  <p aria-live="polite" className="text-sm text-muted-foreground mt-2">{atual.ajuda}</p>
                </fieldset>
                <div><label htmlFor="assunto" className="text-sm font-semibold text-foreground">Assunto *</label><input id="assunto" name="assunto" required minLength={3} maxLength={180} className={`${campo} h-11 mt-1`} /></div>
                <div>
                  <label htmlFor="mensagem" className="text-sm font-semibold text-foreground">Relato *</label>
                  <p id="dica-relato" className="text-xs text-muted-foreground">{atual.exemplo}</p>
                  <textarea id="mensagem" name="mensagem" aria-describedby="dica-relato" required minLength={10} maxLength={5000} rows={6} className={`${campo} py-2.5 mt-1`} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div><label htmlFor="nome" className="text-sm font-semibold text-foreground">Nome</label><input id="nome" name="nome" minLength={2} maxLength={180} autoComplete="name" className={`${campo} h-11 mt-1`} /></div>
                  <div><label htmlFor="email" className="text-sm font-semibold text-foreground">E-mail{tipo === "denuncia" ? "" : " *"}</label><input id="email" name="email" type="email" required={tipo !== "denuncia"} autoComplete="email" className={`${campo} h-11 mt-1`} /></div>
                  <div><label htmlFor="telefone" className="text-sm font-semibold text-foreground">Telefone</label><input id="telefone" name="telefone" type="tel" autoComplete="tel" className={`${campo} h-11 mt-1`} /></div>
                </div>
                {erro && <p role="alert" className="text-sm font-medium text-destructive">Não foi possível enviar agora. Seus dados continuam no formulário: tente de novo em instantes.</p>}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border">
                  <p className="inline-flex items-start gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="w-4 h-4 text-primary shrink-0" aria-hidden /> <span>Seus dados são usados para tratar a manifestação. <Link to={ROUTES.lgpd} className="underline underline-offset-2">Saiba mais</Link>.</span></p>
                  <button type="submit" disabled={enviando} className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 shrink-0"><Send className="w-4 h-4" aria-hidden /> {enviando ? "Enviando…" : "Enviar manifestação"}</button>
                </div>
              </form>

              <div className="space-y-5">
                <CanaisDiretos />
                <section aria-labelledby="titulo-acompanhar" className="bg-card border border-border rounded-2xl p-5">
                  <h2 id="titulo-acompanhar" className="font-display font-bold text-lg text-foreground">Como acompanhar</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">Guarde o protocolo gerado no envio. A resposta chega pelo contato informado, e o atendimento da Câmara localiza o registro por esse número.</p>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
