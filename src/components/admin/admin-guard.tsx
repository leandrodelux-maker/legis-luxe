import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/hooks/use-supabase-auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, approved, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-deep" />
      </div>
    );
  }

  if (!isAdmin || !approved) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md text-center space-y-4">
          <ShieldAlert className="w-16 h-16 mx-auto text-amber-500" />
          <h1 className="text-2xl font-bold">Acesso restrito</h1>
          <p className="text-slate-600">
            Sua conta foi criada, mas ainda aguarda a liberação de um administrador.
            Assim que ela for habilitada em Usuários e Permissões, o painel ficará disponível.
          </p>
          <p className="text-xs text-slate-500">Seu ID: <code>{user.id}</code></p>
          <Button onClick={() => signOut().then(() => navigate({ to: "/auth" }))}>Sair</Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
