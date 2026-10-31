import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/cms/RichTextEditor";
import { toast } from "sonner";
import { Eye, EyeOff, Image as ImageIcon, Inbox, Loader2, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { BotaoCabecalho, Indicadores, PaginaModulo, Selo } from "@/components/admin/painel/PaginaModulo";

export const Route = createFileRoute("/admin/noticias")({
  component: AdminNoticiasPage,
});

type Noticia = {
  id: string;
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo: string;
  imagem_url: string | null;
  categoria: string | null;
  categoria_id: string | null;
  autor: string | null;
  publicado: boolean;
  destaque: boolean;
  publicado_em: string | null;
  agendado_para: string | null;
  created_at: string;
};

type Categoria = { id: string; nome: string; slug: string; cor: string | null };

const emptyForm = (): Partial<Noticia> => ({
  titulo: "",
  slug: "",
  resumo: "",
  conteudo: "",
  imagem_url: null,
  categoria_id: null,
  categoria: null,
  autor: "",
  publicado: false,
  destaque: false,
  publicado_em: null,
  agendado_para: null,
});

const paraDataHoraLocal = (v: unknown) => {
  if (!v) return "";
  const d = new Date(String(v));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

function slugify(v: string) {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function AdminNoticiasPage() {
  const [rows, setRows] = useState<Noticia[]>([]);
  const [cats, setCats] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Noticia | null>(null);
  const [form, setForm] = useState<Partial<Noticia>>(emptyForm());
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todas" | "publicadas" | "rascunhos">("todas");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [excluindo, setExcluindo] = useState<Noticia | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: noticias, error }, { data: categorias }] = await Promise.all([
      supabase.from("noticias").select("*").order("created_at", { ascending: false }),
      supabase.from("noticias_categorias").select("id, nome, slug, cor").order("ordem"),
    ]);
    if (error) toast.error(`Falha ao carregar notícias: ${error.message}`);
    setRows((noticias as Noticia[]) ?? []);
    setCats((categorias as Categoria[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // Atalhos do início do painel abrem direto o formulário (?novo=1)
    if (new URLSearchParams(window.location.search).get("novo")) {
      startNew();
      window.history.replaceState(null, "", window.location.pathname);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const filtered = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return rows.filter((r) => {
      if (filtro === "publicadas" && !r.publicado) return false;
      if (filtro === "rascunhos" && r.publicado) return false;
      if (filtroCategoria !== "todas" && r.categoria_id !== filtroCategoria) return false;
      if (!q) return true;
      return [r.titulo, r.resumo, r.categoria, r.autor, r.slug]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [rows, busca, filtro, filtroCategoria]);
  const visiveis = filtered;

  const startNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const startEdit = (row: Noticia) => {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  };

  const setField = <K extends keyof Noticia>(key: K, value: Noticia[K] | null) =>
    setForm((prev) => ({ ...prev, [key]: value as any }));

  const togglePublicado = async (row: Noticia) => {
    const publicado = !row.publicado;
    const { error } = await supabase
      .from("noticias")
      .update({
        publicado,
        publicado_em: publicado ? row.publicado_em ?? new Date().toISOString() : row.publicado_em,
      })
      .eq("id", row.id);
    if (error) return toast.error(`Erro ao publicar: ${error.message}`);
    toast.success(publicado ? "Notícia publicada no site" : "Notícia despublicada");
    load();
  };

  const toggleDestaque = async (row: Noticia) => {
    const { error } = await supabase
      .from("noticias")
      .update({ destaque: !row.destaque })
      .eq("id", row.id);
    if (error) return toast.error(`Erro: ${error.message}`);
    load();
  };

  const remove = async () => {
    const row = excluindo;
    setExcluindo(null);
    if (!row) return;
    const { error } = await supabase.from("noticias").delete().eq("id", row.id);
    if (error) return toast.error(`Erro ao excluir: ${error.message}`);
    load();
    toast.success("Notícia excluída.", {
      duration: 8000,
      action: {
        label: "Desfazer",
        onClick: async () => {
          const { error: e } = await (supabase as any).from("noticias").insert(row);
          if (e) return toast.error(`Não foi possível restaurar: ${e.message}`);
          toast.success("Notícia restaurada.");
          load();
        },
      },
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo?.trim()) return toast.error("Informe o título");
    if (!form.conteudo?.trim()) return toast.error("Informe o conteúdo da notícia");

    const cat = cats.find((c) => c.id === form.categoria_id) ?? null;
    const slug = slugify(form.slug || form.titulo);
    const publicado = Boolean(form.publicado);

    const payload = {
      titulo: form.titulo.trim(),
      slug,
      resumo: form.resumo?.trim() || null,
      conteudo: form.conteudo,
      imagem_url: form.imagem_url || null,
      categoria_id: form.categoria_id || null,
      categoria: cat?.nome ?? null,
      autor: form.autor?.trim() || null,
      publicado,
      destaque: Boolean(form.destaque),
      publicado_em: publicado
        ? form.publicado_em ?? new Date().toISOString()
        : form.publicado_em || null,
      agendado_para: form.agendado_para || null,
    };

    setSaving(true);
    const { error } = editing
      ? await supabase.from("noticias").update(payload).eq("id", editing.id)
      : await supabase.from("noticias").insert(payload);
    setSaving(false);

    if (error) {
      const rls = error.code === "42501" || /row-level security/i.test(error.message);
      return toast.error(rls ? `Sem permissão: ${error.message}` : `Erro: ${error.message}`);
    }
    toast.success(
      publicado ? "Notícia salva e publicada no site" : "Notícia salva como rascunho",
    );
    setOpen(false);
    load();
  };

  const publicadas = rows.filter((r) => r.publicado).length;
  const selo = (r: Noticia) => <Selo cor={r.publicado ? "#0B7A4B" : "#A8540F"}>{r.publicado ? "Publicada" : "Rascunho"}</Selo>;
  const dataDe = (r: Noticia) =>
    r.publicado_em
      ? new Date(r.publicado_em).toLocaleDateString("pt-BR")
      : r.agendado_para
        ? `Agendada para ${new Date(r.agendado_para).toLocaleDateString("pt-BR")}`
        : "Sem data";
  const categoriaForm = cats.find((c) => c.id === form.categoria_id);

  return (
    <PaginaModulo acoes={<BotaoCabecalho onClick={startNew}><Plus className="w-4 h-4" aria-hidden /> Nova notícia</BotaoCabecalho>}>
      <Indicadores
        itens={[
          { rotulo: "Notícias", valor: rows.length },
          { rotulo: "Publicadas", valor: publicadas, cor: "#0B7A4B" },
          { rotulo: "Rascunhos", valor: rows.length - publicadas, cor: "#A8540F" },
          { rotulo: "Em destaque", valor: rows.filter((r) => r.destaque).length, cor: "#1F5FBF" },
        ]}
      />

      <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-2xl p-2.5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden />
          <Input aria-label="Buscar notícia" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por título, categoria ou autor..." className="pl-9 h-10 border-0 shadow-none bg-muted/50" />
        </div>
        <Select value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
          <SelectTrigger aria-label="Filtrar por situação" className="h-10 w-[170px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Situação: todas</SelectItem>
            <SelectItem value="publicadas">Publicadas</SelectItem>
            <SelectItem value="rascunhos">Rascunhos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
          <SelectTrigger aria-label="Filtrar por categoria" className="h-10 w-[190px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Categoria: todas</SelectItem>
            {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">{loading ? "Carregando..." : `${visiveis.length} ${visiveis.length === 1 ? "notícia" : "notícias"}`}</p>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : visiveis.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
          <Inbox className="w-10 h-10 mx-auto text-muted-foreground" aria-hidden />
          <p className="font-display font-bold text-lg text-foreground mt-3">{rows.length ? "Nada encontrado com esses filtros" : "Nenhuma notícia ainda"}</p>
          {!rows.length && <Button type="button" className="mt-4 text-white" style={{ backgroundColor: "var(--tema)" }} onClick={startNew}><Plus className="w-4 h-4 mr-1.5" /> Escrever a primeira</Button>}
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visiveis.map((r) => (
            <li key={r.id} className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition">
              <div className="relative h-40 bg-muted">
                {r.imagem_url ? <img src={r.imagem_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-muted-foreground"><ImageIcon className="w-8 h-8" aria-hidden /></div>}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5 bg-card/95 rounded-full">{selo(r)}</div>
                {r.destaque && <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full grid place-items-center bg-gold text-gold-foreground" title="Em destaque"><Star className="w-3.5 h-3.5 fill-current" aria-hidden /><span className="sr-only">Em destaque</span></span>}
              </div>
              <div className="p-4 flex-1">
                <p className="text-xs font-semibold" style={{ color: cats.find((c) => c.id === r.categoria_id)?.cor ?? "var(--tema)" }}>{r.categoria ?? "Sem categoria"}</p>
                <button type="button" onClick={() => startEdit(r)} className="text-left font-display font-bold text-foreground leading-snug mt-1 line-clamp-2 hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 rounded">{r.titulo}</button>
                {r.resumo && <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{r.resumo}</p>}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-1.5 bg-muted/30">
                <span className="text-xs text-muted-foreground truncate pl-1">{dataDe(r)}</span>
                <div className="flex items-center gap-0.5">
                  <Button type="button" size="icon" variant="ghost" aria-label={`${r.publicado ? "Despublicar" : "Publicar"} ${r.titulo}`} title={r.publicado ? "Despublicar" : "Publicar"} onClick={() => togglePublicado(r)}>{r.publicado ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
                  <Button type="button" size="icon" variant="ghost" aria-pressed={r.destaque} aria-label={`Destaque de ${r.titulo}`} title="Destaque" onClick={() => toggleDestaque(r)}><Star className={`w-4 h-4 ${r.destaque ? "fill-current" : ""}`} /></Button>
                  <Button type="button" size="icon" variant="ghost" aria-label={`Editar ${r.titulo}`} title="Editar" onClick={() => startEdit(r)}><Pencil className="w-4 h-4" /></Button>
                  <Button type="button" size="icon" variant="ghost" className="text-destructive hover:text-destructive" aria-label={`Excluir ${r.titulo}`} title="Excluir" onClick={() => setExcluindo(r)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-5xl p-0 gap-0 flex flex-col [&>button]:text-white [&>button]:opacity-100">
          <div className="px-6 py-5 text-white shrink-0" style={{ backgroundColor: "var(--tema)" }}>
            <SheetTitle className="text-white font-display text-xl font-bold pr-8">{editing ? "Editar notícia" : "Nova notícia"}</SheetTitle>
            <SheetDescription className="text-white/90 text-sm mt-0.5">{form.publicado ? "Ficará visível no site ao salvar." : "Fica como rascunho, sem aparecer no site."}</SheetDescription>
          </div>
          <form onSubmit={save} noValidate className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto lg:grid lg:grid-cols-[1fr_340px]">
              <div className="p-6 space-y-8">
                <fieldset className="space-y-4">
                  <legend className="w-full border-b border-border pb-2 mb-1 font-display font-bold text-base text-foreground">Texto</legend>
                  <div>
                    <label htmlFor="titulo" className="block text-sm font-semibold text-foreground mb-1.5">Título <span className="text-destructive" aria-hidden>*</span><span className="sr-only">(obrigatório)</span></label>
                    <Input id="titulo" className="h-11 text-base" aria-required value={form.titulo ?? ""} onChange={(e) => { const titulo = e.target.value; setForm((prev) => ({ ...prev, titulo, slug: editing ? prev.slug : slugify(titulo) })); }} />
                  </div>
                  <div>
                    <label htmlFor="resumo" className="block text-sm font-semibold text-foreground mb-1.5">Resumo</label>
                    <Textarea id="resumo" rows={3} value={form.resumo ?? ""} onChange={(e) => setField("resumo", e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1">Aparece nos cartões de notícia do site.</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1.5">Conteúdo <span className="text-destructive" aria-hidden>*</span><span className="sr-only">(obrigatório)</span></p>
                    <RichTextEditor content={form.conteudo ?? ""} onChange={(html) => setField("conteudo", html)} />
                  </div>
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="w-full border-b border-border pb-2 mb-1 font-display font-bold text-base text-foreground">Imagem de capa</legend>
                  <ImageUploader folder="noticias" height={160} value={form.imagem_url ?? null} onChange={(url) => setField("imagem_url", url)} />
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="w-full border-b border-border pb-2 mb-1 font-display font-bold text-base text-foreground">Organização</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="categoria" className="block text-sm font-semibold text-foreground mb-1.5">Categoria</label>
                      <Select value={form.categoria_id ?? ""} onValueChange={(v) => setField("categoria_id", v)}>
                        <SelectTrigger id="categoria" className="h-10 w-full"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>{cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="autor" className="block text-sm font-semibold text-foreground mb-1.5">Autor</label>
                      <Input id="autor" className="h-10" value={form.autor ?? ""} onChange={(e) => setField("autor", e.target.value)} placeholder="Assessoria de Comunicação" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="slug" className="block text-sm font-semibold text-foreground mb-1.5">Endereço no site</label>
                      <Input id="slug" className="h-10" value={form.slug ?? ""} onChange={(e) => setField("slug", e.target.value)} />
                      <p className="text-xs text-muted-foreground mt-1">Preenchido a partir do título. Mudar depois quebra links já divulgados.</p>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="w-full border-b border-border pb-2 mb-1 font-display font-bold text-base text-foreground">Publicação</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label htmlFor="publicado" className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 cursor-pointer hover:bg-muted/40">
                      <span><span className="block text-sm font-semibold text-foreground">Publicar no site</span><span className="block text-xs text-muted-foreground">Visível na seção Notícias</span></span>
                      <Switch id="publicado" checked={Boolean(form.publicado)} onCheckedChange={(v) => setField("publicado", v)} />
                    </label>
                    <label htmlFor="destaque" className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 cursor-pointer hover:bg-muted/40">
                      <span><span className="block text-sm font-semibold text-foreground">Destaque</span><span className="block text-xs text-muted-foreground">Exibir na página inicial</span></span>
                      <Switch id="destaque" checked={Boolean(form.destaque)} onCheckedChange={(v) => setField("destaque", v)} />
                    </label>
                    <div>
                      <label htmlFor="publicado_em" className="block text-sm font-semibold text-foreground mb-1.5">Data de publicação</label>
                      <Input id="publicado_em" type="datetime-local" className="h-10" value={paraDataHoraLocal(form.publicado_em)} onChange={(e) => setField("publicado_em", e.target.value ? new Date(e.target.value).toISOString() : null)} />
                    </div>
                    <div>
                      <label htmlFor="agendado_para" className="block text-sm font-semibold text-foreground mb-1.5">Agendar para</label>
                      <Input id="agendado_para" type="datetime-local" className="h-10" value={paraDataHoraLocal(form.agendado_para)} onChange={(e) => setField("agendado_para", e.target.value ? new Date(e.target.value).toISOString() : null)} />
                    </div>
                  </div>
                </fieldset>
              </div>
              <aside aria-label="Como aparece no site" className="hidden lg:block border-l border-border bg-muted/30 p-5">
                <div className="sticky top-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Como aparece no site</p>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="h-40 bg-muted">
                      {form.imagem_url ? <img src={form.imagem_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-muted-foreground"><ImageIcon className="w-8 h-8" aria-hidden /></div>}
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold" style={{ color: categoriaForm?.cor ?? "var(--tema)" }}>{categoriaForm?.nome ?? "Categoria"}</p>
                      <p className="font-display font-bold text-foreground leading-snug mt-1">{form.titulo || "Título da notícia"}</p>
                      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-4">{form.resumo || "O resumo aparece aqui."}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3 break-all">/noticias/{form.slug || "endereco-da-noticia"}</p>
                </div>
              </aside>
            </div>
            <div className="shrink-0 flex items-center justify-end gap-2 border-t border-border bg-card px-6 py-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving} className="text-white hover:opacity-90" style={{ backgroundColor: "var(--tema)" }}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {form.publicado ? "Salvar e publicar" : "Salvar rascunho"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={Boolean(excluindo)} onOpenChange={(a) => !a && setExcluindo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir "{excluindo?.titulo}"?</AlertDialogTitle>
            <AlertDialogDescription>A notícia sai do painel e do site. Logo depois da exclusão, você ainda pode clicar em Desfazer por alguns segundos.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Manter</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={remove}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PaginaModulo>
  );
}
