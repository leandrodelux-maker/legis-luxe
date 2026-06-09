import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato e Ouvidoria — Câmara Municipal" },
      {
        name: "description",
        content: "Fale com a Câmara Municipal. Ouvidoria, telefones, endereço e formulário.",
      },
      { property: "og:title", content: "Contato — Câmara Municipal" },
      { property: "og:description", content: "Ouvidoria e canais oficiais da Câmara." },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-deep to-primary text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-gold flex items-center gap-3">
            <span className="gold-divider" /> Fale com a Câmara
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold">
            Contato e Ouvidoria
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Canais oficiais para sugestões, elogios, denúncias e solicitações de informação.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-5">
            {[
              { icon: MapPin, title: "Endereço", lines: ["Av. Principal, 1000 — Centro", "CEP 00000-000"] },
              { icon: Phone, title: "Telefone", lines: ["(00) 0000-0000", "(00) 0000-0001"] },
              { icon: Mail, title: "E-mail", lines: ["contato@camara.gov.br", "ouvidoria@camara.gov.br"] },
              { icon: Clock, title: "Atendimento", lines: ["Segunda a sexta", "08h às 17h"] },
            ].map((c) => (
              <div key={c.title} className="card-premium card-premium-hover p-5 flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{c.title}</h3>
                  {c.lines.map((l) => (
                    <p key={l} className="text-sm text-muted-foreground">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="lg:col-span-3 card-premium p-7 md:p-9 space-y-5"
            aria-label="Formulário de contato"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br from-primary to-primary-deep text-primary-foreground">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold">Envie sua mensagem</h2>
                <p className="text-sm text-muted-foreground">Resposta em até 5 dias úteis.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assunto">Assunto</Label>
              <Input id="assunto" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea id="mensagem" rows={6} required />
            </div>
            <p className="text-xs text-muted-foreground">
              Seus dados são tratados em conformidade com a LGPD (Lei 13.709/18).
            </p>
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Enviar mensagem <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
