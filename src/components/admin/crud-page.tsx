import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "date" | "datetime-local" | "checkbox" | "url" | "email" | "select" | "file";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  table?: string;
  optionLabel?: string;
  optionValue?: string;
};

export type ColumnDef<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T extends { id: string }> = {
  title: string;
  description?: string;
  table: string;
  columns: ColumnDef<T>[];
  fields: FieldDef[];
  orderBy?: { column: string; ascending?: boolean };
  defaultValues?: Partial<T>;
};

export function CrudPage<T extends { id: string }>({
  title, description, table, columns, fields, orderBy, defaultValues = {},
}: Props<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [externalOptions, setExternalOptions] = useState<Record<string, { label: string; value: string }[]>>({});

  const load = async () => {
    setLoading(true);
    // Expand query to include joined tables if necessary (simple join for 1 level)
    let q = (supabase as any).from(table).select("*, vereadores(nome)");
    if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? false });
    const { data, error } = await q;
    if (error) toast.error(error.message);
    else setRows((data as T[]) ?? []);
    setLoading(false);
  };

  const loadExternal = async () => {
    for (const field of fields) {
      if (field.table && field.optionLabel && field.optionValue) {
        const { data, error } = await (supabase as any)
          .from(field.table)
          .select(`${field.optionValue}, ${field.optionLabel}`);
        
        if (!error && data) {
          setExternalOptions(prev => ({
            ...prev,
            [field.name]: data.map((d: any) => ({
              label: d[field.optionLabel!],
              value: String(d[field.optionValue!])
            }))
          }));
        }
      }
    }
  };

  useEffect(() => { 
    load(); 
    loadExternal();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */ 
  }, [table]);

  const startNew = () => {
    setEditing(null);
    setForm({ ...defaultValues });
    setOpen(true);
  };

  const startEdit = (row: T) => {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  };

  const handleDelete = async (row: T) => {
    if (!confirm("Excluir este registro?")) return;
    const { error } = await (supabase as any).from(table).delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Excluído");
    load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: Record<string, unknown> = {};
    fields.forEach((f) => {
      let v = form[f.name];
      if (f.type === "number" && v !== "" && v != null) v = Number(v);
      if (f.type === "checkbox") v = Boolean(v);
      if (v === "" || v === undefined) v = null;
      payload[f.name] = v;
    });
    const op = editing
      ? (supabase as any).from(table).update(payload).eq("id", editing.id)
      : (supabase as any).from(table).insert(payload);
    const { error } = await op;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Atualizado" : "Criado");
    setOpen(false);
    load();
  };

  return (
    <div className="space-y-6 animate-[fade-up_0.4s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">{title}</h2>
          {description && <p className="text-slate-500">{description}</p>}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew} className="bg-primary-deep">
              <Plus className="w-4 h-4 mr-2" /> Novo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar" : "Criar"} registro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <Label htmlFor={f.name}>{f.label}{f.required && " *"}</Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      id={f.name}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={String(form[f.name] ?? "")}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      rows={4}
                    />
                  ) : f.type === "checkbox" ? (
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        id={f.name}
                        type="checkbox"
                        checked={Boolean(form[f.name])}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-600">{f.placeholder ?? "Sim"}</span>
                    </div>
                  ) : f.type === "select" ? (
                    <Select
                      value={String(form[f.name] ?? "")}
                      onValueChange={(v) => setForm({ ...form, [f.name]: v })}
                      required={f.required}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={f.placeholder || "Selecione..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {(f.options || externalOptions[f.name])?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : f.type === "file" ? (
                    <div className="space-y-2">
                      <Input
                        id={f.name}
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setSaving(true);
                          const fileExt = file.name.split('.').pop();
                          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                          const filePath = `${table}/${fileName}`;

                          const { error: uploadError, data } = await supabase.storage
                            .from('documentos')
                            .upload(filePath, file);

                          if (uploadError) {
                            toast.error("Erro no upload: " + uploadError.message);
                            setSaving(false);
                            return;
                          }

                          const { data: { publicUrl } } = supabase.storage
                            .from('documentos')
                            .getPublicUrl(filePath);

                          setForm({ ...form, [f.name]: publicUrl });
                          setSaving(false);
                          toast.success("Documento enviado com sucesso!");
                        }}
                      />
                      {form[f.name] ? (
                        <p className="text-xs text-emerald-600 font-medium">
                          ✓ Arquivo carregado
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <Input
                      id={f.name}
                      type={f.type ?? "text"}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={
                        f.type === "datetime-local" && form[f.name]
                          ? String(form[f.name]).slice(0, 16)
                          : String(form[f.name] ?? "")
                      }
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <DialogFooter>
                <Button type="submit" disabled={saving} className="bg-primary-deep">
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editing ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Nenhum registro. Clique em "Novo" para começar.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => <TableHead key={String(c.key)}>{c.label}</TableHead>)}
                <TableHead className="w-32 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((c) => (
                    <TableCell key={String(c.key)}>
                      {c.render ? c.render(row) : (String((row as Record<string, any>)[c.key as string] ?? "—") as React.ReactNode)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(row)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(row)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}