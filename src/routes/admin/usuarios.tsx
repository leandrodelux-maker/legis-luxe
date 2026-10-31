import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  Loader2,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  listAdminUsers,
  createAdminUser,
  setAdminUserApproval,
  setAdminUserRole,
  deleteAdminUser,
  type AdminUserRow,
} from "@/lib/admin-users.functions";

import { BotaoCabecalho, PaginaModulo } from "@/components/admin/painel/PaginaModulo";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/usuarios")({
  component: AdminUsuarios,
});

function roleOf(user: AdminUserRow): "admin" | "editor" | "none" {
  if (user.roles.includes("admin")) return "admin";
  if (user.roles.includes("editor")) return "editor";
  return "none";
}

function AdminUsuarios() {
  const queryClient = useQueryClient();
  const fetchUsers = useServerFn(listAdminUsers);
  const create = useServerFn(createAdminUser);
  const approve = useServerFn(setAdminUserApproval);
  const changeRole = useServerFn(setAdminUserRole);
  const remove = useServerFn(deleteAdminUser);

  const [open, setOpen] = useState(false);
  const [excluindo, setExcluindo] = useState<AdminUserRow | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "editor" as "admin" | "editor" | "none",
    aprovado: true,
  });

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchUsers({ data: undefined }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const createMutation = useMutation({
    mutationFn: () => create({ data: form }),
    onSuccess: () => {
      toast.success("Usuário criado.");
      setOpen(false);
      setForm({ email: "", password: "", full_name: "", role: "editor", aprovado: true });
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const approveMutation = useMutation({
    mutationFn: (vars: { userId: string; aprovado: boolean }) => approve({ data: vars }),
    onSuccess: (_d, vars) => {
      toast.success(vars.aprovado ? "Conta habilitada." : "Conta desabilitada.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const roleMutation = useMutation({
    mutationFn: (vars: { userId: string; role: "admin" | "editor" | "none" }) => changeRole({ data: vars }),
    onSuccess: () => {
      toast.success("Permissão atualizada.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => remove({ data: { userId } }),
    onSuccess: () => {
      toast.success("Usuário excluído.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const pendentes = (users ?? []).filter((u) => !u.aprovado);

  return (
    <PaginaModulo
      acoes={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <BotaoCabecalho><UserPlus className="w-4 h-4" aria-hidden /> Novo usuário</BotaoCabecalho>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar usuário</DialogTitle>
              <DialogDescription>
                A pessoa poderá entrar com este e-mail e senha. O acesso ao painel só funciona depois de habilitado.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Senha provisória</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Mínimo de 8 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label>Permissão</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v as typeof form.role })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="none">Sem acesso ao painel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>Habilitar conta agora</Label>
                  <p className="text-xs text-muted-foreground">Desligue para deixar pendente de aprovação.</p>
                </div>
                <Switch
                  checked={form.aprovado}
                  onCheckedChange={(v) => setForm({ ...form, aprovado: v })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Criar usuário
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {pendentes.length > 0 && (
        <Card className="border-amber-300 bg-amber-50/60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" /> {pendentes.length} conta(s) aguardando aprovação
            </CardTitle>
            <CardDescription>Habilite abaixo para liberar o acesso ao painel.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contas cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 grid place-items-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{(error as Error).message}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead>Permissão</TableHead>
                    <TableHead>Último acesso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(users ?? []).map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="font-semibold">{u.full_name || "—"}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </TableCell>
                      <TableCell>
                        {u.aprovado ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Habilitada
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="w-3 h-3 mr-1" /> Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={roleOf(u)}
                          onValueChange={(v) =>
                            roleMutation.mutate({ userId: u.id, role: v as "admin" | "editor" | "none" })
                          }
                        >
                          <SelectTrigger className="w-[190px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="none">Sem acesso ao painel</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {u.last_sign_in_at
                          ? new Date(u.last_sign_in_at).toLocaleString("pt-BR")
                          : "Nunca acessou"}
                      </TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant={u.aprovado ? "outline" : "default"}
                          onClick={() => approveMutation.mutate({ userId: u.id, aprovado: !u.aprovado })}
                          disabled={approveMutation.isPending}
                        >
                          {u.aprovado ? "Desabilitar" : "Habilitar"}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          aria-label={`Excluir a conta de ${u.email}`}
                          onClick={() => setExcluindo(u)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={Boolean(excluindo)} onOpenChange={(a) => !a && setExcluindo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir a conta {excluindo?.email}?</AlertDialogTitle>
            <AlertDialogDescription>A pessoa perde o acesso ao painel. Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Manter</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => { if (excluindo) deleteMutation.mutate(excluindo.id); setExcluindo(null); }}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PaginaModulo>
  );
}
