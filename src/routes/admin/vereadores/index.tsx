import { createFileRoute, Link } from "@tanstack/react-router";
import { History, Images, Mail, Phone } from "lucide-react";
import { CrudPage, slugify } from "@/components/admin/crud-page";
import { Selo } from "@/components/admin/painel/PaginaModulo";
import { Input } from "@/components/ui/input";
import { VereadorAvatar } from "@/components/vereador-avatar";
import { VereadorPhotoUploader } from "@/components/admin/VereadorPhotoUploader";

export const Route = createFileRoute("/admin/vereadores/")({
  component: AdminVereadores,
});

type Redes = { instagram?: string; facebook?: string; twitter?: string; youtube?: string };
type Vereador = {
  id: string;
  nome: string;
  partido: string | null;
  foto_url: string | null;
  cargo: string | null;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
  mandato_atual: string | null;
  redes_sociais: Redes;
};

const REDES: [keyof Redes, string, string][] = [
  ["instagram", "Instagram", "@perfil"],
  ["facebook", "Facebook", "Link da página"],
  ["twitter", "Twitter / X", "Link do perfil"],
  ["youtube", "YouTube", "Link do canal"],
];

const atalho = "inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-sm font-semibold bg-white/15 hover:bg-white/25 text-white transition";

function AdminVereadores() {
  return (
    <CrudPage<Vereador>
      title="Vereadores"
      table="vereadores"
      singular="vereador"
      vazio="Nenhum vereador cadastrado"
      orderBy={{ column: "ordem", ascending: true }}
      defaultValues={{ ativo: true, mandato_atual: "2025–2028", redes_sociais: {} }}
      buscaEm={["nome", "partido", "cargo", "email"]}
      acoesPagina={
        <>
          <Link to="/admin/vereadores/mandatos" className={atalho}><History className="w-4 h-4" aria-hidden /> Mandatos</Link>
          <Link to="/admin/vereadores/galeria" className={atalho}><Images className="w-4 h-4" aria-hidden /> Galeria</Link>
        </>
      }
      indicadores={(ls) => [
        { rotulo: "Vereadores", valor: ls.length },
        { rotulo: "Ativos no site", valor: ls.filter((l) => l.ativo).length, cor: "#0B7A4B" },
        { rotulo: "Partidos", valor: new Set(ls.map((l) => l.partido).filter(Boolean)).size, cor: "#A8540F" },
        { rotulo: "Sem foto", valor: ls.filter((l) => !l.foto_url).length, cor: "#B42318", detalhe: "Aparecem com as iniciais" },
      ]}
      filtros={[
        { campo: "partido", rotulo: "Partido" },
        { campo: "situacao", rotulo: "Situação", valor: (r) => (r.ativo ? "Ativo" : "Inativo") },
      ]}
      cartao={{
        imagem: (r) => <VereadorAvatar nome={r.nome} foto={r.foto_url} size={64} />,
        titulo: (r) => r.nome,
        subtitulo: (r) => [r.cargo, r.partido].filter(Boolean).join(" · ") || "Vereador",
        selo: (r) => <Selo cor={r.ativo ? "#0B7A4B" : "#6B7280"}>{r.ativo ? "Ativo" : "Inativo"}</Selo>,
        texto: (r) => (
          <span className="flex flex-col gap-0.5">
            {r.email && <span className="inline-flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5 shrink-0" aria-hidden /> {r.email}</span>}
            {r.telefone && <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 shrink-0" aria-hidden /> {r.telefone}</span>}
          </span>
        ),
        rodape: (r) => (r.mandato_atual ? `Mandato ${r.mandato_atual}` : ""),
      }}
      previa={(f) => (
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <div className="flex justify-center"><VereadorAvatar nome={String(f.nome || "Nome")} foto={f.foto_url ?? null} size={112} /></div>
          <p className="font-display font-bold text-lg text-foreground mt-3 leading-snug">{f.nome || "Nome do vereador"}</p>
          <p className="text-sm text-muted-foreground">{[f.cargo || "Vereador", f.partido].filter(Boolean).join(" · ")}</p>
          {f.mandato_atual && <p className="text-xs text-muted-foreground mt-2">Mandato {f.mandato_atual}</p>}
          {f.nome && <p className="text-[11px] text-muted-foreground mt-3 break-all">/vereadores/{f.slug || slugify(String(f.nome))}</p>}
        </div>
      )}
      columns={[
        { key: "foto_url", label: "Foto", render: (r) => <VereadorAvatar nome={r.nome} foto={r.foto_url} size={40} /> },
        { key: "nome", label: "Nome" },
        { key: "partido", label: "Partido" },
        { key: "cargo", label: "Cargo" },
        { key: "mandato_atual", label: "Mandato" },
        { key: "ativo", label: "Situação", render: (r) => <Selo cor={r.ativo ? "#0B7A4B" : "#6B7280"}>{r.ativo ? "Ativo" : "Inativo"}</Selo> },
      ]}
      secoes={[
        { titulo: "Foto e identificação", campos: ["foto_url", "nome", "partido", "cargo", "slug"] },
        { titulo: "Mandato", campos: ["mandato_atual", "legislatura", "mandato_inicio", "mandato_fim", "data_posse", "comissoes"] },
        { titulo: "Contato", descricao: "Publicados no perfil do vereador.", campos: ["email", "telefone", "gabinete"] },
        { titulo: "Sobre", campos: ["biografia", "data_nascimento", "naturalidade", "escolaridade", "profissao"] },
        { titulo: "Redes sociais", campos: ["redes_sociais"] },
        { titulo: "Exibição no site", campos: ["ativo", "ordem"] },
      ]}
      fields={[
        {
          name: "foto_url",
          label: "Foto",
          type: "custom",
          renderCustom: (_row, form, setForm) => (
            <VereadorPhotoUploader nome={String(form.nome || "")} value={form.foto_url ?? null} onChange={(url) => setForm({ ...form, foto_url: url })} />
          ),
        },
        { name: "nome", label: "Nome completo", required: true, largo: true },
        { name: "partido", label: "Partido", placeholder: "Ex.: MDB" },
        { name: "cargo", label: "Cargo", placeholder: "Vereador, Presidente, Líder" },
        { name: "slug", label: "Endereço no site", slugDe: "nome", largo: true, ajuda: "Preenchido a partir do nome. Mudar depois quebra links já divulgados." },
        { name: "mandato_atual", label: "Mandato atual", placeholder: "2025–2028" },
        { name: "legislatura", label: "Legislatura", placeholder: "2025–2028" },
        { name: "mandato_inicio", label: "Início do mandato", type: "date" },
        { name: "mandato_fim", label: "Fim do mandato", type: "date" },
        { name: "data_posse", label: "Data de posse", type: "date" },
        { name: "comissoes", label: "Comissões", placeholder: "Ex.: Finanças, Educação" },
        { name: "email", label: "E-mail", type: "email" },
        { name: "telefone", label: "Telefone", placeholder: "(00) 00000-0000" },
        { name: "gabinete", label: "Gabinete" },
        { name: "biografia", label: "Biografia", type: "textarea" },
        { name: "data_nascimento", label: "Data de nascimento", type: "date" },
        { name: "naturalidade", label: "Naturalidade" },
        { name: "escolaridade", label: "Escolaridade" },
        { name: "profissao", label: "Profissão" },
        {
          name: "redes_sociais",
          label: "Perfis",
          type: "custom",
          renderCustom: (_row, form, setForm) => {
            const redes: Redes = form.redes_sociais || {};
            return (
              <div className="grid sm:grid-cols-2 gap-3">
                {REDES.map(([k, rotulo, dica]) => (
                  <div key={k}>
                    <label htmlFor={`rede-${k}`} className="text-xs font-semibold text-muted-foreground">{rotulo}</label>
                    <Input id={`rede-${k}`} className="h-10 mt-1" placeholder={dica} value={redes[k] || ""} onChange={(e) => setForm({ ...form, redes_sociais: { ...redes, [k]: e.target.value } })} />
                  </div>
                ))}
              </div>
            );
          },
        },
        { name: "ativo", label: "Situação", type: "checkbox", placeholder: "Mostrar este vereador no site" },
        { name: "ordem", label: "Ordem de exibição", type: "number", ajuda: "Os menores aparecem primeiro." },
      ]}
    />
  );
}
