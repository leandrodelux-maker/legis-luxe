import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Download, Eye, FileText, Handshake, Scale, X, type LucideIcon } from "lucide-react";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { DocumentLibrary, VisualizadorDocumento, type LegalDocument } from "@/components/document-library";
import { arquivoNoSiteAntigo } from "@/lib/legal-documents";
import { useOfficialDocuments } from "@/lib/official-documents";
import { ROUTES } from "@/lib/site-links";

export type TemaDocumento = { icone: LucideIcon; titulo: string; texto: string; to: string; rotulo: string };

const OUTROS_ATOS = [
  { to: ROUTES.projetos, rotulo: "Atos Legislativos", icone: FileText },
  { to: ROUTES.cartaServicos, rotulo: "Carta de Serviços", icone: Handshake },
  { to: ROUTES.leiOrganica, rotulo: "Lei Orgânica Municipal", icone: Scale },
  { to: ROUTES.regimentoInterno, rotulo: "Regimento Interno", icone: BookOpen },
];

const normalizar = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const seletor = "h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground min-w-0";

/** Navegação entre as páginas de Atos Legislativos. */
export function OutrosAtos({ atual }: { atual: string }) {
  return (
    <nav aria-label="Outros atos legislativos" className="grid gap-3 sm:grid-cols-3">
      {OUTROS_ATOS.filter((l) => l.to !== atual).map((l) => (
        <Link key={l.to} to={l.to} className="group flex items-center gap-3 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition focus-visible:outline-2 focus-visible:outline-offset-2">
          <l.icone className="w-5 h-5 text-primary" aria-hidden />
          <span className="flex-1 text-sm font-semibold text-foreground">{l.rotulo}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
        </Link>
      ))}
    </nav>
  );
}

/** Modelo comum de Carta de Serviços, Lei Orgânica e Regimento Interno. */
export function PaginaDocumentoOficial({
  rota,
  categoria,
  reserva,
  titulo,
  descricao,
  icone,
  tituloTemas,
  temas,
  children,
}: {
  rota: string;
  categoria: string;
  reserva: LegalDocument[];
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  tituloTemas: string;
  temas: TemaDocumento[];
  children?: ReactNode;
}) {
  const { documents, loading } = useOfficialDocuments(categoria, reserva);
  const [aberto, setAberto] = useState<LegalDocument | null>(null);
  const [busca, setBusca] = useState("");
  const [ano, setAno] = useState("");

  const anoDe = (d: LegalDocument) => /\d{4}/.exec(d.date ?? "")?.[0] ?? "";
  const anos = useMemo(() => [...new Set(documents.map(anoDe).filter(Boolean))].sort().reverse(), [documents]);
  const q = normalizar(busca.trim());
  const visiveis = documents.filter((d) => (!ano || anoDe(d) === ano) && (!q || normalizar(`${d.title} ${d.description ?? ""}`).includes(q)));
  const principal = documents[0];
  const antigo = principal ? arquivoNoSiteAntigo(principal.downloadUrl) : false;

  return (
    <>
      <CabecalhoPagina
        titulo={titulo}
        trilha={[{ rotulo: "Atos Legislativos", to: ROUTES.projetos }]}
        icone={icone}
        descricao={descricao}
        lateral={
          principal && (
            <section aria-label="Documento em vigor" className="rounded-2xl bg-white text-slate-900 p-5 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#8A5A00" }}>Documento oficial</p>
              <h2 className="font-display font-bold text-lg leading-snug mt-1">{principal.title}</h2>
              {principal.date && <p className="text-sm text-slate-600 mt-0.5">Publicado em {principal.date}</p>}
              <div className="flex gap-2 mt-4">
                {!antigo && (
                  <button type="button" onClick={() => setAberto(principal)} className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl border border-slate-300 text-sm font-semibold hover:bg-slate-100 transition">
                    <Eye className="w-4 h-4" aria-hidden /> Visualizar
                  </button>
                )}
                <a href={principal.downloadUrl} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">
                  <Download className="w-4 h-4" aria-hidden /> Baixar PDF
                </a>
              </div>
              {antigo && (
                <p className="text-xs text-slate-600 mt-3">
                  Se o arquivo não abrir, <Link to={ROUTES.esic} className="font-semibold underline underline-offset-2">peça uma cópia pelo e-SIC</Link>.
                </p>
              )}
            </section>
          )
        }
      />

      <div className="container-page py-8 md:py-10 space-y-10">
        <section aria-labelledby="titulo-temas">
          <h2 id="titulo-temas" className="font-display font-bold text-xl text-foreground">{tituloTemas}</h2>
          <ul className="grid gap-4 md:grid-cols-3 mt-4">
            {temas.map((t) => (
              <li key={t.titulo} className="flex flex-col bg-card border border-border rounded-2xl p-5">
                <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary text-primary-foreground"><t.icone className="w-5 h-5" aria-hidden /></span>
                <h3 className="font-display font-bold text-foreground mt-3">{t.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1 flex-1">{t.texto}</p>
                <Link to={t.to} className="group inline-flex items-center gap-1 text-sm font-semibold text-primary mt-3 hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2">
                  {t.rotulo} <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {children}

        <section aria-labelledby="titulo-documentos" className="space-y-4">
          <div>
            <h2 id="titulo-documentos" className="font-display font-bold text-xl text-foreground">Documentos publicados</h2>
            <p className="text-sm text-muted-foreground mt-0.5" aria-live="polite">
              {loading ? "Carregando…" : `${documents.length} ${documents.length === 1 ? "documento disponível" : "documentos disponíveis"} para consulta em PDF.`}
            </p>
          </div>
          {documents.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-2xl p-3">
              <input type="search" aria-label="Buscar documento" placeholder="Buscar documento" value={busca} onChange={(e) => setBusca(e.target.value)} className={`${seletor} flex-1 min-w-[220px]`} />
              {anos.length > 1 && (
                <select aria-label="Filtrar por ano" value={ano} onChange={(e) => setAno(e.target.value)} className={seletor}>
                  <option value="">Todos os anos</option>
                  {anos.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              )}
              {(busca || ano) && <button type="button" onClick={() => { setBusca(""); setAno(""); }} className="inline-flex items-center gap-1 h-11 px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted"><X className="w-4 h-4" aria-hidden /> Limpar</button>}
            </div>
          )}
          <DocumentLibrary documents={visiveis} emptyLabel="Nenhum documento encontrado." />
        </section>

        <OutrosAtos atual={rota} />
      </div>

      {aberto && <VisualizadorDocumento documento={aberto} onClose={() => setAberto(null)} />}
    </>
  );
}
