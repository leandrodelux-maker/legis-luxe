import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Mail, 
  Phone, 
  User, 
  ChevronLeft, 
  Camera as InstagramIcon, 
  Share2 as TwitterIcon, 
  MessageSquare as FacebookIcon,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Trophy,
  CheckCircle2,
  FileText,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { VereadorAvatar } from "@/components/vereador-avatar";

export const Route = createFileRoute("/vereadores/$id")({
  component: VereadorDetailPage,
});

function VereadorDetailPage() {
  const { id } = Route.useParams();
  const [vereador, setVereador] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVereador() {
      try {
        const { data, error } = await supabase
          .from("vereadores")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setVereador(data);
      } catch (error) {
        console.error("Erro ao buscar vereador:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVereador();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!vereador) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Vereador não encontrado</h1>
        <Button asChild>
          <Link to="/vereadores">Voltar para a lista</Link>
        </Button>
      </div>
    );
  }

  const redes = vereador.redes_sociais || {};
  const stats = vereador.stats || { projetos: 0, presencas: 0, participacoes: 0 };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header com gradiente */}
      <section className="bg-gradient-to-br from-primary-deep to-primary text-primary-foreground pt-12 pb-32">
        <div className="container-page">
          <Button 
            variant="ghost" 
            asChild 
            className="text-white hover:text-gold hover:bg-white/10 mb-8"
          >
            <Link to="/vereadores">
              <ChevronLeft className="w-4 h-4 mr-2" /> Voltar para a lista
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <VereadorAvatar
              nome={vereador.nome}
              foto={vereador.foto_url}
              partido={vereador.partido}
              size={256}
              rounded="2xl"
              className="border-4 border-white/20 shadow-2xl"
            />

            <div className="text-center md:text-left">
              <Badge className="bg-gold text-primary-deep mb-4 px-4 py-1">
                Legislatura 2025–2028
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                {vereador.nome}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80">
                <span className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    {vereador.partido}
                  </Badge>
                </span>
                <span className="w-1 h-1 bg-white/30 rounded-full hidden md:block" />
                <span className="font-medium text-gold uppercase tracking-widest text-sm">
                  {vereador.cargo || "Vereador"}
                </span>
              </div>

              <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
                {redes.instagram && (
                  <a href={`https://instagram.com/${redes.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                    <Button size="icon" variant="outline" className="rounded-full bg-white/5 border-white/20 text-white hover:bg-gold hover:text-primary-deep">
                      <InstagramIcon className="w-5 h-5" />
                    </Button>
                  </a>
                )}
                {redes.facebook && (
                  <a href={redes.facebook} target="_blank" rel="noopener noreferrer">
                    <Button size="icon" variant="outline" className="rounded-full bg-white/5 border-white/20 text-white hover:bg-gold hover:text-primary-deep">
                      <FacebookIcon className="w-5 h-5" />
                    </Button>
                  </a>
                )}
                {redes.twitter && (
                  <a href={redes.twitter} target="_blank" rel="noopener noreferrer">
                    <Button size="icon" variant="outline" className="rounded-full bg-white/5 border-white/20 text-white hover:bg-gold hover:text-primary-deep">
                      <TwitterIcon className="w-5 h-5" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Informações */}
      <section className="container-page -mt-16 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda: Stats e Contato */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="bg-white p-6">
                <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gold" /> Desempenho
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Projetos</p>
                      <p className="text-2xl font-display font-bold text-primary">{stats.projetos}</p>
                    </div>
                    <FileText className="w-8 h-8 text-primary/10" />
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Presenças</p>
                      <p className="text-2xl font-display font-bold text-primary">{stats.presencas}</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-primary/10" />
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Participações</p>
                      <p className="text-2xl font-display font-bold text-primary">{stats.participacoes}</p>
                    </div>
                    <User className="w-8 h-8 text-primary/10" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-display font-bold text-xl mb-4">Contato</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">E-mail</p>
                      <p className="text-sm font-medium">{vereador.email || "Não informado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Telefone</p>
                      <p className="text-sm font-medium">{vereador.telefone || "Não informado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Gabinete</p>
                      <p className="text-sm font-medium">{vereador.gabinete || "Câmara Municipal"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Direita: Abas de Conteúdo */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl min-h-[500px]">
              <Tabs defaultValue="biografia" className="w-full">
                <div className="px-6 border-b border-slate-100">
                  <TabsList className="bg-transparent h-16 gap-8">
                    <TabsTrigger value="biografia" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none h-16 font-bold text-slate-500">
                      Biografia
                    </TabsTrigger>
                    <TabsTrigger value="info" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none h-16 font-bold text-slate-500">
                      Informações Pessoais
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <CardContent className="p-8">
                  <TabsContent value="biografia" className="mt-0">
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                        {vereador.biografia || "Nenhuma biografia disponível."}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="info" className="mt-0">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Nascimento</p>
                            <p className="font-bold text-slate-700">{vereador.data_nascimento ? new Date(vereador.data_nascimento).toLocaleDateString('pt-BR') : "Não informado"}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Naturalidade</p>
                            <p className="font-bold text-slate-700">{vereador.naturalidade || "Não informado"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Escolaridade</p>
                            <p className="font-bold text-slate-700">{vereador.escolaridade || "Não informado"}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                            <Briefcase className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Profissão</p>
                            <p className="font-bold text-slate-700">{vereador.profissao || "Não informado"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
