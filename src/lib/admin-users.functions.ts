import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AdminUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
  aprovado: boolean;
  aprovado_em: string | null;
  roles: string[];
};

type AppRole = "admin" | "editor";

async function requireAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Apenas administradores podem gerenciar usuários.");
  return supabaseAdmin;
}

export const listAdminUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    const supabaseAdmin = await requireAdmin(context.userId);

    const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) throw new Error(error.message);

    const ids = list.users.map((u) => u.id);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, full_name, aprovado, aprovado_em").in("id", ids),
      supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", ids),
    ]);

    return list.users.map((u) => {
      const profile = (profiles ?? []).find((p) => p.id === u.id);
      return {
        id: u.id,
        email: u.email ?? "",
        full_name: profile?.full_name ?? (u.user_metadata?.["full_name"] as string | undefined) ?? null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        email_confirmed: Boolean(u.email_confirmed_at),
        aprovado: profile?.aprovado ?? false,
        aprovado_em: profile?.aprovado_em ?? null,
        roles: (roles ?? []).filter((r) => r.user_id === u.id).map((r) => r.role as string),
      };
    });
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { email: string; password: string; full_name: string; role: AppRole | "none"; aprovado: boolean }) => data)
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const email = data.email.trim().toLowerCase();
    if (!email.includes("@")) throw new Error("E-mail inválido.");
    if (data.password.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres.");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name.trim() },
    });
    if (error) throw new Error(error.message);
    const newId = created.user!.id;

    await supabaseAdmin.from("profiles").upsert({
      id: newId,
      full_name: data.full_name.trim() || null,
      aprovado: data.aprovado,
      aprovado_em: data.aprovado ? new Date().toISOString() : null,
      aprovado_por: data.aprovado ? context.userId : null,
    });

    if (data.role !== "none") {
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: newId, role: data.role });
      if (roleError) throw new Error(roleError.message);
    }

    return { id: newId };
  });

export const setAdminUserApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; aprovado: boolean }) => data)
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("profiles").upsert({
      id: data.userId,
      aprovado: data.aprovado,
      aprovado_em: data.aprovado ? new Date().toISOString() : null,
      aprovado_por: data.aprovado ? context.userId : null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setAdminUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; role: AppRole | "none" }) => data)
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    if (data.userId === context.userId && data.role !== "admin") {
      throw new Error("Você não pode remover seu próprio acesso de administrador.");
    }
    const { error: delError } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    if (delError) throw new Error(delError.message);
    if (data.role !== "none") {
      const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: data.userId, role: data.role });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    if (data.userId === context.userId) throw new Error("Você não pode excluir sua própria conta.");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
