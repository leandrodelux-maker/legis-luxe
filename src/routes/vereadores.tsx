import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, User } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

export const Route = createFileRoute("/vereadores")({
  head: () => ({
    meta: [
      { title: "Vereadores — Câmara Municipal" },
      {
        name: "description",
        content: "Conheça os vereadores da Câmara Municipal, partidos, comissões e contatos.",
      },
      { property: "og:title", content: "Vereadores — Câmara Municipal" },
      { property: "og:description", content: "Parlamentares da Câmara Municipal." },
      { property: "og:url", content: "/vereadores" },
    ],
    links: [{ rel: "canonical", href: "/vereadores" }],
  }),
  component: VereadoresPage,
});

const vereadores = [
  { nome: "Ana Beatriz Almeida", partido: "PSD", cargo: "Presidente", comissao: "Mesa Diretora" },
  { nome: "Carlos Eduardo Lima", partido: "MDB", cargo: "Vice-Presidente", comissao: "Constituição e Justiça" },
  { nome: "Mariana Souza", partido: "PT", cargo: "1ª Secretária", comissao: "Educação e Cultura" },
  { nome: "João Pereira", partido: "PL", cargo: "Vereador", comissao: "Finanças e Orçamento" },
  { nome: "Fernanda Costa", partido: "PSDB", cargo: "Vereadora", comissao: "Saúde" },
  { nome: "Roberto Mendes", partido: "PP", cargo: "Vereador", comissao: "Obras e Urbanismo" },
  { nome: "Patrícia Ribeiro", partido: "REPUBLICANOS", cargo: "Vereadora", comissao: "Direitos Humanos" },
  { nome: "Lucas Andrade", partido: "PODE", cargo: "Vereador", comissao: "Meio Ambiente" },
  { nome: "Juliana Martins", partido: "PSB", cargo: "Vereadora", comissao: "Mulher e Família" },
];

function VereadoresPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-deep to-primary text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-gold flex items-center gap-3">
            <span className="gold-divider" /> Legislatura 2025–2028
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold">
            Nossos Vereadores
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            21 parlamentares eleitos pela população, representando todos os bairros e segmentos da
            cidade.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <SectionHeading eyebrow="Composição" title="Mesa Diretora e parlamentares" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vereadores.map((v, i) => (
            <article
              key={v.nome}
              className="card-premium card-premium-hover group p-6 animate-[fade-up_0.5s_ease-out_both]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-deep text-primary-foreground ring-2 ring-gold/30">
                  <User className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground border border-gold/30">
                    {v.cargo}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-foreground truncate">
                    {v.nome}
                  </h3>
                  <p className="text-sm text-muted-foreground">{v.partido}</p>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-border/60 space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Comissão</p>
                <p className="text-sm font-medium text-foreground">{v.comissao}</p>
                <div className="flex gap-2 pt-2">
                  <a
                    href="#"
                    aria-label={`Email de ${v.nome}`}
                    className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="#"
                    aria-label={`Telefone de ${v.nome}`}
                    className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
