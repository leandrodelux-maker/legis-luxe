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
  FileCheck,
  Users2,
  CheckCircle2,
  Stamp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

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
  { tipo: "Sessão Ordinária", data: "16 Jun 2026", hora: "14h00", local: "Plenário Principal", pauta: 7 },
  { tipo: "Audiência Pública", data: "18 Jun 2026", hora: "19h00", local: "Auditório", pauta: 3 },
  { tipo: "Sessão Extraordinária", data: "23 Jun 2026", hora: "10h00", local: "Plenário Principal", pauta: 4 },
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
  { 
    id: "pl-124-2026",
    num: "124", 
    ano: "2026",
    tipo: "Projeto de Lei",
    titulo: "Institui o programa municipal de incentivo à leitura", 
    autor: "Ver. Mariana Souza", 
    status: "Comissão",
    fase: 2 
  },
  { 
    id: "pl-118-2026",
    num: "118", 
    ano: "2026",
    tipo: "Projeto de Lei",
    titulo: "Cria a semana de prevenção à violência doméstica", 
    autor: "Ver. Patrícia Ribeiro", 
    status: "Plenário",
    fase: 3
  },
  { 
    id: "ind-045-2026",
    num: "045", 
    ano: "2026",
    tipo: "Indicação",
    titulo: "Manutenção asfáltica na Rua das Palmeiras", 
    autor: "Ver. Roberto Mendes", 
    status: "Protocolado",
    fase: 1
  },
  { 
    id: "pl-097-2026",
    num: "097", 
    ano: "2026",
    tipo: "Projeto de Lei",
    titulo: "Regulamenta horta comunitária em áreas municipais", 
    autor: "Ver. Juliana Martins", 
    status: "Sancionado",
    fase: 5
  },
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
            Processo <span className="text-gold">Legislativo</span>
          </h1>
          <p className="mt-6 max-w-2xl text-primary-foreground/85 text-lg">
            Acompanhe em tempo real a tramitação de leis, requerimentos e a agenda de sessões da Câmara.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading 
            eyebrow="Agenda Oficial" 
            title="Próximas sessões" 
            className="mb-0"
          />
          <Button variant="outline" className="group">
            Ver calendário completo <Calendar className="ml-2 h-4 w-4 group-hover:text-gold transition-colors" />
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {proximasSessoes.map((s, i) => (
            <article
              key={s.tipo + s.data}
              className="card-premium card-premium-hover p-8 animate-[fade-up_0.5s_ease-out_both]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-6">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-1">
                  {s.tipo}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 text-gold" /> {s.pauta} pautas
                </div>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">{s.data}</h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  {s.hora}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  {s.local}
                </div>
              </div>
              <Button variant="default" className="w-full justify-between group">
                Ver pauta completa <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/30 border-y border-border/50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Transparência"
            title="Consulta de Matérias Legislativas"
            description="Pesquise por projetos de lei, indicações e requerimentos em tramitação."
          />

          <div className="mt-12 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por número, ano ou palavra-chave..." 
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
                <Button className="h-12 px-6">Filtrar</Button>
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
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredProjetos.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Nenhuma matéria encontrada</h3>
                  <p className="text-muted-foreground">Tente ajustar seus termos de busca ou filtros.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
