import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, CheckCircle2, Clock, Copy, FileSearch, Lock, Mail, MapPin, Megaphone, Phone, Printer, type LucideIcon } from "lucide-react";
import { useContactInfo } from "@/hooks/use-contact-info";
import { ROUTES } from "@/lib/site-links";

// O visitante não pode ler a tabela depois de gravar, por isso o protocolo é gerado aqui.
export const novoProtocolo = (prefixo: string) => `${prefixo}-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 900 + 100)}`;

export const campo = "w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground";

const CANAIS: { id: string; pergunta: string; titulo: string; texto: string; to: string; acao: string; icone: LucideIcon }[] = [
  { id: "informacao", pergunta: "Quero uma informação ou um documento público", titulo: "e-SIC", texto: "É o canal da Lei de Acesso à Informação. A Câmara responde em até 20 dias, prorrogáveis por mais 10.", to: ROUTES.esic, acao: "Abrir o e-SIC", icone: FileSearch },
  { id: "manifestacao", pergunta: "Quero reclamar, denunciar, sugerir ou elogiar", titulo: "Ouvidoria", texto: "Recebe manifestações sobre os serviços da Câmara. A denúncia pode ser enviada sem identificação.", to: ROUTES.contato, acao: "Abrir a Ouvidoria", icone: Megaphone },
  { id: "dados", pergunta: "Quero saber o que a Câmara faz com meus dados", titulo: "LGPD", texto: "Veja quais dados o site recebe e como pedir acesso, correção ou eliminação.", to: ROUTES.lgpd, acao: "Ver meus direitos", icone: Lock },
];

/** Pergunta qual é a necessidade e indica o canal certo. */
export function EscolhaCanal({ atual }: { atual: string }) {
  const [escolha, setEscolha] = useState(CANAIS[0].id);
  const canal = CANAIS.find((c) => c.id === escolha) ?? CANAIS[0];
  return (
    <section aria-labelledby="titulo-canal" className="grid gap-4 lg:grid-cols-2 lg:items-center bg-card border border-border rounded-2xl p-5">
      <div>
        <h2 id="titulo-canal" className="font-display font-bold text-xl text-foreground">Este é o canal certo?</h2>
        <label htmlFor="escolha-canal" className="block text-sm text-muted-foreground mt-1">Conte o que você precisa:</label>
        <select id="escolha-canal" value={escolha} onChange={(e) => setEscolha(e.target.value)} className={`${campo} h-11 mt-2 font-medium`}>
          {CANAIS.map((c) => <option key={c.id} value={c.id}>{c.pergunta}</option>)}
        </select>
      </div>
      <div aria-live="polite" className="flex gap-3 rounded-xl bg-muted/60 p-4">
        <canal.icone className="w-6 h-6 text-primary shrink-0" aria-hidden />
        <div>
          <p className="font-display font-bold text-foreground">{canal.titulo}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{canal.texto}</p>
          {canal.to === atual ? (
            <p className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-2"><Check className="w-4 h-4" aria-hidden /> Você já está aqui</p>
          ) : (
            <Link to={canal.to} className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-2 hover:underline underline-offset-2">{canal.acao} <ArrowRight className="w-4 h-4" aria-hidden /></Link>
          )}
        </div>
      </div>
    </section>
  );
}

/** Comprovante mostrado depois do envio, com o prazo legal calculado. */
export function Comprovante({ protocolo, titulo, prazoDias, resumo, onNovo }: { protocolo: string; titulo: string; prazoDias: number; resumo: string; onNovo: () => void }) {
  const [copiado, setCopiado] = useState(false);
  const agora = new Date();
  const prazo = new Date(agora.getTime() + prazoDias * 864e5);
  const copiar = async () => {
    await navigator.clipboard.writeText(protocolo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };
  return (
    <section role="status" className="max-w-2xl mx-auto bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6 text-center text-white" style={{ background: "linear-gradient(120deg, var(--primary-deep), var(--primary))" }}>
        <CheckCircle2 className="w-10 h-10 mx-auto" aria-hidden />
        <h2 className="font-display font-bold text-2xl mt-2">{titulo}</h2>
        <p className="text-white/90 text-sm mt-1">Guarde o número abaixo. Ele identifica o seu atendimento na Câmara.</p>
      </div>
      <div className="p-6">
        <p className="text-sm text-muted-foreground text-center">Número do protocolo</p>
        <p className="font-mono font-bold text-2xl md:text-3xl text-primary text-center mt-1 break-all">{protocolo}</p>
        <dl className="grid grid-cols-2 gap-3 mt-5 text-sm">
          <div className="rounded-xl border border-border p-3"><dt className="text-xs text-muted-foreground">Registrado em</dt><dd className="font-semibold text-foreground">{agora.toLocaleDateString("pt-BR")}</dd></div>
          <div className="rounded-xl border border-border p-3"><dt className="text-xs text-muted-foreground">Prazo legal de resposta</dt><dd className="font-semibold text-foreground">até {prazo.toLocaleDateString("pt-BR")}</dd></div>
        </dl>
        <p className="text-sm text-muted-foreground leading-relaxed mt-4">{resumo}</p>
        <div className="flex flex-wrap gap-2 mt-5 print:hidden">
          <button type="button" onClick={copiar} className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">{copiado ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />} <span aria-live="polite">{copiado ? "Copiado" : "Copiar o número"}</span></button>
          <button type="button" onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition"><Printer className="w-4 h-4" aria-hidden /> Imprimir</button>
          <button type="button" onClick={onNovo} className="flex-1 inline-flex items-center justify-center h-11 px-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition">Fazer outro registro</button>
        </div>
      </div>
    </section>
  );
}

/** Telefone, e-mail, endereço e horário, vindos das configurações do site. */
export function CanaisDiretos() {
  const c = useContactInfo();
  const itens: { icone: LucideIcon; rotulo: string; valor: string; href?: string }[] = [
    { icone: Phone, rotulo: "Telefone", valor: c.telefone, href: c.telefoneHref },
    { icone: Mail, rotulo: "E-mail", valor: c.email, href: `mailto:${c.email}` },
    { icone: MapPin, rotulo: "Endereço", valor: c.endereco },
    { icone: Clock, rotulo: "Horário", valor: c.horario },
  ];
  return (
    <section aria-labelledby="titulo-canais" className="bg-card border border-border rounded-2xl p-5">
      <h2 id="titulo-canais" className="font-display font-bold text-lg text-foreground">Atendimento direto</h2>
      <ul className="space-y-3 mt-3 text-sm">
        {itens.map((i) => (
          <li key={i.rotulo} className="flex gap-2.5 min-w-0">
            <i.icone className="w-5 h-5 text-primary shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="block font-semibold text-foreground">{i.rotulo}</span>
              {i.href ? <a href={i.href} className="text-muted-foreground underline underline-offset-2 break-words">{i.valor}</a> : <span className="text-muted-foreground">{i.valor}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
