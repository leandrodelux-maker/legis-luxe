import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // defer to avoid deadlock
        setTimeout(async () => {
          const [{ data }, { data: profile }] = await Promise.all([
            supabase.from("user_roles").select("role").eq("user_id", s.user.id),
            supabase.from("profiles").select("aprovado").eq("id", s.user.id).maybeSingle(),
          ]);
          setIsAdmin((data ?? []).some((r) => r.role === "admin" || r.role === "editor"));
          setApproved(Boolean((profile as { aprovado?: boolean } | null)?.aprovado));
        }, 0);
      } else {
        setIsAdmin(false);
        setApproved(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, isAdmin, approved, loading };
}

export async function signOut() {
  await supabase.auth.signOut();
}
