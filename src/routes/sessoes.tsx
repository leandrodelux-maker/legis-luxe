import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Calendar, 
  Clock, 
  FileText, 
  MapPin, 
  Search, 
  Filter, 
  ArrowRight,
  Gavel,
  Users2,
  CheckCircle2,
  Stamp,
  Youtube,
  Play,
  ClipboardList,
  Vote,
  FileCheck,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export const Route = createFileRoute("/sessoes")({
  head: () => ({
    meta: [
      { title: "Atividade Legislativa — Câmara Municipal" },
      {
        name: "description",
        content: "Agenda de sessões, pautas, atas e processos legislativos em tramitação.",
      },
    ],
  }),
  component: SessoesPage,
});

const proximasSessoes = [
  { id: 1, tipo: "Sessão Ordinária", data: "16 Jun 2026", hora: "14h00", local: "Plenário Principal", pauta: 7, videoId: "dQw4w9WgXcQ" },
  { id: 2, tipo: "Audiência Pública", data: "18 Jun 2026", hora: "19h00", local: "Auditório", pauta: 3, videoId: "dQw4w9WgXcQ" },
  { id: 3, tipo: "Sessão Extraordinária", data: "23 Jun 2026", hora: "10h00", local: "Plenário Principal", pauta: 4, videoId: null },
  { id: 4, tipo: "Sessão Solene", data: "25 Jun 2026", hora: "19h30", local: "Plenário Principal", pauta: 2, videoId: null },
];

const historicoSessoes = [
  { id: 101, tipo: "Sessão Ordinária", data: "09 Jun 2026", videoId: "dQw4w9WgXcQ", pauta: 12, ata: true, presenca: 19, votacoes: 5 },
  { id: 102, tipo: "Sessão Ordinária", data: "02 Jun 2026", videoId: "dQw4w9WgXcQ", pauta: 8, ata: true, presenca: 21, votacoes: 3 },
  { id: 103, tipo: "Audiência Pública", data: "28 Mai 2026", videoId: "dQw4w9WgXcQ", pauta: 1, ata: true, presenca: 15, votacoes: 0 },
];

const tiposMateria = [
  "Projeto de Lei",
  "Projeto Complementar",
  "Emenda",
  "Moção",
  "Requerimento",
  "Indicação"
];

const projetos = [
  { id: "pl-124-2026", num: "124", ano: "2026", tipo: "Projeto de Lei", titulo: "Institui o programa municipal de incentivo à leitura", autor: "Ver. Mariana Souza", status: "Comissão", fase: 2 },
  { id: "pl-118-2026", num: "118", ano: "2026", tipo: "Projeto de Lei", titulo: "Cria a semana de prevenção à violência doméstica", autor: "Ver. Patrícia Ribeiro", status: "Plenário", fase: 3 },
  { id: "ind-045-2026", num: "045", ano: "2026", tipo: "Indicação", titulo: "Manutenção asfáltica na Rua das Palmeiras", autor: "Ver. Roberto Mendes", status: "Protocolado", fase: 1 },
  { id: "pl-097-2026", num: "097", ano: "2026", tipo: "Projeto de Lei", titulo: "Regulamenta horta comunitária em áreas municipais", autor: "Ver. Juliana Martins", status: "Sancionado", fase: 5 },
];

const fases = [
  { label: "Protocolado", icon: FileText },
  { label: "Comissão", icon: Users2 },
  { label: "Plenário", icon: Gavel },
  { label: "Aprovado", icon: CheckCircle2 },
  { label: "Sancionado", icon: Stamp },
];

function LegislativeTimeline({ currentFase }: { currentFase: number }) {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto py-8">
      {fases.map((fase, index) => {
        const step = index + 1;
        const isActive = step <= currentFase;
        const isCurrent = step === currentFase;
        const Icon = fase.icon;

        return (
          <div key={fase.label} className="flex flex-col items-center relative flex-1">
            {index !== 0 && (
              <div 
                className={`absolute right-1/2 top-5 w-full h-0.5 -translate-y-1/2 -z-10 ${
                  isActive ? "bg-primary" : "bg-muted"
                }`} 
              />
            )}
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                isActive 
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                  : "bg-muted text-muted-foreground"
              } ${isCurrent ? "scale-110 shadow-lg shadow-primary/20" : ""}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className={`mt-3 text-[10px] font-bold uppercase tracking-tighter text-center max-w-[80px] ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}>
              {fase.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SessoesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const filteredProjetos = projetos.filter(p => {
    const matchesSearch = p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.num.includes(searchTerm);
    const matchesType = selectedType === "Todos" || p.tipo === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <section className="bg-gradient-to-br from-primary-deep to-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 skew-x-12 translate-x-1/2" />
        <div className="container-page py-16 md:py-24 relative z-10">
          <div className="text-xs uppercase tracking-[0.2em] text-gold flex items-center gap-3">
            <span className="gold-divider" /> Atividade Parlamentar
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold leading-tight">
            Sessões e <span className="text-gold">Processo</span>
          </h1>
          <p className="mt-6 max-w-2xl text-primary-foreground/85 text-lg">
            Acompanhe as sessões ao vivo, consulte pautas, atas e toda a tramitação legislativa de forma transparente.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <Tabs defaultValue="proximas" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
            <TabsList className="bg-secondary/50 p-1 rounded-xl">
              <TabsTrigger value="proximas" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Próximas Sessões
              </TabsTrigger>
              <TabsTrigger value="historico" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Histórico e Vídeos
              </TabsTrigger>
              <TabsTrigger value="calendario" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Calendário Completo
              </TabsTrigger>
            </TabsList>
            
            <Button className="bg-red-600 hover:bg-red-700 text-white animate-pulse">
              <Youtube className="mr-2 h-4 w-4" /> Assista Ao Vivo
            </Button>
          </div>

          <TabsContent value="proximas" className="animate-[fade-up_0.5s_ease-out]">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {proximasSessoes.map((s, i) => (
                <article
                  key={s.id}
                  className="card-premium card-premium-hover p-6 flex flex-col group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                      {s.tipo}
                    </Badge>
                    {s.videoId && (
                      <Badge className="bg-red-100 text-red-600 border-red-200">
                        <Play className="h-3 w-3 mr-1 fill-current" /> LIVE
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-4">{s.data}</h3>
                  <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /> {s.hora}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> {s.local}</div>
                    <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-gold" /> {s.pauta} matérias na pauta</div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border/50 space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-between group-hover:border-primary">
                      Ver Pauta <ChevronRight className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                      Baixar Editais
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="historico" className="animate-[fade-up_0.5s_ease-out]">
            <div className="space-y-6">
              {historicoSessoes.map((s, i) => (
                <div key={s.id} className="card-premium p-6 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                  <div className="relative w-full lg:w-64 aspect-video rounded-lg overflow-hidden bg-black group cursor-pointer">
                    <img 
                      src={`https://img.youtube.com/vi/${s.videoId}/0.jpg`} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-white fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="secondary" className="bg-primary/5 text-primary">
                        {s.tipo}
                      </Badge>
                      <span className="text-sm font-bold text-muted-foreground">{s.data}</span>
                    </div>
                    <h4 className="font-display text-2xl font-bold">Resumo dos Trabalhos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-center">
                        <div className="text-lg font-bold text-primary">{s.pauta}</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Pautas</div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-center">
                        <div className="text-lg font-bold text-primary">{s.presenca}</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Presenças</div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-center">
                        <div className="text-lg font-bold text-primary">{s.votacoes}</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Votações</div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-center">
                        <div className="text-lg font-bold text-emerald-600">ATA</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Publicada</div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-auto flex flex-col gap-2">
                    <Button variant="outline" className="w-full lg:w-40 justify-between">
                      <FileText className="h-4 w-4" /> Ata em PDF
                    </Button>
                    <Button variant="outline" className="w-full lg:w-40 justify-between">
                      <ClipboardList className="h-4 w-4" /> Lista Presença
                    </Button>
                    <Button variant="outline" className="w-full lg:w-40 justify-between">
                      <Vote className="h-4 w-4" /> Resumo Votos
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full py-8 text-muted-foreground hover:text-primary">
                Carregar mais sessões anteriores...
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="calendario" className="animate-[fade-up_0.5s_ease-out]">
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <div className="card-premium p-6 inline-block w-full">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                  />
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-display text-2xl font-bold flex items-center gap-3">
                  <Calendar className="text-gold" /> 
                  Eventos em {date?.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="space-y-4">
                  {[
                    { day: "16", title: "Sessão Ordinária", hour: "14h", type: "Legislativo" },
                    { day: "18", title: "Audiência Pública: Orçamento 2027", hour: "19h", type: "Participativo" },
                    { day: "23", title: "Sessão Extraordinária", hour: "10h", type: "Urgência" },
                  ].map((event, idx) => (
                    <div key={idx} className="flex gap-6 p-5 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group">
                      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary text-primary-foreground shrink-0">
                        <span className="text-2xl font-bold leading-none">{event.day}</span>
                        <span className="text-[10px] uppercase font-bold">JUN</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gold">{event.type}</span>
                        </div>
                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{event.title}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Clock className="h-3.5 w-3.5" /> {event.hour} no Plenário Principal
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="self-center">
                        <ChevronRight />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="bg-secondary/30 border-y border-border/50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Tramitação"
            title="Acompanhe o Fluxo Legislativo"
            description="Entenda como as leis são criadas e pesquise por matérias específicas."
          />

          <div className="mt-12 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar projeto por número, ano ou palavra-chave..." 
                  className="pl-10 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="relative w-full md:w-64">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select 
                    className="w-full h-12 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none appearance-none"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option>Todos</option>
                    {tiposMateria.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <Button className="h-12 px-6">Pesquisar</Button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredProjetos.map((p, i) => (
                <div 
                  key={p.id}
                  className="group bg-background border border-border/60 rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all animate-[fade-up_0.5s_ease-out_both]"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                          {p.tipo.toUpperCase()} {p.num}/{p.ano}
                        </span>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                          {p.status}
                        </Badge>
                      </div>
                      <h4 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {p.titulo}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users2 className="h-3.5 w-3.5 text-gold" /> {p.autor}
                      </p>
                    </div>
                    
                    <div className="lg:w-[400px]">
                      <LegislativeTimeline currentFase={p.fase} />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="h-10">
                        <FileText className="h-4 w-4 mr-2" /> PDF
                      </Button>
                      <Button size="sm" className="h-10">
                        Tramitação
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
